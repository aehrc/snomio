import axios from 'axios';
import {
  Concept,
  ConceptResponse,
  ConceptSearchResponse,
} from '../types/concept.ts';
import { mapToConcepts } from '../utils/helpers/conceptUtils.ts';

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
  async getConcept(id: string): Promise<Concept> {
    const response = await axios.get(`/snowstorm/MAIN/concepts/${id}`);
    if (response.status != 200) {
      this.handleErrors();
    }
    const concept = response.data as Concept;
    return concept;
  },
};

export default ConceptService;
