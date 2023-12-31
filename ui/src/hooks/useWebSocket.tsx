import SockJs from 'sockjs-client';
import Stomp, { Frame, Message } from 'stompjs';
import useUserStore from '../stores/UserStore';
import { useEffect } from 'react';
import useWebsocketEventHandler from './useWebsocketEventHandler';

export enum EntityType {
  Rebase = 'Rebase',
  ConflictReport = 'ConflictReport',
  Promotion = 'Promotion',
  Feedback = 'Feedback',
  Classification = 'Classification',
  BranchState = 'BranchState',
  Validation = 'Validation',
  BranchHead = 'BranchHead',
  AuthorChange = 'AuthorChange',
}

// using a hook, so we can create snackbars on different events
function useWebSocket() {
  const { handleClassificationEvent, handleValidationEvent } =
    useWebsocketEventHandler();

  let stompClient: Stomp.Client;
  const user = useUserStore();

  const stompConnectCallback = (frame: Frame | undefined): any => {
    const headers = frame?.headers as StompHeaders;
    const username = headers['user-name'];
    if (username !== null) {
      stompClient.subscribe(
        `/topic/user/${user?.login}/notifications`,
        subscriptionHandler,
        { id: `sca-subscription-id-${user?.login}` },
      );
    }
  };

  const stompConnect = () => {
    const sockJsProtocols = ['websocket'];
    const socketProvider = new SockJs(
      '/authoring-services/' + 'authoring-services-websocket',
      null,
      { transports: sockJsProtocols },
    );

    const stompyBoi: Stomp.Client = Stomp.over(socketProvider);
    stompyBoi.connect({}, stompConnectCallback, errorCallback);

    stompClient = stompyBoi;
  };
  const subscriptionHandler = (message: Message) => {
    const notification = JSON.parse(message.body) as StompMessage;
    switch (notification.entityType) {
      case EntityType.Classification:
        void handleClassificationEvent(notification);
        break;
      case EntityType.Validation:
        void handleValidationEvent(notification);
        break;
      default:
        break;
    }
  };

  const errorCallback = (frame: string | Frame): any => {
    stompClient.disconnect(stompConnect);
    setTimeout(function () {
      stompConnect();
    }, 5000);
  };

  useEffect(() => {
    stompConnect();
  }, []);
}

interface StompHeaders {
  'user-name': string;
}

export interface StompMessage {
  entityType: EntityType;
  project?: string;
  task?: string;
  event?: string;
}

export default useWebSocket;
