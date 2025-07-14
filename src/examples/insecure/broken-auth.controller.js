import jwt from 'jsonwebtoken';
import { User } from '../../models/user.js';

//Contraseña en texto plano y JWT sin expiración
export const registerInsecure = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    //Contraseña guardada en texto plano
    const user = await User.create({
      username,
      password, // Sin hash
      email
    });

    res.status(201).json({ 
      message: 'Usuario creado (inseguro)', 
      userId: user.id 
    });
  } catch {
    res.status(400).json({ error: 'Error al crear usuario' });
  }
};

export const loginInsecure = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    //Comparación directa de contraseña en texto plano
    const user = await User.findOne({ where: { username } });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    //JWT sin expiración y con secret débil
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      'secret123' // Secret débil y hardcodeado
      // Sin expiración
    );

    res.json({ 
      message: 'Login exitoso (inseguro)', 
      token,
      user: { id: user.id, username: user.username }
    });
  } catch {
    res.status(500).json({ error: 'Error en login' });
  }
};

export const getProfileInsecure = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    //Verificación sin manejo de errores apropiado
    const decoded = jwt.verify(token, 'secret123');
    const user = await User.findByPk(decoded.userId);

    res.json({ 
      message: 'Perfil obtenido (inseguro)',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};
