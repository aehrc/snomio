import { experimentalStyled as styled } from '@mui/material/styles';
import {
  AccordionDetails,
  AccordionSummary,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { DefinitionStatus, Product } from '../../../types/concept.ts';
import { Accordion } from '@mantine/core';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { isFsnToggleOn } from '../../../utils/helpers/conceptUtils.ts';
import { useEffect, useState } from 'react';
import { Stack } from '@mui/system';

interface ProductCardProps {
  product: Product;
}
function ProductLabelGroup({ product }: ProductCardProps) {
  const [fsnToggle, setFsnToggle] = useState(isFsnToggleOn());

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
  useEffect(() => {
    setFsnToggle(isFsnToggleOn);
    // localStorage.setItem('fsn_toggle', fsnToggle.toString());
  }, [fsnToggle]);
  const getColorByDefinitionStatus = (): string => {
    return product.concept.definitionStatus === DefinitionStatus.Primitive
      ? '#4A80A3 '
      : ' #aed0ea';
  };
  return (
    <Grid>
      <Accordion defaultExpanded={false}>
        <AccordionSummary
          sx={{
            backgroundColor: getColorByDefinitionStatus,
          }}
          expandIcon={<ExpandMoreIcon />}
          //aria-expanded={true}

          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            {fsnToggle ? product.concept.fsn.term : product.concept.pt.term}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <Stack direction="row" spacing={2}>
              <span style={{ color: '#184E6B' }}>Concept Id:</span>
              <Link>{product.concept.conceptId}</Link>
            </Stack>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}

export default ProductLabelGroup;
