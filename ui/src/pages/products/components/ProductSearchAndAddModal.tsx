import React, { useState } from 'react';
import BaseModal from '../../../components/modal/BaseModal';
import BaseModalBody from '../../../components/modal/BaseModalBody';
import BaseModalHeader from '../../../components/modal/BaseModalHeader';
import BaseModalFooter from '../../../components/modal/BaseModalFooter';
import { Button } from '@mui/material';
import SearchProduct from './SearchProduct.tsx';
import { Concept } from '../../../types/concept.ts';
import ConceptService from '../../../api/ConceptService.ts';
import { FieldArrayRenderProps } from 'formik';
import {
  MedicationPackageDetails,
  MedicationProductQuantity,
} from '../../../types/authoring.ts';
import { ECL_EXISTING_PRODUCT_TO_PACKAGE } from '../../../utils/helpers/EclUtils.ts';
import { useSnackbar } from 'notistack';
import { UseFieldArrayAppend } from 'react-hook-form';
import containedProducts from './ContainedProducts.tsx';

interface ProductSearchAndAddModalProps {
  open: boolean;
  handleClose: () => void;
  productAppend: UseFieldArrayAppend<
    MedicationPackageDetails,
    'containedProducts'
  >;
}
export default function ProductSearchAndAddModal({
  open,
  handleClose,
  productAppend,
}: ProductSearchAndAddModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<Concept | null>(null);
  const handleSelectedProductChange = (concept: Concept | null) => {
    setSelectedProduct(concept);
  };
  const { enqueueSnackbar } = useSnackbar();
  const [searchInputValue, setSearchInputValue] = useState('');

  const handleSubmit = () => {
    if (selectedProduct) {
      void (async () => {
        try {
          const productDetails = await ConceptService.fetchMedicationProduct(
            selectedProduct.conceptId,
          );
          // packageDetails.containedProducts.map(p => arrayHelpers.push(p));

          const productQuantity: MedicationProductQuantity = {
            productDetails: productDetails,
          };
          productAppend(productQuantity);
          handleClose();
        } catch (error) {
          handleClose();
          enqueueSnackbar(
            `Unable to retrieve the details for [${selectedProduct.pt.term}-${selectedProduct.conceptId}]`,
            {
              variant: 'error',
            },
          );
        }
      })();
    }
  };
  return (
    <BaseModal open={open} handleClose={handleClose}>
      <BaseModalHeader title="Add an existing Product" />
      <BaseModalBody>
        <SearchProduct
          disableLinkOpen={true}
          handleChange={handleSelectedProductChange}
          providedEcl={ECL_EXISTING_PRODUCT_TO_PACKAGE}
          inputValue={searchInputValue}
          setInputValue={setSearchInputValue}
          showDeviceSearch={false}
        />
      </BaseModalBody>
      <BaseModalFooter
        startChildren={<></>}
        endChildren={
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedProduct}
          >
            Add Product
          </Button>
        }
      />
    </BaseModal>
  );
}
