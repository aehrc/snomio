import { create } from 'zustand';
import { Concept, Product, ProductModelSummary } from '../types/concept.ts';
import conceptService from '../api/ConceptService.ts';
import { Ticket } from '../types/tickets/ticket.ts';

interface ConceptStoreConfig {
  fetching: boolean;
  fetchProductModel: (
    conceptId: string | undefined,
  ) => Promise<ProductModelSummary | undefined | null>;
  activeProduct: Concept | null;
  setActiveProduct: (product: Concept | null) => void;
}

const useConceptStore = create<ConceptStoreConfig>()(set => ({
  fetching: false,
  activeProduct: null,
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
}));

export default useConceptStore;
