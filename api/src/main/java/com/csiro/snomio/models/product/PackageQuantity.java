package com.csiro.snomio.models.product;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class PackageQuantity extends Quantity {
  PackageDetails packageDetails;
}
