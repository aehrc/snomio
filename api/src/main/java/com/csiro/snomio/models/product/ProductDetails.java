package com.csiro.snomio.models.product;

import au.csiro.snowstorm_client.model.SnowstormConceptMiniComponent;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class ProductDetails {
  SnowstormConceptMiniComponent productName;
  SnowstormConceptMiniComponent genericForm;
  SnowstormConceptMiniComponent specificForm;

  // These are the old unit of use/presentation attributes needed until purged
  Quantity quantity;
  SnowstormConceptMiniComponent containerType;
  SnowstormConceptMiniComponent deviceType;

  String otherIdentifyingInformation;
  List<Ingredient> activeIngredients = new ArrayList<>();
}
