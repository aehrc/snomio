import { Autocomplete, TextField } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { Concept } from '../../../types/concept.ts';
import useDebounce from '../../../hooks/useDebounce.tsx';

import { useSearchConcepts } from '../../../hooks/api/useInitializeConcepts.tsx';
import { ConceptSearchType } from '../../../types/conceptSearch.ts';
import { Control, Controller } from 'react-hook-form';
import { filterOptionsForConceptAutocomplete } from '../../../utils/helpers/conceptUtils.ts';
interface ProductAutoCompleteParentProps {
  optionValues: Concept[];
  searchType: ConceptSearchType;
  setval: (val: Concept) => void;
  // eslint-disable-next-line
  control: Control<any>;
  name: string;
  branch: string;
}
const ProductAutoCompleteParent: FC<ProductAutoCompleteParentProps> = ({
  optionValues,
  searchType,
  setval,
  control,
  name,
  branch,
}) => {
  const [inputValue, setInputValue] = useState('');
  const debouncedSearch = useDebounce(inputValue, 1000);
  const [options, setOptions] = useState<Concept[]>(
    optionValues ? optionValues : [],
  );
  const { isLoading, data } = useSearchConcepts(
    debouncedSearch,
    searchType,
    branch,
  );
  const [open, setOpen] = useState(false);
  useEffect(() => {
    mapDataToOptions();
  }, [data]);

  const mapDataToOptions = () => {
    if (data) {
      setOptions(data);
    } else if (optionValues) {
      setOptions(optionValues);
    }
  };
  return (
    <Controller
      name={name as 'containedProducts.0.productDetails.genericForm'}
      control={control}
      render={({ field: { onChange, value }, ...props }) => (
        <Autocomplete
          loading={isLoading}
          options={options}
          getOptionLabel={option => option.pt.term}
          filterOptions={filterOptionsForConceptAutocomplete}
          renderInput={params => <TextField {...params} />}
          onOpen={() => {
            if (inputValue) {
              setOpen(true);
            }
          }}
          onInputChange={(e, value) => {
            setInputValue(value);
            if (!value) {
              setOpen(false);
            }
          }}
          inputValue={inputValue}
          onChange={(e, data) => {
            onChange(data);
            setval(data as Concept);
          }}
          {...props}
          value={(value as Concept) || null}
        />
      )}
    />
  );
};
export default ProductAutoCompleteParent;