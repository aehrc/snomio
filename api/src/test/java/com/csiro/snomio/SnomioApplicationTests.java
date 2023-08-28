package com.csiro.snomio;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;

class SnomioApplicationTests extends SnomioTestBase {

  @Test
  void contextLoads() {}

  @Test
  public void configRespondsNoAuth() {
    RestAssured.port = randomServerPort;
    given().get("/config").then().statusCode(200);
  }

  @Test
  public void authFailsNoAuth() {
    RestAssured.port = randomServerPort;
    given().get("api/auth").then().statusCode(403);
  }
}
