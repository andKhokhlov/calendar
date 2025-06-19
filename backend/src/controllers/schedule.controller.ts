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
  try {
    const result = await pool.query('SELECT teacher FROM schedule');

    // Process unique teachers in Node.js
    const rawTeachers = result.rows.map((r) => r.teacher);

    // Filter out null/empty, trim, convert to lowercase for comparison, then get unique
    const uniqueLowercased = new Set<string>();
    const cleanedTeachers: string[] = [];

    for (const teacher of rawTeachers) {
      if (teacher && typeof teacher === 'string') {
        const trimmed = teacher.trim();
        const trimmedLower = trimmed.toLowerCase();
        if (trimmedLower !== '' && !uniqueLowercased.has(trimmedLower)) {
          uniqueLowercased.add(trimmedLower);
          // Store the original (trimmed) version for display, picking the first one encountered
          cleanedTeachers.push(trimmed);
        }
      }
    }

    // Sort the cleaned unique teachers
    cleanedTeachers.sort((a, b) => a.localeCompare(b, 'ru'));

    res.json(cleanedTeachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Error fetching teachers' });
  }
}

export async function getScheduleByTeacher(req: Request, res: Response) {
  const { teacher } = req.params;
  const cleanedTeacherParam = teacher.trim().toLowerCase();

  const result = await pool.query(
    `SELECT * FROM schedule 
     WHERE LOWER(TRIM(REPLACE(teacher, E'\\t', ''))) = $1 
     ORDER BY day, time`,
    [cleanedTeacherParam]
  );
  res.json(result.rows);
}

// Загрузка картинки (замены/сессия)
export async function uploadImage(req: Request, res: Response) {
  try {
    const { type, date } = req.body;
    const file = req.file;
    if (!file || !type || !date) {
      return res.status(400).json({ message: 'Необходимы файл, type и date' });
    }
    await pool.query(
      'INSERT INTO images (type, date, data, mimetype) VALUES ($1, $2, $3, $4) ON CONFLICT (type, date) DO UPDATE SET data = EXCLUDED.data, mimetype = EXCLUDED.mimetype, uploaded_at = CURRENT_TIMESTAMP',
      [type, date, file.buffer, file.mimetype]
    );
    res.json({ message: 'Картинка загружена' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка загрузки', error: e });
  }
}

// Получение картинки по дате и типу
export async function getImage(req: Request, res: Response) {
  try {
    const { type, date } = req.query;
    const result = await pool.query(
      'SELECT data, mimetype FROM images WHERE type = $1 AND date = $2',
      [type, date]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Картинка не найдена' });
    }
    res.set('Content-Type', result.rows[0].mimetype);
    res.send(result.rows[0].data);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка получения', error: e });
  }
}
