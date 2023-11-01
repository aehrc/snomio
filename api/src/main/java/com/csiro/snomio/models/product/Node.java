package com.csiro.snomio.models.product;

import static com.csiro.snomio.util.SnomedConstants.DEFINED;
import static com.csiro.snomio.util.SnomedConstants.PRIMITIVE;

import au.csiro.snowstorm_client.model.SnowstormConceptMiniComponent;
import au.csiro.snowstorm_client.model.SnowstormTermLangPojoComponent;
import com.csiro.snomio.util.AmtConstants;
import com.csiro.snomio.validation.OnlyOnePopulated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A node in a {@link ProductSummary} which represents a concept with a particular label indicating
 * the type of the node in the context of the product. This DTO can also represent a new concept
 * that has not yet been created in Snowstorm.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@OnlyOnePopulated(
    fields = {"concept", "newConceptDetails"},
    message = "Node must represent a concept or a new concept, not both")
public class Node {
  /**
   * Existing concept in the terminology for this node. Either this element or newConceptDetails is
   * populated, not both.
   */
  SnowstormConceptMiniComponent concept;

  /** Label for this node indicating its place in the model. */
  @NotNull @NotEmpty String label;

  /**
   * Details of a new concept that has not yet been created in the terminology. Either this element
   * or concept is populated, not both.
   */
  @Valid NewConceptDetails newConceptDetails;

  public Node(SnowstormConceptMiniComponent concept, String label) {
    this.concept = concept;
    this.label = label;
  }

  /**
   * Returns the concept ID of the concept represented by this node. If the node represents an
   * existing concept that ID will be returned, otherwise if it represents a new concept the
   * temporary concept ID will be returned. Either way this will be the ID used in the edges of the
   * product model.
   */
  public String getConceptId() {
    if (concept != null) {
      return concept.getConceptId();
    }
    return newConceptDetails.getConceptId().toString();
  }

  /** Returns the concept represented by this node as ID and FSN, usually for logging. */
  public String getIdAndFsnTerm() {
    if (concept != null) {
      return concept.getIdAndFsnTerm();
    }
    return newConceptDetails.getConceptId().toString()
        + "| "
        + newConceptDetails.getFullySpecifiedName()
        + "|";
  }

  /**
   * Returns true if this node represents a new concept, or false if it represents an existing
   * concept.
   */
  public boolean isNewConcept() {
    return newConceptDetails != null;
  }

  public SnowstormConceptMiniComponent toConceptMini() {
    if (concept != null) {
      return getConcept();
    } else if (newConceptDetails != null) {
      SnowstormConceptMiniComponent cm = new SnowstormConceptMiniComponent();
      return cm.conceptId(newConceptDetails.getConceptId().toString())
          .fsn(
              new SnowstormTermLangPojoComponent()
                  .lang("en")
                  .term(newConceptDetails.getFullySpecifiedName()))
          .pt(
              new SnowstormTermLangPojoComponent()
                  .lang("en")
                  .term(newConceptDetails.getPreferredTerm()))
          .idAndFsnTerm(getIdAndFsnTerm())
          .definitionStatus(
              newConceptDetails.getAxioms().stream()
                      .anyMatch(a -> Objects.equals(a.getDefinitionStatus(), DEFINED))
                  ? DEFINED
                  : PRIMITIVE)
          .moduleId(AmtConstants.SCT_AU_MODULE);
    } else {
      throw new IllegalStateException("Node must represent a concept or a new concept, not both");
    }
  }
}
