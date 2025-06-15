import { sequelize } from '../../config/database.js';



export const getUserSecure = async (req, res) => {

  //req.validatedQuery viene del middleware del controlador
  const { id } = req.validatedQuery;

  const sql = 'SELECT * FROM Users WHERE id = ?';
  const [rows] = await sequelize.query(sql, { replacements: [id] });

  return res.json(rows);
};