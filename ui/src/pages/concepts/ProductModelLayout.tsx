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

function ProductModelLayout() {
  const [productModel, setProductModel] = useState<ProductModel>();
  const conceptStore = useConceptStore();
  const { id } = useParams();
  const lableTypesRight = ['TP', 'TPUU', 'TPP'];
  const lableTypesLeft = ['MP', 'MPUU', 'MPP'];
  const lableTypesCentre = ['CTPP'];

  useEffect(() => {
    conceptService
      .getConceptModel(id as string)
      .then(e => setProductModel(e))
      .catch(error);
  }, [id, conceptStore]);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid xs={6} key={'left'}>
          {lableTypesLeft.map(label => (
            <ProductLabelGroup
              label={label}
              productLabelItems={filterByLabel(
                productModel?.nodes as Product[],
                label,
              )}
            />
          ))}
        </Grid>
        <Grid xs={6} key={'right'}>
          {lableTypesRight.map(label => (
            <ProductLabelGroup
              label={label}
              productLabelItems={filterByLabel(
                productModel?.nodes as Product[],
                label,
              )}
            />
          ))}
        </Grid>
        <Grid xs={12} key={'bottom'}>
          {lableTypesCentre.map(label => (
            <ProductLabelGroup
              label={label}
              productLabelItems={filterByLabel(
                productModel?.nodes as Product[],
                label,
              )}
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProductModelLayout;
