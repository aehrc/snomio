package com.csiro.tickets.repository;

import com.csiro.tickets.models.State;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StateRepository extends JpaRepository<State, Long> {}
