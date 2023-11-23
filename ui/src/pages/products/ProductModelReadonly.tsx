import React from 'react';
import { ProductModel } from '../../types/concept.ts';
import { useLocation, useParams } from 'react-router-dom';

import ProductModelEdit from './ProductModelEdit.tsx';
import ProductModelView from './ProductModelView.tsx';

interface LocationState {
  productModel: ProductModel;
  branch: string;
}
function ProductModelReadonly() {
  const location = useLocation();
  const { id } = useParams();

  if (location !== null && location.state) {
    const locationState = location.state as LocationState;
    if (locationState.productModel !== null) {
      return (
        <ProductModelEdit
          productModel={locationState.productModel}
          readOnlyMode={true}
          branch={locationState.branch}
        />
      );
    }
  } else if (id) {
    return <ProductModelView />;
  }
}

export default ProductModelReadonly;
