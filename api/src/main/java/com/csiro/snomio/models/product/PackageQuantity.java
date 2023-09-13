package com.csiro.snomio.models.product;

import lombok.Data;

@Data
public class PackageQuantity extends Quantity {
  Quantity quantity;
  PackageDetails packageDetails;
}
