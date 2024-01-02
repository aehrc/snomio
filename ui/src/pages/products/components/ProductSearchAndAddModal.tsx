import React, { useState } from 'react';
import BaseModal from '../../../components/modal/BaseModal';
import BaseModalBody from '../../../components/modal/BaseModalBody';
import BaseModalHeader from '../../../components/modal/BaseModalHeader';
import BaseModalFooter from '../../../components/modal/BaseModalFooter';
import { Button } from '@mui/material';
import SearchProduct from './SearchProduct.tsx';
import { Concept } from '../../../types/concept.ts';
import ConceptService from '../../../api/ConceptService.ts';
import {
  MedicationProductQuantity,
  ProductType,
} from '../../../types/product.ts';
import { generateEclFromBinding } from '../../../utils/helpers/EclUtils.ts';
import { useSnackbar } from 'notistack';
import { UseFieldArrayAppend } from 'react-hook-form';
import { isDeviceType } from '../../../utils/helpers/conceptUtils.ts';
import { FieldBindings } from '../../../types/FieldBindings.ts';

interface ProductSearchAndAddModalProps {
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productAppend: UseFieldArrayAppend<any, 'containedProducts'>;
  productType: ProductType;
  branch: string;
  fieldBindings: FieldBindings;
}
export default function ProductSearchAndAddModal({
  open,
  handleClose,
  productAppend,
  productType,
  branch,
  fieldBindings,
}: ProductSearchAndAddModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<Concept | null>(null);
  const handleSelectedProductChange = (concept: Concept | null) => {
    setSelectedProduct(concept);
  };
  const { enqueueSnackbar } = useSnackbar();
  const [searchInputValue, setSearchInputValue] = useState('');

  const handleSubmit = () => {
    if (selectedProduct && selectedProduct.conceptId) {
      void (async () => {
        try {
          const productDetails = await ConceptService.fetchMedicationProduct(
            selectedProduct.conceptId as string,
            branch,
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
          providedEcl={generateEclFromBinding(
            fieldBindings,
            isDeviceType(productType)
              ? 'deviceProduct.add.productName'
              : 'medicationProduct.add.productName',
          )}
          inputValue={searchInputValue}
          setInputValue={setSearchInputValue}
          showDeviceSearch={false}
          branch={branch}
          fieldBindings={fieldBindings}
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
