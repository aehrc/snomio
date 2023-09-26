import React, { useState } from 'react';
import { Field, FieldArray, Form, Formik, useFormikContext } from 'formik';
import { MedicationPackageDetails } from '../../../types/authoring.ts';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Stack } from '@mui/system';
import Select from '@mui/material/Select';
import { experimentalStyled as styled, useTheme } from '@mui/material/styles';

import { ToggleButton, ToggleButtonGroup } from '@mui/lab';

export interface ProductAuthoringMainProps {
  packageDetails: MedicationPackageDetails;
  show: boolean;
}

const InnerBox = styled(Box)({
  border: '5px solid #f0f0f0',
  color: '#003665',
  marginTop: '10px',
  marginBottom: '10px',
  fontSize: 'small',
});

function ProductAuthoringMain(productprops: ProductAuthoringMainProps) {
  const { packageDetails, show } = productprops;
  const theme = useTheme();

  const handleSubmit = (values, props) => {
    console.log(values);
  };

  const MainBox = styled(Box)({
    border: `2px solid ${theme.palette.divider}`,
    color: 'red',
    fontWeight: 'bold',
  });
  const DetailBox = styled(Box)({
    border: `1px solid ${theme.palette.divider}`,
    color: 'red',
    fontWeight: 'bold',
    fontSize: 'larger',
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container>
        <Grid item sm={12} xs={12}>
          <Paper>
            <Box m={3} p={2}>
              <Formik
                initialValues={{ ...packageDetails }}
                enableReinitialize={true}
                onSubmit={handleSubmit}
              >
                {({ values }) => (
                  <Form
                    onChange={event => {
                      console.log('hello');
                    }}
                  >
                    {/*<MainBox component="fieldset">*/}
                    <DetailBox component="fieldset">
                      <legend>Trade details</legend>

                      <Stack
                        direction="row"
                        spacing={3}
                        sx={{ marginLeft: '10px' }}
                      >
                        <Grid item xs={4}>
                          <InnerBox component="fieldset">
                            <legend>Trade Product</legend>
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
                              as={TextField}
                              name={'containerType.pt.term'}
                              fullWidth
                              variant="outlined"
                              margin="dense"
                              InputLabelProps={{ shrink: true }}
                            />
                          </InnerBox>
                        </Grid>
                        <Grid item xs={3}>
                          <InnerBox component="fieldset">
                            <legend>ARTG ID</legend>
                            <Field
                              as={TextField}
                              name={'externalIdentifiers[0].identifierValue'}
                              fullWidth
                              variant="outlined"
                              margin="dense"
                              InputLabelProps={{ shrink: true }}
                            />
                          </InnerBox>
                        </Grid>
                      </Stack>
                    </DetailBox>

                    {packageDetails.containedProducts.length > 0 ? (
                      <div>
                        <FieldArray name="containedProducts">
                          {arrayHelpers => {
                            return (
                              <>
                                <br />
                                <ContainedProducts
                                  containerProductsArrayHelpers={arrayHelpers}
                                  showTPU={
                                    packageDetails.containedProducts.length > 1
                                      ? true
                                      : false
                                  }
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
                                <ContainedPackages
                                  containerPackagesArrayHelpers={arrayHelpers}
                                />
                              </>
                            );
                          }}
                        </FieldArray>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {/*</MainBox>*/}
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

const ContainedPackages = ({ containerPackagesArrayHelpers }) => {
  //const [name, setName] = React.useState("");
  const { values, setFieldValue } = useFormikContext();
  const theme = useTheme();
  const OuterBox = styled(Box)({
    border: `2px solid ${theme.palette.divider}`,
    color: 'green',
    fontWeight: 'bold',
    fontSize: 'small',
    marginBottom: '50px',
  });

  const PackageBox = styled(Box)({
    border: `1px solid ${theme.palette.divider}`,
    color: 'red',
    fontWeight: 'bold',
    fontSize: 'larger',
  });
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
            <Typography>{children}</Typography>
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
      {/*<input type="text" value={name} onChange={handleChange} />*/}
      {/*<button type="button" onClick={handleAddPerson}>*/}
      {/*  add person*/}
      {/*</button>*/}
      <PackageBox component="fieldset">
        <legend>Contained Packages</legend>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
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
            key={containedPackage.packageDetails.productName.conceptId + index}
          >
            <FieldArray name={'containedPackages[${index}].containedProducts'}>
              {arrayHelpers => (
                <>
                  <ContainedProducts
                    containerProductsArrayHelpers={arrayHelpers}
                    packageIndex={index}
                    partOfPackage={true}
                    showTPU={false}
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

const ContainedProducts = ({
  containedProductsArrayHelpers,
  packageIndex,
  partOfPackage,
  showTPU,
}) => {
  //const [name, setName] = React.useState("");
  const { values, setFieldValue } = useFormikContext();
  const theme = useTheme();
  const OuterBox = styled(Box)({
    border: `2px solid ${theme.palette.divider}`,
    color: 'green',
    fontWeight: 'bold',
    fontSize: 'medium',
    marginBottom: '15px',
  });

  const CPBox = styled(Box)({
    border: `2px solid ${theme.palette.divider}`,
    color: '#CD7F32',
    fontWeight: 'bold',
    fontSize: 'large',
  });

  const containedProducts = partOfPackage
    ? values.containedPackages[packageIndex].packageDetails.containedProducts
    : values.containedProducts;
  const productsArray = partOfPackage
    ? `containedPackages[${packageIndex}].packageDetails.containedProducts`
    : 'containedProducts';

  return (
    <>
      {/*<input type="text" value={name} onChange={handleChange} />*/}
      {/*<button type="button" onClick={handleAddPerson}>*/}
      {/*  add person*/}
      {/*</button>*/}
      <CPBox component="fieldset">
        <legend>Contained Products</legend>
        {containedProducts.map((containedProduct, index) => (
          <div
            key={containedProduct.productDetails.productName.conceptId + index}
          >
            <br />
            <Accordion key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                //aria-expanded={true}

                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Grid xs={40} item={true}>
                  <Typography>
                    {containedProduct.productDetails.productName.pt.term}
                  </Typography>
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
                          <legend>Trade Product</legend>
                          <Field
                            as={TextField}
                            name={`${productsArray}[${index}].productDetails.productName.pt.term`}
                            fullWidth
                            variant="outlined"
                            margin="dense"
                            InputLabelProps={{ shrink: true }}
                          />
                        </InnerBox>
                      </OuterBox>
                    ) : (
                      <div></div>
                    )}

                    <OuterBox component="fieldset">
                      <legend>Active Ingredients</legend>
                      <FieldArray
                        name={'containedProducts[${index}].activeIngredients'}
                      >
                        {arrayHelpers => (
                          <>
                            <ActiveIngredients
                              containedProductIndex={index}
                              activeIngredientsArrayHelpers={arrayHelpers}
                              packageIndex={packageIndex}
                              partOfPackage={partOfPackage}
                            />
                          </>
                        )}
                      </FieldArray>
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
                          as={TextField}
                          name={`${productsArray}[${index}].productDetails.genericForm.pt.term`}
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          InputLabelProps={{ shrink: true }}
                        />
                      </InnerBox>
                      <InnerBox component="fieldset">
                        <legend>Specific Dose Form</legend>
                        <Field
                          as={TextField}
                          name={`${productsArray}[${index}].productDetails.genericForm.pt.term`}
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          InputLabelProps={{ shrink: true }}
                        />
                      </InnerBox>

                      <InnerBox component="fieldset">
                        <legend>Unit of Use</legend>
                        <Field
                          as={TextField}
                          name={`${productsArray}[${index}].productDetails.genericForm.pt.term`}
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          InputLabelProps={{ shrink: true }}
                        />
                      </InnerBox>
                      <InnerBox component="fieldset">
                        <legend>Unit of Use size</legend>

                        <Stack direction="row" spacing={2}>
                          <Grid item xs={2}>
                            <Field
                              as={TextField}
                              name={`${productsArray}[${index}].productDetails.genericForm.pt.term`}
                              fullWidth
                              variant="outlined"
                              margin="dense"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={10}>
                            <Field
                              as={TextField}
                              name={`${productsArray}[${index}].productDetails.genericForm.pt.term`}
                              fullWidth
                              variant="outlined"
                              margin="dense"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        </Stack>
                      </InnerBox>
                      <InnerBox component="fieldset">
                        <legend>Unit of Use Quantity</legend>

                        <Stack direction="row" spacing={2}>
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
                              as={TextField}
                              name={`${productsArray}[${index}].productDetails.genericForm.pt.term`}
                              fullWidth
                              variant="outlined"
                              margin="dense"
                              InputLabelProps={{ shrink: true }}
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
      </CPBox>
    </>
  );
};

const ActiveIngredients = ({
  containedProductIndex,
  activeIngredientsArrayHelpers,
  packageIndex,
  partOfPackage,
}) => {
  //const [number, setNumber] = React.useState("");
  const { values } = useFormikContext();
  const [unitSelection, setUnitSelection] = useState<string>('existing');

  const handleUnitToggleChange = (
    event: React.MouseEvent<HTMLElement>,
    newUnitSelection: string,
  ) => {
    setUnitSelection(newUnitSelection);
  };

  // const handleAddContactNumber = () => {
  //   const contact = {};
  //   contact.number = number;
  //
  //   contactsArrayHelpers.push(contact);
  //   setNumber("");
  // };

  // const handleChange = event => {
  //   setNumber(event.currentTarget.value);
  // };

  const activeIngredients = partOfPackage
    ? values.containedPackages[packageIndex].packageDetails.containedProducts[
        containedProductIndex
      ].productDetails.activeIngredients
    : values.containedProducts[containedProductIndex].productDetails
        .activeIngredients;

  const activeIngredientsArray = partOfPackage
    ? `containedPackages[${packageIndex}].packageDetails.containedProducts[${containedProductIndex}].productDetails.activeIngredients`
    : `containedProducts[${containedProductIndex}].productDetails.activeIngredients`;

  return (
    <>
      {activeIngredients.map((activeIngredient, index) => (
        <div key={activeIngredient.activeIngredient.conceptId + index}>
          <br />
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              //aria-expanded={true}

              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Grid xs={40} item={true}>
                <Typography>
                  {activeIngredient.activeIngredient.pt.term}
                </Typography>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <InnerBox component="fieldset">
                <legend>Intended Active Ingredient</legend>
                <Field
                  as={TextField}
                  //name={`containedProducts[${index}].activeIngredients[${ingIndex}].activeIngredient.conceptId`}
                  name={`${activeIngredientsArray}[${index}].activeIngredient.pt.term`}
                  fullWidth
                  variant="outlined"
                  margin="dense"
                />
              </InnerBox>
              <InnerBox component="fieldset">
                <legend>BoSS</legend>
                <Field
                  as={TextField}
                  //name={`containedProducts[${index}].activeIngredients[${ingIndex}].activeIngredient.conceptId`}
                  name={`${activeIngredientsArray}[${index}].basisOfStrengthSubstance.pt.term`}
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                />
              </InnerBox>
              <InnerBox component="fieldset">
                <legend>Strength</legend>

                <Stack direction="row" spacing={2}>
                  <Grid item xs={7}>
                    <ToggleButtonGroup
                      color="primary"
                      value={unitSelection}
                      exclusive
                      onChange={handleUnitToggleChange}
                      aria-label="Platform"
                    >
                      <ToggleButton value="all">All Units</ToggleButton>
                      <ToggleButton value="existing">
                        Existing Units
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                  <Grid item xs={5}>
                    <Field
                      name={`${activeIngredientsArray}[${index}].totalQuantity.unit.pt.term`}
                      type="text"
                      // component={CountrySelect}
                      label="Country"
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      as={Select}
                    >
                      <MenuItem value={1}>01</MenuItem>
                      <MenuItem value={2}>02</MenuItem>
                    </Field>
                  </Grid>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Grid item xs={4}>
                    <Field
                      as={TextField}
                      //name={`containedProducts[${index}].activeIngredients[${ingIndex}].activeIngredient.conceptId`}
                      name={`${activeIngredientsArray}[${index}].totalQuantity.value`}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Field
                      as={TextField}
                      //name={`containedProducts[${index}].activeIngredients[${ingIndex}].activeIngredient.conceptId`}
                      name={`${activeIngredientsArray}[${index}].totalQuantity.unit.pt.term`}
                      variant="filled"
                      margin="dense"
                      inputProps={{ readOnly: true }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Stack>
              </InnerBox>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
      {/*<input type="text" value={number} onChange={handleChange} />*/}

      {/*<button type="button" onClick={handleAddContactNumber}>*/}
      {/*  add contact to {values.people[personIndex].name}*/}
      {/*</button>*/}
    </>
  );
};

export default ProductAuthoringMain;
