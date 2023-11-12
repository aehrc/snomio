import { useParams } from 'react-router-dom';
import useTicketById from '../../../hooks/useTicketById';
import { Stack } from '@mui/system';
import { Card, Divider } from '@mui/material';
import Description from '../Description';
import TicketHeader from './components/TicketHeader';
import TicketFields from './components/TicketFields';
import Attachments from './components/Attachments';
import CommentSection from './comments/CommentSection';

function IndividualTicketEdit() {
  const { id } = useParams();
  const ticket = useTicketById(id, true);

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
        <Attachments attachments={ticket?.attachments} />
        <CommentSection ticket={ticket} />
      </Card>
    </Stack>
  );
}

export default IndividualTicketEdit;
