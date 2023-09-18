import {Concept, ConceptSearchItem, Edge, Product} from '../../types/concept.ts';
import {JiraUser} from "../../types/JiraUserResponse.ts";

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

export function findRelations(edges:Edge[], nodeA:string, nodeB:string): Edge[] {
  const related= edges.filter(e => (Number(e.source) === Number(nodeA) && Number(e.target) === Number(nodeB)) || (Number(e.source) === Number(nodeB) && Number(e.target) === Number(nodeA)));
  // console.log(nodeA +","+nodeB);
  // console.log(related);
  if(related.length >1){
    console.log(related);
  }
  return related;
}
export function findProductUsingId(conceptId:string, nodes:Product[]) {
  const product = nodes.find(function (p) {
    return Number(p.concept.conceptId) === Number(conceptId);
  });
  return product;
}


