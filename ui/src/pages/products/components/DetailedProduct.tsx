import { Field, FieldArray, FieldArrayRenderProps } from 'formik';
import { Concept } from '../../../types/concept.ts';
import { MedicationProductQuantity } from '../../../types/authoring.ts';
import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Stack } from '@mui/system';
import { Delete } from '@mui/icons-material';
import { InnerBox, OuterBox } from './style/ProductBoxes.tsx';
import { ConceptSearchType } from '../../../types/conceptSearch.ts';
import ProductAutocomplete from './ProductAutocomplete.tsx';
import Ingredients from './Ingredients.tsx';
import ConceptService from '../../../api/ConceptService.ts';
import DoseFormAutocomplete from './DoseFormAutocomplete.tsx';
import ConfirmationModal from '../../../themes/overrides/ConfirmationModal.tsx';

interface DetailedProductProps {
  index: number;
  arrayHelpers: FieldArrayRenderProps;
  units: Concept[];
  expandedProducts: string[];
  setExpandedProducts: (value: string[]) => void;
  containedProduct: MedicationProductQuantity;
  showTPU: boolean;
  productsArray: string;
  partOfPackage: boolean;
  packageIndex?: number;
  doseForms: Concept[];
}
function DetailedProduct(props: DetailedProductProps) {
  const {
    index,
    expandedProducts,
    setExpandedProducts,
    arrayHelpers,
    units,
    doseForms,
    containedProduct,
    showTPU,
    productsArray,
    partOfPackage,
    packageIndex,
  } = props;

  const [specialFormDoses, setSpecialFormDoses] = useState<Concept[]>([]);
  const [selectedDoseForm, setSelectedDoseForm] = useState<Concept | null>(
    containedProduct.productDetails?.genericForm
      ? containedProduct.productDetails?.genericForm
      : null,
  );
  const [doseFormsearchInputValue, setDoseFormsearchInputValue] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(-1);
  const [deleteModalContent, setDeleteModalContent] = useState('');

  const handleDeleteProduct = () => {
    arrayHelpers.remove(indexToDelete);
    setDeleteModalOpen(false);
  };
  const productKey = (index: number) => {
    return `product-key-${index}`;
  };
  const productAccordionClicked = (key: string) => {
    if (expandedProducts.includes(key)) {
      setExpandedProducts(
        expandedProducts.filter((value: string) => value !== key),
      );
    } else {
      setExpandedProducts([...expandedProducts, key]);
    }
  };
  const activeIngredientsArray = partOfPackage
    ? `containedPackages[${packageIndex}].packageDetails.containedProducts[${index}].productDetails.activeIngredients`
    : `containedProducts[${index}].productDetails.activeIngredients`;

  useEffect(() => {
    async function fetchSpecialFormDoses() {
      setSpecialFormDoses([]);
      try {
        // alert(selectedDoseForm);
        if (selectedDoseForm != null) {
          const conceptId = selectedDoseForm.conceptId.trim();
          const ecl = '<' + conceptId;

          const concepts = await ConceptService.searchConceptByEcl(ecl);
          setSpecialFormDoses(concepts);
        } else {
          setDoseFormsearchInputValue('');
        }
      } catch (error) {
        console.log(error);
      }
    }
    void fetchSpecialFormDoses().then(r => r);
  }, [selectedDoseForm]);
  return (
    <div key={productKey(index)} style={{ marginTop: '10px' }}>
      <ConfirmationModal
        open={deleteModalOpen}
        content={deleteModalContent}
        handleClose={() => {
          setDeleteModalOpen(false);
        }}
        title={'Confirm Delete Product'}
        disabled={disabled}
        action={'Delete'}
        handleAction={handleDeleteProduct}
      />
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
                <Typography
                  sx={{
                    color: !containedProduct.productDetails?.productName
                      ? 'red'
                      : 'inherit',
                  }}
                >
                  {containedProduct.productDetails?.productName
                    ? containedProduct.productDetails?.productName?.pt.term
                    : 'Untitled*'}
                </Typography>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Stack direction="row" spacing={0} alignItems="center">
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={e => {
                      setIndexToDelete(index);

                      setDeleteModalContent(
                        `Remove the product  "${
                          containedProduct.productDetails?.productName
                            ? containedProduct.productDetails?.productName?.pt
                                .term
                            : 'Untitled'
                        }?"`,
                      );
                      setDeleteModalOpen(true);
                      e.stopPropagation();
                    }}
                    color="error"
                    sx={{ mt: 0.25 }}
                  >
                    <Tooltip title={'Delete Product'}>
                      <Delete />
                    </Tooltip>
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
                      getOptionLabel={(option: Concept) => option.pt.term}
                      searchType={ConceptSearchType.brandProducts}
                      component={ProductAutocomplete}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      // disableClearable={true}
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
                          partOfPackage ? (packageIndex as number) : undefined
                        }
                        partOfPackage={partOfPackage}
                        arrayHelpers={arrayHelpers}
                        units={units}
                      />
                    </>
                  )}
                </FieldArray>
                {/*<pre>{JSON.stringify(values.containedProducts[0].productDetails.activeIngredients, null, 2)}</pre>*/}
              </OuterBox>
            </Grid>
            <Grid xs={6} key={'right'} item={true}>
              <OuterBox component="fieldset">
                <legend>Dose Forms</legend>
                <InnerBox component="fieldset">
                  <legend>Generic Dose Form</legend>
                  <Field
                    name={`${productsArray}[${index}].productDetails.genericForm`}
                    id={`${productsArray}[${index}].productDetails.genericForm`}
                    getOptionLabel={(option: Concept) => option.pt.term}
                    setval={setSelectedDoseForm}
                    optionValues={doseForms}
                    searchType={ConceptSearchType.doseForms}
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
                    getOptionLabel={(option: Concept) => option.pt.term}
                    optionValues={specialFormDoses}
                    inputValue={doseFormsearchInputValue}
                    setInputValue={setDoseFormsearchInputValue}
                    component={DoseFormAutocomplete}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                  />
                </InnerBox>

                <InnerBox component="fieldset">
                  <legend>Unit Size</legend>

                  <Stack direction="row" spacing={2} alignItems={'center'}>
                    <Grid item xs={2}>
                      <Field
                        as={TextField}
                        name={`${productsArray}[${index}].productDetails.quantity.value`}
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        value={
                          containedProduct.productDetails?.quantity?.value || ''
                        }
                      />
                    </Grid>
                    <Grid item xs={10}>
                      <Field
                        name={`${productsArray}[${index}].productDetails.quantity.unit`}
                        id={`${productsArray}[${index}].productDetails.quantity.unit`}
                        optionValues={units}
                        getOptionLabel={(option: Concept) => option.pt.term}
                        searchType={ConceptSearchType.units}
                        component={ProductAutocomplete}
                      />
                    </Grid>
                  </Stack>
                </InnerBox>
                <InnerBox component="fieldset">
                  <legend>Pack Size</legend>

                  <Stack direction="row" spacing={2} alignItems={'center'}>
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
                        getOptionLabel={(option: Concept) => option.pt.term}
                        searchType={ConceptSearchType.units}
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
}
export default DetailedProduct;
