import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { Product, ProductModel } from '../../types/concept.ts';
import useConceptStore from '../../stores/ConceptStore.ts';
import { useParams } from 'react-router-dom';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;
import conceptService from '../../api/ConceptService.ts';
import { Box } from '@mui/material';
import ProductLabelGroup from './components/ProductLabelGroup.tsx';
import { filterByLabel } from '../../utils/helpers/conceptUtils.ts';
import ProductModelGraph from "./components/ProductModelGraph.tsx";



function ProductModelLayout() {
  const [productModel, setProductModel] = useState<ProductModel>();
  const conceptStore = useConceptStore();
  const { id } = useParams();


  useEffect(() => {
    conceptService
      .getConceptModel(id as string)
      .then(e => setProductModel(e))
      .catch(error);
  }, [id, conceptStore]);

  return (
    <Box sx={{ width: '100%' }}>
      <ProductModelGraph productModel={productModel as ProductModel}/>
    </Box>
  );
}

export default ProductModelLayout;
