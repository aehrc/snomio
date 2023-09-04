package com.csiro.tickets.controllers;

import com.csiro.tickets.controllers.exceptions.ResourceNotFoundProblem;
import com.csiro.tickets.models.Iteration;
import com.csiro.tickets.repository.IterationRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IterationController {

  @Autowired
  private IterationRepository iterationRepository;

  @GetMapping("/api/tickets/iterations")
  public ResponseEntity<List<Iteration>> getAllIterations(){
    List<Iteration> iterations = iterationRepository.findAll();

    return new ResponseEntity<>(iterations, HttpStatus.OK);
  }

  @PostMapping(value = "/api/tickets/iterations", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Iteration> createIteration(@RequestBody Iteration iteration){
    // check no dupe name
    Iteration createdIteration = iterationRepository.save(iteration);

    return new ResponseEntity<>(createdIteration, HttpStatus.OK);
  }

  @PutMapping(value = "/api/tickets/iterations/{iterationId}", consumes = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Iteration> updateIteration(@PathVariable Long iterationId, @RequestBody Iteration iteration){
    Optional<Iteration> foundIteration = iterationRepository.findById(iterationId);
    if(foundIteration.isEmpty()){
      throw new ResourceNotFoundProblem("placeholder");
    }

    iteration.setId(iterationId);
    Iteration updatedIteration = iterationRepository.save(iteration);

    return new ResponseEntity<>(updatedIteration, HttpStatus.OK);
  }
}
