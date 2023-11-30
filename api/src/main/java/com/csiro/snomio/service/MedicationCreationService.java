package com.csiro.snomio.service;

import static com.csiro.snomio.service.ProductService.CONTAINS_LABEL;
import static com.csiro.snomio.service.ProductService.CTPP_LABEL;
import static com.csiro.snomio.service.ProductService.HAS_PRODUCT_NAME_LABEL;
import static com.csiro.snomio.service.ProductService.IS_A_LABEL;
import static com.csiro.snomio.service.ProductService.MPP_LABEL;
import static com.csiro.snomio.service.ProductService.MPUU_LABEL;
import static com.csiro.snomio.service.ProductService.MP_LABEL;
import static com.csiro.snomio.service.ProductService.TPP_LABEL;
import static com.csiro.snomio.service.ProductService.TPUU_LABEL;
import static com.csiro.snomio.service.ProductService.TP_LABEL;
import static com.csiro.snomio.util.AmtConstants.ARTGID_REFSET;
import static com.csiro.snomio.util.AmtConstants.ARTGID_SCHEME;
import static com.csiro.snomio.util.AmtConstants.CONCENTRATION_STRENGTH_UNIT;
import static com.csiro.snomio.util.AmtConstants.CONCENTRATION_STRENGTH_VALUE;
import static com.csiro.snomio.util.AmtConstants.CONTAINS_PACKAGED_CD;
import static com.csiro.snomio.util.AmtConstants.COUNT_OF_CONTAINED_COMPONENT_INGREDIENT;
import static com.csiro.snomio.util.AmtConstants.CTPP_REFSET_ID;
import static com.csiro.snomio.util.AmtConstants.HAS_CONTAINER_TYPE;
import static com.csiro.snomio.util.AmtConstants.HAS_DEVICE_TYPE;
import static com.csiro.snomio.util.AmtConstants.HAS_OTHER_IDENTIFYING_INFORMATION;
import static com.csiro.snomio.util.AmtConstants.HAS_TOTAL_QUANTITY_UNIT;
import static com.csiro.snomio.util.AmtConstants.HAS_TOTAL_QUANTITY_VALUE;
import static com.csiro.snomio.util.AmtConstants.MPP_REFSET_ID;
import static com.csiro.snomio.util.AmtConstants.MPUU_REFSET_ID;
import static com.csiro.snomio.util.AmtConstants.MP_REFSET_ID;
import static com.csiro.snomio.util.AmtConstants.SCT_AU_MODULE;
import static com.csiro.snomio.util.AmtConstants.TPP_REFSET_ID;
import static com.csiro.snomio.util.AmtConstants.TPUU_REFSET_ID;
import static com.csiro.snomio.util.SnomedConstants.BRANDED_CLINICAL_DRUG_PACKAGE_SEMANTIC_TAG;
import static com.csiro.snomio.util.SnomedConstants.BRANDED_CLINICAL_DRUG_SEMANTIC_TAG;
import static com.csiro.snomio.util.SnomedConstants.CLINICAL_DRUG_SEMANTIC_TAG;
import static com.csiro.snomio.util.SnomedConstants.CONTAINERIZED_BRANDED_CLINICAL_DRUG_PACKAGE_SEMANTIC_TAG;
import static com.csiro.snomio.util.SnomedConstants.CONTAINS_CD;
import static com.csiro.snomio.util.SnomedConstants.DEFINED;
import static com.csiro.snomio.util.SnomedConstants.HAS_ACTIVE_INGREDIENT;
import static com.csiro.snomio.util.SnomedConstants.HAS_BOSS;
import static com.csiro.snomio.util.SnomedConstants.HAS_MANUFACTURED_DOSE_FORM;
import static com.csiro.snomio.util.SnomedConstants.HAS_PACK_SIZE_UNIT;
import static com.csiro.snomio.util.SnomedConstants.HAS_PACK_SIZE_VALUE;
import static com.csiro.snomio.util.SnomedConstants.HAS_PRECISE_ACTIVE_INGREDIENT;
import static com.csiro.snomio.util.SnomedConstants.HAS_PRODUCT_NAME;
import static com.csiro.snomio.util.SnomedConstants.IS_A;
import static com.csiro.snomio.util.SnomedConstants.MEDICINAL_PRODUCT;
import static com.csiro.snomio.util.SnomedConstants.MEDICINAL_PRODUCT_PACKAGE;
import static com.csiro.snomio.util.SnomedConstants.MEDICINAL_PRODUCT_SEMANTIC_TAG;
import static com.csiro.snomio.util.SnomedConstants.PRIMITIVE;
import static com.csiro.snomio.util.SnomedConstants.UNIT_OF_PRESENTATION;
import static com.csiro.snomio.util.SnowstormDtoUtil.addQuantityIfNotNull;
import static com.csiro.snomio.util.SnowstormDtoUtil.addRelationshipIfNotNull;
import static com.csiro.snomio.util.SnowstormDtoUtil.getSnowstormDatatypeComponent;
import static com.csiro.snomio.util.SnowstormDtoUtil.getSnowstormRelationship;
import static com.csiro.snomio.util.SnowstormDtoUtil.toSnowstormConceptMini;

