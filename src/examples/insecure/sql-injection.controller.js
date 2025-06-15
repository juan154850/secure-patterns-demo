import { sequelize } from '../../config/database.js';

export const getUserInsecure = async (req, res) => {
  // ❌ Parámetro concatenado (vulnerable)
  const { id } = req.query; // ?id=1 OR 1=1
  const sql = `SELECT * FROM Users WHERE id = ${id};`;
  const [rows] = await sequelize.query(sql);
  return res.json(rows);
};
