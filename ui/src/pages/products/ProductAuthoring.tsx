import React, { useEffect, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import SearchProduct from './components/SearchProduct.tsx';
import useConceptStore from '../../stores/ConceptStore.ts';
import conceptService from '../../api/ConceptService.ts';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;
import { MedicationPackageDetails } from '../../types/authoring.ts';
import { Grid } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import ProductAuthoringMain from './components/ProductAuthoringMain.tsx';

function ProductAuthoring() {
  const { activeProduct } = useConceptStore();
  const [packageDetails, setPackageDetails] =
    useState<MedicationPackageDetails>();
  const [name, setName] = useState<string>('Random');
  const theme = useTheme();
  useEffect(() => {
    conceptService
      .fetchMedication(activeProduct ? activeProduct.conceptId : '')
      .then(mp => {
        setPackageDetails(mp);
        console.log(packageDetails?.productName.conceptId);
        if (packageDetails) {
          setName(packageDetails.productName.conceptId);
        }
      })
      .catch(error);
  }, [activeProduct]);

  return (
    <Grid>
      <h1>Product Authoring</h1>
      <Grid item sm={3} xs={false}>
        <span>Load an existing product</span>
        <SearchProduct authoring={true} />
      </Grid>

      {packageDetails && packageDetails.productName ? (
        <Grid>
          <ProductAuthoringMain packageDetails={packageDetails} show={true} />{' '}
        </Grid>
      ) : (
        <Grid>Hello</Grid>
      )}
    </Grid>
  );
}
export default ProductAuthoring;
