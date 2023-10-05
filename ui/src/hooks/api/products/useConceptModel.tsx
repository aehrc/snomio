import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ConceptService from '../../../api/ConceptService';
import { ProductModel, ProductModelSummary } from '../../../types/concept';

export function useConceptModel(
  id: string | undefined,
  reloadStateElements: () => void,
  setProductModel: (data: ProductModelSummary) => void,
) {
  const { isLoading, data } = useQuery(
    [`concept-${id}`],
    () => {
      return ConceptService.getConceptModel(id);
    },
    { staleTime: 20 * (60 * 1000) },
  );

  useMemo(() => {
    if (data) {
      reloadStateElements();
      setProductModel(data);
    }
  }, [data]);

  return { isLoading, data };
}
