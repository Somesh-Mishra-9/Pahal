import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTeacherAuth } from '@/contexts/teacherAuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { teacher } = useTeacherAuth();

  if (!teacher || !teacher.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
