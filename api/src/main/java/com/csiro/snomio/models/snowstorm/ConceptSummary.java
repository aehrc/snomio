package com.csiro.snomio.models.snowstorm;

import lombok.Data;

/**
 * DTO for Snowstorm's API when it returns a "Concept mini" response - i.e. summary
 */
@Data
public class ConceptSummary {

  long conceptId;
  boolean active;
  DefinitionStatus definitionStatus;
  long moduleId;
  DescriptionSummary fsn;
  DescriptionSummary pt;
  String idAndFsnTerm;

  public void setId(long id) {
    this.conceptId = id;
  }

}
