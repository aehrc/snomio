import {
  AccordionDetails,
  AccordionSummary, DialogTitle,
  Grid,
  Link, Popover, Switch, Tooltip,
  Typography, withStyles,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  DefinitionStatus, Edge,
  Product,
  ProductModel,
} from '../../types/concept.ts';
import useConceptStore from '../../stores/ConceptStore.ts';
import { useParams } from 'react-router-dom';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;
import conceptService from '../../api/ConceptService.ts';
import { Box } from '@mui/material';
import ProductTypeGroup from './components/ProductTypeGroup.tsx';
import {filterByLabel, findProductUsingId, findRelations} from '../../utils/helpers/conceptUtils.ts';
import { experimentalStyled as styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Stack } from '@mui/system';
import LinkViews from "./components/LinkViews.tsx";
import {Button} from "@mantine/core";

function ProductModelLayout() {
  const [productModel, setProductModel] = useState<ProductModel>();
  const conceptStore = useConceptStore();
  const { id } = useParams();
  const lableTypesRight = ['TP', 'TPUU', 'TPP'];
  const lableTypesLeft = ['MP', 'MPUU', 'MPP'];
  const lableTypesCentre = ['CTPP'];
  const [activeConcept, setActiveConcept] = useState<string>();

  useEffect(() => {
    conceptService
      .getConceptModel(id as string)
      .then(e => setProductModel(e))
      .catch(error);
  }, [id, conceptStore]);
  interface ProductTypeGroupProps {
    productLabelItems: Product[];
    label: string;
  }

  function ProductTypeGroup({
    productLabelItems,
    label,
  }: ProductTypeGroupProps) {
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
       const links = activeConcept ? findRelations(productModel?.edges as Edge[], activeConcept, product.concept.conceptId) : [];

      const getColorByDefinitionStatus = (): string => {
        return product.concept.definitionStatus === DefinitionStatus.Primitive
          ? '#99CCFF'
          : '#CCCCFF';
      };

      return (
        <Grid>

          <Accordion
            //defaultExpanded={true}
            //renderActiveOnly={false}
            // onChange={(e, expanded) => {
            //   if (expanded) {
            //
            //
            //   } else {
            //     setActiveConcept(undefined);
            //   }
            // }}
            onClick={(e) => {
              e.stopPropagation();
             setActiveConcept(product.concept.conceptId);

              //if(e.target.)
            }}
          >
            <AccordionSummary
              sx={{
                backgroundColor:  getColorByDefinitionStatus,
              }}
              expandIcon={<ExpandMoreIcon />}
              //aria-expanded={true}

              aria-controls="panel1a-content"
              id="panel1a-header"
            >

              {links.length > 0 ? (<Grid xs={40} item={true} style={{backgroundColor:"yellow"}}>
                <Tooltip title={<LinkViews links={links} linkedConcept={findProductUsingId(activeConcept as string, productModel?.nodes as Product[]) as Product} currentConcept={product} key={product.concept.conceptId}/>}
                         componentsProps={{
                           tooltip: {
                             sx: {
                               bgcolor: "#9bddff",
                               color: "#262626",
                               border: "1px solid #888888",
                               borderRadius:"15px"
                             }
                           }
                         }}>
                  <Typography>
                    {fsnToggle ? product.concept.fsn.term : product.concept.pt.term}
                  </Typography>
                </Tooltip>


              </Grid>) :(<Grid xs={40} item={true}><Typography>
                {fsnToggle ? product.concept.fsn.term : product.concept.pt.term}
              </Typography></Grid>)}

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
                {/*<Switch*/}
                {/*    checked={checked}*/}
                {/*    onChange={(event) => {*/}
                {/*      //if(event.i)*/}
                {/*      event.stopPropagation();*/}
                {/*      if (event.currentTarget.checked) {*/}
                {/*        //setActiveConcept(product.concept.conceptId);*/}
                {/*        setChecked(true);*/}
                {/*      }else {*/}
                {/*        setChecked(false);*/}
                {/*      }*/}
                {/*    }*/}

                {/*    }*/}
                {/*    inputProps={{ 'aria-label': 'controlled' }}*/}
                {/*/>*/}
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
            <Typography key={label+"-lists"}>
              {productLabelItems?.map(p => {
                return <ProductPanel label={p.label} concept={p.concept}  key={p.concept.conceptId}/>;
              })}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid xs={6} key={'left'} item={true}>
          {lableTypesLeft.map(label => (
            <ProductTypeGroup
                key={label}
              label={label}
              productLabelItems={filterByLabel(
                productModel?.nodes as Product[],
                label,
              )}
            />
          ))}
        </Grid>
        <Grid xs={6} key={'right'} item={true}>
          {lableTypesRight.map(label => (
            <ProductTypeGroup
              label={label}
              key={label}
              productLabelItems={filterByLabel(
                productModel?.nodes as Product[],
                label,
              )}
            />
          ))}
        </Grid>
        <Grid xs={12} key={'bottom'} item={true}>
          {lableTypesCentre.map(label => (
            <ProductTypeGroup
              label={label}
              key={label}
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
