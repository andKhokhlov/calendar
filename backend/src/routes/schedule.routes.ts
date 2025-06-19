import { Router } from 'express';
import {
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getTeachers,
  getScheduleByTeacher,
  uploadImage,
  getImage,
} from '../controllers/schedule.controller';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware';
import multer from 'multer';

const router = Router();
const upload = multer();

router.get('/', getSchedule);
router.post('/', authenticateJWT, requireAdmin, createSchedule);
router.put('/:id', authenticateJWT, requireAdmin, updateSchedule);
router.delete('/:id', authenticateJWT, requireAdmin, deleteSchedule);
router.get('/teachers', getTeachers);
router.get('/teacher/:teacher', getScheduleByTeacher);
router.post('/image', upload.single('file'), uploadImage);
router.get('/image', getImage);

export default router;
