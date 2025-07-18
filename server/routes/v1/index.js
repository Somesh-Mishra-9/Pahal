import express, { Router } from 'express';
import authRoutes from './authRoutes.js';
import attendanceRoutes from './attendanceRoutes.js';
import teacherAttendanceRoutes from './teacherAttendanceRoutes.js';
import teacherRoutes from './teacherRoutes.js';
import homeworkRoutes from './homeworkRoutes.js';
import studentRouter from './studentRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import adminRoutes from './admin.js';

const v1Routes = Router();

v1Routes.use('/auth', authRoutes); // http://localhost:3000/api/v1/auth
v1Routes.use('/attendance', attendanceRoutes); // http://localhost:3000/api/v1/attendance
v1Routes.use('/teacher-attendance', teacherAttendanceRoutes); // http://localhost:3000/api/v1/teacher-attendance
v1Routes.use('/teacher', teacherRoutes); // http://localhost:3000/api/v1/teacher
v1Routes.use('/homework', homeworkRoutes); // http://localhost:3000/api/v1/homework
v1Routes.use('/student', studentRouter); // http://localhost:3000/api/v1/student
v1Routes.use('/dashboard', dashboardRoutes); // http://localhost:3000/api/v1/dashboard
v1Routes.use('/admin', adminRoutes); // http://localhost:3000/api/v1/admin

export default v1Routes;
