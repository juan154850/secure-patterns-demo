import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-that-should-be-in-env';
const JWT_EXPIRES_IN = '1h';
const SALT_ROUNDS = 12;

export const registerSecure = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Hash de contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const user = await User.create({
      username,
      password: hashedPassword,
      email
    });

    res.status(201).json({ 
      message: 'Usuario creado (seguro)', 
      userId: user.id 
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Usuario o email ya existe' });
    }
    res.status(400).json({ error: 'Error al crear usuario' });
  }
};

export const loginSecure = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Comparación segura de contraseña hasheada
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // JWT con expiración y secret desde variable de entorno
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ 
      message: 'Login exitoso (seguro)', 
      token,
      user: { id: user.id, username: user.username },
      expiresIn: JWT_EXPIRES_IN
    });
  } catch {
    res.status(500).json({ error: 'Error en login' });
  }
};

export const getProfileSecure = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    // Verificación con manejo apropiado de errores
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
      message: 'Perfil obtenido (seguro)',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    res.status(500).json({ error: 'Error al verificar token' });
  }
};