import au.csiro.snowstorm_client.model.SnowstormAxiom;
import au.csiro.snowstorm_client.model.SnowstormConceptMini;
import au.csiro.snowstorm_client.model.SnowstormConceptView;
import au.csiro.snowstorm_client.model.SnowstormConcreteValue.DataTypeEnum;
import au.csiro.snowstorm_client.model.SnowstormReferenceSetMemberViewComponent;
import au.csiro.snowstorm_client.model.SnowstormRelationship;
import com.csiro.snomio.exception.EmptyProductCreationProblem;
import com.csiro.snomio.exception.MoreThanOneSubjectProblem;
import com.csiro.snomio.exception.ProductAtomicDataValidationProblem;
import com.csiro.snomio.models.FsnAndPt;
import com.csiro.snomio.models.NameGeneratorSpec;
import com.csiro.snomio.models.product.Edge;
import com.csiro.snomio.models.product.NewConceptDetails;
import com.csiro.snomio.models.product.Node;
import com.csiro.snomio.models.product.ProductCreationDetails;
import com.csiro.snomio.models.product.ProductSummary;
import com.csiro.snomio.models.product.details.ExternalIdentifier;
import com.csiro.snomio.models.product.details.Ingredient;
import com.csiro.snomio.models.product.details.MedicationProductDetails;
import com.csiro.snomio.models.product.details.PackageDetails;
import com.csiro.snomio.models.product.details.PackageQuantity;
import com.csiro.snomio.models.product.details.ProductQuantity;
import com.csiro.snomio.models.product.details.Quantity;
import com.csiro.snomio.util.*;
import com.csiro.tickets.controllers.dto.ProductDto;
import com.csiro.tickets.controllers.dto.TicketDto;
import com.csiro.tickets.service.TicketService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.BiMap;
import com.google.common.collect.HashBiMap;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.logging.Level;
import java.util.stream.Collectors;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@Log
public class MedicationCreationService {

  SnowstormClient snowstormClient;
  NameGenerationService nameGenerationService;
  TicketService ticketService;

  OwlAxiomService owlAxiomService;

  ObjectMapper mapper = new ObjectMapper();
  Random random = new Random();

  // TODO: Refactor this. It's no good having as a local variable. What happens if we have multiple threads?
  //  Needs to be an expiring cache?
  BiMap<String, String> idMap = HashBiMap.create();

  @Autowired
  public MedicationCreationService(
      SnowstormClient snowstormClient,
      NameGenerationService nameGenerationService,
      TicketService ticketService,
      OwlAxiomService owlAxiomService) {
    this.snowstormClient = snowstormClient;
    this.nameGenerationService = nameGenerationService;
    this.ticketService = ticketService;
    this.owlAxiomService = owlAxiomService;
  }

  private static Set<SnowstormReferenceSetMemberViewComponent>
      getExternalIdentifierReferenceSetEntries(
          PackageDetails<MedicationProductDetails> packageDetails) {
    Set<SnowstormReferenceSetMemberViewComponent> referenceSetMembers = new HashSet<>();
    for (ExternalIdentifier identifier : packageDetails.getExternalIdentifiers()) {
      if (identifier.getIdentifierScheme().equals(ARTGID_SCHEME.getValue())) {
        referenceSetMembers.add(
            new SnowstormReferenceSetMemberViewComponent()
                .active(true)
                .moduleId(SCT_AU_MODULE.getValue())
                .refsetId(ARTGID_REFSET.getValue())
                .additionalFields(Map.of("mapTarget", identifier.getIdentifierValue())));
      } else {
        throw new ProductAtomicDataValidationProblem(
            "Unknown identifier scheme " + identifier.getIdentifierScheme());
      }
    }
    return referenceSetMembers;
  }

  private static Node getSubject(ProductSummary productSummary) {
    Set<Node> subjectNodes =
        productSummary.getNodes().stream()
            .filter(
                n ->
                    n.getLabel().equals(CTPP_LABEL)
                        && productSummary.getEdges().stream()
                            .noneMatch(e -> e.getTarget().equals(n.getConceptId())))
            .collect(Collectors.toSet());

    if (subjectNodes.size() != 1) {
      throw new MoreThanOneSubjectProblem(
          "Product model must have exactly one CTPP node (root) with no incoming edges. Found "
              + subjectNodes.size()
              + " which were "
              + subjectNodes.stream().map(Node::getConceptId).collect(Collectors.joining(", ")));
    }

    return subjectNodes.iterator().next();
  }

