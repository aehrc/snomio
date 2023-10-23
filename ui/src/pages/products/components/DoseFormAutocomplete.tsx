import { Autocomplete, TextField } from '@mui/material';
import React, { FC } from 'react';
import { Concept } from '../../../types/concept.ts';
import { FieldProps } from 'formik';

interface DoseFormAutocompleteProps {
  optionValues: Concept[];
  defaultOption?: Concept;
  inputValue: string;
  setInputValue: (value: string) => void;
}
const DoseFormAutocomplete: FC<DoseFormAutocompleteProps & FieldProps> = ({
  field,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  form: { touched, setTouched, setFieldValue },
  defaultOption,
  optionValues,
  inputValue,
  setInputValue,

  ...props
}) => {
  const { name } = field;

  // useEffect(() => {
  //     console.log(inputValue);
  // }, [inputValue]);
  return (
    <Autocomplete
      {...props}
      {...field}
      defaultValue={defaultOption ? defaultOption : null}
      value={(field.value as Concept) || null}
      onChange={(_, value) => {
        void setFieldValue(name, value);
      }}
      inputValue={inputValue}
      onInputChange={(e, value) => {
        // if (e !== null) {
        setInputValue(value);
        // }
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
