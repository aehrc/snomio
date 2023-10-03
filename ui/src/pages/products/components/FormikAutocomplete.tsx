import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { fieldToTextField } from 'formik-mui';
const FormikAutocomplete = ({ textFieldProps, ...props }) => {
  const {
    form: { setTouched, setFieldValue },
    callback,
  } = props;

  const { error, helperText, ...field } = fieldToTextField(props);
  const { name: string } = field;

  return (
    <Autocomplete
      {...props}
      {...field}
      onChange={(_, value: any) => {
        setFieldValue(name, value);
        if (callback) {
          callback(value);
        }
      }}
      onBlur={() => setTouched({ [name]: true })}
      // getOptionSelected={(item, current) => item.value === current.value}
      renderInput={props => (
        <TextField
          {...props}
          {...textFieldProps}
          helperText={helperText}
          error={error}
        />
      )}
    />
  );
};
export default FormikAutocomplete;
