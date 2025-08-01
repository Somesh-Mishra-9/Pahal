import jwt from 'jsonwebtoken';
import Teacher from '../models/teacher.model.js';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacher = await Teacher.findById(decoded.id).select('-password');
    
    if (!teacher) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!teacher.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    req.teacher = teacher;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if teacher is verified
export const requireVerification = async (req, res, next) => {
  try {
    if (!req.teacher.isVerified) {
      return res.status(403).json({ 
        message: 'Account not verified. Please wait for admin verification.' 
      });
    }
    next();
  } catch (error) {
    console.error('Verification middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if teacher is admin
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.teacher.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Combined middleware for verified teachers
export const requireVerifiedTeacher = [authenticateToken, requireVerification];

// Combined middleware for admin access
export const requireAdminAccess = [authenticateToken, requireAdmin];
