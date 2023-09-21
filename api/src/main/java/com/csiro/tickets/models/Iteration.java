package com.csiro.tickets.models;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.envers.Audited;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "iteration")
@Entity
@Audited
@EntityListeners(AuditingEntityListener.class)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Iteration extends BaseAuditableEntity {

  @Column(unique = true)
  private String name;

  @Column private Instant startDate;

  @Column private Instant endDate;

  @Column private boolean active;

  @Column private boolean completed;

  @OneToMany(
      mappedBy = "iteration",
      fetch = FetchType.LAZY,
      cascade = {CascadeType.ALL, CascadeType.REMOVE},
      orphanRemoval = false)
  @Transient
  @JsonIgnore
  private List<Ticket> tickets;
}
