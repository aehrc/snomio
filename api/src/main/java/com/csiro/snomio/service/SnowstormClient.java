package com.csiro.snomio.service;

import com.csiro.snomio.exception.SingleConceptExpectedProblem;
import com.csiro.snomio.exception.UnexpectedSnowstormResponseProblem;
import com.csiro.snomio.models.snowstorm.ConceptList;
import com.csiro.snomio.models.snowstorm.ConceptSummary;
import java.util.Collection;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

/** Client for Snowstorm's REST API */
@Service
@Log
public class SnowstormClient {

  private final WebClient snowStormApiClient;

  @Autowired
  public SnowstormClient(@Qualifier("snowStormApiClient") WebClient snowStormApiClient) {
    this.snowStormApiClient = snowStormApiClient;
  }

  private static String populateParameters(String ecl, Pair<String, Object>[] params) {
    for (Pair<String, Object> param : params) {
      ecl = ecl.replaceAll(param.getFirst(), param.getSecond().toString());
    }
    return ecl;
  }

  public ConceptSummary getConcept(String branch, Long id) {
    return snowStormApiClient
        .get()
        .uri("/" + branch + "/concepts/" + id)
        .retrieve()
        .bodyToMono(ConceptSummary.class)
        .block();
  }

  public ConceptSummary getConceptFromEcl(String branch, String ecl, Long id)
      throws SingleConceptExpectedProblem {
    return getConceptFromEcl(branch, ecl, Pair.of("<id>", id));
  }

  public ConceptSummary getConceptFromEcl(String branch, String ecl, Pair<String, Object>... params)
      throws SingleConceptExpectedProblem {
    ecl = populateParameters(ecl, params);
    Collection<ConceptSummary> concepts = getConceptsFromEcl(branch, ecl);
    if (concepts.size() != 1) {
      throw new SingleConceptExpectedProblem(branch, ecl, concepts);
    }
    return concepts.iterator().next();
  }

  public Collection<ConceptSummary> getConceptsFromEcl(String branch, String ecl, Long id) {
    return getConceptsFromEcl(branch, ecl, Pair.of("<id>", id));
  }

  public Collection<ConceptSummary> getConceptsFromEcl(
      String branch, String ecl, Pair<String, Object>... params) {
    ecl = populateParameters(ecl, params);
    ConceptList list =
        snowStormApiClient
            .get()
            .uri("/" + branch + "/concepts?ecl=" + ecl)
            .retrieve()
            .bodyToMono(ConceptList.class)
            .block();

    if (list == null) {
      throw new UnexpectedSnowstormResponseProblem(
          "Expected a list of concepts from ECL '"
              + ecl
              + "' on branch '"
              + branch
              + "' but the response was null");
    }

    return list.getItems();
  }

  public Collection<ConceptSummary> getDescendants(String branch, long conceptId) {
    ConceptList list =
        snowStormApiClient
            .get()
            .uri("/" + branch + "/concepts/" + conceptId + "/descendants")
            .retrieve()
            .bodyToMono(ConceptList.class)
            .block();

    if (list == null) {
      throw new UnexpectedSnowstormResponseProblem(
          "Expected a list of descendants for '"
              + conceptId
              + "' on branch '"
              + branch
              + "' but the response was null");
    }

    return list.getItems();
  }
}
