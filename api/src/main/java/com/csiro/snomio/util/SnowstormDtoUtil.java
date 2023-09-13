package com.csiro.snomio.util;

import au.csiro.snowstorm_client.model.SnowstormConceptMini;
import au.csiro.snowstorm_client.model.SnowstormConceptMiniComponent;
import au.csiro.snowstorm_client.model.SnowstormTermLangPojoComponent;
import java.util.LinkedHashMap;

public class SnowstormDtoUtil {

  /**
   * Convert a {@link SnowstormConceptMini} to a {@link SnowstormConceptMiniComponent}. Annoying
   * that this is necessary but these two DTOs are essentially the same but generated differently by
   * a quirk of the OpenAPI generated for Snowstorm.
   *
   * @param mini a {@link SnowstormConceptMini} to convert
   * @return {@link SnowstormConceptMiniComponent} with the same data as the input
   */
  public static SnowstormConceptMiniComponent fromMini(SnowstormConceptMini mini) {
    if (mini == null) return null;
    SnowstormConceptMiniComponent component = new SnowstormConceptMiniComponent();
    component.setConceptId(mini.getConceptId());
    component.setActive(mini.getActive());
    component.setDefinitionStatus(mini.getDefinitionStatus());
    component.setModuleId(mini.getModuleId());
    component.setEffectiveTime(mini.getEffectiveTime());
    component.setFsn(
        new SnowstormTermLangPojoComponent()
            .lang(mini.getFsn().getLang())
            .term(mini.getFsn().getTerm()));
    component.setPt(
        new SnowstormTermLangPojoComponent()
            .lang(mini.getPt().getLang())
            .term(mini.getPt().getTerm()));
    component.setDescendantCount(mini.getDescendantCount());
    component.isLeafInferred(mini.getIsLeafInferred());
    component.isLeafStated(mini.getIsLeafStated());
    component.setId(mini.getId());
    component.setDefinitionStatusId(mini.getDefinitionStatusId());
    component.setLeafInferred(fromMini(mini.getLeafInferred()));
    component.setLeafStated(fromMini(mini.getLeafStated()));
    component.setExtraFields(mini.getExtraFields());
    component.setIdAndFsnTerm(mini.getIdAndFsnTerm());
    return component;
  }

  /**
   * Convert a {@link SnowstormConceptMini} to a {@link SnowstormConceptMiniComponent}. Annoying
   * that this is necessary because of the odd return types from some of the generated web client.
   *
   * @param o a {@link LinkedHashMap} representing a {@link SnowstormConceptMiniComponent}
   * @return {@link SnowstormConceptMiniComponent} with the same data as the input
   */
  public static SnowstormConceptMiniComponent fromLinkedHashMap(Object o) {
    LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) o;
    SnowstormConceptMiniComponent component = new SnowstormConceptMiniComponent();
    component.setConceptId((String) map.get("conceptId"));
    component.setActive((Boolean) map.get("active"));
    component.setDefinitionStatus((String) map.get("definitionStatus"));
    component.setModuleId((String) map.get("moduleId"));
    component.setEffectiveTime((String) map.get("effectiveTime"));
    LinkedHashMap<String, String> fsn = (LinkedHashMap<String, String>) map.get("fsn");
    component.setFsn(
        new SnowstormTermLangPojoComponent().lang(fsn.get("lang")).term(fsn.get("term")));
    LinkedHashMap<String, String> pt = (LinkedHashMap<String, String>) map.get("pt");
    component.setPt(new SnowstormTermLangPojoComponent().lang(pt.get("lang")).term(pt.get("term")));
    component.id((String) map.get("id"));
    component.idAndFsnTerm((String) map.get("idAndFsnTerm"));
    return component;
  }
}