  /**
   * Creates the product concepts in the ProductSummary that are new concepts and returns an updated
   * ProductSummary with the new concepts.
   *
   * @param branch branch to write the changes to
   * @param productCreationDetails ProductCreationDetails containing the concepts to create
   * @return ProductSummary with the new concepts
   */
  public ProductSummary createProductFromAtomicData(
      String branch,
      @Valid ProductCreationDetails<@Valid MedicationProductDetails> productCreationDetails) {

    // validate the ticket exists
    TicketDto ticket = ticketService.findTicket(productCreationDetails.getTicketId());

    ProductSummary productSummary = productCreationDetails.getProductSummary();
    if (productSummary.getNodes().stream().noneMatch(Node::isNewConcept)) {
      throw new EmptyProductCreationProblem();
    }

    Node subject = getSubject(productSummary);

    BiMap<String, String> idMap = HashBiMap.create();

    List<Node> nodeCreateOrder =
        productSummary.getNodes().stream()
            .filter(Node::isNewConcept)
            .sorted(Node.getNodeComparator(productSummary.getNodes()))
            .toList();

    if (log.isLoggable(Level.FINE)) {
      log.fine(
          "Creating concepts in order "
              + nodeCreateOrder.stream()
                  .map(n -> n.getConceptId() + "_" + n.getLabel())
                  .collect(Collectors.joining(", ")));
    }

    nodeCreateOrder.forEach(n -> createConcept(branch, n, idMap));

    for (Edge edge : productSummary.getEdges()) {
      if (idMap.containsKey(edge.getSource())) {
        edge.setSource(idMap.get(edge.getSource()));
      }
      if (idMap.containsKey(edge.getTarget())) {
        edge.setTarget(idMap.get(edge.getTarget()));
      }
    }

    productSummary.setSubject(subject.getConcept());

    ProductDto productDto =
        ProductDto.builder()
            .conceptId(Long.parseLong(productSummary.getSubject().getConceptId()))
            .packageDetails(productCreationDetails.getPackageDetails())
            .name(productSummary.getSubject().getFsn().getTerm())
            .build();

    ticketService.putProductOnTicket(ticket.getId(), productDto);

    return productSummary;
  }

  private void createConcept(String branch, Node node, BiMap<String, String> idMap) {
    SnowstormConceptView concept = toSnowstormConceptView(node, idMap);
    NewConceptDetails newConceptDetails = node.getNewConceptDetails();

    if (newConceptDetails.getSpecifiedConceptId() != null
        && snowstormClient.conceptExists(branch, newConceptDetails.getSpecifiedConceptId())) {
      throw new ProductAtomicDataValidationProblem(
          "Concept with id " + newConceptDetails.getSpecifiedConceptId() + " already exists");
    }

    concept = snowstormClient.createConcept(branch, concept, false);
    node.setConcept(toSnowstormConceptMini(concept));
    node.setNewConceptDetails(null);
    if (!newConceptDetails.getConceptId().toString().equals(concept.getConceptId())) {
      idMap.put(newConceptDetails.getConceptId().toString(), concept.getConceptId());
    }

    snowstormClient.createRefsetMembership(
        branch, getRefsetId(node.getLabel()), concept.getConceptId());

    if (newConceptDetails.getReferenceSetMembers() != null) {
      for (SnowstormReferenceSetMemberViewComponent member :
          newConceptDetails.getReferenceSetMembers()) {
        member.setReferencedComponentId(concept.getConceptId());
        snowstormClient.createRefsetMembership(branch, member);
      }
    }
  }

  private SnowstormConceptView toSnowstormConceptView(Node node, BiMap<String, String> idMap) {
    SnowstormConceptView concept = new SnowstormConceptView();

    if (node.getNewConceptDetails().getConceptId() != null) {
      concept.setConceptId(node.getNewConceptDetails().getConceptId().toString());
    }
    concept.setModuleId(SCT_AU_MODULE.getValue());

    NewConceptDetails newConceptDetails = node.getNewConceptDetails();

    SnowstormDtoUtil.addDescription(
        concept, newConceptDetails.getPreferredTerm(), SnomedConstants.SYNONYM.getValue());
    SnowstormDtoUtil.addDescription(
        concept, newConceptDetails.getFullySpecifiedName(), SnomedConstants.FSN.getValue());

    concept.setActive(true);
    concept.setDefinitionStatusId(
        newConceptDetails.getAxioms().stream()
                .anyMatch(a -> a.getDefinitionStatus().equals(DEFINED.getValue()))
            ? DEFINED.getValue()
            : PRIMITIVE.getValue());
    concept.setClassAxioms(newConceptDetails.getAxioms());

    concept.getClassAxioms().stream()
        .forEach(
            a ->
                a.getRelationships()
                    .forEach(
                        r -> {
                          if (idMap.containsKey(r.getDestinationId())) {
                            r.setDestinationId(idMap.get(r.getDestinationId()));
                          }
                        }));

    concept.setConceptId(newConceptDetails.getSpecifiedConceptId());
    if (concept.getConceptId() == null) {
        concept.setConceptId(String.valueOf(newConceptDetails.getConceptId()));
    }
    addToIdMap(concept, idMap);
    return concept;
  }

