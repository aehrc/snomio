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
import ProductCard from './ProductCard.tsx';
import { useEffect, useState } from 'react';
import { isFsnToggleOn } from '../../../utils/helpers/conceptUtils.ts';
import { Stack } from '@mui/system';

interface ProductTypeGroupProps {
  productLabelItems: Product[];
  label: string;
}
function ProductTypeGroup({ productLabelItems, label }: ProductTypeGroupProps) {
  const [activeConcept, setActiveConcept] = useState<string>();
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
  const ProductPanel = (product: Product, fsnToggle: boolean) => {
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

    const getColorByDefinitionStatus = (): string => {
      return product.concept.definitionStatus === DefinitionStatus.Primitive
        ? '#99CCFF'
        : '#CCCCFF';
    };
    const calledFunction = () => setActiveConcept(product.concept.conceptId);
    return (
      <Grid>
        <Accordion
          defaultExpanded={false}
          onChange={(e, expanded) => {
            if (expanded) {
              calledFunction();
              return;
            } else {
              setActiveConcept(undefined);
            }
          }}
        >
          <AccordionSummary
            sx={{
              backgroundColor: activeConcept
                ? 'yellow'
                : getColorByDefinitionStatus,
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
              <Stack direction="row" spacing={2}>
                <Typography style={{ color: '#184E6B' }}>
                  {fsnToggle ? 'PT' : 'FSN'}:
                </Typography>
                <Typography>
                  {fsnToggle
                    ? product.concept.pt.term
                    : product.concept.fsn.term}
                </Typography>
              </Stack>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
    );
  };
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
            {productLabelItems?.map(p => {
              return <ProductPanel label={p.label} concept={p.concept} />;
            })}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}

export default ProductTypeGroup;
