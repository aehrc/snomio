import React, { FC, useEffect, useState } from 'react';
import {Field, FieldArray, FieldArrayRenderProps, Form, Formik, useFormikContext} from 'formik';
import {
  ExternalIdentifier,
  Ingredient,
  MedicationPackageDetails, MedicationProductQuantity,
} from '../../../types/authoring.ts';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid, IconButton,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Stack } from '@mui/system';
import { experimentalStyled as styled, useTheme } from '@mui/material/styles';
import { Concept } from '../../../types/concept.ts';
import ProductAutocomplete from './ProductAutocomplete.tsx';
import conceptService from '../../../api/ConceptService.ts';
import {
  addOrRemoveFromArray,
} from "../../../utils/helpers/conceptUtils.ts";
;
import {AddCircle, RemoveCircle} from "@mui/icons-material";

export interface ProductAuthoringMainProps {
  packageDetails: MedicationPackageDetails;
  show: boolean;
  units: Concept[];
  containerTypes: Concept[];
  ingredients: Concept[];
  doseForms: Concept[];
  brandProducts: Concept[];
}

function ProductAuthoringMain(productprops: ProductAuthoringMainProps) {
  const {
    packageDetails,
    units,
    containerTypes,
    ingredients,
    doseForms,
    brandProducts,
  } = productprops;
  const theme = useTheme();

  const handleSubmit = (values: MedicationPackageDetails) => {
    console.log(values);
  };

  const TPBox = styled(Box)({
    border: `1px solid ${theme.palette.divider}`,
    color: 'red',
    fontWeight: 'bold',
    fontSize: 'larger',
  });
  const OuterBox = styled(Box)({
    border: `1px solid ${theme.palette.divider}`,
    color: 'green',
    fontWeight: 'bold',
    fontSize: 'medium',
    marginBottom: '15px',
  });
  const InnerBox = styled(Box)({
    border: '0 solid #f0f0f0',
    color: '#003665',
    marginTop: '10px',
    marginBottom: '10px',
    fontSize: 'small',
  });

  const ProductBox = styled(Box)({
    border: `1px solid ${theme.palette.divider}`,
    color: '#CD7F32',
    fontWeight: 'bold',
    fontSize: 'large',
  });

  const PackageBox = styled(Box)({
    border: `1px solid ${theme.palette.divider}`,
    color: 'red',
    fontWeight: 'bold',
    fontSize: 'larger',
  });

  const ContainedPackages = () => {
    const { values } = useFormikContext<MedicationPackageDetails>();

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
    interface TabPanelProps {
      children?: React.ReactNode;
      index: number;
      value: number;
    }
    function CustomTabPanel(props: TabPanelProps) {
      const { children, value, index, ...other } = props;

      return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
        >
          {value === index && (
            <Box sx={{ p: 3 }}>
              <div>{children}</div>
            </Box>
          )}
        </div>
      );
    }
    function a11yProps(index: number) {
      return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
    }
    return (
      <>
        <PackageBox component="fieldset">
          <legend>Contained Packages</legend>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="package tab"
            >
              {values.containedPackages.map((containedPackage, index) => (
                <Tab
                  label={containedPackage.packageDetails.productName.pt.term}
                  {...a11yProps(index)}
                  key={index}
                />
              ))}
            </Tabs>
          </Box>
          {values.containedPackages.map((containedPackage, index) => (
            <CustomTabPanel
              value={value}
              index={index}
              key={containedPackage.packageDetails.productName.conceptId}
            >
              <FieldArray
                name={'containedPackages[${index}].containedProducts'}
              >
                {arrayHelpers => (
                  <>
                    <ContainedProducts
                      packageIndex={index}
                      partOfPackage={true}
                      showTPU={true}
                      arrayHelpers={arrayHelpers}
                    />
                  </>
                )}
              </FieldArray>
            </CustomTabPanel>
          ))}
        </PackageBox>
      </>
    );
  };

  interface ContainedProductsProps {
    packageIndex?: number;
    partOfPackage: boolean;
    showTPU: boolean;
    arrayHelpers:FieldArrayRenderProps;

  }
  const ContainedProducts: FC<ContainedProductsProps> = ({
                                                           packageIndex,
                                                           partOfPackage,
                                                           showTPU,
                                                           arrayHelpers
                                                         }) => {
    //const [name, setName] = React.useState("");
    const { values } = useFormikContext<MedicationPackageDetails>();

    const containedProducts = partOfPackage
        ? values.containedPackages[packageIndex as number].packageDetails
            .containedProducts
        : values.containedProducts;
    const productsArray = partOfPackage
        ? `containedPackages[${packageIndex}].packageDetails.containedProducts`
        : 'containedProducts';

    const [specialFormDoses, setSpecialFormDoses] = useState<Concept[]>([]);
    const [selectedDoseForm, setSelectedDoseForm] = useState<Concept>();
    const [expandedProducts, setExpandedProducts] = useState<string[]>([]);


    const productAccordionClicked = (key: string) => {
      if (expandedProducts.includes(key)) {
        setExpandedProducts(
            expandedProducts.filter((value: string) => value !== key),
        );
      } else {
        setExpandedProducts([...expandedProducts, key]);
      }
    };
    const productKey = (index: number) => {
      return `product-key-${index}`;
    };
    useEffect(() => {
      async function fetchSpecialFormDoses() {
        setSpecialFormDoses([]);
        try {
          let concepts: Concept[] = [];
          if (selectedDoseForm) {
            const conceptId = selectedDoseForm.conceptId.trim();
            const ecl = '<' + conceptId;

            concepts = await conceptService.searchConceptByEcl(ecl);
            setSpecialFormDoses(concepts);
          }
        } catch (error) {
          console.log(error);
        }
      }
      void fetchSpecialFormDoses().then(r => r);
    }, [selectedDoseForm]);


    return (
        <>

          <ProductBox component="fieldset">
            <legend>Contained Products</legend>

            {containedProducts.map((containedProduct, index) => (
                <div key={productKey(index)}>
                  <br />
                  <Accordion
                      key={productKey(index)}
                      style={{ border: 'none' }}
                      onChange={() => productAccordionClicked(productKey(index))}
                      expanded={expandedProducts.includes(productKey(index))}
                  >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        //aria-expanded={true}

                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                      <Grid xs={40} item={true}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Grid item xs={10}>
                            <Typography>
                              {containedProduct.productDetails?.productName?.pt.term}
                            </Typography>
                          </Grid>
                          <Grid container justifyContent="flex-end">
                            <Stack direction="row" spacing={0} alignItems="center">

                              <IconButton onClick={ () => {
                                //storeIngredientsExpanded([]);
                                const productQuantity:MedicationProductQuantity ={productDetails:{activeIngredients:[{}]}};
                                arrayHelpers.push(productQuantity);

                              }} aria-label="create" size="large">
                                <AddCircle fontSize="inherit"/>
                              </IconButton>
                              <IconButton aria-label="delete" size="large" onClick={ () => arrayHelpers.remove(index)}>
                                <RemoveCircle fontSize="inherit" />
                              </IconButton>
                            </Stack>
                          </Grid>

                        </Stack>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid
                          container
                          rowSpacing={1}
                          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      >
                        <Grid xs={6} key={'left'} item={true}>
                          {showTPU ? (
                              <OuterBox component="fieldset">
                                <legend>Product Details</legend>
                                <InnerBox component="fieldset">
                                  <legend>Brand Name</legend>
                                  <Field
                                      name={`${productsArray}[${index}].productDetails.productName`}
                                      id={`${productsArray}[${index}].productDetails.productName`}
                                      optionValues={brandProducts}
                                      getOptionLabel={(option: Concept) => option.pt.term}
                                      component={ProductAutocomplete}
                                      fullWidth
                                      variant="outlined"
                                      margin="dense"
                                      disableClearable={true}
                                  />
                                </InnerBox>
                              </OuterBox>
                          ) : (
                              <div></div>
                          )}

                          <OuterBox component="fieldset">
                            <legend>Active Ingredients</legend>
                            <FieldArray
                                name={`containedProducts[${index}].productDetails.activeIngredients`}
                            >
                              {arrayHelpers => (
                                  <>
                                    <Ingredients
                                        containedProductIndex={index}
                                        packageIndex={
                                          partOfPackage
                                              ? (packageIndex as number)
                                              : undefined
                                        }
                                        partOfPackage={partOfPackage}
                                        arrayHelpers={arrayHelpers}
                                    />

                                  </>
                              )}

                            </FieldArray>
                            {/*<pre>{JSON.stringify(values.containedProducts[0].productDetails.activeIngredients, null, 2)}</pre>*/}
                          </OuterBox>
                        </Grid>
                        <Grid xs={6} key={'right'} item={true}>
                          <OuterBox
                              component="fieldset"
                              sx={{
                                display: 'grid',
                              }}
                          >
                            <legend>Dose Forms</legend>
                            <InnerBox component="fieldset">
                              <legend>Generic Dose Form</legend>
                              <Field
                                  name={`${productsArray}[${index}].productDetails.genericForm`}
                                  id={`${productsArray}[${index}].productDetails.genericForm`}
                                  optionValues={doseForms}
                                  getOptionLabel={(option: Concept) => option.pt.term}
                                  setval={setSelectedDoseForm}
                                  component={ProductAutocomplete}
                                  fullWidth
                                  variant="outlined"
                                  margin="dense"
                              />
                            </InnerBox>
                            <InnerBox component="fieldset">
                              <legend>Specific Dose Form</legend>

                              <Field
                                  name={`${productsArray}[${index}].productDetails.specificForm`}
                                  id={`${productsArray}[${index}].productDetails.specificForm`}
                                  optionValues={specialFormDoses}
                                  getOptionLabel={(option: Concept) => option.pt.term}
                                  component={ProductAutocomplete}
                                  fullWidth
                                  variant="outlined"
                                  margin="dense"
                              />
                            </InnerBox>

                            <InnerBox component="fieldset">
                              <legend>Unit Size</legend>

                              <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems={'center'}
                              >
                                <Grid item xs={2}>
                                  <Field
                                      as={TextField}
                                      name={`${productsArray}[${index}].productDetails.quantity.value`}
                                      fullWidth
                                      variant="outlined"
                                      margin="dense"
                                      InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                                <Grid item xs={10}>
                                  <Field
                                      name={`${productsArray}[${index}].productDetails.quantity.unit`}
                                      id={`${productsArray}[${index}].productDetails.quantity.unit`}
                                      optionValues={units}
                                      getOptionLabel={(option: Concept) =>
                                          option.pt.term
                                      }
                                      component={ProductAutocomplete}
                                  />
                                </Grid>
                              </Stack>
                            </InnerBox>
                            <InnerBox component="fieldset">
                              <legend>Pack Size</legend>

                              <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems={'center'}
                              >
                                <Grid item xs={2}>
                                  <Field
                                      as={TextField}
                                      name={`${productsArray}[${index}].value`}
                                      fullWidth
                                      variant="outlined"
                                      margin="dense"
                                      InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                                <Grid item xs={10}>
                                  <Field
                                      name={`${productsArray}[${index}].unit`}
                                      id={`${productsArray}[${index}].unit`}
                                      optionValues={units}
                                      getOptionLabel={(option: Concept) =>
                                          option.pt.term
                                      }
                                      component={ProductAutocomplete}
                                  />
                                </Grid>
                              </Stack>
                            </InnerBox>
                          </OuterBox>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>
            ))}
          </ProductBox>
        </>
    );
  };

  interface IngredientsProps {
    packageIndex?: number;
    containedProductIndex: number;
    partOfPackage: boolean;
    arrayHelpers:FieldArrayRenderProps;

  }
  const Ingredients: FC<IngredientsProps> = ({
                                               containedProductIndex,
                                               packageIndex,
                                               partOfPackage,
                                               arrayHelpers,

                                             }) => {
    //const [number, setNumber] = React.useState("");
    const { values } = useFormikContext<MedicationPackageDetails>();
    const [expandedIngredients, setExpandedIngredients] = useState<string[]>([]);
    const InnerBox = styled(Box)({
      border: '0 solid #f0f0f0',
      color: '#003665',
      marginTop: '10px',
      marginBottom: '10px',
      fontSize: 'small',
    });





    const activeIngredients = partOfPackage
        ? values.containedPackages[packageIndex as number].packageDetails
            .containedProducts[containedProductIndex].productDetails
            ?.activeIngredients
        : values.containedProducts[containedProductIndex].productDetails
            ?.activeIngredients;

    const activeIngredientsArray = partOfPackage
        ? `containedPackages[${packageIndex}].packageDetails.containedProducts[${containedProductIndex}].productDetails.activeIngredients`
        : `containedProducts[${containedProductIndex}].productDetails.activeIngredients`;
    const getKey = (index: number) => {
      return `ingredient-key-${index}`;
    };

    const ingredientsAccordionClicked = (key: string) => {
      setExpandedIngredients(addOrRemoveFromArray(expandedIngredients, key))
      //storeIngredientsExpanded(expandedIngredients);

    };


    return (
        <>
          <div>


            {activeIngredients?.map((activeIngredient: Ingredient, index: number) => (
                <div key={getKey(index)}>
                  <br />
                  <Accordion
                      style={{ border: 'none' }}
                      key={getKey(index)}
                      defaultExpanded={expandedIngredients.includes(getKey(index))}

                  >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        onClick={(event) => {
                          ingredientsAccordionClicked(getKey(index))
                          event.stopPropagation();
                        }}

                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                      <Grid xs={40} item={true}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Grid item xs={10}>
                            <Typography>
                              {activeIngredient.activeIngredient?.pt.term}
                            </Typography>
                          </Grid>
                          <Grid container justifyContent="flex-end">
                            <Stack direction="row" spacing={0} alignItems="center">
                              <IconButton onClick={ () => {
                                //storeIngredientsExpanded([]);
                                const ingredient:Ingredient ={};
                                arrayHelpers.push(ingredient);


                              }} aria-label="create" size="large">
                                <AddCircle fontSize="inherit"/>
                              </IconButton>
                            <IconButton aria-label="delete" size="large" onClick={ () => arrayHelpers.remove(index)}>
                              <RemoveCircle fontSize="inherit" />
                            </IconButton>
                            </Stack>
                          </Grid>

                        </Stack>

                      </Grid>

                    </AccordionSummary>
                    <AccordionDetails>

                      <InnerBox component="fieldset">
                        <legend>Intended Active Ingredient</legend>

                        <Field
                            name={`${activeIngredientsArray}[${index}].activeIngredient`}
                            id={`${activeIngredientsArray}[${index}].activeIngredient`}
                            optionValues={ingredients}
                            getOptionLabel={(option: Concept) => option.pt.term}
                            component={ProductAutocomplete}
                            fullWidth
                            variant="outlined"
                            margin="dense"
                            required
                            disableClearable={true}
                        />
                      </InnerBox>
                      <InnerBox component="fieldset">
                        <legend>BoSS</legend>
                        <Field
                            name={`${activeIngredientsArray}[${index}].basisOfStrengthSubstance`}
                            id={`${activeIngredientsArray}[${index}].basisOfStrengthSubstance`}
                            optionValues={ingredients}
                            getOptionLabel={(option: Concept) => option.pt.term}
                            component={ProductAutocomplete}
                            fullWidth
                            variant="outlined"
                            margin="dense"
                            required
                        />
                      </InnerBox>
                      <InnerBox component="fieldset">
                        <legend>Strength</legend>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Grid item xs={4}>
                            <Field
                                as={TextField}
                                //name={`containedProducts[${index}].activeIngredients[${ingIndex}].activeIngredient.conceptId`}
                                name={`${activeIngredientsArray}[${index}].totalQuantity.value`}
                                fullWidth
                                variant="outlined"
                                margin="dense"
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Field
                                id={`${activeIngredientsArray}[${index}].totalQuantity.unit`}
                                name={`${activeIngredientsArray}[${index}].totalQuantity.unit`}
                                optionValues={units}
                                getOptionLabel={(option: Concept) => option.pt.term}
                                component={ProductAutocomplete}
                                required
                            />
                          </Grid>
                        </Stack>
                      </InnerBox>

                      <InnerBox component="fieldset">
                        <legend>Concentration Strength</legend>

                        <Stack direction="row" spacing={2} alignItems="center">
                          <Grid item xs={4}>
                            <Field
                                as={TextField}
                                //name={`containedProducts[${index}].activeIngredients[${ingIndex}].activeIngredient.conceptId`}
                                name={`${activeIngredientsArray}[${index}].concentrationStrength.value`}
                                fullWidth
                                variant="outlined"
                                margin="dense"
                                InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <Field
                                id={`${activeIngredientsArray}[${index}].concentrationStrength.unit`}
                                name={`${activeIngredientsArray}[${index}].concentrationStrength.unit`}
                                optionValues={units}
                                getOptionLabel={(option: Concept) => option.pt.term}
                                component={ProductAutocomplete}
                            />
                          </Grid>
                        </Stack>
                      </InnerBox>

                    </AccordionDetails>
                  </Accordion>
                </div>
            ))}
          </div>
        </>
    );
  };

  return (
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
                {({ values }) => (
                  <Form
                    onChange={event => {
                      console.log(event.currentTarget);
                    }}
                  >
                    {/*<MainBox component="fieldset">*/}
                    <TPBox component="fieldset">
                      <legend>Package Details</legend>

                      <Stack
                        direction="row"
                        spacing={3}
                        sx={{ marginLeft: '10px' }}
                        alignItems="center"
                      >
                        <Grid item xs={4}>
                          <InnerBox component="fieldset">
                            <legend>Brand Name</legend>
                            <Field
                              as={TextField}
                              name={`productName.pt.term`}
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
                            <Field
                              name={'containerType'}
                              id={'containerType'}
                              optionValues={containerTypes}
                              getOptionLabel={(option: Concept) =>
                                option.pt.term
                              }
                              component={ProductAutocomplete}
                              fullWidth
                              variant="outlined"
                              margin="dense"
                            />
                          </InnerBox>
                        </Grid>
                        <Grid item xs={3}>
                          <InnerBox component="fieldset">
                            <legend>ARTG ID</legend>
                            <Field
                              name={'externalIdentifiers'}
                              id={'externalIdentifiers'}
                              optionValues={[]}
                              getOptionLabel={(option: ExternalIdentifier) =>
                                option.identifierValue
                              }
                              multiple
                              freeSolo
                              component={ProductAutocomplete}
                              fullWidth
                              variant="outlined"
                              margin="dense"
                            />
                          </InnerBox>
                        </Grid>
                      </Stack>
                    </TPBox>

                    {packageDetails.containedProducts.length > 0 ? (
                      <div>
                        <FieldArray name="containedProducts">
                          {arrayHelpers => {
                            return (
                              <>
                                <br />
                                <ContainedProducts
                                  showTPU={true}
                                  partOfPackage={false}
                                  arrayHelpers={arrayHelpers}
                                />
                              </>
                            );
                          }}
                        </FieldArray>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {packageDetails.containedPackages.length > 0 ? (
                      <div>
                        <FieldArray name="containedPackages">
                          {arrayHelpers => {
                            return (
                              <>
                                <br />
                                <ContainedPackages />
                              </>
                            );
                          }}
                        </FieldArray>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {/*</MainBox>*/}

                    <Box m={1} p={1}>
                      <Stack spacing={2} direction="row" justifyContent="end">
                        <Button variant="contained" type="submit" color="info">
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
  );
}

export default ProductAuthoringMain;
