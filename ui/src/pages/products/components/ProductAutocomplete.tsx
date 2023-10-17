import { Autocomplete, TextField } from '@mui/material';
import React, { FC } from 'react';
import { Concept } from '../../../types/concept.ts';
import { FieldProps } from 'formik';
interface ProductAutocompleteProps {
  setval: (val: any) => void;
  optionValues: any[];
  defaultOption?: Concept;
}
const ProductAutocomplete: FC<ProductAutocompleteProps & FieldProps> = ({
  field,
  form: { touched, setTouched, setFieldValue },
  setval,
  defaultOption,
  optionValues,

  ...props
}) => {
  const { name } = field;
  return (
    <Autocomplete
      {...props}
      {...field}
      defaultValue={defaultOption ? defaultOption : null}
      value={(field.value as Concept) || null}
      onChange={(_, value) => {
        void setFieldValue(name, value);
        if (setval) {
          setval(value as Concept);
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
export default ProductAutocomplete;
