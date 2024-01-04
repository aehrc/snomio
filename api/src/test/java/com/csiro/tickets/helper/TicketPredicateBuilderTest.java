package com.csiro.tickets.helper;

import com.querydsl.core.BooleanBuilder;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class TicketPredicateBuilderTest {

  @Test
  public void buildPredicateFromSearchConditions() {

    // Search title
    SearchCondition titleSearchCondition =
        SearchCondition.builder()
            .condition("and")
            .value("titleTest")
            .operation("=")
            .key("title")
            .build();

    BooleanBuilder titleBoolean =
        TicketPredicateBuilder.buildPredicateFromSearchConditions(List.of(titleSearchCondition));

    Assertions.assertEquals(
        titleBoolean.getValue().toString(), "containsIc(ticket.title,titleTest)");

    // Search title and comments
    SearchCondition commentSearchCondition =
        SearchCondition.builder()
            .condition("or")
            .value("commentTest")
            .operation("=")
            .key("comments.text")
            .build();

    titleSearchCondition.setCondition("or");

    BooleanBuilder titleAndComments =
        TicketPredicateBuilder.buildPredicateFromSearchConditions(
            List.of(titleSearchCondition, commentSearchCondition));
    Assertions.assertEquals(
        titleAndComments.getValue().toString(),
        "containsIc(ticket.title,titleTest) || containsIc(any(ticket.comments).text,commentTest)");

    SearchCondition prioritySearchCondition =
        SearchCondition.builder()
            .condition("and")
            .value("priorityTest")
            .operation("=")
            .key("priorityBucket.name")
            .build();

    BooleanBuilder priority =
        TicketPredicateBuilder.buildPredicateFromSearchConditions(List.of(prioritySearchCondition));
    Assertions.assertEquals(
        priority.getValue().toString(), "containsIc(ticket.priorityBucket.name,priorityTest)");

    SearchCondition scheduleSearchCondition =
        SearchCondition.builder()
            .condition("and")
            .value("scheduleTest")
            .operation("=")
            .key("additionalFieldValues.valueOf")
            .build();

    BooleanBuilder schedule =
        TicketPredicateBuilder.buildPredicateFromSearchConditions(List.of(scheduleSearchCondition));
    Assertions.assertEquals(
        schedule.getValue().toString(),
        "containsIc(any(ticket.additionalFieldValues).valueOf,scheduleTest)");

    SearchCondition iterationSearchCondition =
        SearchCondition.builder()
            .condition("and")
            .value("iterationTest")
            .operation("=")
            .key("iteration.name")
            .build();

    BooleanBuilder iteration =
        TicketPredicateBuilder.buildPredicateFromSearchConditions(
            List.of(iterationSearchCondition));
    Assertions.assertEquals(
        iteration.getValue().toString(), "containsIc(ticket.iteration.name,iterationTest)");

    SearchCondition stateSearchCondition =
        SearchCondition.builder()
            .condition("and")
            .value("stateTest")
            .operation("=")
            .key("state.label")
            .build();

    BooleanBuilder state =
        TicketPredicateBuilder.buildPredicateFromSearchConditions(List.of(stateSearchCondition));
    Assertions.assertEquals(
        state.getValue().toString(), "containsIc(ticket.state.label,stateTest)");

    SearchCondition taskCondition =
        SearchCondition.builder()
            .condition("and")
            .value("taskTest")
            .operation("=")
            .key("taskAssociation.taskId")
            .build();

    BooleanBuilder task =
        TicketPredicateBuilder.buildPredicateFromSearchConditions(List.of(taskCondition));
    Assertions.assertEquals(
        task.getValue().toString(), "containsIc(ticket.taskAssociation.taskId,taskTest)");

    SearchCondition assigneeCondition =
        SearchCondition.builder()
            .condition("and")
            .valueIn("[assigneeTest1, assigneeTest2]")
            .operation("=")
            .key("assignee")
            .build();

    BooleanBuilder assignee =
        TicketPredicateBuilder.buildPredicateFromSearchConditions(List.of(assigneeCondition));
    Assertions.assertEquals(
        assignee.getValue().toString(), "ticket.assignee in [assigneeTest1, assigneeTest2]");

    SearchCondition createdCondition =
        SearchCondition.builder()
            .condition("and")
            .value("01/01/24-04/01/24")
            .operation("=")
            .key("created")
            .build();

    BooleanBuilder created =
        TicketPredicateBuilder.buildPredicateFromSearchConditions(List.of(createdCondition));
    Assertions.assertEquals(
        created.getValue().toString(),
        "ticket.created between 2023-12-31T14:00:00Z and 2024-01-03T14:00:00Z");

    SearchCondition createdCondition2 =
        SearchCondition.builder()
            .condition("and")
            .value("01/01/24")
            .operation("=")
            .key("created")
            .build();

    BooleanBuilder created2 =
        TicketPredicateBuilder.buildPredicateFromSearchConditions(List.of(createdCondition2));
    Assertions.assertEquals(
        created2.getValue().toString(),
        "ticket.created between 2023-12-31T14:00:00Z and 2024-01-01T13:59:59.999Z");

    // all together
    BooleanBuilder together =
        TicketPredicateBuilder.buildPredicateFromSearchConditions(
            List.of(
                titleSearchCondition,
                commentSearchCondition,
                prioritySearchCondition,
                scheduleSearchCondition,
                iterationSearchCondition,
                stateSearchCondition,
                taskCondition,
                assigneeCondition,
                createdCondition));
    Assertions.assertEquals(
        together.getValue().toString(),
        "(containsIc(ticket.title,titleTest) || containsIc(any(ticket.comments).text,commentTest)) && containsIc(ticket.priorityBucket.name,priorityTest) && containsIc(any(ticket.additionalFieldValues).valueOf,scheduleTest) && containsIc(ticket.iteration.name,iterationTest) && containsIc(ticket.state.label,stateTest) && containsIc(ticket.taskAssociation.taskId,taskTest) && ticket.assignee in [assigneeTest1, assigneeTest2] && ticket.created between 2023-12-31T14:00:00Z and 2024-01-03T14:00:00Z");
  }
}
