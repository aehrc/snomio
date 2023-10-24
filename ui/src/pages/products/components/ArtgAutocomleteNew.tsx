import { Autocomplete, TextField } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';
import { Concept } from '../../../types/concept.ts';
import useDebounce from '../../../hooks/useDebounce.tsx';

import { useSearchConcepts } from '../../../hooks/api/useInitializeConcepts.tsx';
import { ConceptSearchType } from '../../../types/conceptSearch.ts';
import {ExternalIdentifier, MedicationPackageDetails} from "../../../types/authoring.ts";
import {Control, Controller} from "react-hook-form";

interface ArtgAutoCompleteNewProps {
  onChange: (value: any) => void;
  value:any
  optionValues:Concept[];
}
const ArtgAutoCompleteNew: FC<ArtgAutoCompleteNewProps> = ({
  onChange,optionValues,value,

  ...props
}) => {

  return (

      <Autocomplete
                  options={optionValues}
                  multiple
                  freeSolo
                  // getOptionLabel={option => option.pt.term}
                  renderInput={params => (
                      <TextField {...params} />
                  )}

                  onChange={(e, values: any[]) =>
                  {
                    const tempValues: ExternalIdentifier[] = [];
                    values.map(v => {
                      if (typeof v === 'string') {
                        const artg: ExternalIdentifier = {
                          identifierScheme: 'https://www.tga.gov.au/artg',
                          identifierValue: v,
                        };
                        tempValues.push(artg);
                      } else {
                        tempValues.push(v as ExternalIdentifier);
                      }
                    });
                    onChange(tempValues);
                  }
                  }
                  {...props}
                  value={value || null}
              />


  );

};
export default ArtgAutoCompleteNew;
