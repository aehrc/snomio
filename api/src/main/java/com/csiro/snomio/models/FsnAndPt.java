package com.csiro.snomio.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FsnAndPt {

  String FSN;
  String PT;
}
