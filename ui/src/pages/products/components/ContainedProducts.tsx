import { FieldArrayRenderProps, useFormikContext } from 'formik';
import React, { FC, useState } from 'react';
import {
  MedicationPackageDetails,
  MedicationProductQuantity,
} from '../../../types/authoring.ts';
import { Concept } from '../../../types/concept.ts';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { Stack } from '@mui/system';
import { AddCircle } from '@mui/icons-material';

import ProductSearchAndAddModal from './ProductSearchAndAddModal.tsx';
import SearchAndAddIcon from '../../../components/icons/SearchAndAddIcon.tsx';
import { Level1Box, Level2Box } from './style/ProductBoxes.tsx';

import DetailedProduct from './DetailedProduct.tsx';

interface ContainedProductsProps {
  packageIndex?: number;
  partOfPackage: boolean;
  showTPU: boolean;
  arrayHelpers: FieldArrayRenderProps;
  units: Concept[];
  doseForms: Concept[];
}
const ContainedProducts: FC<ContainedProductsProps> = ({
  packageIndex,
  partOfPackage,
  showTPU,
  arrayHelpers,
  units,
  doseForms,
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

  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const handleToggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const handleSearchAndAddProduct = () => {
    handleToggleModal();
    // setValue(newValue);
  };

  const ProductDetails = () => {
    return (
      <div key={'product-details'}>
        <Grid container justifyContent="flex-end">
          <Stack direction="row" spacing={0} alignItems="center">
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
              <Tooltip title={'Create new product'}>
                <AddCircle fontSize="medium" />
              </Tooltip>
            </IconButton>

            <Tooltip title={'Search and add an existing product'}>
              <IconButton
                aria-label="create"
                size="large"
                onClick={handleSearchAndAddProduct}
              >
                <SearchAndAddIcon width={'20px'} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
        <ProductSearchAndAddModal
          open={modalOpen}
          handleClose={handleToggleModal}
          arrayHelpers={arrayHelpers}
        />

        {containedProducts.map((containedProduct, index) => {
          return (
            <DetailedProduct
              index={index}
              arrayHelpers={arrayHelpers}
              units={units}
              expandedProducts={expandedProducts}
              setExpandedProducts={setExpandedProducts}
              containedProduct={containedProduct}
              showTPU={showTPU}
              productsArray={productsArray}
              partOfPackage={partOfPackage}
              packageIndex={packageIndex}
              key={`product-${index}`}
              doseForms={doseForms}
            />
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

export default ContainedProducts;