  private void addToIdMap(SnowstormConceptView conceptView, BiMap<String, String> idMap) {
    String json = null;
    try {
      json = mapper.writeValueAsString(conceptView);
    } catch (JsonProcessingException e) {
      throw new RuntimeException("Failed to convert concept to json", e);
    }
    Pattern pattern = Pattern.compile("[a-f0-9]{8}(?:-[a-f0-9]{4}){4}[a-f0-9]{8}");
    Matcher matcher = pattern.matcher(json);
    Set<String> uuids = new HashSet<>();
    while (matcher.find()) {
      String str = matcher.group();
      uuids.add(str);
    }
    for (String uuid : uuids) {
      if (!idMap.containsKey(uuid)) {
        String newId = "" + nextNegativeInt();
        while (idMap.containsValue(newId)) {
          newId = "" + nextNegativeInt();
        }
        idMap.put(uuid, newId);
      }
    }
  }

  private int nextNegativeInt() {
    return (random.nextInt(Integer.MAX_VALUE - 1) + 1) * -1;
  }

  private String getRefsetId(String label) {
    switch (label) {
      case MPP_LABEL:
        return MPP_REFSET_ID.getValue();
      case TPP_LABEL:
        return TPP_REFSET_ID.getValue();
      case CTPP_LABEL:
        return CTPP_REFSET_ID.getValue();
      case MP_LABEL:
        return MP_REFSET_ID.getValue();
      case MPUU_LABEL:
        return MPUU_REFSET_ID.getValue();
      case TPUU_LABEL:
        return TPUU_REFSET_ID.getValue();
      default:
        throw new IllegalArgumentException("Unknown refset for label " + label);
    }
  }

  /**
   * Calculates the existing and new products required to create a product based on the product
   * details.
   *
   * @param branch branch to lookup concepts in
   * @param packageDetails details of the product to create
   * @return ProductSummary representing the existing and new concepts required to create this
   *     product
   */
  public ProductSummary calculateProductFromAtomicData(
      String branch, PackageDetails<MedicationProductDetails> packageDetails) {
    return calculateCreatePackage(branch, packageDetails);
  }

  private ProductSummary calculateCreatePackage(
      String branch, PackageDetails<MedicationProductDetails> packageDetails) {
    ProductSummary productSummary = new ProductSummary();

    validatePackageDetails(packageDetails);

    Map<PackageQuantity<MedicationProductDetails>, ProductSummary> innerPackageSummaries =
        new HashMap<>();
    for (PackageQuantity<MedicationProductDetails> packageQuantity :
        packageDetails.getContainedPackages()) {
      validatePackageQuantity(packageQuantity);
      ProductSummary innerPackageSummary =
          calculateCreatePackage(branch, packageQuantity.getPackageDetails());
      innerPackageSummaries.put(packageQuantity, innerPackageSummary);
    }

    Map<ProductQuantity<MedicationProductDetails>, ProductSummary> innnerProductSummaries =
        new HashMap<>();
    for (ProductQuantity<MedicationProductDetails> productQuantity :
        packageDetails.getContainedProducts()) {
      validateProductQuantity(branch, productQuantity);
      ProductSummary innerProductSummary =
          createProduct(branch, productQuantity.getProductDetails());
      innnerProductSummaries.put(productQuantity, innerProductSummary);
    }

    Node mpp =
        getOrCreatePackagedClinicalDrug(
            branch,
            packageDetails,
            innerPackageSummaries,
            innnerProductSummaries,
            null,
            false,
            false);
    productSummary.addNode(mpp);

    Node tpp =
        getOrCreatePackagedClinicalDrug(
            branch,
            packageDetails,
            innerPackageSummaries,
            innnerProductSummaries,
            mpp,
            true,
            false);
    productSummary.addNode(tpp);
    productSummary.addEdge(tpp.getConceptId(), mpp.getConceptId(), IS_A_LABEL);

    Node ctpp =
        getOrCreatePackagedClinicalDrug(
            branch, packageDetails, innerPackageSummaries, innnerProductSummaries, tpp, true, true);
    productSummary.addNode(ctpp);
    productSummary.addEdge(ctpp.getConceptId(), tpp.getConceptId(), IS_A_LABEL);

    productSummary.setSubject(ctpp.toConceptMini());

    productSummary.addNode(packageDetails.getProductName(), TP_LABEL);
    productSummary.addEdge(
        tpp.getConceptId(), packageDetails.getProductName().getConceptId(), HAS_PRODUCT_NAME_LABEL);
    productSummary.addEdge(
        ctpp.getConceptId(),
        packageDetails.getProductName().getConceptId(),
        HAS_PRODUCT_NAME_LABEL);

    for (ProductSummary summary : innerPackageSummaries.values()) {
      productSummary.addSummary(summary);
      productSummary.addEdge(
          ctpp.getConceptId(), summary.getSubject().getConceptId(), CONTAINS_LABEL);
      productSummary.addEdge(
          tpp.getConceptId(), summary.getSingleConceptWithLabel(TPP_LABEL), CONTAINS_LABEL);
      productSummary.addEdge(
          mpp.getConceptId(), summary.getSingleConceptWithLabel(MPP_LABEL), CONTAINS_LABEL);
    }

    for (ProductSummary summary : innnerProductSummaries.values()) {
      productSummary.addSummary(summary);
      productSummary.addEdge(
          ctpp.getConceptId(), summary.getSubject().getConceptId(), CONTAINS_LABEL);
      productSummary.addEdge(
          tpp.getConceptId(), summary.getSubject().getConceptId(), CONTAINS_LABEL);
      productSummary.addEdge(
          mpp.getConceptId(), summary.getSingleConceptWithLabel(MPUU_LABEL), CONTAINS_LABEL);
    }

    Set<Edge> transitiveContainsEdges =
        ProductService.getTransitiveEdges(productSummary, new HashSet<>());
    productSummary.getEdges().addAll(transitiveContainsEdges);

    return productSummary;
  }

