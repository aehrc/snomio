package com.csiro.snomio.models.snowstorm;

import java.util.Collection;
import lombok.Data;

/** DTO for Snowstorm's API response when returning a list of concepts */
@Data
public class ConceptList {

  private Collection<ConceptSummary> items;
  private int total;
  private int limit;
  private int offset;
  private String searchAfter;
  private Long[] searchAfterArray;
}
