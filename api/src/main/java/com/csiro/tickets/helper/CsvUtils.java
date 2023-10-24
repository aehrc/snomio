package com.csiro.tickets.helper;

import com.csiro.snomio.exception.CsvCreationProblem;
import com.csiro.tickets.models.Label;
import com.csiro.tickets.models.Ticket;
import com.csiro.tickets.service.ExportService;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

public class CsvUtils {

  private CsvUtils(){}
  public static ByteArrayInputStream createAdhaCsv(List<Ticket> tickets) {

    ByteArrayOutputStream out = new ByteArrayOutputStream();
    String[] HEADERS = {
      "Date Requested", "External Requesters", "ARTG ID", "Title", "Priority", "URL"
    };
    CSVFormat csvFormat = CSVFormat.DEFAULT.builder().setHeader(HEADERS).build();

    try (final CSVPrinter printer = new CSVPrinter(new PrintWriter(out), csvFormat)) {
      tickets.forEach(
          (ticket) -> {
            try {
              printer.printRecord(
                  AdditionalFieldUtils.findValueByAdditionalFieldName("StartDate", ticket),
                  CsvUtils.getExternalRequesters(ticket.getLabels()),
                  AdditionalFieldUtils.findValueByAdditionalFieldName("ARTGID", ticket),
                  ticket.getTitle(),
                  ticket.getPriorityBucket() != null ? ticket.getPriorityBucket().getName() : "",
                  // TODO make this change depending on the environment
                  "https://dev-snomio.ihtsdotools.org/dashboard/tickets/individual/"
                      + ticket.getId());
            } catch (IOException ioException) {
              throw new CsvCreationProblem(ioException.getMessage());
            }
          });

    } catch (IOException ioException) {
      throw new CsvCreationProblem(ioException.getMessage());
    }

    return new ByteArrayInputStream(out.toByteArray());
  }

  public static String getExternalRequesters(List<Label> labels) {

    String filteredLabels =
        labels.stream()
            .filter(
                label -> {
                  return (!ExportService.NON_EXTERNAL_REQUESTERS.contains(label.getName()));
                })
            .map(Label::getName)
            .collect(Collectors.joining(", "));
    return filteredLabels;
  }
}