  private Node getOrCreatePackagedClinicalDrug(
      String branch,
      PackageDetails<MedicationProductDetails> packageDetails,
      Map<PackageQuantity<MedicationProductDetails>, ProductSummary> innerPackageSummaries,
      Map<ProductQuantity<MedicationProductDetails>, ProductSummary> innnerProductSummaries,
      Node parent,
      boolean branded,
      boolean container) {

    String semanticTag;
    String label;
    Set<String> refsets;
    Set<SnowstormReferenceSetMemberViewComponent> referenceSetMembers = Set.of();
    if (branded) {
      if (container) {
        label = CTPP_LABEL;
        semanticTag = CONTAINERIZED_BRANDED_CLINICAL_DRUG_PACKAGE_SEMANTIC_TAG.getValue();
        refsets = Set.of(CTPP_REFSET_ID.getValue());
        referenceSetMembers = getExternalIdentifierReferenceSetEntries(packageDetails);
      } else {
        label = TPP_LABEL;
        semanticTag = BRANDED_CLINICAL_DRUG_PACKAGE_SEMANTIC_TAG.getValue();
        refsets = Set.of(TPP_REFSET_ID.getValue());
      }
    } else {
      label = MPP_LABEL;
      semanticTag = CLINICAL_DRUG_SEMANTIC_TAG.getValue();
      refsets = Set.of(MPP_REFSET_ID.getValue());
    }

    Set<SnowstormRelationship> relationships =
        createPackagedClinicalDrugRelationships(
            packageDetails,
            innerPackageSummaries,
            innnerProductSummaries,
            parent,
            branded,
            container);

    return getOptionalNodeWithLabel(branch, relationships, refsets, label)
        .orElse(
            createNewConceptNode(
                DEFINED.getValue(),
                relationships,
                referenceSetMembers,
                semanticTag,
                label,
                packageDetails.getIdFsnMap()));
  }

  private Set<SnowstormRelationship> createPackagedClinicalDrugRelationships(
      PackageDetails<MedicationProductDetails> packageDetails,
      Map<PackageQuantity<MedicationProductDetails>, ProductSummary> innerPackageSummaries,
      Map<ProductQuantity<MedicationProductDetails>, ProductSummary> innnerProductSummaries,
      Node parent,
      boolean branded,
      boolean container) {

    Set<SnowstormRelationship> relationships = new HashSet<>();
    relationships.add(getSnowstormRelationship(IS_A.getValue(), MEDICINAL_PRODUCT_PACKAGE.getValue(), 0));
    if (parent != null) {
      relationships.add(getSnowstormRelationship(IS_A.getValue(), parent.getConceptId(), 0));
    }

    if (branded && container) {
      addRelationshipIfNotNull(
          relationships, packageDetails.getContainerType(), HAS_CONTAINER_TYPE.getValue(), 0);
    }

    if (branded) {
      addRelationshipIfNotNull(relationships, packageDetails.getProductName(), HAS_PRODUCT_NAME.getValue(), 0);
    }

    int group = 1;
    for (Entry<ProductQuantity<MedicationProductDetails>, ProductSummary> entry :
        innnerProductSummaries.entrySet()) {
      String containedId;
      ProductSummary productSummary = entry.getValue();
      if (branded) {
        containedId = productSummary.getSubject().getConceptId();
      } else {
        containedId = productSummary.getSingleConceptWithLabel(MPUU_LABEL);
      }
      relationships.add(getSnowstormRelationship(CONTAINS_CD.getValue(), containedId, group));

      ProductQuantity<MedicationProductDetails> quantity = entry.getKey();
      relationships.add(
          getSnowstormRelationship(HAS_PACK_SIZE_UNIT.getValue(), quantity.getUnit().getConceptId(), group));
      relationships.add(
          getSnowstormDatatypeComponent(
              HAS_PACK_SIZE_VALUE.getValue(), quantity.getValue().toString(), DataTypeEnum.DECIMAL, group));

      relationships.add(
          getSnowstormDatatypeComponent(
              COUNT_OF_CONTAINED_COMPONENT_INGREDIENT.getValue(),
              Integer.toString(quantity.getProductDetails().getActiveIngredients().size()),
              DataTypeEnum.INTEGER,
              group));

      group++;
    }

    for (Entry<PackageQuantity<MedicationProductDetails>, ProductSummary> entry :
        innerPackageSummaries.entrySet()) {
      String containedId;
      ProductSummary productSummary = entry.getValue();
      if (branded && container) {
        containedId = productSummary.getSubject().getConceptId();
      } else if (branded) {
        containedId = productSummary.getSingleConceptWithLabel(TPP_LABEL);
      } else {
        containedId = productSummary.getSingleConceptWithLabel(MPP_LABEL);
      }
      relationships.add(getSnowstormRelationship(CONTAINS_PACKAGED_CD.getValue(), containedId, group));

      PackageQuantity<MedicationProductDetails> quantity = entry.getKey();
      relationships.add(
          getSnowstormRelationship(HAS_PACK_SIZE_UNIT.getValue(), quantity.getUnit().getConceptId(), group));
      relationships.add(
          getSnowstormDatatypeComponent(
              HAS_PACK_SIZE_VALUE.getValue(), quantity.getValue().toString(), DataTypeEnum.DECIMAL, group));
      group++;
    }
    return relationships;
  }

