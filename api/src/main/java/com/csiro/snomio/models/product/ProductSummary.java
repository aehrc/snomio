package com.csiro.snomio.models.product;

import com.csiro.snomio.models.snowstorm.ConceptSummary;
import java.util.HashSet;
import java.util.Set;
import lombok.Data;

/**
 * "N-box" model DTO listing a set of nodes and edges between them where the nodes and edges have
 * labels indicating their type.
 */
@Data
public class ProductSummary {

  ConceptSummary subject;

  Set<Node> nodes = new HashSet<>();
  Set<Edge> edges = new HashSet<>();

  public void addNode(ConceptSummary conceptSummary, String label) {
    nodes.add(new Node(conceptSummary, label));
  }

  public void addEdge(long source, long target, String type) {
    edges.add(new Edge(source, target, type));
  }
}
