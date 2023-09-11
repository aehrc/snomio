package com.csiro.snomio.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class TaskManagerService {

  private final WebClient authoringPlatformApiClient;

  @Autowired
  public TaskManagerService(
      @Qualifier("authoringPlatformApiClient") WebClient authoringPlatformApiClient) {
    this.authoringPlatformApiClient = authoringPlatformApiClient;
  }

  public JsonArray getUserTasks() throws AccessDeniedException {
    String json =
        authoringPlatformApiClient
            .get()
            .uri("/projects/my-tasks?excludePromoted=false")
            .retrieve()
            .bodyToMono(String.class) // TODO May be change to actual objects?
            .block();
    JsonArray convertedObject =
        new Gson().fromJson(json, JsonArray.class); // //TODO Serialization Bean?
    return convertedObject;
  }

  public JsonArray getAllTasks() throws AccessDeniedException {
    String json =
        authoringPlatformApiClient
            .get()
            .uri("/projects/AU/tasks?lightweight=false")
            .retrieve()
            .bodyToMono(String.class) // TODO May be change to actual objects?
            .block();
    JsonArray convertedObject =
        new Gson().fromJson(json, JsonArray.class); // //TODO Serialization Bean?
    return convertedObject;
  }
}
