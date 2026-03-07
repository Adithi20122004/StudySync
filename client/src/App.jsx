import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout    from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Tasks     from './pages/Tasks';
import Calendar  from './pages/Calendar';
import Groups    from './pages/Groups';
import Resources from './pages/Resources';
import Login     from './pages/Login';
import Register  from './pages/Register';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index              element={<Dashboard />} />
          <Route path="tasks"       element={<Tasks />} />
          <Route path="calendar"    element={<Calendar />} />
          <Route path="groups"      element={<Groups />} />
          <Route path="resources"   element={<Resources />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}