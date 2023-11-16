package com.csiro.snomio.models.product.details;

import au.csiro.snowstorm_client.model.SnowstormConceptMini;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quantity {
  @NotNull @Positive BigDecimal value;

  @NotNull SnowstormConceptMini unit;
}
