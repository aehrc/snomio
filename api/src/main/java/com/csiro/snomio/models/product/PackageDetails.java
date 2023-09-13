package com.csiro.snomio.models.product;

import au.csiro.snowstorm_client.model.SnowstormConceptMiniComponent;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class PackageDetails {
  SnowstormConceptMiniComponent productName;
  SnowstormConceptMiniComponent containerType;
  List<ExternalIdentifier> externalIdentifiers = new ArrayList<>();
  List<ProductQuantity> containedProducts = new ArrayList<>();
  List<PackageQuantity> containedPackages = new ArrayList<>();
}
