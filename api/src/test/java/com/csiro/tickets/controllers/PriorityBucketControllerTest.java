package com.csiro.tickets.controllers;

import com.csiro.tickets.TicketTestBase;
import com.csiro.tickets.models.PriorityBucket;
import com.csiro.tickets.models.State;
import io.restassured.http.ContentType;
import org.junit.Assert;
import org.junit.jupiter.api.Test;

class PriorityBucketControllerTest extends TicketTestBase {

  @Test
  void getAllBuckets(){
    PriorityBucket[] allBuckets = withAuth()
        .contentType(ContentType.JSON)
        .when()
        .get(this.getSnomioLocation() + "/api/tickets/priorityBuckets")
        .then()
        .statusCode(200).extract().as(PriorityBucket[].class);

    Assert.assertEquals(allBuckets.length, 3);
  }
  @Test
  void createPriorityBucket(){
    PriorityBucket newPriorityBucket = PriorityBucket.builder()
        .name("Add to end")
        .description("Won't reorder list")
        .orderIndex(3)
        .build();

    PriorityBucket newBucket = withAuth()
        .contentType(ContentType.JSON)
        .when()
        .body(newPriorityBucket)
        .post(this.getSnomioLocation() + "/api/tickets/priorityBuckets")
        .then()
        .statusCode(200).extract().as(PriorityBucket.class);
    Integer order = newBucket.getOrderIndex();
    Assert.assertTrue(order.equals(3));

    PriorityBucket newPriorityBucketMiddle = PriorityBucket.builder()
        .name("Add to middle")
        .description("Will reorder list")
        .orderIndex(2)
        .build();

    PriorityBucket newBucketMiddle = withAuth()
        .contentType(ContentType.JSON)
        .when()
        .body(newPriorityBucketMiddle)
        .post(this.getSnomioLocation() + "/api/tickets/priorityBuckets")
        .then()
        .statusCode(200).extract().as(PriorityBucket.class);
    order = newBucketMiddle.getOrderIndex();
    Assert.assertTrue(order.equals(2));

    PriorityBucket[] allBuckets = withAuth()
        .contentType(ContentType.JSON)
        .when()
        .get(this.getSnomioLocation() + "/api/tickets/priorityBuckets")
        .then()
        .statusCode(200).extract().as(PriorityBucket[].class);

    PriorityBucket middleBucketReturned = allBuckets[2];
    Assert.assertEquals(middleBucketReturned.getDescription(), "Will reorder list");
    PriorityBucket finalBucketReturned = allBuckets[4];
    Assert.assertEquals(finalBucketReturned.getDescription(), "Won't reorder list");
  }
}