  private Optional<Node> getOptionalNodeWithLabel(
      String branch,
      Set<SnowstormRelationship> relationships,
      Set<String> refsetIds,
      String label) {

    // if the relationships are empty or contain a non-isa relationship to a new concept (UUID not
    // SCTID) then don't bother looking
    if (relationships.isEmpty()
        || relationships.stream()
            .anyMatch(
                r ->
                    !r.getConcrete()
                        && !r.getTypeId().equals(IS_A.getValue())
                        && !r.getDestinationId().matches("\\d+"))) {
      return Optional.empty();
    }

    String ecl = EclBuilder.build(relationships, refsetIds);
    Optional<SnowstormConceptMini> optionalConceptFromEcl =
        snowstormClient.getOptionalConceptFromEcl(branch, ecl);

    if (!optionalConceptFromEcl.isPresent()) {
      log.warning("No concept found for ECL " + ecl);
    }

    return optionalConceptFromEcl.map(c -> new Node(c, label));
  }

  private ProductSummary createProduct(String branch, MedicationProductDetails productDetails) {
    ProductSummary productSummary = new ProductSummary();

    Node mp = findOrCreateMp(branch, productDetails, productSummary);
    Node mpuu = findOrCreateUnit(branch, productDetails, mp, productSummary, false);
    Node tpuu = findOrCreateUnit(branch, productDetails, mpuu, productSummary, true);

    productSummary.addNode(productDetails.getProductName(), TP_LABEL);
    productSummary.addEdge(
        tpuu.getConceptId(),
        productDetails.getProductName().getConceptId(),
        HAS_PRODUCT_NAME_LABEL);

    productSummary.setSubject(tpuu.toConceptMini());

    return productSummary;
  }

  private Node findOrCreateUnit(
      String branch,
      MedicationProductDetails productDetails,
      Node parent,
      ProductSummary productSummary,
      boolean branded) {
    String label = branded ? TPUU_LABEL : MPUU_LABEL;
    Set<String> referencedIds = Set.of(branded ? TPUU_REFSET_ID.getValue() : MPUU_REFSET_ID.getValue());
    String semanticTag = branded ? BRANDED_CLINICAL_DRUG_SEMANTIC_TAG.getValue() : CLINICAL_DRUG_SEMANTIC_TAG.getValue();

    Set<SnowstormRelationship> relationships =
        createClinicalDrugRelationships(productDetails, parent, branded);
    Node node =
        getOptionalNodeWithLabel(branch, relationships, referencedIds, label)
            .orElse(
                createNewConceptNode(
                    DEFINED.getValue(),
                    relationships,
                    null,
                    semanticTag,
                    label,
                    productDetails.getIdFsnMap()));
    productSummary.addNode(node);
    productSummary.addEdge(node.getConceptId(), parent.getConceptId(), IS_A_LABEL);
    return node;
  }

  private Node findOrCreateMp(
      String branch, MedicationProductDetails details, ProductSummary productSummary) {
    Set<SnowstormRelationship> relationships = createMpRelationships(details);
    Node mp =
        getOptionalNodeWithLabel(branch, relationships, Set.of(MP_REFSET_ID.getValue()), MP_LABEL)
            .orElse(
                createNewConceptNode(
                    DEFINED.getValue(),
                    relationships,
                    null,
                    MEDICINAL_PRODUCT_SEMANTIC_TAG.getValue(),
                    MP_LABEL,
                    details.getIdFsnMap()));
    productSummary.addNode(mp);
    return mp;
  }

