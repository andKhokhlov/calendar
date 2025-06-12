import { pool } from '../../db';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  console.log('Введённый пароль:', password);
  console.log('Хеш из базы:', user.password);
  const valid = await bcryptjs.compare(password, user.password);
  console.log('bcrypt.compare:', valid);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env['JWT_SECRET']!,
    { expiresIn: '1d' }
  );
  res.json({ token });
}
