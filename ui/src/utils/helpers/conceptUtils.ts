import {
  Concept,
  ConceptSearchItem,
  Edge,
  Product,
} from '../../types/concept.ts';

import {
  Ingredient,
  MedicationPackageQuantity,
  MedicationProductQuantity,
  ProductType,
} from '../../types/product.ts';
import { createFilterOptions } from '@mui/material';

function isNumeric(value: string) {
  return /^\d+$/.test(value);
}

export function mapToConceptIds(searchItem: ConceptSearchItem[]): string[] {
  const conceptList = searchItem.map(function (item) {
    const referencedComponentId = item.referencedComponent.conceptId as string;
    return referencedComponentId;
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

export function findRelations(
  edges: Edge[],
  nodeA: string,
  nodeB: string,
): Edge[] {
  const related = edges.filter(function (el) {
    return (
      (el.source === nodeA && el.target === nodeB) ||
      (el.source === nodeB && el.target === nodeA)
    );
  });
  return related;
}

export function findProductUsingId(conceptId: string, nodes: Product[]) {
  const product = nodes.find(function (p) {
    return p.conceptId === conceptId;
  });
  return product;
}
export function findConceptUsingPT(pt: string, concepts: Concept[]) {
  if (!pt || pt === '' || concepts.length === 0) {
    return null;
  }
  const concept = concepts.find(function (c) {
    return c.pt.term.toUpperCase() === pt.toUpperCase();
  });
  return concept ? concept : null;
}

export function containsNewConcept(nodes: Product[]) {
  const product = nodes.find(function (p) {
    return p.newConcept;
  });
  return product !== undefined;
}
export function getDefaultUnit(units: Concept[]) {
  return units.find(unit => unit.pt.term === 'Unit of presentation');
}

export const isValidConceptName = (concept: Concept) => {
  return concept && concept.pt.term !== '' && concept.pt.term !== null;
};

export const defaultIngredient = (defaultUnit: Concept) => {
  const ingredient: Ingredient = {
    activeIngredient: {
      pt: { term: '' },
    },
    basisOfStrengthSubstance: { pt: { term: '' } },
    // concentrationStrength:{value:0,unit:defaultUnit},
    totalQuantity: { value: 0, unit: defaultUnit },
  };
  return ingredient;
};
export const defaultProduct = (defaultUnit: Concept) => {
  const productQuantity: MedicationProductQuantity = {
    productDetails: {
      activeIngredients: [defaultIngredient(defaultUnit)],
      productName: { pt: { term: '' } },
      genericForm: {
        pt: { term: '' },
      },
    },
    value: 1,
    unit: defaultUnit,
  };
  return productQuantity;
};
export const defaultPackage = (defaultUnit: Concept) => {
  const medicationPackageQty: MedicationPackageQuantity = {
    unit: defaultUnit,
    value: 1,
    packageDetails: {
      productName: { pt: { term: '' } },
      containerType: { pt: { term: '' } },

      externalIdentifiers: [],
      containedPackages: [],
      containedProducts: [defaultProduct(defaultUnit)],
    },
  };
  return medicationPackageQty;
};

export const isDeviceType = (productType: ProductType) => {
  return productType === ProductType.device;
};
export const defaultUnitID = '732935002';

export const filterKeypress = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
};

export function isEmptyObjectByValue(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return true;
  }
  return Object.values(obj as object).every(value => {
    if (value === null || value === undefined || value === false) {
      return true;
    }
    return false;
  });
}
export const filterOptionsForConceptAutocomplete = createFilterOptions({
  matchFrom: 'any',
  stringify: (option: Concept) => option.pt.term + (option.fsn?.term as string),
});
export function filterByActiveConcepts(concepts: Concept[]) {
  const activeConcepts = concepts.filter(function (concept) {
    return concept.active;
  });
  return activeConcepts;
}