  private Set<SnowstormRelationship> createClinicalDrugRelationships(
      MedicationProductDetails productDetails, Node mp, boolean branded) {
    Set<SnowstormRelationship> relationships = new HashSet<>();
    relationships.add(getSnowstormRelationship(IS_A.getValue(), MEDICINAL_PRODUCT.getValue(), 0));
    relationships.add(getSnowstormRelationship(IS_A.getValue(), mp.getConceptId(), 0));

    if (branded) {
      relationships.add(
          getSnowstormRelationship(
              HAS_PRODUCT_NAME.getValue(), productDetails.getProductName().getConceptId(), 0));

      relationships.add(
          getSnowstormDatatypeComponent(
              HAS_OTHER_IDENTIFYING_INFORMATION.getValue(),
              StringUtils.hasLength(productDetails.getOtherIdentifyingInformation())
                  ? "None"
                  : productDetails.getOtherIdentifyingInformation(),
              DataTypeEnum.STRING,
              0));
    }

    addRelationshipIfNotNull(
        relationships, productDetails.getContainerType(), HAS_CONTAINER_TYPE.getValue(), 0);
    addRelationshipIfNotNull(relationships, productDetails.getDeviceType(), HAS_DEVICE_TYPE.getValue(), 0);

    String doseFormId =
        productDetails.getGenericForm() == null
            ? null
            : productDetails.getGenericForm().getConceptId();

    if (branded) {
      doseFormId =
          productDetails.getSpecificForm() == null
              ? doseFormId
              : productDetails.getSpecificForm().getConceptId();
    }

    if (doseFormId != null) {
      relationships.add(getSnowstormRelationship(HAS_MANUFACTURED_DOSE_FORM.getValue(), doseFormId, 0));
    }

    addQuantityIfNotNull(
        productDetails.getQuantity(),
        relationships,
        HAS_PACK_SIZE_VALUE.getValue(),
        HAS_PACK_SIZE_UNIT.getValue(),
        DataTypeEnum.DECIMAL,
        0);

    int group = 1;
    for (Ingredient ingredient : productDetails.getActiveIngredients()) {
      addRelationshipIfNotNull(
          relationships, ingredient.getActiveIngredient(), HAS_ACTIVE_INGREDIENT.getValue(), group);
      addRelationshipIfNotNull(
          relationships, ingredient.getPreciseIngredient(), HAS_PRECISE_ACTIVE_INGREDIENT.getValue(), group);
      addRelationshipIfNotNull(
          relationships, ingredient.getBasisOfStrengthSubstance(), HAS_BOSS.getValue(), group);
      addQuantityIfNotNull(
          ingredient.getTotalQuantity(),
          relationships,
          HAS_TOTAL_QUANTITY_VALUE.getValue(),
          HAS_TOTAL_QUANTITY_UNIT.getValue(),
          DataTypeEnum.DECIMAL,
          group);
      addQuantityIfNotNull(
          ingredient.getConcentrationStrength(),
          relationships,
          CONCENTRATION_STRENGTH_VALUE.getValue(),
          CONCENTRATION_STRENGTH_UNIT.getValue(),
          DataTypeEnum.DECIMAL,
          group);
      group++;
    }

    return relationships;
  }

  private Set<SnowstormRelationship> createMpRelationships(
      MedicationProductDetails productDetails) {
    Set<SnowstormRelationship> relationships = new HashSet<>();
    relationships.add(getSnowstormRelationship(IS_A.getValue(), MEDICINAL_PRODUCT.getValue(), 0));
    int group = 1;
    for (Ingredient ingredient : productDetails.getActiveIngredients()) {
      relationships.add(
          getSnowstormRelationship(
              HAS_ACTIVE_INGREDIENT.getValue(), ingredient.getActiveIngredient().getConceptId(), group));
      group++;
    }
    return relationships;
  }

  private boolean isIntegerValue(BigDecimal bd) {
    return bd.stripTrailingZeros().scale() <= 0;
  }

  private void validateProductQuantity(
      String branch, ProductQuantity<MedicationProductDetails> productQuantity) {
    // Leave the MRCM validation to the MRCM - the UI should already enforce this and the validation
    // in the MS will catch it. Validating here will just slow things down.
    validateQuantityValueIsOneIfUnitIsEach(productQuantity);

    // if the contained product has a container/device type or a quantity then the unit must be
    // each and the quantity must be an integer
    if ((productQuantity.getProductDetails().getContainerType() != null
            || productQuantity.getProductDetails().getDeviceType() != null
            || productQuantity.getProductDetails().getQuantity() != null)
        && (productQuantity.getUnit().getConceptId().equals(UNIT_OF_PRESENTATION.getValue())
            && !isIntegerValue(productQuantity.getValue()))) {
      throw new ProductAtomicDataValidationProblem(
          "Product quantity must not have a container type, device type or quantity");
    }

    // -- for each ingredient
    // --- total quantity unit if present must not me composite
    // --- concentration strength if present must be composite unit
    for (Ingredient ingredient : productQuantity.getProductDetails().getActiveIngredients()) {
      if (ingredient.getTotalQuantity() != null
          && snowstormClient.isCompositeUnit(branch, ingredient.getTotalQuantity().getUnit())) {
        throw new ProductAtomicDataValidationProblem(
            "Total quantity unit must not be composite. Ingredient was "
                + getIdAndFsnTerm(ingredient.getActiveIngredient())
                + " with unit "
                + getIdAndFsnTerm(ingredient.getTotalQuantity().getUnit()));
      }

      if (ingredient.getConcentrationStrength() != null
          && !snowstormClient.isCompositeUnit(
              branch, ingredient.getConcentrationStrength().getUnit())) {
        throw new ProductAtomicDataValidationProblem(
            "Concentration strength unit must be composite. Ingredient was "
                + getIdAndFsnTerm(ingredient.getActiveIngredient())
                + " with unit "
                + getIdAndFsnTerm(ingredient.getConcentrationStrength().getUnit()));
      }
    }
  }

