package com.csiro.tickets.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "task_association", uniqueConstraints = @UniqueConstraint(columnNames = "ticket_id"))
@JsonIdentityInfo(
    scope = TaskAssociation.class,
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id")
public class TaskAssociation extends BaseAuditableEntity {

  @OneToOne
  @JsonBackReference(value = "ticket-task")
  private Ticket ticket;

  @Column private String taskId;
}
