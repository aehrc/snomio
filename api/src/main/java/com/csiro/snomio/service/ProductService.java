package com.csiro.snomio.service;

import com.csiro.snomio.exception.ProductModelProblem;
import com.csiro.snomio.exception.SingleConceptExpectedProblem;
import com.csiro.snomio.models.product.Node;
import com.csiro.snomio.models.product.ProductSummary;
import com.csiro.snomio.models.snowstorm.ConceptSummary;
import java.util.Collection;
import org.jgrapht.alg.TransitiveReduction;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.graph.DirectedAcyclicGraph;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service for product-centric operations
 */
@Service
public class ProductService {

  public static final String TPP_FOR_CTPP_ECL = ">> <id> and ^ 929360041000036105";
  public static final String MPP_FOR_CTPP_ECL = ">> <id> and ^ 929360081000036101";
  public static final String TP_FOR_PRODUCT_ECL = ">> <id>.774158006";
  public static final String TPUU_FOR_CTPP_ECL = "(>> ( <id> .774160008)) and (^ 929360031000036100)";
  public static final String MPUU_FOR_TPUU_ECL = ">> <id> and ^ 929360071000036103";
  public static final String MP_FOR_TPUU_ECL = ">> <id> and ^ 929360061000036106";
  private static final String SUBPACK_FROM_PARENT_PACK_ECL = "<id>.999000011000168107";
  private final SnowstormClient snowStormApiClient;

  @Autowired
  ProductService(SnowstormClient snowStormApiClient) {
    this.snowStormApiClient = snowStormApiClient;
  }

  public ProductSummary getProductSummary(String branch, Long productId) {
    ProductSummary productSummary = new ProductSummary();
    addConceptsAndRelationshipsForProduct(branch, productId, productSummary);
    snowStormApiClient.getConceptsFromEcl(branch, SUBPACK_FROM_PARENT_PACK_ECL, productId)
        .forEach(subpack -> {
          addConceptsAndRelationshipsForProduct(branch, subpack.getConceptId(), productSummary);
          productSummary.addEdge(productId, subpack.getConceptId(), "contains");
        });

    DirectedAcyclicGraph<Long, DefaultEdge> graph = new DirectedAcyclicGraph<>(DefaultEdge.class);
    productSummary.getNodes().forEach(node -> graph.addVertex(node.getConcept().getConceptId()));
    for (Node node : productSummary.getNodes()) {
      snowStormApiClient.getDescendants(branch, node.getConcept().getConceptId())
          .stream()
          .map(ConceptSummary::getConceptId)
          .filter(graph::containsVertex)
          .forEach(id -> graph.addEdge(id, node.getConcept().getConceptId()));
    }
    TransitiveReduction.INSTANCE.reduce(graph);

    graph.edgeSet().forEach(
        edge -> productSummary.addEdge(graph.getEdgeSource(edge), graph.getEdgeTarget(edge),
            "is a"));

    return productSummary;
  }

  private void addConceptsAndRelationshipsForProduct(String branch, Long productId,
      ProductSummary productSummary) {
    // add the product concept
    productSummary.addNode(snowStormApiClient.getConcept(branch, productId), "CTPP");
    // add the TPP for the product
    ConceptSummary tpp = addSingleNode(branch, productSummary, productId, TPP_FOR_CTPP_ECL, "TPP");
    // look up the MPP for the product summary
    snowStormApiClient.getConceptsFromEcl(branch, MPP_FOR_CTPP_ECL, productId)
        .forEach(mpp -> productSummary.addNode(mpp, "MPP"));
    // look up the TP
    ConceptSummary tp = addSingleNode(branch, productSummary, productId, TP_FOR_PRODUCT_ECL, "TP");
    productSummary.addEdge(tpp.getConceptId(), tp.getConceptId(), "has product name");

    // look up TPUUs for the product
    Collection<ConceptSummary> tpuus = snowStormApiClient.getConceptsFromEcl(branch,
        TPUU_FOR_CTPP_ECL,
        productId);
    for (ConceptSummary tpuu : tpuus) {
      productSummary.addNode(tpuu, "TPUU");
      productSummary.addEdge(tpp.getConceptId(), tpuu.getConceptId(), "contains");

      ConceptSummary tpuuTp = addSingleNode(branch, productSummary, tpuu.getConceptId(),
          TP_FOR_PRODUCT_ECL, "TP");
      productSummary.addEdge(tpuu.getConceptId(), tpuuTp.getConceptId(), "has product name");

      snowStormApiClient.getConceptsFromEcl(branch, MPUU_FOR_TPUU_ECL, tpuu.getConceptId())
          .forEach(mpuu -> productSummary.addNode(mpuu, "MPUU"));

      snowStormApiClient.getConceptsFromEcl(branch, MP_FOR_TPUU_ECL, tpuu.getConceptId())
          .forEach(mp -> productSummary.addNode(mp, "MP"));
    }
  }

  private ConceptSummary addSingleNode(String branch, ProductSummary productSummary, Long productId,
      String ecl, String type) {
    try {
      ConceptSummary conceptSummary = snowStormApiClient.getConceptFromEcl(branch, ecl, productId);
      productSummary.addNode(conceptSummary, type);
      return conceptSummary;
    } catch (SingleConceptExpectedProblem e) {
      throw new ProductModelProblem(type, productId, e);
    }
  }
}
