import useInitializeTickets from './useInitializeTickets';
import useInitializeTasks from './useInitializeTasks';
import { useInitializeJiraUsers } from './useInitializeJiraUsers';
import useInitializeConcepts from './useInitializeConcepts.tsx';

export default function useInitializeApp() {
  const { tasksLoading } = useInitializeTasks();
  const { ticketsLoading } = useInitializeTickets();
  const { jiraUsersIsLoading } = useInitializeJiraUsers();

  return {
    appLoading: tasksLoading || ticketsLoading || jiraUsersIsLoading,
  };
}
