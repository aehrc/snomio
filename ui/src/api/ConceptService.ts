import axios from 'axios';
import {
  Concept,
  ConceptResponse,
  ConceptSearchResponse,
  ProductModelSummary,
} from '../types/concept.ts';
import { mapToConcepts } from '../utils/helpers/conceptUtils.ts';
import { MedicationPackageDetails } from '../types/authoring.ts';

const ConceptService = {
  // TODO more useful way to handle errors? retry? something about tasks service being down etc.

  handleErrors: () => {
    throw new Error('invalid concept response');
  },

  async searchConcept(str: string): Promise<Concept[]> {
    let concepts: Concept[] = [];
    const response = await axios.get(
      // `/snowstorm/MAIN/concepts?term=${str}`,
      `/snowstorm/MAIN/concepts?term=${str}&ecl=%5E%20929360051000036108`,
    );
    if (response.status != 200) {
      this.handleErrors();
    }
    const conceptResponse = response.data as ConceptResponse;
    concepts = conceptResponse.items;
    return concepts;
  },
  async searchConceptById(id: string): Promise<Concept> {
    const response = await axios.get(`/snowstorm/MAIN/concepts/${id}`);
    if (response.status != 200) {
      this.handleErrors();
    }
    const concept = response.data as Concept;
    return concept;
  },
  async searchConceptByArtgId(id: string): Promise<Concept[]> {
    const searchBody = {
      additionalFields: {
        schemeValue: id, //need to change to schemeValue
      },
    };
    const response = await axios.post(
      `/snowstorm/MAIN/members/search`,
      searchBody,
    );
    if (response.status != 200) {
      this.handleErrors();
    }
    const conceptSearchResponse = response.data as ConceptSearchResponse;
    return mapToConcepts(conceptSearchResponse.items);
  },
  async getConceptModel(id: string): Promise<ProductModelSummary> {
    const response = await axios.get(`/api/branch/product-model/${id}`);
    if (response.status != 200) {
      this.handleErrors();
    }
    const productModel = response.data as ProductModelSummary;
    return productModel;
  },
  async fetchMedication(id: string): Promise<MedicationPackageDetails> {
    const response = await axios.get(`/api/branch/medications/${id}`);
    if (response.status != 200) {
      this.handleErrors();
    }
    const medicationPackageDetails = response.data as MedicationPackageDetails;
    return medicationPackageDetails;
  },
  async fetchDevice(id: string): Promise<ProductModelSummary> {
    const response = await axios.get(`/api/branch/devices/${id}`);
    if (response.status != 200) {
      this.handleErrors();
    }
    const productModel = response.data as ProductModelSummary;
    return productModel;
  },
};

export default ConceptService;
