package com.csiro.snomio.service;

import au.csiro.snowstorm_client.model.SnowstormConceptComponent;
import au.csiro.snowstorm_client.model.SnowstormConceptMiniComponent;
import au.csiro.snowstorm_client.model.SnowstormItemsPageReferenceSetMemberComponent;
import au.csiro.snowstorm_client.model.SnowstormRelationshipComponent;
import com.csiro.snomio.exception.AtomicDataExtractionProblem;
import com.csiro.snomio.models.product.ExternalIdentifier;
import com.csiro.snomio.models.product.Ingredient;
import com.csiro.snomio.models.product.PackageDetails;
import com.csiro.snomio.models.product.PackageQuantity;
import com.csiro.snomio.models.product.ProductDetails;
import com.csiro.snomio.models.product.ProductQuantity;
import com.csiro.snomio.models.product.Quantity;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

/** Service for product-centric operations */
@Service
@Log
public class MedicationService {
  public static final String PRODUCT_CONCEPTS_FOR_ATOMIC_EXTRACTION_ECL =
      "<id> or (<id>.999000111000168106) or (<id>.999000011000168107) "
          + "or (<id>.774160008) or (<id>.999000081000168101) "
          + "or (<id>.999000111000168106.999000081000168101) or (<id>.999000011000168107.774160008) "
          + "or ((>>((<id>.774160008) or (<id>.999000081000168101) or (<id>.999000111000168106. 999000081000168101) or (<id>.999000011000168107.774160008))) and (^929360071000036103))";
  public static final String CTPP_REFSET_ID = "929360051000036108";
  public static final String TPP_REFSET_ID = "929360041000036105";
  public static final String TPUU_REFSET_ID = "929360031000036100";
  public static final String MPUU_REFSET_ID = "929360071000036103";
  public static final String HAS_CONTAINER_TYPE = "30465011000036106";
  public static final String CONTAINS_PACKAGED_CD = "999000011000168107";
  public static final String CONTAINS_CD = "774160008";
  public static final String HAS_PACK_SIZE_UNIT = "774163005";
  public static final String HAS_PACK_SIZE_VALUE = "1142142004";
  public static final String HAS_PRODUCT_NAME = "774158006";
  public static final String HAS_MANUFACTURED_DOSE_FORM = "411116001";
  public static final String HAS_OTHER_IDENTIFYING_INFORMATION = "999000001000168109";
  public static final String HAS_ACTIVE_INGREDIENT = "127489000";
  public static final String HAS_BOSS = "732943007";
  public static final String HAS_TOTAL_QUANTITY_VALUE = "999000041000168106";
  public static final String HAS_TOTAL_QUANTITY_UNIT = "999000051000168108";
  public static final String CONCENTRATION_STRENGTH_VALUE = "999000021000168100";
  public static final String CONCENTRATION_STRENGTH_UNIT = "999000031000168102";
  public static final String HAS_DEVICE_TYPE = "999000061000168105";
  public static final String HAS_PRECISE_ACTIVE_INGREDIENT = "762949000";
  public static final String ARTGID_REFSET = "11000168105";
  public static final String IS_A = "116680003";
  private final SnowstormClient snowStormApiClient;

  @Autowired
  MedicationService(SnowstormClient snowStormApiClient) {
    this.snowStormApiClient = snowStormApiClient;
  }

  private static Set<SnowstormRelationshipComponent> filterActiveStatedRelationshipByType(
      Set<SnowstormRelationshipComponent> relationships, String type) {
    return relationships.stream()
        .filter(r -> r.getType().getConceptId().equals(type))
        .filter(r -> r.getActive())
        .filter(r -> r.getCharacteristicType().equals("STATED_RELATIONSHIP"))
        .collect(Collectors.toSet());
  }

