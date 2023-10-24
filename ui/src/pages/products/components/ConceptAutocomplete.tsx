import { Autocomplete, TextField } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { Concept } from '../../../types/concept.ts';
import useDebounce from '../../../hooks/useDebounce.tsx';

import { useSearchConcepts } from '../../../hooks/api/useInitializeConcepts.tsx';
import { ConceptSearchType } from '../../../types/conceptSearch.ts';
import {MedicationPackageDetails} from "../../../types/authoring.ts";
import {Control, Controller} from "react-hook-form";
interface ProductAutocompleteNewProps {
  control:Control<MedicationPackageDetails>
  optionValues?:Concept[];
  searchType:ConceptSearchType;
  name:string

}
const ProductAutocompleteNew: FC<ProductAutocompleteNewProps> = ({
                                                                   control,optionValues,searchType,name,

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
    console.log(options)
  };
  return (
      <Controller
          name="containerType"
          control={control}
          render={({ field:{onChange,value}, ...props }) => (
              <Autocomplete
                  options={options}
                  getOptionLabel={option => option.pt.term}
                  renderInput={params => (
                      <TextField {...params} />
                  )}

                  onChange={(e, data) => onChange(data)}
                  {...props}
                  value={value || null}
              />
          )}
      />

  );

};
export default ProductAutocompleteNew;
