import React, { useState } from 'react';
import {
  ExternalIdentifier,
  MedicationPackageDetails,
} from '../../../types/authoring.ts';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { Box, Button, Grid, Paper, styled, TextField } from '@mui/material';

import { Stack } from '@mui/system';
import { Concept } from '../../../types/concept.ts';
import { useTheme } from '@mui/material/styles';
import ConfirmationModal from '../../../themes/overrides/ConfirmationModal.tsx';
import { ConceptSearchType } from '../../../types/conceptSearch.ts';
import ProductAutocomplete from './ProductAutocomplete.tsx';
import ContainedPackages from './ContainedPackages.tsx';
import ContainedProducts from './ContainedProducts.tsx';
import ArtgAutoComplete from './ArtgAutoComplete.tsx';

export interface ProductAuthoringMainProps {
  packageDetails: MedicationPackageDetails;
  units: Concept[];
  containerTypes: Concept[];
  doseForms: Concept[];
  ingredients: Concept[];
  brandProducts: Concept[];
  handleClearForm: () => void;
  isFormEdited: boolean;
  setIsFormEdited: (value: boolean) => void;
}

function ProductAuthoringMain(productprops: ProductAuthoringMainProps) {
  const {
    packageDetails,
    units,
    containerTypes,
    doseForms,
    ingredients,
    brandProducts,
    handleClearForm,
    isFormEdited,
    setIsFormEdited,
  } = productprops;
  const theme = useTheme();

  const Level1Box = styled(Box)({
    border: `1px solid ${theme.palette.divider}`,
    color: '#003665',
    fontWeight: 'bold',
    fontSize: 'larger',
  });
  const Level2Box = styled(Box)({
    border: `1px solid ${theme.palette.divider}`,
    color: '#CD7F32',
    fontWeight: 'bold',
    fontSize: 'medium',
  });
  const InnerBox = styled(Box)({
    border: '0 solid #f0f0f0',
    color: '#003665',
    marginTop: '10px',
    marginBottom: '10px',
    fontSize: 'small',
  });

  const defaultForm: MedicationPackageDetails = {
    containedProducts: [],
    containedPackages: [],
  };

  const [resetModalDisabled, setResetModalDisabled] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const { register, control, handleSubmit, formState, reset } =
    useForm<MedicationPackageDetails>({ values: packageDetails });
  const onSubmit: SubmitHandler<MedicationPackageDetails> = data =>
    console.log(data);

  const {
    fields: productFields,
    append: productAppend,
    remove: productRemove,
  } = useFieldArray({
    control,
    name: 'containedProducts',
  });

  const {
    fields: packageFields,
    append: packageAppend,
    remove: packageRemove,
  } = useFieldArray({
    control,
    name: 'containedPackages',
  });
  const formUpdated = formState.isDirty;
  setIsFormEdited(formUpdated);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container>
        <Grid item sm={12} xs={12}>
          <Paper>
            <Box m={2} p={2}>
              <form onSubmit={() => handleSubmit(onSubmit)}>
                <ConfirmationModal
                  open={resetModalOpen}
                  content={`Confirm clear?. This will reset the unsaved changes`}
                  handleClose={() => {
                    setResetModalOpen(false);
                  }}
                  title={'Confirm Clear'}
                  disabled={resetModalDisabled}
                  action={'Clear'}
                  handleAction={() => {
                    reset(defaultForm);
                    handleClearForm();
                    setResetModalOpen(false);
                  }}
                />
                <Grid container justifyContent="flex-end">
                  <Button
                    type="reset"
                    onClick={() => {
                      setResetModalOpen(true);
                    }}
                    variant="contained"
                    color="error"
                    disabled={!isFormEdited}
                  >
                    Clear
                  </Button>
                </Grid>
                {/*<MainBox component="fieldset">*/}
                <Level1Box component="fieldset">
                  <legend>Product Details</legend>

                  <Stack
                    direction="row"
                    spacing={3}
                    // sx={{ marginLeft: '10px' }}
                    alignItems="center"
                  >
                    <Grid item xs={4}>
                      <InnerBox component="fieldset">
                        <legend>Brand Name</legend>
                        <TextField
                          {...register('productName.pt.term')}
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          InputLabelProps={{ shrink: true }}
                        />
                      </InnerBox>
                    </Grid>

                    <Grid item xs={4}>
                      <InnerBox component="fieldset">
                        <legend>Container Type</legend>

                        <ProductAutocomplete
                          optionValues={containerTypes}
                          searchType={ConceptSearchType.containerTypes}
                          name={'containerType'}
                          control={control}
                          register={register}
                        />
                      </InnerBox>
                    </Grid>
                    <Grid item xs={3}>
                      <InnerBox component="fieldset">
                        <legend>ARTG ID</legend>
                        <ArtgAutoComplete
                          control={control}
                          name="externalIdentifiers"
                          register={register}
                          optionValues={[]}
                        />
                      </InnerBox>
                    </Grid>
                  </Stack>
                </Level1Box>

                {packageFields.length > 0 ||
                (packageFields.length === 0 && productFields.length === 0) ? (
                  <div>
                    <ContainedPackages
                      units={units}
                      doseForms={doseForms}
                      brandProducts={brandProducts}
                      ingredients={ingredients}
                      containerTypes={containerTypes}
                      control={control}
                      register={register}
                      // watch={watch}
                    />
                  </div>
                ) : (
                  <div></div>
                )}
                {productFields.length > 0 ||
                (packageFields.length === 0 && productFields.length === 0) ? (
                  <div>
                    <ContainedProducts
                      showTPU={true}
                      partOfPackage={false}
                      units={units}
                      doseForms={doseForms}
                      brandProducts={brandProducts}
                      ingredients={ingredients}
                      control={control}
                      register={register}
                    />
                  </div>
                ) : (
                  <div></div>
                )}

                <Box m={1} p={1}>
                  <Stack spacing={2} direction="row" justifyContent="end">
                    <Button variant="contained" type="submit" color="info">
                      Save
                    </Button>
                    <Button variant="contained" type="submit" color="success">
                      Preview
                    </Button>
                    <Button variant="contained" type="submit" color="primary">
                      Commit
                    </Button>
                  </Stack>
                </Box>
              </form>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductAuthoringMain;