  public PackageDetails getProductAtomioData(String branch, String productId) {
    Collection<SnowstormConceptMiniComponent> concepts =
        snowStormApiClient.getConceptsFromEcl(
            branch, PRODUCT_CONCEPTS_FOR_ATOMIC_EXTRACTION_ECL, productId, 0, 100);

    // get the concepts involved in this product
    Mono<List<SnowstormConceptComponent>> browserConcepts =
        snowStormApiClient.getBrowserConcepts(branch, concepts);

    // categorise them using the reference sets
    Mono<SnowstormItemsPageReferenceSetMemberComponent> refsetMembers =
        snowStormApiClient.getRefsetMembers(branch, concepts, 0, 100);

    Map<String, SnowstormConceptComponent> browserMap =
        browserConcepts.block().stream().collect(Collectors.toMap(c -> c.getConceptId(), c -> c));

    Map<String, String> typeMap =
        refsetMembers.block().getItems().stream()
            .filter(
                m ->
                    m.getRefsetId().equals(CTPP_REFSET_ID)
                        || m.getRefsetId().equals(TPUU_REFSET_ID)
                        || m.getRefsetId().equals(MPUU_REFSET_ID))
            .collect(Collectors.toMap(m -> m.getReferencedComponentId(), m -> m.getRefsetId()));

    Map<String, Set<String>> artgMap = new HashMap<>();
    refsetMembers.block().getItems().stream()
        .filter(m -> m.getRefsetId().equals(ARTGID_REFSET))
        .forEach(
            m ->
                artgMap
                    .computeIfAbsent(m.getReferencedComponentId(), k -> new HashSet<>())
                    .add(m.getAdditionalFields().getOrDefault("schemeValue", null)));

    if (!typeMap.keySet().equals(browserMap.keySet())) {
      throw new AtomicDataExtractionProblem(
          "Mismatch between browser and refset members", productId);
    }

    return populatePackageDetails(productId, browserMap, typeMap, artgMap);
  }

  private PackageDetails populatePackageDetails(
      String productId,
      Map<String, SnowstormConceptComponent> browserMap,
      Map<String, String> typeMap,
      Map<String, Set<String>> artgMap) {

    PackageDetails details = new PackageDetails();

    SnowstormConceptComponent basePackage = browserMap.get(productId);
    Set<SnowstormRelationshipComponent> basePackageRelationships =
        getRelationshipsFromAxioms(basePackage);
    // container type
    details.setContainerType(getSingleActiveTarget(basePackageRelationships, HAS_CONTAINER_TYPE));
    // product name
    details.setProductName(getSingleActiveTarget(basePackageRelationships, HAS_PRODUCT_NAME));
    // ARTG ID
    if (artgMap.containsKey(productId)) {
      artgMap
          .get(productId)
          .forEach(
              artg ->
                  details
                      .getExternalIdentifiers()
                      .add(new ExternalIdentifier("https://www.tga.gov.au/artg", artg)));
    }

    Set<SnowstormRelationshipComponent> subpacksRelationships =
        getActiveRelationshipsOfType(basePackageRelationships, CONTAINS_PACKAGED_CD);
    Set<SnowstormRelationshipComponent> productRelationships =
        getActiveRelationshipsOfType(basePackageRelationships, CONTAINS_CD);

    if (!subpacksRelationships.isEmpty()) {
      if (!productRelationships.isEmpty()) {
        throw new AtomicDataExtractionProblem(
            "Multipack should not have direct products", productId);
      }
      for (SnowstormRelationshipComponent subpacksRelationship : subpacksRelationships) {
        Set<SnowstormRelationshipComponent> roleGroup =
            getActiveRelationshipsInRoleGroup(subpacksRelationship, basePackageRelationships);
        PackageQuantity packageQuantity = new PackageQuantity();
        details.getContainedPackages().add(packageQuantity);
        // sub pack quantity unit
        packageQuantity.setUnit(getSingleActiveTarget(roleGroup, HAS_PACK_SIZE_UNIT));
        // sub pack quantity value
        packageQuantity.setValue(
            new BigDecimal(getSingleActiveConcreteValue(roleGroup, HAS_PACK_SIZE_VALUE)));
        // sub pack product details
        packageQuantity.setPackageDetails(
            populatePackageDetails(
                subpacksRelationship.getTarget().getConceptId(), browserMap, typeMap, artgMap));
      }
    } else {
      if (productRelationships.isEmpty()) {
        throw new AtomicDataExtractionProblem(
            "Package has no sub packs, expected product relationships", productId);
      }

      for (SnowstormRelationshipComponent subProductRelationship : productRelationships) {
        Set<SnowstormRelationshipComponent> subRoleGroup =
            getActiveRelationshipsInRoleGroup(subProductRelationship, basePackageRelationships);
        ProductQuantity productQuantity = new ProductQuantity();
        details.getContainedProducts().add(productQuantity);
        // contained product quantity value
        productQuantity.setValue(getSingleActiveBigDecimal(subRoleGroup, HAS_PACK_SIZE_VALUE));
        // contained product quantity unit
        productQuantity.setUnit(getSingleActiveTarget(subRoleGroup, HAS_PACK_SIZE_UNIT));
        // contained product details
        productQuantity.setProductDetails(
            populateProductDetails(productId, browserMap, typeMap, subProductRelationship));
      }
    }
    return details;
  }

