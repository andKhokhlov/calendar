import { Router } from 'express';
import {
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getTeachers,
  getScheduleByTeacher,
} from '../controllers/schedule.controller';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware';
const router = Router();
router.get('/', getSchedule);
router.post('/', authenticateJWT, requireAdmin, createSchedule);
router.put('/:id', authenticateJWT, requireAdmin, updateSchedule);
router.delete('/:id', authenticateJWT, requireAdmin, deleteSchedule);
router.get('/teachers', getTeachers);
router.get('/teacher/:teacher', getScheduleByTeacher);
export default router;
