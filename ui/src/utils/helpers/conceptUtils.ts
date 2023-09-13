import {Concept, ConceptSearchItem, Edge, Product} from '../../types/concept.ts';

function isNumeric(value: string) {
  return /^\d+$/.test(value);
}

export function mapToConcepts(searchItem: ConceptSearchItem[]): Concept[] {
  const conceptList = searchItem.map(function (item) {
    const referencedComponent = item.referencedComponent;
    return referencedComponent;
  });
  return conceptList;
}

export function isArtgId(id: string) {
  if (id == null) {
    return false;
  }
  id = '' + id;
  return (
    isNumeric(id) &&
    Number(id) > 0 &&
    id.length >= 4 &&
    id.length <= 15 &&
    id.match(/\./) == null
  );
}

export function isSctId(id: string) {
  if (id == null) {
    return false;
  }
  id = '' + id;
  return isNumeric(id) && Number(id) > 0 && id.length >= 6 && id.length <= 18;
  // && Enums.Partition.fromCode(Common.getPartition(id)) != null //TODO need to expand this
  // && Verhoeff.isValid(id);
}
export function filterByLabel(productLabels: Product[], label: string) {
  if (!productLabels) {
    return [];
  }
  return productLabels.filter(productLabel => productLabel.label === label);
}
export function isFsnToggleOn(): boolean {
  return localStorage.getItem('fsn_toggle') === 'true' ? true : false;
}

export function mapToEdges(edges:Edge[]): string[][] {
  const stringArray = edges.map(function (item) {
    const values:string[] = Object.values(item) as string [];
    return values;
  });
  return stringArray;
}
export function getColorForModel(model:string):string{
  if(model === 'TP'){
    return "#66CDAA";
  }else if(model === 'TPUU'){
    return "#8FBC8F";
  }else if(model === 'TPP'){
    return "#20B2AA";
  }else if(model === 'MP'){
    return "#C0C0C0";
  }else if(model === 'MPUU'){
    return "#696969";
  }else if(model === 'MPP'){
    return "#808080";
  }else if(model === 'CTPP'){
    return "#6495ED";
  }
  return "#FFFFFF";
}
export function mapToNodes(nodes:Product[]): any[] {
  const nodeArray = nodes.map(function (item) {
    const value = {id: item.concept.conceptId,
      marker: {
        //radius: 60
        symbol:'square',
        radius: 80
      },
      color: getColorForModel(item.label),name:item.concept.fsn.term,key:item.label}
    return value;
  });
  return nodeArray;
}