  private String getIdAndFsnTerm(SnowstormConceptMini component) {
    return component.getConceptId() + "|" + component.getFsn().getTerm() + "|";
  }

  private Node createNewConceptNode(
      String definitionStatus,
      Set<SnowstormRelationship> relationships,
      Set<SnowstormReferenceSetMemberViewComponent> referenceSetMembers,
      String semanticTag,
      String label,
      Map<String, String> idFsnMap) {

    Node node = new Node();
    node.setLabel(label);
    NewConceptDetails newConceptDetails = new NewConceptDetails();
    SnowstormAxiom axiom = new SnowstormAxiom();
    axiom.active(true);
    axiom.setDefinitionStatus(definitionStatus);
    axiom.setRelationships(relationships);
    newConceptDetails.setSemanticTag(semanticTag);
    node.setNewConceptDetails(newConceptDetails);
    newConceptDetails.getAxioms().add(axiom);
    newConceptDetails.setReferenceSetMembers(referenceSetMembers);
    SnowstormConceptView scon = toSnowstormConceptView(node, idMap);
    Set<String> axioms = owlAxiomService.translate(scon, idMap);
    String axiomN;
    try {
      if (axioms == null || axioms.size() != 1) {
        throw new NoSuchElementException();
      }
      axiomN = axioms.stream().findFirst().orElseThrow();
    } catch (NoSuchElementException e) {
      throw new ProductAtomicDataValidationProblem(
          "Could not calculate one (and only one) axiom for concept " + scon.getConceptId());
    }
    synchronized (idMap) {
      // Reverse the map so we can replace the negative numbers with their original UUIDs
      idMap = idMap.inverse();
      // Replace negative numbers with their original UUID
      axiomN = substituteIdsInAxiom(axiomN, idMap, false);
      idMap.inverse();
    }
    // Replace UUIDs with their FSN // TODO: This map does not contain all of the required id-->fsn
    // mappings, so the final axiom still has ids in it
    // Also, add in known static id & FSNs
    Arrays.stream(AmtConstants.values()).filter(AmtConstants::hasLabel)
            .forEach(con -> idFsnMap.put(con.getValue(), con.getLabel()));
    Arrays.stream(SnomedConstants.values()).filter(SnomedConstants::hasLabel)
            .forEach(con -> idFsnMap.put(con.getValue(), con.getLabel()));
    axiomN = substituteIdsInAxiom(axiomN, idFsnMap, true);
    log.info("AXIOM: " + axiomN);
    FsnAndPt fsnAndPt =
        nameGenerationService.createFsnAndPreferredTerm(new NameGeneratorSpec(semanticTag, axiomN));
    newConceptDetails.setFullySpecifiedName(fsnAndPt.getFSN());
    newConceptDetails.setPreferredTerm(fsnAndPt.getPT());
    return node;
  }

  private String substituteIdsInAxiom(String axiom, Map<String, String> map, boolean quote) {
    for (Map.Entry<String, String> entry : map.entrySet()) {
      axiom =
          axiom.replaceAll(
              "(<http://snomed\\.info/id/" + entry.getKey() + ">|:[ ]*" + entry.getKey() + ")",
              ":" + (quote ? "'" + entry.getValue() + "'" : entry.getValue()));
    }
    return axiom;
  }

  private void validatePackageQuantity(PackageQuantity<MedicationProductDetails> packageQuantity) {
    // Leave the MRCM validation to the MRCM - the UI should already enforce this and the validation
    // in the MS will catch it. Validating here will just slow things down.

    // -- package quantity unit must be each and the quantitiy must be an integer
    validateQuantityValueIsOneIfUnitIsEach(packageQuantity);

    // validate that the package is only nested one deep
    if (packageQuantity.getPackageDetails().getContainedPackages() != null
        && !packageQuantity.getPackageDetails().getContainedPackages().isEmpty()) {
      throw new ProductAtomicDataValidationProblem(
          "A contained package must not contain further packages - nesting is only one level deep");
    }
  }

  private void validateQuantityValueIsOneIfUnitIsEach(Quantity quantity) {
    if (quantity.getUnit().getConceptId().equals(UNIT_OF_PRESENTATION.getValue())
        && !isIntegerValue(quantity.getValue())) {
      throw new ProductAtomicDataValidationProblem(
          "Quantity must be an integer if the unit is 'each', unit was "
              + getIdAndFsnTerm(quantity.getUnit()));
    }
  }

  private void validatePackageDetails(PackageDetails<MedicationProductDetails> packageDetails) {
    // Leave the MRCM validation to the MRCM - the UI should already enforce this and the validation
    // in the MS will catch it. Validating here will just slow things down.

    // validate the package details
    // - product name is a product name - MRCM?
    // - container type is a container type - MRCM?
  }
}
