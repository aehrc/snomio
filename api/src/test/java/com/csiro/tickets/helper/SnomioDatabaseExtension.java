package com.csiro.tickets.helper;

import org.junit.jupiter.api.extension.AfterAllCallback;
import org.junit.jupiter.api.extension.BeforeAllCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@Testcontainers
public class SnomioDatabaseExtension implements BeforeAllCallback, AfterAllCallback {

  PostgreSQLContainer<?> snomioTestDbContainer =
      new PostgreSQLContainer<>(
              DockerImageName.parse("nctsacr.azurecr.io/snomio_test_db:latest")
                  .asCompatibleSubstituteFor("postgres"))
          .withExposedPorts(5432)
          .withEnv("POSTGRES_HOST_AUTH_METHOD", "trust")
          .waitingFor(Wait.forListeningPort());

  @Override
  public void beforeAll(ExtensionContext extensionContext) {

    snomioTestDbContainer.start();

    String generatedJdbcUrl = snomioTestDbContainer.getJdbcUrl();

    // Override the database name in the JDBC URL
    String jdbcUrlWithDatabase = generatedJdbcUrl.replace("/test?", "/snomio?");

    System.setProperty("spring.datasource.url", jdbcUrlWithDatabase);
    System.setProperty("spring.datasource.username", "postgres");
    System.setProperty("spring.datasource.password", "");
    System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
  }

  @Override
  public void afterAll(ExtensionContext extensionContext) {
    // nothing to do
  }
}
