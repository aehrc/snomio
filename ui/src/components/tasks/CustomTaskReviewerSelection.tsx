import { ReactNode, useEffect, useState } from 'react';

import Gravatar from 'react-gravatar';
import emailUtils, {
  mapEmailToUserDetail,
} from '../../utils/helpers/emailUtils.ts';
import { ListItemText, MenuItem, OutlinedInput, Tooltip } from '@mui/material';
import { Task, UserDetails } from '../../types/task.ts';
import { JiraUser } from '../../types/JiraUserResponse.ts';
import useTaskStore from '../../stores/TaskStore.ts';
import TasksServices from '../../api/TasksService.ts';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Stack } from '@mui/system';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import emailToName from '../../utils/helpers/emailUtils.ts';

interface CustomTaskReviewerSelectionProps {
  id?: string;
  user?: string[];
  userList: JiraUser[];
}
const ITEM_HEIGHT = 100;
const ITEM_PADDING_TOP = 8;

export default function CustomTaskReviewerSelection({
  id,
  user,
  userList,
}: CustomTaskReviewerSelectionProps) {
  const taskStore = useTaskStore();
  const { enqueueSnackbar } = useSnackbar();
  const [emailAddress, setEmailAddress] = useState<string[]>(user as string[]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const getTaskById = (taskId: string): Task => {
    return taskStore.getTaskById(taskId) as Task;
  };
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const updateReviewers = async (reviewerList: string[], taskId: string) => {
    const task: Task = getTaskById(taskId);

    const reviewers = reviewerList.map(e => {
      const userDetail = mapEmailToUserDetail(e, userList);
      if (userDetail) {
        return userDetail;
      }
    });

    const returnedTask = await TasksServices.updateTask(
      task?.projectKey,
      task?.key,
      undefined,
      reviewers as UserDetails[],
    );
    taskStore.mergeTasks(returnedTask);
  };
  const handleChange = (event: SelectChangeEvent<typeof emailAddress>) => {
    setDisabled(true);
    const {
      target: { value },
    } = event;
    void updateReviewers(value as string[], id as string)
      .then(() => {
        enqueueSnackbar(`Updated reviewers for task ${id}`, {
          variant: 'success',
          autoHideDuration: 5000,
        });
        setDisabled(false);
      })
      .catch(err => {
        enqueueSnackbar(
          `Update reviewers failed for task ${id} with error ${err}`,
          {
            variant: 'error',
          },
        );
        setDisabled(false);
      });
    setEmailAddress(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    console.log(value);
  };

  return (
    <Select
      multiple
      value={emailAddress}
      onChange={handleChange}
      disabled={disabled}
      sx={{ width: '100%' }}
      input={<OutlinedInput label="Tag" />}
      //renderValue={(selected) => selected.join(', ')}
      renderValue={selected => (
        <Stack gap={1} direction="row" flexWrap="wrap">
          {selected.map(value => (
            <Tooltip title={emailToName(value)} key={value}>
              <Stack direction="row" spacing={1}>
                <Gravatar
                  email={value}
                  rating="pg"
                  default="monsterid"
                  style={{ borderRadius: '50px' }}
                  size={30}
                  className="CustomAvatar-image"
                  key={value}
                />
              </Stack>
            </Tooltip>
          ))}
        </Stack>
      )}
      MenuProps={MenuProps}
    >
      {userList.map(u => (
        <MenuItem key={u.emailAddress} value={u.emailAddress}>
          <Stack direction="row" spacing={2}>
            {/* <Avatar url="/static/logo7.png" alt="food" /> */}
            <Gravatar
              email={u.emailAddress}
              rating="pg"
              default="monsterid"
              style={{ borderRadius: '50px' }}
              size={30}
              className="CustomAvatar-image"
            />
          </Stack>

          <Checkbox checked={emailAddress.indexOf(u.emailAddress) > -1} />
          <ListItemText primary={u.displayName} />
        </MenuItem>
      ))}
    </Select>
  );
}
