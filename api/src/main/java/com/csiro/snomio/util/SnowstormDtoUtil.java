package com.csiro.snomio.util;

import static com.csiro.snomio.util.AmtConstants.SCT_AU_MODULE;
import static com.csiro.snomio.util.SnomedConstants.ENTIRE_TERM_CASE_SENSITIVE;
import static com.csiro.snomio.util.SnomedConstants.SOME_MODIFIER;
import static com.csiro.snomio.util.SnomedConstants.STATED_RELATIONSHIP;
import static com.csiro.snomio.util.SnomedConstants.STATED_RELATIONSHUIP_CHARACTRISTIC_TYPE;

import au.csiro.snowstorm_client.model.SnowstormConcept;
import au.csiro.snowstorm_client.model.SnowstormConceptMini;
import au.csiro.snowstorm_client.model.SnowstormConceptView;
import au.csiro.snowstorm_client.model.SnowstormConcreteValue;
import au.csiro.snowstorm_client.model.SnowstormConcreteValue.DataTypeEnum;
import au.csiro.snowstorm_client.model.SnowstormDescription;
import au.csiro.snowstorm_client.model.SnowstormRelationship;
import au.csiro.snowstorm_client.model.SnowstormTermLangPojo;
import com.csiro.snomio.exception.AtomicDataExtractionProblem;
import com.csiro.snomio.exception.ResourceNotFoundProblem;
import com.csiro.snomio.product.details.Quantity;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.java.Log;

@Log
public class SnowstormDtoUtil {

  private SnowstormDtoUtil() {}