  private Set<SnowstormRelationshipComponent> getRelationshipsFromAxioms(
      SnowstormConceptComponent concept) {
    if (concept.getClassAxioms().size() != 1) {
      throw new AtomicDataExtractionProblem(
          "Expected 1 class axiom but found " + concept.getClassAxioms().size(),
          concept.getConceptId());
    }
    return concept.getClassAxioms().iterator().next().getRelationships();
  }

  private ProductDetails populateProductDetails(
      String productId,
      Map<String, SnowstormConceptComponent> browserMap,
      Map<String, String> typeMap,
      SnowstormRelationshipComponent subProductRelationship) {

    ProductDetails productDetails = new ProductDetails();

    SnowstormConceptComponent product =
        browserMap.get(subProductRelationship.getTarget().getConceptId());

    if (product == null) {
      throw new AtomicDataExtractionProblem(
          "Expected concept to be in downloaded set for the product but was not found: "
              + subProductRelationship.getTarget().getIdAndFsnTerm(),
          productId);
    }

    // product name
    Set<SnowstormRelationshipComponent> productRelationships = getRelationshipsFromAxioms(product);
    productDetails.setProductName(getSingleActiveTarget(productRelationships, HAS_PRODUCT_NAME));

    // manufactured dose form - need to detect generic and specific forms if present
    if (relationshipOfTypeExists(productRelationships, HAS_MANUFACTURED_DOSE_FORM)) {

      Set<SnowstormConceptComponent> mpuu =
          filterActiveStatedRelationshipByType(productRelationships, IS_A).stream()
              .filter(r -> typeMap.get(r.getTarget().getConceptId()).equals(MPUU_REFSET_ID))
              .map(r -> browserMap.get(r.getTarget().getConceptId()))
              .collect(Collectors.toSet());

      if (mpuu.size() != 1) {
        throw new AtomicDataExtractionProblem(
            "Expected 1 MPUU but found " + mpuu.size(), productId);
      }

      SnowstormConceptMiniComponent genericDoseForm =
          getSingleActiveTarget(
              getRelationshipsFromAxioms(mpuu.stream().findFirst().get()),
              HAS_MANUFACTURED_DOSE_FORM);

      productDetails.setGenericForm(genericDoseForm);
      SnowstormConceptMiniComponent specificDoseForm =
          getSingleActiveTarget(productRelationships, HAS_MANUFACTURED_DOSE_FORM);
      if (!specificDoseForm.getConceptId().equals(genericDoseForm.getConceptId())) {
        productDetails.setSpecificForm(specificDoseForm);
      }
      if (relationshipOfTypeExists(productRelationships, HAS_DEVICE_TYPE)) {
        throw new AtomicDataExtractionProblem(
            "Expected manufactured dose form or device type, product has both", productId);
      }
    } else if (relationshipOfTypeExists(productRelationships, HAS_DEVICE_TYPE)) {
      productDetails.setDeviceType(getSingleActiveTarget(productRelationships, HAS_DEVICE_TYPE));
    } else {
      throw new AtomicDataExtractionProblem(
          "Expected manufactured dose form or device type, product has neither", productId);
    }

    productDetails.setContainerType(
        getSingleOptionalActiveTarget(productRelationships, HAS_CONTAINER_TYPE));
    if (relationshipOfTypeExists(productRelationships, HAS_PACK_SIZE_UNIT)) {
      productDetails.setQuantity(
          new Quantity(
              getSingleOptionalActiveBigDecimal(productRelationships, HAS_PACK_SIZE_VALUE),
              getSingleActiveTarget(productRelationships, HAS_PACK_SIZE_UNIT)));
    }
    productDetails.setOtherIdentifyingInformation(
        getSingleActiveConcreteValue(productRelationships, HAS_OTHER_IDENTIFYING_INFORMATION));

    Set<SnowstormRelationshipComponent> ingredientRelationships =
        getActiveRelationshipsOfType(productRelationships, HAS_ACTIVE_INGREDIENT);
    for (SnowstormRelationshipComponent ingredientRelationship : ingredientRelationships) {
      Set<SnowstormRelationshipComponent> ingredientRoleGroup =
          getActiveRelationshipsInRoleGroup(ingredientRelationship, productRelationships);
      Ingredient ingredient = new Ingredient();
      ingredient.setActiveIngredient(ingredientRelationship.getTarget());
      ingredient.setPreciseIngredient(
          getSingleOptionalActiveTarget(ingredientRoleGroup, HAS_PRECISE_ACTIVE_INGREDIENT));
      ingredient.setBasisOfStrengthSubstance(
          getSingleOptionalActiveTarget(ingredientRoleGroup, HAS_BOSS));
      if (relationshipOfTypeExists(ingredientRoleGroup, HAS_TOTAL_QUANTITY_VALUE)) {
        ingredient.setTotalQuantity(
            new Quantity(
                getSingleOptionalActiveBigDecimal(ingredientRoleGroup, HAS_TOTAL_QUANTITY_VALUE),
                getSingleActiveTarget(ingredientRoleGroup, HAS_TOTAL_QUANTITY_UNIT)));
      }
      if (relationshipOfTypeExists(ingredientRoleGroup, CONCENTRATION_STRENGTH_VALUE)) {
        ingredient.setConcentrationStrength(
            new Quantity(
                getSingleOptionalActiveBigDecimal(
                    ingredientRoleGroup, CONCENTRATION_STRENGTH_VALUE),
                getSingleActiveTarget(ingredientRoleGroup, CONCENTRATION_STRENGTH_UNIT)));
      }
      productDetails.getActiveIngredients().add(ingredient);
    }
    return productDetails;
  }

