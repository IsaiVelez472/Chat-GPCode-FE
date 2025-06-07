import { Routes, Route, Navigate } from 'react-router-dom';
import VisitorSearch from '../modules/visitors/components/VisitorSearch';
import { useAuth } from '../modules/auth/context/AuthContext';
import RegisterEmployee from '../modules/employees/pages/RegisterEmployee';
import ManageEmployees from '../modules/employees/pages/ManageEmployees';
import Employees from '../modules/employees/pages/Employees';
import Reports from '../modules/reports/pages/Reports.jsx';
import ReportTables from '../modules/reports/pages/ReportTables.jsx';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='flex flex-col items-center'>
      <Routes>
        <Route path='/empleados' element={<Employees />} />
        <Route path='/visitantes' element={<VisitorSearch />} />
        <Route path='/registrar-empleado' element={<RegisterEmployee />} />
        <Route path='/administrar-empleados' element={<ManageEmployees />} />
        <Route path='/reportes' element={<Reports />} />
        <Route path='/reportes/tablas' element={<ReportTables />} />
        <Route path='*' element={<Navigate to='/dashboard/empleados' replace />} />
      </Routes>
    </div>
  );
};

export default Dashboard;
