package com.csiro.snomio.service;

import com.csiro.snomio.helper.ApiClientProvider;
import com.csiro.snomio.models.ImsUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

  private final ApiClientProvider apiClientProvider;

  @Autowired
  public LoginService(ApiClientProvider apiClientProvider) {
    this.apiClientProvider = apiClientProvider;
  }

  @Cacheable(cacheNames = "users")
  public ImsUser getUserByToken(String cookie) throws AccessDeniedException {
    ImsUser user =
        apiClientProvider
            .getImsApiClient(cookie)
            .get()
            .uri("/api/account")
            .retrieve()
            .bodyToMono(ImsUser.class)
            .block();
    return user;
  }
}
