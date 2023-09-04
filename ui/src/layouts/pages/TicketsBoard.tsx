import { useEffect, useState } from 'react';
import useTicketStore from '../../stores/TicketStore';
import TicketsService from '../../api/TicketsService';
import { State, Ticket } from '../../types/tickets/ticket';

import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  MouseSensor,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
} from '@dnd-kit/core';
import TicketColumn from './TicketColumn';
import { Stack } from '@mui/system';

function TicketsBoard() {
  const {
    setTickets,
    availableStates,
    setAvailableStates,
    getTicketById,
    mergeTickets,
  } = useTicketStore();

  const [isDropped, setIsDropped] = useState(false);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const sensors = useSensors(
    useSensor(MouseSensor),
    pointerSensor,
    useSensor(KeyboardSensor),
    useSensor(TouchSensor),
  );

  useEffect(() => {
    TicketsService.getAllTickets()
      .then((tickets: Ticket[]) => {
        setTickets(tickets);
      })
      .catch(err => console.log(err));
    TicketsService.getAllStates()
      .then((states: State[]) => {
        setAvailableStates(states);
      })
      .catch(err => console.log(err));
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    console.log(active);
    console.log(over);
    console.log(event);
    if (active && active.id && over && over.id !== undefined) {
      const ticket = getTicketById(Number(active.id));
      if (ticket !== undefined) {
        ticket.state.id = Number(over.id);
        TicketsService.updateTicket(ticket)
          .then(updatedTicket => {
            mergeTickets(updatedTicket);
          })
          .catch(err => console.log(err));
      }

      setIsDropped(true);
    }
  }

  return (
    <Stack width={'100%'} height={'100%'} gap={3} direction={'row'}>
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        {availableStates.map(state => {
          return <TicketColumn state={state} key={state.id} />;
        })}
      </DndContext>
    </Stack>
  );
}

export default TicketsBoard;