package com.csiro.snomio.models.product;

import lombok.Data;

@Data
public class ProductQuantity extends Quantity {
  ProductDetails productDetails;
}
