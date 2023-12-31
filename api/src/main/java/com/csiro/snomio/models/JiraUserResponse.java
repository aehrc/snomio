package com.csiro.snomio.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JiraUserResponse {
  private String name;
  private JiraUserItems users;
}
