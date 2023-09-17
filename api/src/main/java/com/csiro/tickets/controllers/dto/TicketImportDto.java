package com.csiro.tickets.controllers.dto;

import com.csiro.tickets.models.AdditionalField;
import com.csiro.tickets.models.Attachment;
import com.csiro.tickets.models.Comment;
import com.csiro.tickets.models.Label;
import com.csiro.tickets.models.State;
import com.csiro.tickets.models.Ticket;
import com.csiro.tickets.models.TicketType;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TicketImportDto {

  private String assignee;

  private String title;

  private String description;

  private TicketType ticketType;

  private State state;

  @JsonProperty(value = "ticket-labels")
  private List<Label> labels;

  @JsonProperty(value = "ticket-comment")
  private List<Comment> comments;

  @JsonProperty(value = "ticket-additional-field")
  private List<AdditionalField> additionalFields;

  @JsonProperty(value = "ticket-attachment")
  private List<Attachment> attachments;

  public static TicketImportDto of(Ticket ticket) {
    TicketImportDtoBuilder ticketImportDto = TicketImportDto.builder();

    ticketImportDto
        .title(ticket.getTitle())
        .description(ticket.getDescription())
        .ticketType(ticket.getTicketType())
        .labels(ticket.getLabels())
        .comments(ticket.getComments())
        .additionalFields(ticket.getAdditionalFields())
        .attachments(ticket.getAttachments())
        .comments(ticket.getComments())
        .state(ticket.getState());

    return ticketImportDto.build();
  }
}
