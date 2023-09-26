package com.csiro.tickets.service;

import com.csiro.tickets.TicketTestBase;
import com.csiro.tickets.controllers.dto.ImportResponse;
import com.csiro.tickets.models.AdditionalFieldValue;
import com.csiro.tickets.models.Ticket;
import com.csiro.tickets.repository.AdditionalFieldTypeRepository;
import com.csiro.tickets.repository.AdditionalFieldValueRepository;
import com.csiro.tickets.repository.AttachmentRepository;
import com.csiro.tickets.repository.AttachmentTypeRepository;
import com.csiro.tickets.repository.CommentRepository;
import com.csiro.tickets.repository.LabelRepository;
import com.csiro.tickets.repository.StateRepository;
import com.csiro.tickets.repository.TicketRepository;
import com.csiro.tickets.repository.TicketTypeRepository;
import io.restassured.http.ContentType;
import java.io.IOException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.Transactional;

class TicketImportTest extends TicketTestBase {
  @Autowired TicketRepository ticketRepository;

  @Autowired AdditionalFieldTypeRepository additionalFieldTypeRepository;

  @Autowired AdditionalFieldValueRepository additionalFieldTypeValueRepository;

  @Autowired StateRepository stateRepository;

  @Autowired AttachmentTypeRepository attachmentTypeRepository;

  @Autowired AttachmentRepository attachmentRepository;

  @Autowired TicketTypeRepository ticketTypeRepository;

  @Autowired CommentRepository commentRepository;

  @Autowired LabelRepository labelRepository;

  protected final Log logger = LogFactory.getLog(getClass());

  private final String ticket1Title =
      "TGA - ARTG ID 200051 AZITHROMYCIN AN azithromycin (as monohydrate) 500mg film-coated tablet blister pack";
  private final String ticket2Title =
      "TGA - ARTG ID 191034 SOZOL pantoprazole (as sodium sesquihydrate) 20 mg enteric-coated tablet blister pack.";

  @BeforeAll
  protected void initDb() {
    ticketRepository.deleteAll();
    additionalFieldTypeRepository.deleteAll();
    stateRepository.deleteAll();
    attachmentTypeRepository.deleteAll();
    attachmentRepository.deleteAll();
    ticketTypeRepository.deleteAll();
    commentRepository.deleteAll();
    labelRepository.deleteAll();
  }

  @Test
  @Transactional
  void testimportTicket() throws IOException {
    ImportResponse importResopnse =
        withAuth()
            .contentType(ContentType.JSON)
            .when()
            .post(
                this.getSnomioLocation()
                    + "/api/ticketimport?importPath="
                    + new ClassPathResource("test-jira-export.json").getFile().getAbsolutePath())
            .then()
            .statusCode(200)
            .extract()
            .as(ImportResponse.class);

    Assertions.assertEquals(
        true, importResopnse.getMessage().contains("tickets have been imported successfully"));
    Ticket ticket1 = ticketRepository.findByTitle(ticket1Title).get();
    Ticket ticket2 = ticketRepository.findByTitle(ticket2Title).get();

    // Ticket 1
    Assertions.assertEquals(1371, ticket1.getDescription().length());
    Assertions.assertEquals(true, ticket1.getState().getLabel().equals("To Do"));
    Assertions.assertEquals(true, ticket1.getTicketType().getName().equals("Author Product"));
    Assertions.assertEquals(5, ticket1.getAdditionalFieldValues().size());
    AdditionalFieldValue artgid1 =
        ticket1.getAdditionalFieldValues().stream()
            .filter(afv -> afv.getAdditionalFieldType().getName().equals("Schedule"))
            .findFirst()
            .get();
    Assertions.assertEquals(true, artgid1.getValueOf().equals("S4"));
    Assertions.assertEquals(0, ticket1.getAttachments().size());
    Assertions.assertEquals(1, ticket1.getLabels().size());
    Assertions.assertEquals(true, ticket1.getLabels().get(0).getName().equals("Internal"));
    Assertions.assertEquals(13, ticket1.getComments().size());

    // Ticket 2
    Assertions.assertEquals(1371, ticket2.getDescription().length());
    Assertions.assertEquals(true, ticket2.getState().getLabel().equals("Closed"));
    Assertions.assertEquals(true, ticket2.getTicketType().getName().equals("Edit Product"));
    Assertions.assertEquals(5, ticket2.getAdditionalFieldValues().size());
    AdditionalFieldValue artgid2 =
        ticket2.getAdditionalFieldValues().stream()
            .filter(afv -> afv.getAdditionalFieldType().getName().equals("AMTFlags"))
            .findFirst()
            .get();
    Assertions.assertEquals(true, artgid2.getValueOf().equals("PBS"));
    Assertions.assertEquals(3, ticket2.getAttachments().size());
    Assertions.assertEquals(
        true,
        ticket2
            .getAttachments()
            .get(0)
            .getAttachmentType()
            .getMimeType()
            .equals("application/pdf"));
    Assertions.assertEquals(0, ticket2.getLabels().size());
    Assertions.assertEquals(17, ticket2.getComments().size());

    Assertions.assertEquals(2, commentRepository.findByText("<p>Closed as per Serge 1</p>").size());
  }
}
