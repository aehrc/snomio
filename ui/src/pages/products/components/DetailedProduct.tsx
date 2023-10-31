import { Concept } from '../../../types/concept.ts';
import {
  DeviceProductQuantity,
  MedicationPackageDetails,
  MedicationProductQuantity,
  ProductType,
} from '../../../types/product.ts';
import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Stack } from '@mui/system';
import { Delete } from '@mui/icons-material';
import { InnerBox, OuterBox } from './style/ProductBoxes.tsx';
import { ConceptSearchType } from '../../../types/conceptSearch.ts';
import Ingredients from './Ingredients.tsx';

import ConfirmationModal from '../../../themes/overrides/ConfirmationModal.tsx';
import ProductAutocomplete from './ProductAutocomplete.tsx';
import {
  Control,
  UseFieldArrayRemove,
  UseFormRegister,
  useWatch,
} from 'react-hook-form';
import DoseForms from './DoseForm.tsx';
import {
  isDeviceType,
  isValidConceptName,
} from '../../../utils/helpers/conceptUtils.ts';
import DeviceTypeForms from './DeviceTypeForm.tsx';

interface DetailedProductProps {
  index: number;
  units: Concept[];
  expandedProducts: string[];
  setExpandedProducts: (value: string[]) => void;
  containedProduct: MedicationProductQuantity | DeviceProductQuantity;
  showTPU?: boolean;
  productsArray: string;
  partOfPackage: boolean;
  packageIndex?: number;
  doseForms?: Concept[];
  medicationDeviceTypes?: Concept[];
  deviceDeviceTypes?: Concept[];
  brandProducts: Concept[];
  ingredients?: Concept[];
  containerTypes: Concept[];
  control: Control<any>;
  register: UseFormRegister<any>;
  productRemove: UseFieldArrayRemove;
  productType: ProductType;
}
function DetailedProduct(props: DetailedProductProps) {
  const {
    index,
    expandedProducts,
    setExpandedProducts,

    units,
    doseForms,
    containedProduct,
    showTPU,
    productsArray,
    partOfPackage,
    packageIndex,
    brandProducts,
    ingredients,
    control,
    register,
    productRemove,
    productType,
    containerTypes,
    medicationDeviceTypes,
    deviceDeviceTypes,
  } = props;

  const [disabled, setDisabled] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(-1);
  const [deleteModalContent, setDeleteModalContent] = useState('');

  const handleDeleteProduct = () => {
    productRemove(indexToDelete);
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
                <ProductNameWatched
                  control={control}
                  index={index}
                  productsArray={productsArray}
                />
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
                          isValidConceptName(
                            containedProduct.productDetails
                              ?.productName as Concept,
                          )
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
                    <ProductAutocomplete
                      optionValues={brandProducts}
                      searchType={
                        isDeviceType(productType)
                          ? ConceptSearchType.device_brand_products
                          : ConceptSearchType.brandProducts
                      }
                      name={`${productsArray}[${index}].productDetails.productName`}
                      control={control}
                    />
                  </InnerBox>
                </OuterBox>
              ) : (
                <div></div>
              )}

              {!isDeviceType(productType) ? (
                <OuterBox component="fieldset">
                  <legend>Active Ingredients</legend>

                  <Ingredients
                    containedProductIndex={index}
                    packageIndex={
                      partOfPackage ? (packageIndex as number) : undefined
                    }
                    partOfPackage={partOfPackage}
                    units={units}
                    ingredients={ingredients as Concept[]}
                    control={control}
                    register={register}
                  />
                </OuterBox>
              ) : (
                <div></div>
              )}
            </Grid>
            {!isDeviceType(productType) ? (
              <DoseForms
                productsArray={productsArray}
                control={control}
                register={register}
                doseForms={doseForms as Concept[]}
                units={units}
                medicationDeviceTypes={medicationDeviceTypes as Concept[]}
                containerTypes={containerTypes}
                index={index}
                containedProduct={containedProduct as MedicationProductQuantity}
              />
            ) : (
              <DeviceTypeForms
                productsArray={productsArray}
                control={control}
                register={register}
                units={units}
                index={index}
                deviceDeviceTypes={deviceDeviceTypes as Concept[]}
                containedProduct={containedProduct as DeviceProductQuantity}
              />
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
function ProductNameWatched({
  control,
  index,
  productsArray,
}: {
  control: Control<MedicationPackageDetails>;
  index: number;
  productsArray: string;
}) {
  const productName = useWatch({
    control,
    name: `${productsArray}[${index}].productDetails.productName` as 'containedProducts.0.productDetails.productName', // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
  }) as Concept;

  return (
    <Typography
      sx={{
        color: !isValidConceptName(productName) ? 'red' : 'inherit',
      }}
    >
      {isValidConceptName(productName) ? productName.pt.term : 'Untitled*'}
    </Typography>
  );
}
export default DetailedProduct;
