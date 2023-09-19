package com.csiro.tickets.controllers;

import com.csiro.snomio.exception.ErrorMessages;
import com.csiro.snomio.exception.ResourceNotFoundProblem;
import com.csiro.tickets.models.AdditionalFieldType;
import com.csiro.tickets.models.AdditionalFieldTypeValue;
import com.csiro.tickets.models.Ticket;
import com.csiro.tickets.repository.AdditionalFieldTypeRepository;
import com.csiro.tickets.repository.AdditionalFieldTypeValueRepository;
import com.csiro.tickets.repository.TicketRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdditionalFieldController {

  @Autowired private AdditionalFieldTypeRepository additionalFieldTypeRepository;

  @Autowired private AdditionalFieldTypeValueRepository additionalFieldTypeValueRepository;

  @Autowired private TicketRepository ticketRepository;

  @GetMapping("/api/tickets/additionalFieldTypes")
  public ResponseEntity<List<AdditionalFieldType>> getAllAdditionalFieldTypes() {
    List<AdditionalFieldType> additionalFieldTypes = additionalFieldTypeRepository.findAll();

    return new ResponseEntity<>(additionalFieldTypes, HttpStatus.OK);
  }

  @PostMapping(value = "/api/tickets/{ticketId}/additionalField/{additionalFieldTypeValueId}")
  public ResponseEntity<Ticket> createTicketAdditionalField(
      @PathVariable Long ticketId, @PathVariable Long additionalFieldTypeValueId) {
    Optional<Ticket> ticketOptional = ticketRepository.findById(ticketId);

    if (ticketOptional.isEmpty()) {
      throw new ResourceNotFoundProblem(String.format(ErrorMessages.TICKET_ID_NOT_FOUND, ticketId));
    }
    Ticket ticket = ticketOptional.get();
    List<AdditionalFieldTypeValue> values =
        additionalFieldTypeValueRepository.findAllByTickets(ticket);
    Optional<AdditionalFieldTypeValue> additionalFieldTypeValueOptional =
        additionalFieldTypeValueRepository.findById(additionalFieldTypeValueId);

    if (additionalFieldTypeValueOptional.isEmpty()) {
      throw new ResourceNotFoundProblem(
          String.format(
              ErrorMessages.ADDITIONAL_FIELD_VALUE_ID_NOT_FOUND, additionalFieldTypeValueId));
    }
    AdditionalFieldTypeValue additionalFieldTypeValue = additionalFieldTypeValueOptional.get();
    Long additionalFieldTypeId = additionalFieldTypeValue.getAdditionalFieldType().getId();

    for (AdditionalFieldTypeValue additionalFieldTypeValue1 : values) {
      if (additionalFieldTypeValue1
          .getAdditionalFieldType()
          .getId()
          .equals(additionalFieldTypeId)) {
        ticket.getAdditionalFieldTypeValues().remove(additionalFieldTypeValue1);
        ticket.getAdditionalFieldTypeValues().add(additionalFieldTypeValue);
        ticketRepository.save(ticket);
        return new ResponseEntity<>(ticket, HttpStatus.OK);
      }
    }
    ticket.getAdditionalFieldTypeValues().add(additionalFieldTypeValue);
    ticketRepository.save(ticket);
    return new ResponseEntity<>(ticket, HttpStatus.OK);
  }
}