package com.csiro.tickets.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.envers.Audited;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@Table(name = "comment")
@Entity
@Audited
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Comment extends BaseAuditableEntity {

  @ManyToOne
  @JoinColumn(name = "ticket_id")
  @JsonBackReference(value = "ticket-comment")
  private Ticket ticket;

  @Column(length = 1000000)
  private String text;

  @Column private Instant jiraCreated;

  public static Comment of(Comment comment) {
    return Comment.builder().text(comment.getText()).jiraCreated(comment.getJiraCreated()).build();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    if (!super.equals(o)) {
      return false;
    }
    Comment that = (Comment) o;
    return Objects.equals(super.getId(), that.getId());
  }

  @PrePersist
  public void prePersist() {
    if (jiraCreated != null) {
      setCreated(jiraCreated);
    }
  }

  @Override
  public int hashCode() {
    return Objects.hash(super.hashCode(), text);
  }
}
