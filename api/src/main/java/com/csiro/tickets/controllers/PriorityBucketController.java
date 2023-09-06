package com.csiro.tickets.controllers;

import com.csiro.snomio.exception.ResourceAlreadyExists;
import com.csiro.snomio.exception.ResourceNotFoundProblem;
import com.csiro.tickets.models.PriorityBucket;
import com.csiro.tickets.repository.PriorityBucketRepository;
import com.csiro.tickets.service.PriorityBucketService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;

@RestController
public class PriorityBucketController {

  @Autowired private PriorityBucketRepository priorityBucketRepository;

  @Autowired private PriorityBucketService priorityBucketService;

  @GetMapping(value = "/api/tickets/priorityBuckets")
  public ResponseEntity<List<PriorityBucket>> getAllBuckets() {

    List<PriorityBucket> priorityBuckets = priorityBucketRepository.findAllByOrderByOrderIndexAsc();

    return new ResponseEntity<>(priorityBuckets, HttpStatus.OK);
  }

  @PostMapping(value = "/api/tickets/priorityBuckets")
  public ResponseEntity<PriorityBucket> createBucket(@RequestBody PriorityBucket priorityBucket) {

    Optional<PriorityBucket> priorityBucketNameOptional = priorityBucketRepository.findByName(priorityBucket.getName());

    if(priorityBucketNameOptional.isPresent()){
      throw new ResourceAlreadyExists(String.format("PriorityBucket with name %s already exists", priorityBucket.getName()));
    }
    List<PriorityBucket> priorityBuckets = priorityBucketRepository.findAll();

    if(priorityBuckets != null && priorityBuckets.size() > 0){
      PriorityBucket newPriorityBucket = priorityBucketService.createAndReorder(priorityBucket);
      return new ResponseEntity<>(newPriorityBucket, HttpStatus.OK);
    }

    PriorityBucket priorityBucket1 = priorityBucketRepository.save(priorityBucket);
    return new ResponseEntity<>(priorityBucket1, HttpStatus.OK);
  }
}
