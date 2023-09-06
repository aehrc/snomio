package com.csiro.tickets.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.envers.Audited;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Data
@Table(name = "attachment")
@Audited
@EntityListeners(AuditingEntityListener.class)
public class Attachment extends BaseAuditableEntity {

  @ManyToOne
  @JoinColumn(name = "ticket_id")
  @JsonBackReference(value = "ticket-attachment")
  private Ticket ticket;

  @Column private String description;

  @Column private String data;

  @Column private Integer length;

  @Column private String sha256;

  @ManyToOne private AttachmentType attachmentType;
}
