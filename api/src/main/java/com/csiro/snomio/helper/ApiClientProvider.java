package com.csiro.snomio.helper;

import org.codehaus.plexus.util.StringUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class ApiClientProvider {

  private final WebClient snowStormApiClient;

  private final WebClient imsApiClient;
  private final AuthHelper authHelper;

  public ApiClientProvider(
      @Qualifier("snowStormApiClient") WebClient snowStormApiClient,
      @Qualifier("imsApiClient") WebClient imsApiClient,
      AuthHelper authHelper) {
    this.snowStormApiClient = snowStormApiClient;
    this.imsApiClient = imsApiClient;
    this.authHelper = authHelper;
  }

  public WebClient getSnowStormApiClient() {
    addDefaultConfigurations(snowStormApiClient, authHelper.getCookieValue());
    return snowStormApiClient;
  }

  public WebClient getImsApiClient(String cookie) {
    addDefaultConfigurations(
        imsApiClient, StringUtils.isNotBlank(cookie) ? cookie : authHelper.getCookieValue());
    return imsApiClient;
  }

  private void addDefaultConfigurations(WebClient client, String cookie) {
    client.get().cookie(authHelper.getImsCookieName(), cookie);
  }
}
