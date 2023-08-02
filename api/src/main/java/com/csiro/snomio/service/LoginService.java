package com.csiro.snomio.service;

import com.csiro.snomio.models.ImsUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class LoginService {
  private final String imsCookieName;
  private final WebClient imsApiClient;

  @Autowired
  public LoginService(
      @Qualifier("imsApiClient") WebClient imsApiClient,
      @Value("${ims.api.cookie.name}") String imsCookieName) {
    this.imsApiClient = imsApiClient;
    this.imsCookieName = imsCookieName;
  }

  @Cacheable(cacheNames = "users")
  public ImsUser getUserByToken(String cookie) throws AccessDeniedException {
    ImsUser user =
        imsApiClient
            .get()
            .uri("/api/account")
            .cookie(imsCookieName, cookie)
            .retrieve()
            .bodyToMono(ImsUser.class)
            .block();
    return user;
  }
}
