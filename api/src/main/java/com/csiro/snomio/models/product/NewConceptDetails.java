package com.csiro.snomio.models.product;

import au.csiro.snowstorm_client.model.SnowstormAxiom;
import au.csiro.snowstorm_client.model.SnowstormReferenceSetMemberViewComponent;
import com.csiro.snomio.util.PartionIdentifier;
import com.csiro.snomio.validation.ValidSctId;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewConceptDetails {
  /**
   * A temporary identifier for this new concept as a placeholder, is used in Edges in the product
   * summary.
   */
  @NotNull UUID conceptId = UUID.randomUUID();

  /**
   * The SCTID of the concept to be created if the user wants to use a specific SCTID. This is
   * optional, if not specified a new concept will be created with a random SCTID.
   */
  @ValidSctId(partitionIdentifier = PartionIdentifier.CONCEPT)
  String specifiedConceptId;

  /**
   * Fully specified name of the concept to be created. This does not include the semantic tag which
   * is in the element below.
   */
  @NotNull @NotEmpty String fullySpecifiedName;

  /** Preferred term of the concept to be created. */
  @NotNull @NotEmpty String preferredTerm;

  /** Semantic tag of the concept to be created. */
  @NotNull @NotEmpty String semanticTag;

  /** Axioms of the concept to be created, usually only one. */
  @NotNull @NotEmpty Set<SnowstormAxiom> axioms = new HashSet<>();

  Set<SnowstormReferenceSetMemberViewComponent> referenceSetMembers = new HashSet<>();

  public boolean containsTarget(UUID conceptId) {
    return axioms.stream()
        .anyMatch(
            axiom ->
                axiom.getRelationships().stream()
                    .filter(r -> !r.getConcrete())
                    .anyMatch(r -> r.getDestinationId().equals(conceptId.toString())));
  }

  public boolean refersToUuid() {
    return axioms.stream()
        .anyMatch(
            axiom ->
                axiom.getRelationships().stream()
                    .filter(r -> !r.getConcrete())
                    .anyMatch(r -> !r.getDestinationId().matches("[0-9]+")));
  }
}
