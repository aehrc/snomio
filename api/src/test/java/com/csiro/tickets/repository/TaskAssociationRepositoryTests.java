package com.csiro.tickets.repository;

import com.csiro.tickets.TicketTestBase;
import com.csiro.tickets.controllers.dto.TaskAssociationDto;
import com.csiro.tickets.models.TaskAssociation;
import com.csiro.tickets.models.Ticket;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class TaskAssociationRepositoryTests extends TicketTestBase {

  @Autowired TaskAssociationRepository taskAssociationRepository;

  @Autowired TicketRepository ticketRepository;

  @Test
  void getAllTaskAssociations() {
    Ticket ticket = Ticket.builder().title("Task association test").description("A test").build();
    Ticket savedTicket = ticketRepository.save(ticket);

    TaskAssociation taskAssociation = new TaskAssociation();
    taskAssociation.setTicket(savedTicket);
    taskAssociation.setTaskId("AU-Test1");

    taskAssociationRepository.save(taskAssociation);

    TaskAssociation taskAssociation2 = new TaskAssociation();
    taskAssociation2.setTicket(savedTicket);
    taskAssociation2.setTaskId("AU-Test2");

    taskAssociationRepository.save(taskAssociation2);

    List<TaskAssociationDto> taskAssociationDtos = taskAssociationRepository.findAllToDto();

    Assertions.assertEquals(2, taskAssociationDtos.size());
  }
}
