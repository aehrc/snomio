import React, { FC, useState } from 'react';
import {Field, FieldArrayRenderProps, useFormikContext} from 'formik';
import {
  Ingredient,
  MedicationPackageDetails,
} from '../../../types/authoring.ts';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box, Button,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Concept } from '../../../types/concept.ts';
import ProductAutocomplete from './ProductAutocomplete.tsx';
import { Stack } from '@mui/system';
import { experimentalStyled as styled } from '@mui/material/styles';

interface IngredientsProps {
  packageIndex?: number;
  containedProductIndex: number;
  partOfPackage: boolean;
  arrayHelpers:FieldArrayRenderProps;
  ingredients: Concept[];
  units: Concept[];
}
const Ingredients: FC<IngredientsProps> = ({
  containedProductIndex,
  packageIndex,
  partOfPackage,
    arrayHelpers,
  ingredients,
  units,
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

  const handleAddIngredient = () => {
    const ingredient = {};
    arrayHelpers.push(ingredient);

  };


  const activeIngredients = partOfPackage
    ? values.containedPackages[packageIndex as number].packageDetails
        .containedProducts[containedProductIndex].productDetails
        .activeIngredients
    : values.containedProducts[containedProductIndex].productDetails
        .activeIngredients;

  const activeIngredientsArray = partOfPackage
    ? `containedPackages[${packageIndex}].packageDetails.containedProducts[${containedProductIndex}].productDetails.activeIngredients`
    : `containedProducts[${containedProductIndex}].productDetails.activeIngredients`;
  const getKey = (index: number) => {
    return `ingredient-key-${index}`;
  };

  const ingredientsAccordionClicked = (key: string) => {
    if (expandedIngredients.includes(key)) {
      setExpandedIngredients(
        expandedIngredients.filter((value: string) => value !== key),
      );
    } else {
      setExpandedIngredients([...expandedIngredients, key]);
    }
  };

  return (
    <>
      {activeIngredients.map((activeIngredient: Ingredient, index: number) => (
        <div key={activeIngredient.activeIngredient.conceptId}>
          <br />
          <Accordion
            style={{ border: 'none' }}
            key={getKey(index)}
            onChange={() => ingredientsAccordionClicked(getKey(index))}
            expanded={expandedIngredients.includes(getKey(index))}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              //aria-expanded={true}

              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Grid xs={40} item={true}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Grid item xs={4}>
                  <Typography>
                    {activeIngredient.activeIngredient.pt.term}
                  </Typography>
                  </Grid>
                  <Grid container justifyContent="flex-end">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Grid item xs={3}>
                        <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                        >
                          +
                        </button>
                      </Grid>
                      <Grid item xs={3}>
                        <button
                            type="button"
                            onClick={handleAddIngredient}
                        >
                          -
                        </button>
                      </Grid>
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
    </>
  );
};
export default Ingredients;
