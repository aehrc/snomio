import { Autocomplete, TextField } from '@mui/material';
import React, { FC } from 'react';
import { Concept } from '../../../types/concept.ts';
import { FieldProps, Form } from 'formik';
interface ProductAutocompleteProps {
  setval: (val: Concept) => void;
}
const ProductAutocomplete: FC<ProductAutocompleteProps & FieldProps> = ({
  field,
  form: { touched, errors, setTouched, setFieldValue },
  // textFieldProps,
  setval,
  ...props
}) => {
  console.log('cgottem');
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
      onBlur={() => void setTouched({ [name]: true })}
      // options={[]}
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
