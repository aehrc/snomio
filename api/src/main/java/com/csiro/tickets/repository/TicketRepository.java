package com.csiro.tickets.repository;

import com.csiro.tickets.models.Ticket;
import com.csiro.tickets.models.TicketType;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/*
   Dormant repository,
   Ticket tales await,
   Future queries bring me to life.
*/
public interface TicketRepository extends JpaRepository<Ticket, Long> {

  Page<Ticket> findAll(final Pageable pageable);

  List<Ticket> findByTitle(String title);

  List<Ticket> findByTicketType(TicketType ticketType);
}
