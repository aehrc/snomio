package com.csiro.snomio.controllers;

import com.csiro.snomio.models.product.ProductSummary;
import com.csiro.snomio.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
    value = "/api",
    produces = {MediaType.APPLICATION_JSON_VALUE})
public class ProductsController {

  @Autowired
  ProductService productService;

  @GetMapping("/{branch}/product-model/{productId}")
  @ResponseBody
  public ProductSummary tasks(@PathVariable String branch, @PathVariable Long productId) {
    return productService.getProductSummary(branch, productId);
  }
}
