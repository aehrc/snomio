package com.csiro.snomio.service;

import static com.csiro.snomio.util.AmtConstants.ARTGID_REFSET;
import static com.csiro.snomio.util.AmtConstants.CTPP_REFSET_ID;
import static com.csiro.snomio.util.AmtConstants.HAS_CONTAINER_TYPE;
import static com.csiro.snomio.util.AmtConstants.HAS_OTHER_IDENTIFYING_INFORMATION;
import static com.csiro.snomio.util.AmtConstants.MPUU_REFSET_ID;
import static com.csiro.snomio.util.AmtConstants.MP_REFSET_ID;
import static com.csiro.snomio.util.AmtConstants.TPUU_REFSET_ID;
import static com.csiro.snomio.util.SnomedConstants.HAS_PACK_SIZE_UNIT;
import static com.csiro.snomio.util.SnomedConstants.HAS_PACK_SIZE_VALUE;
import static com.csiro.snomio.util.SnomedConstants.HAS_PRODUCT_NAME;
import static com.csiro.snomio.util.SnowstormDtoUtil.getActiveRelationshipsInRoleGroup;
import static com.csiro.snomio.util.SnowstormDtoUtil.getActiveRelationshipsOfType;
import static com.csiro.snomio.util.SnowstormDtoUtil.getRelationshipsFromAxioms;
import static com.csiro.snomio.util.SnowstormDtoUtil.getSingleActiveBigDecimal;
import static com.csiro.snomio.util.SnowstormDtoUtil.getSingleActiveConcreteValue;
import static com.csiro.snomio.util.SnowstormDtoUtil.getSingleActiveTarget;

import au.csiro.snowstorm_client.model.SnowstormConcept;
import au.csiro.snowstorm_client.model.SnowstormConceptMini;
import au.csiro.snowstorm_client.model.SnowstormItemsPageReferenceSetMember;
import au.csiro.snowstorm_client.model.SnowstormReferenceSetMember;
import au.csiro.snowstorm_client.model.SnowstormRelationship;
import com.csiro.snomio.exception.AtomicDataExtractionProblem;
import com.csiro.snomio.exception.ResourceNotFoundProblem;
import com.csiro.snomio.models.product.details.ExternalIdentifier;
import com.csiro.snomio.models.product.details.PackageDetails;
import com.csiro.snomio.models.product.details.PackageQuantity;
import com.csiro.snomio.models.product.details.ProductDetails;
import com.csiro.snomio.models.product.details.ProductQuantity;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import lombok.extern.java.Log;
import reactor.core.publisher.Mono;

@Log
public abstract class AtomicDataService<T extends ProductDetails> {

  protected abstract SnowstormClient getSnowStormApiClient();

  protected abstract String getPackageAtomicDataEcl();

  protected abstract String getProductAtomicDataEcl();

  protected abstract T populateSpecificProductDetails(
      SnowstormConcept product,
      String productId,
      Map<String, SnowstormConcept> browserMap,
      Map<String, String> typeMap);

  protected abstract String getType();

  protected abstract String getContainedUnitRelationshipType();

  protected abstract String getSubpackRelationshipType();

  public PackageDetails<T> getPackageAtomicData(String branch, String productId) {
    Maps maps = getMaps(branch, productId, this::getPackageAtomicDataEcl);

    return populatePackageDetails(productId, maps.browserMap(), maps.typeMap(), maps.artgMap());
  }

  public T getProductAtomicData(String branch, String productId) {
    Maps maps = getMaps(branch, productId, this::getProductAtomicDataEcl);

    return populateProductDetails(
        maps.browserMap.get(productId), productId, maps.browserMap(), maps.typeMap());
  }

  private Maps getMaps(String branch, String productId, Supplier<String> ecl) {
    Collection<SnowstormConceptMini> concepts =
        getSnowStormApiClient().getConceptsFromEcl(branch, ecl.get(), productId, 0, 100);

    if (concepts.isEmpty()) {
      throw new ResourceNotFoundProblem(
          "No matching concepts for " + productId + " of type " + getType());
    }

    // get the concepts involved in this product
    Mono<List<SnowstormConcept>> browserConcepts =
        getSnowStormApiClient().getBrowserConcepts(branch, concepts);

    // categorise them using the reference sets
    Mono<SnowstormItemsPageReferenceSetMember> refsetMembers =
        getSnowStormApiClient().getRefsetMembers(branch, concepts, 0, 100);

    List<SnowstormConcept> browserConceptList = browserConcepts.block();
    if (browserConceptList == null) {
      throw new AtomicDataExtractionProblem("No browser concepts found", productId);
    }
    Map<String, SnowstormConcept> browserMap =
        browserConceptList.stream()
            .collect(Collectors.toMap(SnowstormConcept::getConceptId, c -> c));

    SnowstormItemsPageReferenceSetMember refsetMembersList = refsetMembers.block();
    if (refsetMembersList == null || refsetMembersList.getItems() == null) {
      throw new AtomicDataExtractionProblem("No browser concepts found", productId);
    }
    Map<String, String> typeMap =
        refsetMembersList.getItems().stream()
            .filter(
                m ->
                    m.getRefsetId().equals(CTPP_REFSET_ID.getValue())
                        || m.getRefsetId().equals(TPUU_REFSET_ID.getValue())
                        || m.getRefsetId().equals(MPUU_REFSET_ID.getValue())
                        || m.getRefsetId().equals(MP_REFSET_ID.getValue()))
            .collect(
                Collectors.toMap(
                    SnowstormReferenceSetMember::getReferencedComponentId,
                    SnowstormReferenceSetMember::getRefsetId));

    Map<String, Set<String>> artgMap = new HashMap<>();
    refsetMembersList.getItems().stream()
        .filter(m -> m.getRefsetId().equals(ARTGID_REFSET.getValue()))
        .forEach(
            m ->
                artgMap
                    .computeIfAbsent(m.getReferencedComponentId(), k -> new HashSet<>())
                    .add(
                        m.getAdditionalFields() != null
                            ? m.getAdditionalFields().getOrDefault("mapTarget", null)
                            : null));

    if (!typeMap.keySet().equals(browserMap.keySet())) {
      throw new AtomicDataExtractionProblem(
          "Mismatch between browser and refset members", productId);
    }
    return new Maps(browserMap, typeMap, artgMap);
  }

