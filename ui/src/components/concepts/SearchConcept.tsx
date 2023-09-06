import React, { useEffect, useState } from 'react';

import { Autocomplete } from '@mui/lab';
import { Grid, TextField } from '@mui/material';
import { Concept } from '../../types/concept.ts';
import useDebounce from '../../hooks/useDebounce.tsx';
import conceptService from '../../api/ConceptService.ts';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import MedicationIcon from '@mui/icons-material/Medication';
import { Stack } from '@mui/system';
import IconButton from '../@extended/IconButton.tsx';
import { Link } from 'react-router-dom';
import { isArtgId, isSctId } from '../../utils/helpers/conceptUtils.ts';

export default function SearchConcept() {
  const localFsnToggle =
    localStorage.getItem('fsn_toggle') === 'true' ? true : false;
  const [results, setResults] = useState<Concept[]>([]);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [fsnToggle, setFsnToggle] = useState(localFsnToggle);
  const [searchFilter, setSearchFilter] = useState('Term');
  const filterTypes = ['Term', 'ArtgId', 'SctId'];

  const handleTermDisplayToggleChange = () => {
    setFsnToggle(!fsnToggle);
  };

  const checkItemAlreadyExists = (search: string): boolean => {
    const result = results.filter(
      concept =>
        search.includes(concept.conceptId) ||
        search.includes(concept.pt.term) ||
        search.includes(concept.fsn.term),
    );
    return result.length > 0 ? true : false;
  };
  const getTermDisplay = (concept: Concept): string => {
    return fsnToggle ? concept.fsn.term : concept.pt.term;
  };
  const debouncedSearch = useDebounce(inputValue, 400);
  useEffect(() => {
    localStorage.setItem('fsn_toggle', fsnToggle.toString());
    async function fetchData() {
      setLoading(true);
      setResults([]);
      try {
        let concepts: Concept[] = [];
        if (searchFilter === 'Term') {
          concepts = await conceptService.searchConcept(inputValue);
        } else if (searchFilter === 'SctId' && isSctId(inputValue)) {
          concepts = await conceptService.searchConceptById(inputValue);
        } else if (searchFilter === 'ArtgId' && isArtgId(inputValue)) {
          concepts = await conceptService.searchConceptByArtgId(inputValue);
        }
        setResults(concepts);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }

    if (
      debouncedSearch &&
      debouncedSearch.length > 2 &&
      !checkItemAlreadyExists(debouncedSearch)
    ) {
      void fetchData().then(r => r);
    }
  }, [debouncedSearch, fsnToggle]);
  return (
    <Grid item xs={12} sm={12} md={12} lg={12}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', paddingLeft: '1rem' }}
      >
        <Autocomplete
          style={{ width: '130px' }}
          //value={searchFilter}
          autoComplete
          disableClearable
          onInputChange={(e, value) => {
            setSearchFilter(value);
            setResults([]);
            setInputValue('');
          }}
          options={filterTypes}
          value={searchFilter}
          renderInput={params => (
            <TextField
              {...params}
              label="Search Filter"
              variant="outlined"
              sx={{
                fieldset: {
                  borderRadius: '10px 0 0px 10px',
                  //boxShadow: "#3c64d0 2px 2px 2px"
                },
              }}
            />
          )}
        />
        <Autocomplete
          loading={loading}
          style={{
            width: '400px',
            borderRadius: 'border-radius: 0px 10px 10px 0px',
            marginLeft: '0px',
          }}
          open={open}
          getOptionLabel={option =>
            getTermDisplay(option) + '[' + option.conceptId + ']' || ''
          }
          filterOptions={x => x}
          autoComplete
          aria-valuemin={3}
          onOpen={() => {
            if (inputValue) {
              setOpen(true);
            }
          }}
          onClose={() => setOpen(false)}
          inputValue={inputValue}
          onInputChange={(e, value) => {
            setInputValue(value);
            if (!value) {
              setOpen(false);
              setResults([]);
            }
          }}
          options={results}
          renderInput={params => (
            <TextField
              {...params}
              label="Search for a concept"
              variant="outlined"
              sx={{
                fieldset: {
                  borderRadius: '0px 10px 10px 0px',
                  //boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 10px"
                },
              }}
            />
          )}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Link
                to={`/dashboard/concepts/edit/${option.conceptId}`}
                style={{ textDecoration: 'none', color: '#003665' }}
              >
                <Stack direction="row" spacing={2}>
                  <Box
                    component={MedicationIcon}
                    sx={{
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                      borderRadius: '3px',
                      mr: 1,
                      mt: '2px',
                    }}
                  />
                  <Box
                    sx={{
                      flexGrow: 1,
                      '& span': {
                        color: '#586069',
                      },
                    }}
                  >
                    {getTermDisplay(option)}
                    <br />
                    <span>{option.conceptId}</span>
                  </Box>
                  <Box
                    component={CloseIcon}
                    sx={{ opacity: 0.6, width: 18, height: 18 }}
                    style={{
                      visibility: selected ? 'visible' : 'hidden',
                    }}
                  />
                </Stack>
              </Link>
            </li>
          )}
        />
        <IconButton
          variant={fsnToggle ? 'contained' : 'outlined'}
          color="primary"
          aria-label="toggle-task-menu"
          onClick={handleTermDisplayToggleChange}
        >
          <span style={{ fontSize: 'small' }}>{fsnToggle ? 'FSN' : 'PT'} </span>
        </IconButton>
      </Stack>
    </Grid>
  );
}
