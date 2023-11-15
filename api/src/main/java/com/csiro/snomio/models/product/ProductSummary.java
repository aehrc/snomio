package com.csiro.snomio.models.product;

import static com.csiro.snomio.service.ProductService.CTPP_LABEL;

import au.csiro.snowstorm_client.model.SnowstormConceptMini;
import com.csiro.snomio.exception.MoreThanOneSubjectProblem;
import com.csiro.snomio.exception.SingleConceptExpectedProblem;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Data;

/**
 * "N-box" model DTO listing a set of nodes and edges between them where the nodes and edges have
 * labels indicating their type.
 */
@Data
public class ProductSummary {
  @NotNull @NotEmpty Set<@Valid Node> nodes = new HashSet<>();
  @NotNull @NotEmpty Set<@Valid Edge> edges = new HashSet<>();

  public boolean isContainsNewConcepts() {
    return nodes.stream().anyMatch(n -> n.isNewConcept());
  }

  public void addNode(Node node) {
    nodes.add(node);
  }

  public void addNode(SnowstormConceptMini conceptSummary, String label) {
    nodes.add(new Node(conceptSummary, label));
  }

  public void addEdge(String source, String target, String type) {
    edges.add(new Edge(source, target, type));
  }

  public void addSummary(ProductSummary productSummary) {
    nodes.addAll(productSummary.getNodes());
    edges.addAll(productSummary.getEdges());
  }

  public String getSingleConceptWithLabel(String label) {
    Set<Node> filteredNodes =
        getNodes().stream().filter(n -> n.getLabel().equals(label)).collect(Collectors.toSet());
    if (filteredNodes.size() != 1) {
      throw new SingleConceptExpectedProblem(
          "Expected 1 "
              + label
              + " but found "
              + filteredNodes.stream().map(Node::getIdAndFsnTerm).collect(Collectors.joining()),
          filteredNodes.size());
    } else {
      return filteredNodes.iterator().next().getConceptId();
    }
  }

  public SnowstormConceptMini getSubject() {
    Set<Node> subjectNodes =
        getNodes().stream()
            .filter(
                n ->
                    n.getLabel().equals(CTPP_LABEL)
                        && getEdges().stream()
                            .noneMatch(e -> e.getTarget().equals(n.getConceptId())))
            .collect(Collectors.toSet());

    if (subjectNodes.size() != 1) {
      throw new MoreThanOneSubjectProblem(
          "Product model must have exactly one CTPP node (root) with no incoming edges. Found "
              + subjectNodes.size()
              + " which were "
              + subjectNodes.stream().map(Node::getConceptId).collect(Collectors.joining(", ")));
    }

    Node subject = subjectNodes.iterator().next();
    return subject.getConcept();
  }
}
