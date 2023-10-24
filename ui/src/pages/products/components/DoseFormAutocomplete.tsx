import { Autocomplete, TextField } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { Concept } from '../../../types/concept.ts';
import { FieldProps } from 'formik';
import useDebounce from '../../../hooks/useDebounce.tsx';
import { useSpecialDoseFormSearch } from '../../../hooks/api/useInitializeConcepts.tsx';

interface DoseFormAutocompleteProps {
  optionValues: Concept[];
  defaultOption?: Concept;
  inputValue: string;
  setInputValue: (value: string) => void;
  parent: Concept;
}
const DoseFormAutocomplete: FC<DoseFormAutocompleteProps & FieldProps> = ({
  field,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  form: { touched, setTouched, setFieldValue },
  defaultOption,
  optionValues,
  inputValue,
  setInputValue,
  parent,

  ...props
}) => {
  const { name } = field;

  const debouncedSearch = useDebounce(inputValue, 1000);
  const [options, setOptions] = useState<Concept[]>(
    optionValues ? optionValues : [],
  );
  const { isLoading, data } = useSpecialDoseFormSearch(
    debouncedSearch,
    parent ? `< ${parent.conceptId}` : undefined,
  );
  const [open, setOpen] = useState(false);
  useEffect(() => {
    mapDataToOptions();
  }, [data]);
  useEffect(() => {
    if(inputValue === '' && field.value !== null){
      void setFieldValue(name, null);
    }
  }, [inputValue]);
  const mapDataToOptions = () => {
    if (data) {
      setOptions(data);
    }
  };
  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  console.log(inputValue);
  console.log(`value: ${field.value}`);
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
      }}
      inputValue={inputValue}
      onInputChange={(e, value) => {
        setInputValue(value);
        if (!value) {
          setOpen(false);
        }
      }}
      options={optionValues}
      onBlur={() => void setTouched({ [name]: true })}
      renderInput={props => (
        // <div {...props}></div>
        <TextField {...props} />
      )}
    />
  );
};
export default DoseFormAutocomplete;
