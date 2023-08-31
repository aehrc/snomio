package com.csiro.tickets.repository;

import com.csiro.tickets.models.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {}
