import { Autocomplete, TextField } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { Concept } from '../../../types/concept.ts';
import { FieldProps } from 'formik';
import useDebounce from '../../../hooks/useDebounce.tsx';

import { useSearchConcepts } from '../../../hooks/api/useInitializeConcepts.tsx';
import { ConceptSearchType } from '../../../types/conceptSearch.ts';
interface ProductAutocompleteProps {
  setval: (val: Concept | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionValues?: any[];
  defaultOption?: Concept;
  searchType: ConceptSearchType;
}
const ProductAutocomplete: FC<ProductAutocompleteProps & FieldProps> = ({
  field,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  form: { touched, setTouched, setFieldValue },
  setval,
  defaultOption,
  optionValues,
  searchType,

  ...props
}) => {
  const { name } = field;
  const [inputValue, setInputValue] = useState('');
  const debouncedSearch = useDebounce(inputValue, 1000);
  const [options, setOptions] = useState<Concept[]>(
    optionValues ? optionValues : [],
  );
  const { isLoading, data } = useSearchConcepts(
    debouncedSearch,
    searchType,
    field.value ? (field.value as Concept) : undefined,
  );
  const [open, setOpen] = useState(false);
  useEffect(() => {
    mapDataToOptions();
  }, [data]);

  const mapDataToOptions = () => {
    if (data) {
      setOptions(data);
    }
  };
  return (
    <Autocomplete
      loading={isLoading}
      {...props}
      {...field}
      defaultValue={defaultOption ? defaultOption : null}
      value={(field.value as Concept) || null}
      onOpen={() => {
        if (inputValue) {
          setOpen(true);
        }
      }}
      onChange={(_, value) => {
        void setFieldValue(name, value);
        if (setval) {
          setval(value as Concept);
        }
      }}
      inputValue={inputValue}
      onInputChange={(e, value) => {
        setInputValue(value);
        if (!value) {
          setOpen(false);
        }
      }}
      options={options}
      onBlur={() => void setTouched({ [name]: true })}
      renderInput={props => (
        // <div {...props}></div>
        <TextField {...props} />
      )}
    />
  );
};
export default ProductAutocomplete;
