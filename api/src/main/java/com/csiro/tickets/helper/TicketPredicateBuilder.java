package com.csiro.tickets.helper;

import com.csiro.snomio.exception.InvalidSearchProblem;
import com.csiro.tickets.models.QTicket;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.DateTimePath;
import com.querydsl.core.types.dsl.StringPath;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

public class TicketPredicateBuilder {

  public static BooleanBuilder buildPredicate(String search) {
    BooleanBuilder predicate = new BooleanBuilder();

    List<SearchCondition> searchConditions = SearchConditionFactory.parseSearchConditions(search);

    searchConditions.forEach(
        searchCondition -> {
          BooleanExpression booleanExpression = null;
          StringPath path = null;
          String field = searchCondition.getKey().toLowerCase();
          String value = searchCondition.getValue();
          List<String> valueIn = searchCondition.getValueIn();
          if ("title".equals(field)) {
            path = QTicket.ticket.title;
          }
          if ("assignee".equals(field)) {
            path = QTicket.ticket.assignee;
          }
          if ("created".equals(field)) {
            // special case
            DateTimePath<Instant> datePath = QTicket.ticket.created;
            Instant startOfRange = InstantUtils.convert(value);
            if (startOfRange == null) {
              throw new InvalidSearchProblem("Incorrectly formatted date");
            }
            Instant endOfRange = startOfRange.plus(Duration.ofDays(1).minusMillis(1));
            predicate.and(datePath.between(startOfRange, endOfRange));
          }
          if ("description".equals(field)) {
            path = QTicket.ticket.description;
          }
          if ("comments.text".equals(field)) {
            path = QTicket.ticket.comments.any().text;
          }
          if ("iteration.name".equals(field)) {
            path = QTicket.ticket.iteration.name;
          }
          if ("prioritybucket.name".equals(field)) {
            path = QTicket.ticket.priorityBucket.name;
          }
          if ("state.label".equals(field)) {
            path = QTicket.ticket.state.label;
          }
          if ("labels.name".equals(field)) {
            path = QTicket.ticket.labels.any().name;
          }
          if ("additionalfieldvalues.valueof".equals(field)) {
            path = QTicket.ticket.additionalFieldValues.any().valueOf;
          }
          if ("taskassociation".equals(field)) {
            booleanExpression = QTicket.ticket.taskAssociation.isNull();
          }
          if ("taskassociation.taskid".equals(field)) {
            path = QTicket.ticket.taskAssociation.taskId;
          }

          createPredicate(predicate, booleanExpression, path, value, valueIn, searchCondition);
        });

    return predicate;
  }

  private static void createPredicate(
      BooleanBuilder predicate,
      BooleanExpression booleanExpression,
      StringPath path,
      String value,
      List<String> valueIn,
      SearchCondition searchCondition) {

    if (booleanExpression != null) {
      predicate.and(booleanExpression);
    }
    if (path == null) return;

    BooleanExpression generatedPath = createPath(path, value, valueIn);
    if (!predicate.hasValue()) {
      predicate.or(generatedPath);
    } else if (searchCondition.getCondition().equals("and")) {
      predicate.and(generatedPath);
    } else if (searchCondition.getCondition().equals("or")) {
      predicate.or(generatedPath);
    }
  }

  private static BooleanExpression createPath(StringPath path, String value, List<String> valueIn) {

    if (value.equals("null") || value.isEmpty()) {
      return path.isNull();
    }

    if(valueIn != null){
      return path.in(valueIn);
    }
    if (value.contains("!")) {
      // first part !, second part val
      String[] parts = value.split("!");
      return path.containsIgnoreCase(parts[1]).not();
    }
    return path.containsIgnoreCase(value);
  }
}
