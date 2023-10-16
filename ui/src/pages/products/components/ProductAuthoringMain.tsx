import React, { FC, useEffect, useState } from 'react';
import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  Form,
  Formik,
  useFormikContext,
} from 'formik';
import {
  ExternalIdentifier,
  MedicationPackageDetails,
  MedicationPackageQuantity,
  MedicationProductQuantity,
} from '../../../types/authoring.ts';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  IconButton,
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

import { AddCircle } from '@mui/icons-material';
import CustomTabPanel, { a11yProps } from './CustomTabPanel.tsx';
import Ingredients from './Ingredients.tsx';
import SearchIcon from '@mui/icons-material/Search';
import { GridDeleteIcon } from '@mui/x-data-grid';
import PackageSearchAndAddModal from './PackageSearchAndAddModal.tsx';

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

  const Level1Box = styled(Box)({
    border: `1px solid ${theme.palette.divider}`,
    color: '#6495ed ',
    fontWeight: 'bold',
    fontSize: 'larger',
  });
  const Level2Box = styled(Box)({
    border: `1px solid ${theme.palette.divider}`,
    color: '#CD7F32',
    fontWeight: 'bold',
    fontSize: 'medium',
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

  interface ContainedPackagesProps {
    arrayHelpers: FieldArrayRenderProps;
  }

  function ContainedPackages(props: ContainedPackagesProps) {
    const { arrayHelpers } = props;
    const { values } = useFormikContext<MedicationPackageDetails>();

    const [value, setValue] = React.useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const handleToggleModal = () => {
      setModalOpen(!modalOpen);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
    const handlePackageCreation = (newValue: number) => {
      setValue(newValue);
      const medicationPackageQty: MedicationPackageQuantity = {
        packageDetails: {
          externalIdentifiers: [],
          containedPackages: [],
          containedProducts: [{ productDetails: { activeIngredients: [{}] } }],
        },
      };
      arrayHelpers.push(medicationPackageQty);
    };

    const handleSearchAndAddPackage = (newValue: number) => {
      // setValue(newValue);
      // const medicationPackageQty:MedicationPackageQuantity = {packageDetails:{externalIdentifiers:[],containedPackages:[], containedProducts:[{productDetails:{activeIngredients:[{}]}}]}}
      // arrayHelpers.push(medicationPackageQty);
      handleToggleModal();
      // setValue(newValue);
    };

    return (
      <>
        <Level1Box component="fieldset">
          <legend>Contained Packages</legend>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="package tab"
            >
              {values.containedPackages?.map((containedPackage, index) => (
                <Tab
                  label={
                    containedPackage?.packageDetails?.productName
                      ? containedPackage?.packageDetails?.productName?.pt.term
                      : 'untitled'
                  }
                  {...a11yProps(index)}
                  key={index}
                />
              ))}
              <Tab
                icon={<AddCircle />}
                onClick={() =>
                  handlePackageCreation(
                    values.containedPackages?.length
                      ? values.containedPackages?.length + 1
                      : 0,
                  )
                }
                {...a11yProps(
                  values.containedPackages?.length
                    ? values.containedPackages?.length + 1
                    : 0,
                )}
                key={
                  values.containedPackages?.length
                    ? values.containedPackages?.length + 1
                    : 0
                }
              />
              <Tab
                icon={<SearchIcon />}
                onClick={() =>
                  handleSearchAndAddPackage(
                    values.containedPackages?.length
                      ? values.containedPackages?.length + 2
                      : 1,
                  )
                }
                {...a11yProps(
                  values.containedPackages?.length
                    ? values.containedPackages?.length + 2
                    : 1,
                )}
                key={
                  values.containedPackages?.length
                    ? values.containedPackages?.length + 2
                    : 1
                }
              />
            </Tabs>
            <PackageSearchAndAddModal
              open={modalOpen}
              handleClose={handleToggleModal}
              arrayHelpers={arrayHelpers}
            />
          </Box>
          {values.containedPackages?.map((containedPackage, index) => (
            <CustomTabPanel value={value} index={index} key={index}>
              <Grid container justifyContent="flex-end">
                <IconButton
                  onClick={() => {
                    arrayHelpers.remove(index);
                  }}
                  aria-label="create"
                  size="large"
                >
                  <GridDeleteIcon fontSize="inherit" />
                </IconButton>
              </Grid>
              <FieldArray
                name={`containedPackages[${index}].packageDetails.containedProducts`}
              >
                {arrayHelpers => (
                  <>
                    <Level2Box component="fieldset">
                      <legend>Package Details</legend>
                      <Stack direction="row" spacing={3} alignItems="center">
                        <Grid item xs={4}>
                          <InnerBox component="fieldset">
                            <legend>Brand Name</legend>
                            <Field
                              name={`containedPackages[${index}].packageDetails.productName`}
                              id={`containedPackages[${index}].packageDetails.productName`}
                              optionValues={brandProducts}
                              getOptionLabel={(option: Concept) =>
                                option.pt.term
                              }
                              component={ProductAutocomplete}
                              fullWidth
                              variant="outlined"
                              margin="dense"
                              disableClearable={true}
                            />
                          </InnerBox>
                        </Grid>

                        <Grid item xs={4}>
                          <InnerBox component="fieldset">
                            <legend>Container Type</legend>
                            <Field
                              name={`containedPackages[${index}].packageDetails.containerType`}
                              id={`containedPackages[${index}].packageDetails.containerType`}
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
                              name={`containedPackages[${index}].packageDetails.externalIdentifiers`}
                              id={`containedPackages[${index}].packageDetails.externalIdentifiers`}
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

                      <InnerBox component="fieldset">
                        <legend>Quantity</legend>

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems={'center'}
                        >
                          <Grid item xs={1}>
                            <Field
                              as={TextField}
                              name={`containedPackages[${index}].value`}
                              id={`containedPackages[${index}].value`}
                              fullWidth
                              variant="outlined"
                              margin="dense"
                              InputLabelProps={{ shrink: true }}
                              value={containedPackage.value || ''}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <Field
                              name={`containedPackages[${index}].unit`}
                              id={`containedPackages[${index}].unit`}
                              optionValues={units}
                              getOptionLabel={(option: Concept) =>
                                option.pt.term
                              }
                              component={ProductAutocomplete}
                              sx={{ maxWidth: '95%' }}
                            />
                          </Grid>
                        </Stack>
                      </InnerBox>
                    </Level2Box>
                    <br />
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
        </Level1Box>
      </>
    );
  }

  interface ContainedProductsProps {
    packageIndex?: number;
    partOfPackage: boolean;
    showTPU: boolean;
    arrayHelpers: FieldArrayRenderProps;
  }
  const ContainedProducts: FC<ContainedProductsProps> = ({
    packageIndex,
    partOfPackage,
    showTPU,
    arrayHelpers,
  }) => {
    //const [name, setName] = React.useState("");
    const { values } = useFormikContext<MedicationPackageDetails>();

    const containedProducts = partOfPackage
      ? values.containedPackages[packageIndex as number].packageDetails
          ?.containedProducts
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

    const ProductDetails = () => {
      return (
        <div>
          <Grid container justifyContent="flex-end">
            <Stack direction="row" spacing={0} alignItems="center">
              <IconButton aria-label="create" size="large">
                <SearchIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                onClick={() => {
                  const productQuantity: MedicationProductQuantity = {
                    productDetails: { activeIngredients: [{}] },
                  };
                  arrayHelpers.push(productQuantity);
                }}
                aria-label="create"
                size="large"
              >
                <AddCircle fontSize="inherit" />
              </IconButton>
            </Stack>
          </Grid>

          {containedProducts.map((containedProduct, index) => {
            const activeIngredientsArray = partOfPackage
              ? `containedPackages[${packageIndex}].packageDetails.containedProducts[${index}].productDetails.activeIngredients`
              : `containedProducts[${index}].productDetails.activeIngredients`;
            return (
              <div key={productKey(index)} style={{ marginTop: '10px' }}>
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
                            {containedProduct.productDetails?.productName
                              ? containedProduct.productDetails?.productName?.pt
                                  .term
                              : 'untitled'}
                          </Typography>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                          <Stack
                            direction="row"
                            spacing={0}
                            alignItems="center"
                          >
                            <IconButton
                              aria-label="delete"
                              size="large"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              <GridDeleteIcon fontSize="inherit" />
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
                                getOptionLabel={(option: Concept) =>
                                  option.pt.term
                                }
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
                          <FieldArray name={activeIngredientsArray}>
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
                                  units={units}
                                  ingredients={ingredients}
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
                              getOptionLabel={(option: Concept) =>
                                option.pt.term
                              }
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
                              getOptionLabel={(option: Concept) =>
                                option.pt.term
                              }
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
                                  value={
                                    containedProduct.productDetails?.quantity
                                      ?.value || ''
                                  }
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
                                  value={containedProduct.value || ''}
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
            );
          })}
        </div>
      );
    };
    return (
      <>
        {partOfPackage ? (
          <Level2Box component="fieldset">
            <legend>Contained Products</legend>
            <ProductDetails></ProductDetails>
          </Level2Box>
        ) : (
          <Level1Box component="fieldset">
            <legend>Contained Products</legend>
            <ProductDetails></ProductDetails>
          </Level1Box>
        )}
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
                    </Level1Box>

                    <div>
                      <FieldArray name="containedPackages">
                        {arrayHelpers => {
                          return (
                            <>
                              <br />
                              <ContainedPackages arrayHelpers={arrayHelpers} />
                            </>
                          );
                        }}
                      </FieldArray>
                      {/*<pre>{JSON.stringify(values.containedPackages, null, 2)}</pre>*/}
                    </div>
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
                    {/*) : (*/}
                    {/*    <div></div>*/}
                    {/*)}*/}

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
