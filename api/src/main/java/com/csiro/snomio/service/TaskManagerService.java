package com.csiro.snomio.service;

import com.csiro.snomio.helper.ApiClientProvider;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class TaskManagerService {
  private final ApiClientProvider apiClientProvider;

  @Autowired
  public TaskManagerService(ApiClientProvider apiClientProvider) {
    this.apiClientProvider = apiClientProvider;
  }

  public JsonArray getUserTasks() throws AccessDeniedException {
    String json =
        apiClientProvider
            .getSnowStormApiClient()
            .get()
            .uri("/projects/my-tasks?excludePromoted=false")
            .retrieve()
            .bodyToMono(String.class) // TODO May be change to actual objects?
            .block();
    JsonArray convertedObject =
        new Gson().fromJson(json, JsonArray.class); // //TODO Serialization Bean?
    return convertedObject;
  }
}
