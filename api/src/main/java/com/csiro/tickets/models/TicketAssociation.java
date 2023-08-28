package com.csiro.tickets.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.envers.Audited;

@Entity
@Data
@Table(name = "ticket_association")
@Audited
public class TicketAssociation extends BaseAuditableEntity {

  @ManyToOne
  @JoinColumn(name = "ticket_id", insertable = false, updatable = false)
  @JsonBackReference(value = "ticket-source-association")
  private Ticket associationSource;

  @ManyToOne
  @JoinColumn(name = "ticket_id", insertable = false, updatable = false)
  @JsonBackReference(value = "ticket-target-association")
  private Ticket associationTarget;

  @Column(name = "description")
  private String description;
}
