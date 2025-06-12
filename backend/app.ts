import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes';
import scheduleRoutes from './src/routes/schedule.routes';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/schedule', scheduleRoutes);

console.log('JWT_SECRET:', process.env['JWT_SECRET']);

app.listen(3001, () => console.log('Backend running on port 3001'));
