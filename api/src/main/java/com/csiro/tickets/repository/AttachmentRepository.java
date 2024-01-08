package com.csiro.tickets.repository;

import com.csiro.tickets.models.Attachment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
  List<Attachment> findAllByLocation(String location);

  Optional<Attachment> findByTicketId(Long id);

  List<Attachment> findAll();
}
