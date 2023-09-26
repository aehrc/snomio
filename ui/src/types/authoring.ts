import { DefinitionStatus, Term } from './concept.ts';

export interface SnowstormConceptMiniComponent {
  conceptId: string;
  active: boolean;
  definitionStatus: DefinitionStatus;
  moduleId: string;
  effectiveTime: string | null;
  fsn: Term;
  pt: Term;
  descendantCount: string | null;
  isLeafInferred: boolean | null;
  isLeafStated: any;
  id: string;
  definitionStatusId: any;
  leafInferred: any;
  leafStated: any;
  extraFields: any;
  idAndFsnTerm: string | null;
}
export interface ExternalIdentifier {
  identifierScheme: string;
  identifierValue: string;
}
export interface Quantity {
  value: number;
  unit: SnowstormConceptMiniComponent;
}
export interface MedicationProductQuantity {
  value: number;
  unit: SnowstormConceptMiniComponent;
  productDetails: MedicationProductDetails;
}
export interface MedicationPackageQuantity {
  value: number;
  unit: MedicationPackageDetails;
  packageDetails: MedicationPackageDetails;
}
export interface ProductDetails {
  productName: SnowstormConceptMiniComponent;
  deviceType: SnowstormConceptMiniComponent;
  otherIdentifyingInformation: string;
}
export interface Ingredient {
  activeIngredient: SnowstormConceptMiniComponent;
  preciseIngredient: SnowstormConceptMiniComponent;
  basisOfStrengthSubstance: SnowstormConceptMiniComponent;
  totalQuantity: Quantity;
  concentrationStrength: Quantity;
}
export interface MedicationProductDetails {
  productName: SnowstormConceptMiniComponent;
  genericForm: SnowstormConceptMiniComponent;
  specificForm: SnowstormConceptMiniComponent;
  quantity: Quantity;
  containerType: SnowstormConceptMiniComponent;
  activeIngredients: Ingredient[];
}

export interface MedicationPackageDetails {
  productName: SnowstormConceptMiniComponent;
  containerType: SnowstormConceptMiniComponent;
  externalIdentifiers: ExternalIdentifier[];
  containedProducts: MedicationProductQuantity[];
  containedPackages: MedicationPackageQuantity[];
}
