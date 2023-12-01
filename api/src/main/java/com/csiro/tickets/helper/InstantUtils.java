package com.csiro.tickets.helper;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class InstantUtils {

  public static Instant convert(String source) {
    if (source.equals("")) return null;

    DateTimeFormatter formatter = isValidIso8601Formatter(source);

    // Try parsing with "dd/MM/yyyy" format
    if (formatter == null) {
      formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    }

    try {
      LocalDate localDate = LocalDate.parse(source, formatter);
      return convertLocalDateToInstant(localDate);
    } catch (Exception e) {
      // If parsing with "dd/MM/yyyy" format fails, try "dd/MM/yy" format
      formatter = DateTimeFormatter.ofPattern("dd/MM/yy");
      LocalDate localDate = LocalDate.parse(source, formatter);
      return convertLocalDateToInstant(localDate);
    }
  }

  public static Instant convertLocalDateToInstant(LocalDate localDate) {
    // Specify the Brisbane timezone
    ZoneId brisbaneZone = ZoneId.of("Australia/Brisbane");

    // Create a ZonedDateTime in the Brisbane timezone
    ZonedDateTime zonedDateTime = localDate.atStartOfDay(brisbaneZone);

    // Convert ZonedDateTime to Instant
    return zonedDateTime.toInstant();
  }

  public static DateTimeFormatter isValidIso8601Formatter(String input) {
    try {
      DateTimeFormatter iso8601Formatter =
          DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSSX");

      // Parse the input string
      iso8601Formatter.parse(input);

      return iso8601Formatter;
    } catch (DateTimeParseException e) {
      return null;
    }
  }
}
