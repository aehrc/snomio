import { Autocomplete, TextField } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { Concept } from '../../../types/concept.ts';
import useDebounce from '../../../hooks/useDebounce.tsx';

import { useSearchConceptsByEcl } from '../../../hooks/api/useInitializeConcepts.tsx';
import { Control, Controller } from 'react-hook-form';
import { filterOptionsForConceptAutocomplete } from '../../../utils/helpers/conceptUtils.ts';
interface ProductAutoCompleteChildProps {
  optionValues: Concept[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;

  name: string;
  inputValue: string;
  setInputValue: (val: string) => void;
  ecl: string | undefined;
  branch: string;
  isLoading: boolean;
  showDefaultOptions?: boolean;
}
const ProductAutoCompleteChild: FC<ProductAutoCompleteChildProps> = ({
  optionValues,
  inputValue,
  setInputValue,
  control,
  name,
  ecl,
  branch,
  isLoading,
  showDefaultOptions,
}) => {
  const debouncedSearch = useDebounce(inputValue, 1000);
  const [options, setOptions] = useState<Concept[]>(
    optionValues ? optionValues : [],
  );

  const { data } = useSearchConceptsByEcl(
    debouncedSearch,
    ecl,
    branch,
    showDefaultOptions && optionValues.length === 0 && inputValue.length === 0
      ? true
      : false,
  );
  const [open, setOpen] = useState(false);
  useEffect(() => {
    mapDataToOptions();
  }, [data, optionValues]);

  const mapDataToOptions = () => {
    if (data) {
      setOptions(data);
    } else if (optionValues) {
      setOptions(optionValues);
    }
  };
  // alert(optionValues.length)
  return (
    <Controller
      name={name as 'productName'}
      control={control}
      render={({ field: { onChange, value }, ...props }) => (
        <Autocomplete
          loading={isLoading}
          options={options.sort((a, b) => -b.pt.term.localeCompare(a.pt.term))}
          filterOptions={filterOptionsForConceptAutocomplete}
          getOptionLabel={option => option.pt.term}
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
          }}
          {...props}
          value={inputValue === '' ? null : (value as Concept)}
        />
      )}
    />
  );
};
export default ProductAutoCompleteChild;