  /**
   * Convert a {@link SnowstormConceptMini} to a {@link SnowstormConceptMini}. Annoying that this is
   * necessary because of the odd return types from some of the generated web client.
   *
   * @param o a {@link LinkedHashMap} representing a {@link SnowstormConceptMini}
   * @return {@link SnowstormConceptMini} with the same data as the input
   */
  public static SnowstormConceptMini fromLinkedHashMap(Object o) {
    LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) o;
    SnowstormConceptMini component = new SnowstormConceptMini();
    component.setConceptId((String) map.get("conceptId"));
    component.setActive((Boolean) map.get("active"));
    component.setDefinitionStatus((String) map.get("definitionStatus"));
    component.setModuleId((String) map.get("moduleId"));
    component.setEffectiveTime((String) map.get("effectiveTime"));
    LinkedHashMap<String, String> fsn = (LinkedHashMap<String, String>) map.get("fsn");
    component.setFsn(new SnowstormTermLangPojo().lang(fsn.get("lang")).term(fsn.get("term")));
    LinkedHashMap<String, String> pt = (LinkedHashMap<String, String>) map.get("pt");
    component.setPt(new SnowstormTermLangPojo().lang(pt.get("lang")).term(pt.get("term")));
    component.id((String) map.get("id"));
    component.idAndFsnTerm((String) map.get("idAndFsnTerm"));
    return component;
  }

  public static Set<SnowstormRelationship> filterActiveStatedRelationshipByType(
      Set<SnowstormRelationship> relationships, String type) {
    return relationships.stream()
        .filter(r -> r.getType().getConceptId().equals(type))
        .filter(SnowstormRelationship::getActive)
        .filter(r -> r.getCharacteristicType().equals(STATED_RELATIONSHIP.getValue()))
        .collect(Collectors.toSet());
  }

  public static Set<SnowstormRelationship> getRelationshipsFromAxioms(SnowstormConcept concept) {
    if (concept.getClassAxioms().size() != 1) {
      throw new AtomicDataExtractionProblem(
          "Expected 1 class axiom but found " + concept.getClassAxioms().size(),
          concept.getConceptId());
    }
    return concept.getClassAxioms().iterator().next().getRelationships();
  }

  public static boolean relationshipOfTypeExists(
      Set<SnowstormRelationship> subRoleGroup, String type) {
    return !filterActiveStatedRelationshipByType(subRoleGroup, type).isEmpty();
  }

  public static String getSingleActiveConcreteValue(
      Set<SnowstormRelationship> relationships, String type) {
    return findSingleRelationshipsForActiveInferredByType(relationships, type)
        .iterator()
        .next()
        .getConcreteValue()
        .getValue();
  }

  public static BigDecimal getSingleActiveBigDecimal(
      Set<SnowstormRelationship> relationships, String type) {
    return new BigDecimal(getSingleActiveConcreteValue(relationships, type));
  }

  public static BigDecimal getSingleOptionalActiveBigDecimal(
      Set<SnowstormRelationship> relationships, String type) {
    if (relationshipOfTypeExists(relationships, type)) {
      return getSingleActiveBigDecimal(relationships, type);
    }
    return null;
  }

  public static Set<SnowstormRelationship> findSingleRelationshipsForActiveInferredByType(
      Set<SnowstormRelationship> relationships, String type) {
    Set<SnowstormRelationship> filteredRelationships =
        filterActiveStatedRelationshipByType(relationships, type);

    if (filteredRelationships.size() != 1) {
      throw new AtomicDataExtractionProblem(
          "Expected 1 " + type + " relationship but found " + filteredRelationships.size(),
          relationships.iterator().next().getSourceId());
    }

    return filteredRelationships;
  }

  public static Set<SnowstormRelationship> getActiveRelationshipsInRoleGroup(
      SnowstormRelationship subpacksRelationship, Set<SnowstormRelationship> relationships) {
    return relationships.stream()
        .filter(r -> r.getGroupId().equals(subpacksRelationship.getGroupId()))
        .filter(SnowstormRelationship::getActive)
        .filter(r -> r.getCharacteristicType().equals("STATED_RELATIONSHIP"))
        .collect(Collectors.toSet());
  }

  public static Set<SnowstormRelationship> getActiveRelationshipsOfType(
      Set<SnowstormRelationship> relationships, String type) {
    return filterActiveStatedRelationshipByType(relationships, type);
  }

  public static SnowstormConceptMini getSingleOptionalActiveTarget(
      Set<SnowstormRelationship> relationships, String type) {
    if (relationshipOfTypeExists(relationships, type)) {
      return getSingleActiveTarget(relationships, type);
    }
    return null;
  }

  public static SnowstormConceptMini getSingleActiveTarget(
      Set<SnowstormRelationship> relationships, String type) {
    SnowstormConceptMini target =
        findSingleRelationshipsForActiveInferredByType(relationships, type)
            .iterator()
            .next()
            .getTarget();

    // need to fix the id and fsn because it isn't set properly for some reason
    target.setIdAndFsnTerm(target.getConceptId() + " | " + target.getFsn().getTerm() + " |");
    return target;
  }

  public static SnowstormRelationship getSnowstormRelationship(
      String typeId, String destinationId, int group) {
    SnowstormRelationship relationship = createBaseSnowstormRelationship(typeId, group);
    relationship.setConcrete(false);
    relationship.setDestinationId(destinationId);
    return relationship;
  }

  public static SnowstormRelationship getSnowstormDatatypeComponent(
      String typeId, String value, DataTypeEnum type, int group) {
    SnowstormRelationship relationship = createBaseSnowstormRelationship(typeId, group);
    relationship.setConcrete(true);
    relationship.setConcreteValue(new SnowstormConcreteValue().value(value).dataType(type));
    return relationship;
  }

  private static SnowstormRelationship createBaseSnowstormRelationship(String typeId, int group) {
    SnowstormRelationship relationship = new SnowstormRelationship();
    relationship.setActive(true);
    relationship.setModuleId(SCT_AU_MODULE.getValue());
    relationship.setGrouped(group > 0);
    relationship.setGroupId(group);
    relationship.setTypeId(typeId);
    relationship.setModifier(SOME_MODIFIER.getValue());
    relationship.setCharacteristicType(STATED_RELATIONSHUIP_CHARACTRISTIC_TYPE.getValue());
    return relationship;
  }

  public static SnowstormConceptMini toSnowstormConceptMini(SnowstormConceptView c) {
    return new SnowstormConceptMini()
        .fsn(c.getFsn())
        .pt(c.getPt())
        .conceptId(c.getConceptId())
        .active(c.getActive())
        .definitionStatus(c.getDefinitionStatusId())
        .definitionStatusId(c.getDefinitionStatusId())
        .effectiveTime(c.getEffectiveTime())
        .moduleId(c.getModuleId());
  }

  public static void addDatatypeIfNotNull(
      Set<SnowstormRelationship> relationships,
      String value,
      String type,
      DataTypeEnum datatype,
      int i) {
    if (value != null) {
      relationships.add(getSnowstormDatatypeComponent(type, value, datatype, i));
    }
  }

  public static void addQuantityIfNotNull(
      Quantity quantity,
      Set<SnowstormRelationship> relationships,
      String valueTypeId,
      String unitTypeId,
      DataTypeEnum datatype,
      int group) {
    if (quantity != null) {
      relationships.add(
          getSnowstormDatatypeComponent(
              valueTypeId, quantity.getValue().toString(), datatype, group));
      relationships.add(
          getSnowstormRelationship(unitTypeId, quantity.getUnit().getConceptId(), group));
    }
  }

  public static void addRelationshipIfNotNull(
      Set<SnowstormRelationship> relationships,
      SnowstormConceptMini property,
      String typeId,
      int group) {
    if (property != null) {
      relationships.add(getSnowstormRelationship(typeId, property.getConceptId(), group));
    }
  }

  public static void addDescription(SnowstormConceptView concept, String term, String type) {
    Set<SnowstormDescription> descriptions = concept.getDescriptions();

    if (descriptions == null) {
      descriptions = new HashSet<>();
    }

    descriptions.add(
        new SnowstormDescription()
            .active(true)
            .lang("en")
            .term(term)
            .type(type)
            .caseSignificance(ENTIRE_TERM_CASE_SENSITIVE.getValue())
            .moduleId(SCT_AU_MODULE.getValue())
            .acceptabilityMap(
                Map.of(
                    AmtConstants.ADRS.getValue(),
                    SnomedConstants.PREFERRED.getValue(),
                    AmtConstants.GB_LANG_REFSET_ID.getValue(),
                    SnomedConstants.PREFERRED.getValue(),
                    AmtConstants.US_LANG_REFSET_ID.getValue(),
                    SnomedConstants.PREFERRED.getValue())));

    concept.setDescriptions(descriptions);
  }

  public static String getFsnTerm(@NotNull SnowstormConceptMini snowstormConceptMini) {
    if (snowstormConceptMini.getFsn() == null) {
      throw new ResourceNotFoundProblem("FSN is null for " + snowstormConceptMini.getConceptId());
    }
    return snowstormConceptMini.getFsn().getTerm();
  }
}
