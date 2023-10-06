import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import {fieldToTextField, TextFieldProps} from 'formik-mui';
import {Concept} from "../../../types/concept.ts";
import {Form} from 'formik';
interface ProductAutocompleteProps {
    textFieldsProps: TextFieldProps;
    callback: (val:Concept) => void;
    form: Form;


}
const ProductAutocomplete = ({textFieldsProps, form, callback }):ProductAutocompleteProps => {
     const { setTouched, setFieldValue } = form;

    const { error, helperText, ...field } = fieldToTextField(props);
    const { name } = field;

    return (
      <Autocomplete
        {...props}
        {...field}
        onChange={(_, value) => {

          setFieldValue(name, value);
                if(callback){
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
export default ProductAutocomplete;