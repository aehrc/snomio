package com.csiro.snomio.models.snowstorm;

import lombok.Data;

/** Sub part of Snowstorm's response for descriptions in a concept response */
@Data
public class DescriptionSummary {

  String term;
  String lang;
}
