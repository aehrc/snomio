/* eslint-disable */
import { Button, SxProps } from '@mui/material';
import useTaskById from '../../hooks/useTaskById';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ArchiveIcon from '@mui/icons-material/Archive';
import axios from 'axios';
import SockJs from 'sockjs-client';
import Stomp from 'stompjs';

import { authoringPlatformLocation } from '../../utils/externalLocations';

import useUserStore from '../../stores/UserStore';
import { Link } from 'react-router-dom';
import { ClassificationStatus } from '../../types/task';
import { LoadingButton } from '@mui/lab';
import TasksServices from '../../api/TasksService';
import useTaskStore from '../../stores/TaskStore';

const customSx: SxProps = {
  justifyContent: 'flex-start',
};

function TaskDetailsActions() {
  const task = useTaskById();
  const taskStore = useTaskStore();
  
  let stompClient: Stomp.Client;
  let user = useUserStore();

  const classifying = task?.latestClassificationJson?.status === ClassificationStatus.Running;
  const classified = task?.latestClassificationJson?.status === ClassificationStatus.Completed;

  const handleStartClassification = async () => {
    stompConnect();
    const returnedTask = await TasksServices.triggerValidation(task?.projectKey, task?.key);

    taskStore.mergeTasks(returnedTask);    
  };

  const stompSuccessCallback = (frame: any) => {
    let username = frame.headers['user-name'];
    console.log(stompClient);
    if (username !== null) {
      stompClient.subscribe(
        '/topic/user/' + user.login + '/notifications',
        subscriptionHandler,
        { id: 'sca-subscription-id-' + user.login },
      );
    }
  };

  const stompConnect = () => {
    let sockJsProtocols = ['websocket'];
    var socketProvider = new SockJs(
      '/authoring-services/' + 'authoring-services-websocket',
      null,
      { transports: sockJsProtocols },
    );

    const stompyBoi: Stomp.Client = Stomp.over(socketProvider);

    stompyBoi.connect({}, stompSuccessCallback, stompFailureCallback);

    stompClient = stompyBoi;
  };
  const subscriptionHandler = (message: any) => {
    console.log(message);
    console.log('wft');
  };

  const stompFailureCallback = () => {
    stompClient.disconnect(stompConnect);
    setTimeout(function () {
      stompConnect();
    }, 5000);
    console.log('STOMP: Reconnecting in 5 seconds');
  };
  return (
    <div
      style={{
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '.5em',
        padding: '1em',
      }}
    >
      
        <Button
          variant="contained"
          color="primary"
          startIcon={<SettingsIcon />}
          sx={customSx}
          href={`${authoringPlatformLocation}/#/tasks/task/${task?.projectKey}/${task?.key}/edit`}
          target='_blank'
        >
          View In Authoring Platform
        </Button>

        <LoadingButton 
          loading={classifying} 
          variant='contained' 
          color='success' 
          loadingPosition='start'
          startIcon={<NotificationsIcon />}
          sx={customSx}
          onClick={handleStartClassification}
          >
          {classified ? 'Re-classify' : 'Classify'}
        </LoadingButton>

      <Button variant="contained" startIcon={<SchoolIcon />} sx={customSx} color='secondary'>
        Validate Without MRCM
      </Button>
      <Button
        variant="contained"
        startIcon={<QuestionAnswerIcon />}
        sx={customSx}
        color='info'
      >
        Submit For Review
      </Button>
      <Button variant="contained" startIcon={<CallMergeIcon />} sx={customSx} color='warning'>
        Promote This Task to the Project
      </Button>
      <Button variant="contained" startIcon={<ArchiveIcon />} sx={customSx} color='error'>
        Begin Promotion Automation
      </Button>
    </div>
  );
}

export default TaskDetailsActions;
