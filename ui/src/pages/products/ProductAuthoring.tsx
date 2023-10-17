import React, { useEffect, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import SearchProduct from './components/SearchProduct.tsx';
import useConceptStore from '../../stores/ConceptStore.ts';
import conceptService from '../../api/ConceptService.ts';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;
import { MedicationPackageDetails } from '../../types/authoring.ts';
import { Box, Button, Grid, Paper } from '@mui/material';
import ProductAuthoringMain from './components/ProductAuthoringMain.tsx';
import { Stack } from '@mui/system';
import useInitializeConcepts from '../../hooks/api/useInitializeConcepts.tsx';
import Loading from '../../components/Loading.tsx';
import { Concept } from '../../types/concept.ts';
import { storeIngredientsExpanded } from '../../utils/helpers/conceptUtils.ts';
import { Form, Formik } from 'formik';

function ProductAuthoring() {
  const conceptStore = useConceptStore();
  const { units, containerTypes, ingredients, doseForms, brandProducts } =
    conceptStore;
  const defaultPackage: MedicationPackageDetails = {
    containedProducts: [],
    containedPackages: [],
    externalIdentifiers: [],
  };
  const [packageDetails, setPackageDetails] =
    useState<MedicationPackageDetails>(defaultPackage);
  const [name, setName] = useState<string>('Random');
  const theme = useTheme();
  const { conceptsLoading } = useInitializeConcepts();
  const [selectedProduct, setSelectedProduct] = useState<Concept | null>(null);
  const [isLoadingMedication, setLoadingMedication] = useState(false);

  const handleSelectedProductChange = (concept: Concept | null) => {
    setSelectedProduct(concept);
  };
  const handleClearForm = () => {
    setSelectedProduct(null);
    setPackageDetails(defaultPackage);

    // setRefresh(false);
  };
  const handleSubmit = (values: MedicationPackageDetails) => {
    console.log(values);
  };

  useEffect(() => {
    conceptService
      .fetchMedication(selectedProduct ? selectedProduct.conceptId : '')
      .then(mp => {
        if (mp.productName) {
          setPackageDetails(mp);
        }

        if (packageDetails) {
          setName(packageDetails.productName?.conceptId as string);
        }
        storeIngredientsExpanded([]);
        setLoadingMedication(false);
      })
      .catch(error);
  }, [selectedProduct]);
  // if (conceptsLoading) {
  //   return <Loading />;
  // } else

  if (isLoadingMedication) {
    return (
      <Loading
        message={`Loading Medication details for ${selectedProduct?.conceptId}`}
      />
    );
  } else {
    return (
      <Grid>
        <h1>Create New Product</h1>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          paddingLeft="1rem"
        >
          <Grid item xs={2}>
            <span style={{ color: `${theme.palette.primary.main}` }}>
              Load an existing product:
            </span>
          </Grid>
          <Grid item xs={3}>
            <SearchProduct
              disableLinkOpen={true}
              handleChange={handleSelectedProductChange}
            />
          </Grid>
        </Stack>

        {packageDetails &&
        packageDetails.containedProducts &&
        packageDetails.containedPackages ? (
          <Grid>
            <Box sx={{ width: '100%' }}>
              <Grid container>
                <Grid item sm={12} xs={12}>
                  <Paper>
                    <Box m={2} p={2}>
                      <Formik
                        initialValues={{ ...packageDetails }}
                        enableReinitialize={true}
                        onSubmit={handleSubmit}
                      >
                        {({ values, resetForm }) => (
                          <Form
                            onChange={event => {
                              console.log(event.currentTarget);
                            }}
                          >
                            <Grid container justifyContent="flex-end">
                              <Button
                                type="reset"
                                onClick={() => {
                                  // setPackageDetails(defaultPackage); handleSelectedProductChange(null);
                                  handleClearForm();
                                }}
                                variant="contained"
                                color="error"
                              >
                                Clear
                              </Button>
                            </Grid>
                            <ProductAuthoringMain
                              units={units}
                              containerTypes={containerTypes}
                              ingredients={ingredients}
                              doseForms={doseForms}
                              brandProducts={brandProducts}
                            />{' '}
                            <Box sx={{ marginTop: '1rem' }}>
                              <Stack
                                spacing={2}
                                direction="row"
                                justifyContent="end"
                              >
                                <Button
                                  variant="contained"
                                  type="submit"
                                  color="info"
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="contained"
                                  type="submit"
                                  color="success"
                                >
                                  Preview
                                </Button>
                                <Button
                                  variant="contained"
                                  type="submit"
                                  color="primary"
                                >
                                  Commit
                                </Button>
                                <Button
                                  type="reset"
                                  onClick={() => {
                                    setPackageDetails(defaultPackage);
                                    handleSelectedProductChange(null);
                                    resetForm;
                                  }}
                                  variant="contained"
                                  color="error"
                                >
                                  Clear
                                </Button>
                              </Stack>
                            </Box>
                          </Form>
                        )}
                      </Formik>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ) : (
          <Grid></Grid>
        )}
      </Grid>
    );
  }
}
export default ProductAuthoring;