  private boolean relationshipOfTypeExists(
      Set<SnowstormRelationshipComponent> subRoleGroup, String type) {
    return !filterActiveStatedRelationshipByType(subRoleGroup, type).isEmpty();
  }

  private String getSingleActiveConcreteValue(
      Set<SnowstormRelationshipComponent> relationships, String type) {
    return findSingleRelationshipsForActiveInferredByType(relationships, type)
        .iterator()
        .next()
        .getConcreteValue()
        .getValue();
  }

  private BigDecimal getSingleActiveBigDecimal(
      Set<SnowstormRelationshipComponent> relationships, String type) {
    return new BigDecimal(getSingleActiveConcreteValue(relationships, type));
  }

  private BigDecimal getSingleOptionalActiveBigDecimal(
      Set<SnowstormRelationshipComponent> relationships, String type) {
    if (relationshipOfTypeExists(relationships, type)) {
      return getSingleActiveBigDecimal(relationships, type);
    }
    return null;
  }

  private Set<SnowstormRelationshipComponent> findSingleRelationshipsForActiveInferredByType(
      Set<SnowstormRelationshipComponent> relationships, String type) {
    Set<SnowstormRelationshipComponent> filteredRelationships =
        filterActiveStatedRelationshipByType(relationships, type);

    if (filteredRelationships.size() != 1) {
      throw new AtomicDataExtractionProblem(
          "Expected 1 " + type + " relationship but found " + filteredRelationships.size(),
          relationships.iterator().next().getSourceId());
    }

    return filteredRelationships;
  }

  private Set<SnowstormRelationshipComponent> getActiveRelationshipsInRoleGroup(
      SnowstormRelationshipComponent subpacksRelationship,
      Set<SnowstormRelationshipComponent> relationships) {
    return relationships.stream()
        .filter(r -> r.getGroupId().equals(subpacksRelationship.getGroupId()))
        .filter(r -> r.getActive())
        .filter(r -> r.getCharacteristicType().equals("STATED_RELATIONSHIP"))
        .collect(Collectors.toSet());
  }

  private Set<SnowstormRelationshipComponent> getActiveRelationshipsOfType(
      Set<SnowstormRelationshipComponent> relationships, String type) {
    return filterActiveStatedRelationshipByType(relationships, type);
  }

  private SnowstormConceptMiniComponent getSingleOptionalActiveTarget(
      Set<SnowstormRelationshipComponent> relationships, String type) {
    if (relationshipOfTypeExists(relationships, type)) {
      return getSingleActiveTarget(relationships, type);
    }
    return null;
  }

  private SnowstormConceptMiniComponent getSingleActiveTarget(
      Set<SnowstormRelationshipComponent> relationships, String type) {
    return findSingleRelationshipsForActiveInferredByType(relationships, type)
        .iterator()
        .next()
        .getTarget();
  }
}
