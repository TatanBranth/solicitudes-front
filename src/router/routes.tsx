import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard.tsx';
import Ticket from '../pages/Ticket/Ticket.tsx';
import TicketDetail from '../pages/TicketDetail/TicketDetail.tsx';
import Solicitudes from '../pages/Solicitudes/Solicitudes.tsx';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ticket" element={<Ticket/>} />
        <Route path="/detail/:id" element={<TicketDetail />} />
        <Route path="/Solicitudes" element={<Solicitudes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;