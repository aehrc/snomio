import { useEffect, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import useConceptStore from '../../stores/ConceptStore.ts';
import ConceptService from '../../api/ConceptService.ts';
import { defaultUnitID } from '../../utils/helpers/conceptUtils.ts';
import { Concept } from '../../types/concept.ts';
import { errorHandler } from '../../types/ErrorHandler.ts';

export default function useInitializeConcepts(branch: string | undefined) {
  if (branch === undefined) {
    branch = ''; //TODO handle error
  }

  const { defaultUnitIsLoading } = useInitializeDefaultUnit(branch);

  return {
    conceptsLoading: defaultUnitIsLoading,
  };
}

export function useInitializeDefaultUnit(branch: string) {
  const { setDefaultUnit } = useConceptStore();
  const { isLoading, data } = useQuery(
    ['defaultUnit'],
    () => ConceptService.searchConceptByIds([defaultUnitID], branch),
    { staleTime: Infinity },
  );
  useMemo(() => {
    if (data) {
      setDefaultUnit(data[0]);
    }
  }, [data, setDefaultUnit]);

  const defaultUnitIsLoading: boolean = isLoading;
  const defaultUnit = data && data?.length > 0 ? data[0] : undefined;

  return { defaultUnitIsLoading, defaultUnit };
}

export function useSearchConceptsByEcl(
  searchString: string,
  ecl: string | undefined,
  branch: string,
  showDefaultOptions: boolean,
  concept?: Concept,
) {
  const { isLoading, data, error } = useQuery(
    [`search-products-${ecl}-${searchString}-${showDefaultOptions}`],
    () => {
      if (concept && concept.conceptId) {
        return ConceptService.searchConceptByIds([concept.conceptId], branch);
      }
      if (showDefaultOptions) {
        return ConceptService.searchConceptByEcl(
          encodeURIComponent(ecl as string),
          branch,
        );
      }

      return ConceptService.searchConcept(
        searchString,
        branch,
        encodeURIComponent(ecl as string),
      );
    },
    {
      staleTime: 20 * (60 * 1000),
      enabled: isValidEclSearch(searchString, ecl, showDefaultOptions),
    },
  );
  useEffect(() => {
    if (error) {
      errorHandler(error, 'Search Failed');
    }
  }, [error]);

  return { isLoading, data };
}
function isValidEclSearch(
  searchString: string,
  ecl: string | undefined,
  showDefaultOptions: boolean,
) {
  if (!ecl) {
    return false;
  }
  return (
    showDefaultOptions ||
    (searchString !== undefined && searchString.length > 2)
  );
}
