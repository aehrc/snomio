import useTaskById from '../../hooks/useTaskById.tsx';
import TaskEditCard from './components/TaskEditCard.tsx';
import TasksList from './components/TasksList.tsx';
import TaskTicket from './components/TaskTicket.tsx';
import { Stack } from '@mui/system';
import useJiraUserStore from '../../stores/JiraUserStore.ts';
import { InfoCircleOutlined } from '@ant-design/icons';
import IconButton from '../../components/@extended/IconButton.tsx';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

function TaskEditLayout() {
  const task = useTaskById();
  const jiraUserStore = useJiraUserStore();
  const { jiraUsers } = jiraUserStore;
  const [menuOpen, setMenuOpen] = useState(true);
  const [firstOpen, setFirstOpen] = useState(true);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (firstOpen) {
      setFirstOpen(false);
    }
  }, []);

  return (
    <Stack
      sx={{
        minHeight: 'calc(100vh - 110px)',
        position: 'relative',
        width: '100%',
      }}
    >
      <Stack
        spacing={2}
        alignItems={'center'}
        width={'100%'}
        maxHeight={'calc(100vh - 110px)'}
      >
        <TasksList
          tasks={task ? [task] : []}
          heading="Task Details"
          dense={true}
          naked={true}
          jiraUsers={jiraUsers}
          showActionBar={false}
        />
        <Stack
          sx={{
            width: '100%',
            height: 'calc(100vh - 110px)',
            overflow: 'scroll',
          }}
          direction={'row'}
          spacing={3}
        >
          {/* info menu */}
          <Routes>
            <Route path="/:ticketId/*" element={<TaskTicket />} />

            <Route path="" element={<TaskEditCard />} />
          </Routes>
        </Stack>
      </Stack>

      {/* The buttons that will always float to the bottom right */}
      <Stack
        direction="column"
        sx={{ position: 'absolute', bottom: '0', right: '0' }}
        gap={1}
      >
        <IconButton
          variant={menuOpen ? 'contained' : 'outlined'}
          color="primary"
          aria-label="toggle-menu"
          onClick={handleMenuToggle}
        >
          <InfoCircleOutlined />
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default TaskEditLayout;
