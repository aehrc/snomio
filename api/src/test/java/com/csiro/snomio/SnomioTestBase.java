package com.csiro.snomio;

import static io.restassured.RestAssured.given;

import com.google.gson.JsonObject;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.http.Cookie;
import io.restassured.http.Cookies;
import io.restassured.specification.RequestSpecification;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.server.LocalServerPort;

/*
 For now there is some duplicated logic between here and SnomioTestBase. Some kind of attempt
 to make them independant of each other
*/
@Getter
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, classes = Configuration.class)
public class SnomioTestBase {

  @LocalServerPort int randomServerPort;

  @Value("${ihtsdo.ims.api.cookie.name}")
  String imsCookieName;

  @Getter String snomioLocation;
  @Getter Cookie imsCookie;

  @PostConstruct
  private void setup() {

    snomioLocation = "http://localhost:" + randomServerPort;
    final JsonObject usernameAndPassword = new JsonObject();
    String username = System.getProperty("ims-username");
    String password = System.getProperty("ims-password");
    System.out.println(username);
    System.out.println(password);

    usernameAndPassword.addProperty("login", username);
    usernameAndPassword.addProperty("password", password);
    final Cookies cookies =
        RestAssured.given()
            .contentType(ContentType.JSON)
            .when()
            .body(usernameAndPassword.toString())
            .post("https://uat-ims.ihtsdotools.org/api/authenticate")
            .then()
            .statusCode(200)
            .extract()
            .response()
            .getDetailedCookies();

    this.imsCookie = cookies.get(imsCookieName);
  }

  public RequestSpecification withAuth() {
    return given().cookie(imsCookie);
  }
}
