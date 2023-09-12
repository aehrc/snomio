import { experimentalStyled as styled } from '@mui/material/styles';
import {
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import { Product } from '../../../types/concept.ts';
import { Accordion } from '@mantine/core';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ProductCard from './ProductCard.tsx';

interface ProductLabelGroupProps {
  productLabelItems: Product[];
  label: string;
}
function ProductLabelGroup({
  productLabelItems,
  label,
}: ProductLabelGroupProps) {
  const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    //backgroundColor:"white",
    border: `3px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));
  return (
    <Grid>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          //aria-expanded={true}

          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography key={label}>
            {productLabelItems?.map(product => {
              return <ProductCard product={product} />;
            })}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}

export default ProductLabelGroup;
