import { useParams } from 'react-router-dom';
import useTicketById from '../../../hooks/useTicketById';
import { Stack } from '@mui/system';
import { Card, Divider } from '@mui/material';
import Description from '../Description';
import TicketHeader from './components/TicketHeader';
import TicketFields from './components/TicketFields';

function IndividualTicketEdit() {
  const { id } = useParams();
  const ticket = useTicketById(id);

  return (
    <Stack direction="row" width="100%" justifyContent="center" height="100%">
      <Card
        sx={{
          minWidth: '800px',
          maxWidth: '1200px',
          height: '100%',
          padding: '2em',
          overflow: 'scroll',
        }}
      >
        <TicketHeader ticket={ticket} editable={true} />
        <Divider sx={{ marginTop: '1.5em', marginBottom: '1.5em' }} />
        <TicketFields ticket={ticket} editable={true} />
        <Divider sx={{ marginTop: '1.5em', marginBottom: '1.5em' }} />
        <Description ticket={ticket} editable={true} />
      </Card>
    </Stack>
  );
}

export default IndividualTicketEdit;
