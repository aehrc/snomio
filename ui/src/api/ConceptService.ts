import axios from 'axios';
import { Concept, ConceptResponse } from '../types/concept.ts';

const ConceptService = {
  // TODO more useful way to handle errors? retry? something about tasks service being down etc.

  handleErrors: () => {
    throw new Error('invalid concept response');
  },

  async searchConcept(str: string): Promise<Concept[]> {
    let concepts: Concept[] = [];
    const response = await axios.get(
      `/snowstorm/snomed-ct/MAIN/concepts?term=${str}`,
      //`/snowstorm/snomed-ct/MAIN/concepts?term=${str}&ecl=%5E%20929360051000036108`  //need to enable once data is avaialble
    );
    if (response.status != 200) {
      this.handleErrors();
    }
    const conceptResponse = response.data as ConceptResponse;
    concepts = conceptResponse.items;
    return concepts;
  },
  async searchConceptById(id: string): Promise<Concept[]> {
    const response = await axios.get(
      `/snowstorm/snomed-ct/MAIN/concepts/${id}`,
    );
    if (response.status != 200) {
      this.handleErrors();
    }
    const concept = response.data as Concept;
    return [concept];
  },
};

export default ConceptService;
