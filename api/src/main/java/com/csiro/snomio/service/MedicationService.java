package com.csiro.snomio.service;

import static com.csiro.snomio.util.AmtConstants.CONCENTRATION_STRENGTH_UNIT;
import static com.csiro.snomio.util.AmtConstants.CONCENTRATION_STRENGTH_VALUE;
import static com.csiro.snomio.util.AmtConstants.CONTAINS_PACKAGED_CD;
import static com.csiro.snomio.util.AmtConstants.HAS_DEVICE_TYPE;
import static com.csiro.snomio.util.AmtConstants.HAS_TOTAL_QUANTITY_UNIT;
import static com.csiro.snomio.util.AmtConstants.HAS_TOTAL_QUANTITY_VALUE;
import static com.csiro.snomio.util.AmtConstants.MPUU_REFSET_ID;
import static com.csiro.snomio.util.SnomedConstants.CONTAINS_CD;
import static com.csiro.snomio.util.SnomedConstants.HAS_ACTIVE_INGREDIENT;
import static com.csiro.snomio.util.SnomedConstants.HAS_BOSS;
import static com.csiro.snomio.util.SnomedConstants.HAS_MANUFACTURED_DOSE_FORM;
import static com.csiro.snomio.util.SnomedConstants.HAS_PACK_SIZE_UNIT;
import static com.csiro.snomio.util.SnomedConstants.HAS_PACK_SIZE_VALUE;
import static com.csiro.snomio.util.SnomedConstants.HAS_PRECISE_ACTIVE_INGREDIENT;
import static com.csiro.snomio.util.SnomedConstants.IS_A;
import static com.csiro.snomio.util.SnowstormDtoUtil.filterActiveStatedRelationshipByType;
import static com.csiro.snomio.util.SnowstormDtoUtil.getActiveRelationshipsInRoleGroup;
import static com.csiro.snomio.util.SnowstormDtoUtil.getActiveRelationshipsOfType;
import static com.csiro.snomio.util.SnowstormDtoUtil.getRelationshipsFromAxioms;
import static com.csiro.snomio.util.SnowstormDtoUtil.getSingleActiveTarget;
import static com.csiro.snomio.util.SnowstormDtoUtil.getSingleOptionalActiveBigDecimal;
import static com.csiro.snomio.util.SnowstormDtoUtil.getSingleOptionalActiveTarget;
import static com.csiro.snomio.util.SnowstormDtoUtil.relationshipOfTypeExists;

import au.csiro.snowstorm_client.model.SnowstormConceptComponent;
import au.csiro.snowstorm_client.model.SnowstormConceptMiniComponent;
import au.csiro.snowstorm_client.model.SnowstormRelationshipComponent;
import com.csiro.snomio.exception.AtomicDataExtractionProblem;
import com.csiro.snomio.models.product.Ingredient;
import com.csiro.snomio.models.product.MedicationProductDetails;
import com.csiro.snomio.models.product.ProductDetails;
import com.csiro.snomio.models.product.Quantity;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Service for product-centric operations */
@Service
@Log
public class MedicationService extends AtomicDataService {
  private static final String PRODUCT_CONCEPTS_FOR_ATOMIC_EXTRACTION_ECL =
      "(<id> or (<id>.999000011000168107) "
          + "or (<id>.774160008) "
          + "or (<id>.999000011000168107.774160008) "
          + "or ((>>((<id>.774160008) or (<id>.999000011000168107.774160008))) and (^929360071000036103))) "
          + "and <373873005";
  private final SnowstormClient snowStormApiClient;

  @Autowired
  MedicationService(SnowstormClient snowStormApiClient) {
    this.snowStormApiClient = snowStormApiClient;
  }

  private static Ingredient getIngredient(
      SnowstormRelationshipComponent ingredientRelationship,
      Set<SnowstormRelationshipComponent> productRelationships) {
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
              getSingleOptionalActiveBigDecimal(ingredientRoleGroup, CONCENTRATION_STRENGTH_VALUE),
              getSingleActiveTarget(ingredientRoleGroup, CONCENTRATION_STRENGTH_UNIT)));
    }
    return ingredient;
  }

  private static void populateDoseForm(
      String productId,
      Map<String, SnowstormConceptComponent> browserMap,
      Map<String, String> typeMap,
      Set<SnowstormRelationshipComponent> productRelationships,
      MedicationProductDetails productDetails) {
    Set<SnowstormConceptComponent> mpuu =
        filterActiveStatedRelationshipByType(productRelationships, IS_A).stream()
            .filter(r -> typeMap.get(r.getTarget().getConceptId()).equals(MPUU_REFSET_ID))
            .map(r -> browserMap.get(r.getTarget().getConceptId()))
            .collect(Collectors.toSet());

    if (mpuu.size() != 1) {
      throw new AtomicDataExtractionProblem("Expected 1 MPUU but found " + mpuu.size(), productId);
    }

    SnowstormConceptMiniComponent genericDoseForm =
        getSingleActiveTarget(
            getRelationshipsFromAxioms(mpuu.stream().findFirst().orElseThrow()),
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
  }

  private static void populatePackSize(
      Set<SnowstormRelationshipComponent> productRelationships,
      MedicationProductDetails productDetails) {
    if (relationshipOfTypeExists(productRelationships, HAS_PACK_SIZE_UNIT)) {
      productDetails.setQuantity(
          new Quantity(
              getSingleOptionalActiveBigDecimal(productRelationships, HAS_PACK_SIZE_VALUE),
              getSingleActiveTarget(productRelationships, HAS_PACK_SIZE_UNIT)));
    }
  }

  @Override
  protected SnowstormClient getSnowStormApiClient() {
    return snowStormApiClient;
  }

  @Override
  protected String getProductAtomicDataEcl() {
    return PRODUCT_CONCEPTS_FOR_ATOMIC_EXTRACTION_ECL;
  }

  @Override
  protected String getContainedUnitRelationshipType() {
    return CONTAINS_CD;
  }

  @Override
  protected String getSubpackRelationshipType() {
    return CONTAINS_PACKAGED_CD;
  }

  @Override
  protected ProductDetails populateSpecificProductDetails(
      SnowstormConceptComponent product,
      String productId,
      Map<String, SnowstormConceptComponent> browserMap,
      Map<String, String> typeMap,
      SnowstormRelationshipComponent subProductRelationship) {

    MedicationProductDetails productDetails = new MedicationProductDetails();

    // product name
    Set<SnowstormRelationshipComponent> productRelationships = getRelationshipsFromAxioms(product);

    // manufactured dose form - need to detect generic and specific forms if present
    if (relationshipOfTypeExists(productRelationships, HAS_MANUFACTURED_DOSE_FORM)) {
      populateDoseForm(productId, browserMap, typeMap, productRelationships, productDetails);
    } else if (relationshipOfTypeExists(productRelationships, HAS_DEVICE_TYPE)) {
      productDetails.setDeviceType(getSingleActiveTarget(productRelationships, HAS_DEVICE_TYPE));
    } else {
      throw new AtomicDataExtractionProblem(
          "Expected manufactured dose form or device type, product has neither", productId);
    }

    populatePackSize(productRelationships, productDetails);

    Set<SnowstormRelationshipComponent> ingredientRelationships =
        getActiveRelationshipsOfType(productRelationships, HAS_ACTIVE_INGREDIENT);
    for (SnowstormRelationshipComponent ingredientRelationship : ingredientRelationships) {
      productDetails
          .getActiveIngredients()
          .add(getIngredient(ingredientRelationship, productRelationships));
    }
    return productDetails;
  }

  @Override
  protected String getType() {
    return "medication";
  }
}
