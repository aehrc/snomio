import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import useTaskById from '../../../hooks/useTaskById';
import TaskDetailsActions from './TaskDetailsActions';
import { useTheme } from '@mui/material/styles';
import TaskTicketList from './TaskTicketList';
function TaskDetails() {
  const task = useTaskById();
  const theme = useTheme();
  return (
    <>
      <List>
        <ListItem>
          <ListItemIcon sx={{ paddingRight: '1em' }}>
            <BadgeIcon sx={{ fill: theme.palette.primary[400] }} />
          </ListItemIcon>
          <ListItemText primary={`${task?.assignee.displayName}`} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon sx={{ paddingRight: '1em' }}>
            <TitleIcon sx={{ fill: theme.palette.primary[400] }} />
          </ListItemIcon>
          <ListItemText primary={`${task?.summary}`} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon sx={{ paddingRight: '1em' }}>
            <DescriptionIcon sx={{ fill: theme.palette.primary[400] }} />
          </ListItemIcon>
          <ListItemText
            primary={`${task?.description?.replace(/<[^>]*>?/gm, ' ')}`}
          />
        </ListItem>
        <Divider />
      </List>
      <TaskTicketList />
      <TaskDetailsActions />
    </>
  );
}

export default TaskDetails;
