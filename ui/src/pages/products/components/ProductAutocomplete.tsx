import { Autocomplete, TextField } from '@mui/material';
import React, { FC } from 'react';
import { Concept } from '../../../types/concept.ts';
import { FieldProps } from 'formik';
interface ProductAutocompleteProps {
  setval: (val: any) => void;
  optionValues: any[];
}
const ProductAutocomplete: FC<ProductAutocompleteProps & FieldProps> = ({
  field,
  form: { touched, setTouched, setFieldValue },
  // textFieldProps,
  setval,
  optionValues,

  ...props
}) => {
  // const {error, helperText, ...field} = fieldToTextField(props);
  // const { error, helperText, ...field } = fieldToTextField(form);
  const { name } = field;
  return (
    <Autocomplete
      {...props}
      {...field}
      onChange={(_, value) => {
        void setFieldValue(name, value);
        if (setval) {
          setval(value as Concept);
        }
      }}
      options={optionValues}
      onBlur={() => void setTouched({ [name]: true })}
      // getOptionSelected={(item, current) => item.value === current.value}
      renderInput={props => (
        // <div {...props}></div>
        <TextField
          {...props}
          // {...textFieldProps}
          // helperText={}
          // error={errors[field.name]}
        />
      )}
    />
  );
};
export default ProductAutocomplete;
