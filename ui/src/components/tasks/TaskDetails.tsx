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
import useTaskById from '../../hooks/useTaskById';
import TaskDetailsActions from './TaskDetailsActions';
import { useTheme } from '@mui/material/styles';
function TaskDetails() {
  const task = useTaskById();
  const theme = useTheme();
  console.log(theme);
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
            primary={`${task?.description
              ?.replace('<p>', '')
              ?.replace('</p>', '')}`}
          />
        </ListItem>
        <Divider />
      </List>
      <TaskDetailsActions />
    </>
  );
}

export default TaskDetails;
