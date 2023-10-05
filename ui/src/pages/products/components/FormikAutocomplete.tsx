import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { fieldToTextField, TextFieldProps } from 'formik-mui';

class FormikAutocomplete extends React.Component<{
  textFieldProps: TextFieldProps;
}> {
  render() {
    const { textFieldProps, ...props } = this.props;
    const {
      form: { setTouched, setFieldValue },
      callback,
    } = props;

    const { error, helperText, ...field } = fieldToTextField(props);
    const { name } = field;

    return (
      <Autocomplete
        {...props}
        {...field}
        onChange={(_, value) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          setFieldValue(name, value);
          if (callback) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            callback(value);
          }
        }}
        onBlur={() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          setTouched({ [name]: true });
        }}
        // getOptionSelected={(item, current) => item.value === current.value}
        // isOptionEqualToValue={(option, value) =>
        //     option.conceptId === value.conceptId
        // }
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
  }
}

export default FormikAutocomplete;
