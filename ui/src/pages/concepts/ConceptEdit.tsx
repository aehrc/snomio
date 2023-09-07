import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import useTaskById from "../hooks/useTaskById.tsx";
import useConceptById from "../hooks/useConceptkById.tsx";

function ConceptEdit() {
  const { id } = useParams();
  //const concept = useConceptById();
  return (
    <Grid
      container
      sx={{ minHeight: 'calc(100vh - 110px)', position: 'relative' }}
    >
      <h1> Concepts Model placeholder for {id}</h1>
    </Grid>
  );
}

export default ConceptEdit;
