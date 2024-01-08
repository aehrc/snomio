import React, { useState } from 'react';
import {
  Ingredient,
  MedicationPackageDetails,
} from '../../../types/product.ts';
import { Grid, IconButton, Tooltip } from '@mui/material';

import { AddCircle } from '@mui/icons-material';
import { Concept } from '../../../types/concept.ts';

import {
  Control,
  useFieldArray,
  UseFormGetValues,
  UseFormRegister,
} from 'react-hook-form';
import { defaultIngredient } from '../../../utils/helpers/conceptUtils.ts';
import DetailedIngredient from './DetailedIngredient.tsx';
import { FieldBindings } from '../../../types/FieldBindings.ts';

interface IngredientsProps {
  packageIndex?: number;
  containedProductIndex: number;
  partOfPackage: boolean;

  control: Control<MedicationPackageDetails>;
  register: UseFormRegister<MedicationPackageDetails>;
  branch: string;
  fieldBindings: FieldBindings;
  getValues: UseFormGetValues<MedicationPackageDetails>;
  defaultUnit: Concept;
}
function Ingredients(props: IngredientsProps) {
  const {
    containedProductIndex,
    packageIndex,
    partOfPackage,

    control,
    register,
    branch,
    fieldBindings,
    getValues,
    defaultUnit,
  } = props;
  //const [number, setNumber] = React.useState("");
  const [expandedIngredients, setExpandedIngredients] = useState<string[]>([]);
  const activeIngredientsArray = partOfPackage
    ? `containedPackages[${packageIndex}].packageDetails.containedProducts[${containedProductIndex}].productDetails.activeIngredients`
    : `containedProducts[${containedProductIndex}].productDetails.activeIngredients`;
  const {
    fields: ingredientFields,
    append: ingredientAppend,
    remove: ingredientRemove,
  } = useFieldArray({
    control,
    name: partOfPackage
      ? (`containedPackages[${packageIndex}].packageDetails.containedProducts[${containedProductIndex}].productDetails.activeIngredients` as 'containedProducts.0.productDetails.activeIngredients')
      : (`containedProducts[${containedProductIndex}].productDetails.activeIngredients` as 'containedProducts.0.productDetails.activeIngredients'),
  });

  return (
    <>
      <div key={`ingredients-${containedProductIndex}`}>
        <Grid container justifyContent="flex-end">
          <IconButton
            onClick={() => {
              ingredientAppend(defaultIngredient(defaultUnit));
            }}
            aria-label="create"
            size="large"
          >
            <Tooltip title={'Add new Ingredient'}>
              <AddCircle fontSize="inherit" />
            </Tooltip>
          </IconButton>
        </Grid>

        {ingredientFields.map((activeIngredient, index) => {
          return (
            <DetailedIngredient
              expandedIngredients={expandedIngredients}
              setExpandedIngredients={setExpandedIngredients}
              activeIngredient={activeIngredient as Ingredient}
              ingredientIndex={index}
              control={control}
              register={register}
              branch={branch}
              ingredientRemove={ingredientRemove}
              activeIngredientsArray={activeIngredientsArray}
              key={activeIngredient.id}
              fieldBindings={fieldBindings}
              getValues={getValues}
            />
          );
        })}
      </div>
    </>
  );
}

export default Ingredients;
