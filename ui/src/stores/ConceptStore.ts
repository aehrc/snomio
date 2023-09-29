import { create } from 'zustand';
import { Concept, Product, ProductModelSummary } from '../types/concept.ts';
import conceptService from '../api/ConceptService.ts';
import { filterByActiveConcepts } from '../utils/helpers/conceptUtils.ts';

interface ConceptStoreConfig {
  fetching: boolean;
  fetchProductModel: (
    conceptId: string | undefined,
  ) => Promise<ProductModelSummary | undefined | null>;
  activeProduct: Concept | null;
  setActiveProduct: (product: Concept | null) => void;
  units: Concept[];
  containerTypes: Concept[];
  ingredients: Concept[];
  doseForms: Concept[];
  brandProducts: Concept[];
  fetchUnits: () => Promise<void>;
  fetchContainerTypes: () => Promise<void>;
  fetchIngredients: () => Promise<void>;
  fetchDoseForms: () => Promise<void>;
  fetchBrandProducts: () => Promise<void>;
}

const useConceptStore = create<ConceptStoreConfig>()(set => ({
  fetching: false,
  activeProduct: null,
  units: [],
  containerTypes: [],
  ingredients: [],
  doseForms: [],
  brandProducts: [],
  setActiveProduct: product => {
    set({ activeProduct: product });
  },
  fetchProductModel: async (conceptId: string | undefined) => {
    if (conceptId === undefined) {
      return null;
    }
    set(() => ({
      fetching: true,
    }));

    try {
      const tempProductModel = await conceptService.getConceptModel(conceptId);
      //set({ productModel: tempProductModel });
      return tempProductModel;
    } catch (error) {
      console.log(error);
    }
  },
  fetchUnits: async () => {
    set(() => ({
      fetching: true,
    }));

    try {
      const tempUnits = await conceptService.searchConceptByEcl('%3C767524001');
      const uniqueConcepts = filterByActiveConcepts(tempUnits);
      set({ units: [...uniqueConcepts] });
      set({ fetching: false });
    } catch (error) {
      console.log(error);
    }
  },
  fetchContainerTypes: async () => {
    set(() => ({
      fetching: true,
    }));

    try {
      const tempConcepts = await conceptService.searchConceptByEcl(
        '%3C706437002',
      );
      const uniqueConcepts = filterByActiveConcepts(tempConcepts);
      set({ containerTypes: [...uniqueConcepts] });
      set({ fetching: false });
    } catch (error) {
      console.log(error);
    }
  },
  fetchIngredients: async () => {
    set(() => ({
      fetching: true,
    }));

    try {
      const tempConcepts = await conceptService.searchConceptByEcl(
        '%3C105590001',
      );
      const uniqueConcepts = filterByActiveConcepts(tempConcepts);
      set({ ingredients: [...uniqueConcepts] });
      set({ fetching: false });
    } catch (error) {
      console.log(error);
    }
  },
  fetchDoseForms: async () => {
    set(() => ({
      fetching: true,
    }));

    try {
      const tempConcepts = await conceptService.searchConceptByEcl(
        '%3C736542009',
      );
      const uniqueConcepts = filterByActiveConcepts(tempConcepts);
      set({ doseForms: [...uniqueConcepts] });
      set({ fetching: false });
    } catch (error) {
      console.log(error);
    }
  },
  fetchBrandProducts: async () => {
    set(() => ({
      fetching: true,
    }));

    try {
      const tempConcepts = await conceptService.searchConceptByEcl(
        '%3C774167006',
      );
      const uniqueConcepts = filterByActiveConcepts(tempConcepts);
      set({ brandProducts: [...uniqueConcepts] });
      set({ fetching: false });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useConceptStore;
