import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Ticket from '../pages/Ticket/Ticket.tsx';
import TicketDetail from '../pages/TicketDetail/TicketDetail.tsx';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Ticket />} />
        <Route path="/detail/:id" element={<TicketDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;