  private PackageDetails<T> populatePackageDetails(
      String productId,
      Map<String, SnowstormConcept> browserMap,
      Map<String, String> typeMap,
      Map<String, Set<String>> artgMap) {

    PackageDetails<T> details = new PackageDetails<>();

    SnowstormConcept basePackage = browserMap.get(productId);
    Set<SnowstormRelationship> basePackageRelationships = getRelationshipsFromAxioms(basePackage);
    // container type
    details.setContainerType(getSingleActiveTarget(basePackageRelationships, HAS_CONTAINER_TYPE.getValue()));
    // product name
    details.setProductName(getSingleActiveTarget(basePackageRelationships, HAS_PRODUCT_NAME.getValue()));
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

    Set<SnowstormRelationship> subpacksRelationships =
        getActiveRelationshipsOfType(basePackageRelationships, getSubpackRelationshipType());
    Set<SnowstormRelationship> productRelationships =
        getActiveRelationshipsOfType(basePackageRelationships, getContainedUnitRelationshipType());

    if (!subpacksRelationships.isEmpty()) {
      if (!productRelationships.isEmpty()) {
        throw new AtomicDataExtractionProblem(
            "Multipack should not have direct products", productId);
      }
      for (SnowstormRelationship subpacksRelationship : subpacksRelationships) {
        Set<SnowstormRelationship> roleGroup =
            getActiveRelationshipsInRoleGroup(subpacksRelationship, basePackageRelationships);
        PackageQuantity<T> packageQuantity = new PackageQuantity<>();
        details.getContainedPackages().add(packageQuantity);
        // sub pack quantity unit
        packageQuantity.setUnit(getSingleActiveTarget(roleGroup, HAS_PACK_SIZE_UNIT.getValue()));
        // sub pack quantity value
        packageQuantity.setValue(
            new BigDecimal(getSingleActiveConcreteValue(roleGroup, HAS_PACK_SIZE_VALUE.getValue())));
        // sub pack product details
        assert subpacksRelationship.getTarget() != null;
        packageQuantity.setPackageDetails(
            populatePackageDetails(
                subpacksRelationship.getTarget().getConceptId(), browserMap, typeMap, artgMap));
      }
    } else {
      if (productRelationships.isEmpty()) {
        throw new AtomicDataExtractionProblem(
            "Package has no sub packs, expected product relationships", productId);
      }

      for (SnowstormRelationship subProductRelationship : productRelationships) {
        Set<SnowstormRelationship> subRoleGroup =
            getActiveRelationshipsInRoleGroup(subProductRelationship, basePackageRelationships);
        ProductQuantity<T> productQuantity = new ProductQuantity<>();
        details.getContainedProducts().add(productQuantity);
        // contained product quantity value
        productQuantity.setValue(getSingleActiveBigDecimal(subRoleGroup, HAS_PACK_SIZE_VALUE.getValue()));
        // contained product quantity unit
        productQuantity.setUnit(getSingleActiveTarget(subRoleGroup, HAS_PACK_SIZE_UNIT.getValue()));

        assert subProductRelationship.getTarget() != null;
        SnowstormConcept product =
            browserMap.get(subProductRelationship.getTarget().getConceptId());

        if (product == null) {
          throw new AtomicDataExtractionProblem(
              "Expected concept to be in downloaded set for the product but was not found: "
                  + subProductRelationship.getTarget().getIdAndFsnTerm(),
              productId);
        }

        // contained product details
        productQuantity.setProductDetails(
            populateProductDetails(product, productId, browserMap, typeMap));
      }
    }
    return details;
  }

  private T populateProductDetails(
      SnowstormConcept product,
      String productId,
      Map<String, SnowstormConcept> browserMap,
      Map<String, String> typeMap) {

    T productDetails = populateSpecificProductDetails(product, productId, browserMap, typeMap);

    // product name
    Set<SnowstormRelationship> productRelationships = getRelationshipsFromAxioms(product);
    productDetails.setProductName(getSingleActiveTarget(productRelationships, HAS_PRODUCT_NAME.getValue()));

    productDetails.setOtherIdentifyingInformation(
        getSingleActiveConcreteValue(productRelationships, HAS_OTHER_IDENTIFYING_INFORMATION.getValue()));

    return productDetails;
  }

  private record Maps(
      Map<String, SnowstormConcept> browserMap,
      Map<String, String> typeMap,
      Map<String, Set<String>> artgMap) {}
}
