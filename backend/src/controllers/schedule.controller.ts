import { pool } from '../../db';
import { Request, Response } from 'express';

export async function getSchedule(req: Request, res: Response) {
  const result = await pool.query('SELECT * FROM schedule');
  res.json(result.rows);
}

export async function createSchedule(req: Request, res: Response) {
  const { subject, time, group, teacher, day } = req.body;
  const result = await pool.query(
    'INSERT INTO schedule (subject, time, "group", teacher, day) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [subject, time, group, teacher, day]
  );
  res.status(201).json(result.rows[0]);
}

export async function updateSchedule(req: Request, res: Response) {
  const { id } = req.params;
  const { subject, time, group, teacher, day } = req.body;
  const result = await pool.query(
    'UPDATE schedule SET subject=$1, time=$2, "group"=$3, teacher=$4, day=$5 WHERE id=$6 RETURNING *',
    [subject, time, group, teacher, day, id]
  );
  if (result.rows.length === 0) return res.sendStatus(404);
  res.json(result.rows[0]);
}

export async function deleteSchedule(req: Request, res: Response) {
  const { id } = req.params;
  const result = await pool.query(
    'DELETE FROM schedule WHERE id=$1 RETURNING *',
    [id]
  );
  if (result.rows.length === 0) return res.sendStatus(404);
  res.json(result.rows[0]);
}

export async function getTeachers(req: Request, res: Response) {
  const result = await pool.query(
    'SELECT DISTINCT teacher FROM schedule ORDER BY teacher'
  );
  res.json(result.rows.map((r) => r.teacher).filter(Boolean));
}

export async function getScheduleByTeacher(req: Request, res: Response) {
  const { teacher } = req.params;
  const result = await pool.query(
    'SELECT * FROM schedule WHERE teacher = $1 ORDER BY day, time',
    [teacher]
  );
  res.json(result.rows);
}
