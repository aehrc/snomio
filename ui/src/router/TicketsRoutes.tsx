import Loading from '../components/Loading';
import { Route, Routes } from 'react-router-dom';
import TicketsBacklog from '../pages/tickets/TicketsBacklog';
import useInitializeTickets from '../hooks/api/useInitializeTickets';
import { useInitializeJiraUsers } from '../hooks/api/useInitializeJiraUsers';
import IndividualTicketEdit from '../pages/tickets/individual/IndividualTicketEdit';

function TicketsRoutes() {
  const { ticketsLoading } = useInitializeTickets();
  const { jiraUsersIsLoading } = useInitializeJiraUsers();

  if (ticketsLoading || jiraUsersIsLoading) {
    return <Loading />;
  }
  return (
    <Routes>
      <Route path="/backlog" element={<TicketsBacklog />} />
      <Route
        path="/board"
        // element={<TicketsBoard />}
        element={<div>Coming soon to a computer near you!</div>}
      />
      <Route path="/individual/:id" element={<IndividualTicketEdit />} />
    </Routes>
  );
}

export default TicketsRoutes;
