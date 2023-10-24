import { Autocomplete, TextField } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { Concept } from '../../../types/concept.ts';
import useDebounce from '../../../hooks/useDebounce.tsx';

import { useSearchConcepts } from '../../../hooks/api/useInitializeConcepts.tsx';
import { ConceptSearchType } from '../../../types/conceptSearch.ts';
interface ProductAutocompleteNewProps {
  onChange: (value: Concept|null) => void;
  value:Concept | undefined;
  optionValues:Concept[];
  searchType:ConceptSearchType;
}
const ProductAutocompleteNew: FC<ProductAutocompleteNewProps> = ({
  onChange,value,optionValues,searchType,

  ...props
}) => {

  const [inputValue, setInputValue] = useState('');
  const debouncedSearch = useDebounce(inputValue, 1000);
  const [options, setOptions] = useState<Concept[]>(
    optionValues ? optionValues : [],
  );
  const { isLoading, data } = useSearchConcepts(
    debouncedSearch,
    searchType
  );
  const [open, setOpen] = useState(false);
  useEffect(() => {
    mapDataToOptions();
  }, [data]);

  const mapDataToOptions = () => {
    if (data) {
      setOptions(data);
    }else if(optionValues){
     setOptions(optionValues)
    }
  };
  return (

      <Autocomplete
          loading={isLoading}
                  options={options}
                  getOptionLabel={option => option.pt.term}
                  renderInput={params => (
                      <TextField {...params} />
                  )}
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

                  onChange={(e, data) => onChange(data)}
                  {...props}
                  value={value || null}
              />


  );

};
export default ProductAutocompleteNew;
