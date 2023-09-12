export interface ConceptResponse {
  items: Concept[];
}

export enum DefinitionStatus {
  Primitive = 'PRIMITIVE',
  FullyDefined = 'FULLY_DEFINED',
}
export interface Concept {
  conceptId: string;
  definitionStatus?: DefinitionStatus;
  moduleId?: string;
  active?: boolean;
  pt: Term;
  fsn: Term;
  idAndFsnTerm?: string;
}
export interface Term {
  term: string;
  lang?: string;
}

export interface ConceptSearchResponse {
  items: ConceptSearchItem[];
}
export interface ConceptSearchItem {
  referencedComponent: Concept;
}
export interface ProductModel {
  nodes: Product[];
}
export interface Product {
  concept: Concept;
  label: string;
}
