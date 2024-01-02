import { Concept } from './concept.ts';

export interface FieldBindings {
  bindingsMap: Map<string, any>;
}
export interface FieldEclGenerated {
  actualEcl: string;
  generatedEcl: string;
  relatedFields: RelatedField[];
}
export interface RelatedField {
  relatedTo: string | undefined;
  relatedValue: Concept | undefined;
}
