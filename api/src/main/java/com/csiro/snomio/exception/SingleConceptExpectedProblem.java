package com.csiro.snomio.exception;

import com.csiro.snomio.models.snowstorm.ConceptSummary;
import java.util.Collection;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class SingleConceptExpectedProblem extends SnomioProblem {

  final transient Collection<ConceptSummary> concepts;

  public SingleConceptExpectedProblem(String branch, String ecl,
      Collection<ConceptSummary> concepts) {
    super("single-concept-ecl", "Single concept expected from ECL",
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Expected a single concept ecl '" + ecl + "' on branch '" + branch + "' but found "
            + concepts.size());
    this.concepts = concepts;
  }
}
