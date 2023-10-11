import { AdditionalFieldTypeEnum, LabelBasic, Ticket } from '../../../../types/tickets/ticket';
import {
  Card,
  CardActionArea,
  Chip,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import LabelChip from '../../components/LabelChip';
import useTicketStore from '../../../../stores/TicketStore';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import TicketFieldsEdit from './edit/TicketFieldsEdit';

interface TicketFieldsProps {
  ticket?: Ticket;
  isCondensed?: boolean;
  editable?: boolean;
}
export default function TicketFields({
  ticket,
  isCondensed,
  editable,
}: TicketFieldsProps) {
  const { labelTypes } = useTicketStore();
  const [editMode, setEditMode] = useState(false);

  const createLabelBasic = (name: string, id: number): LabelBasic => {
    return {
      labelTypeId: id.toString(),
      labelTypeName: name,
    };
  };

  const theXs = isCondensed ? 3.5 : 1.5;

  if (editMode) {
    return <TicketFieldsEdit ticket={ticket} setEditMode={setEditMode} />;
  } else {
    return (
      <>
        <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
          <Grid item xs={theXs}>
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{ display: 'block', width: '120px' }}
            >
              Labels:
            </Typography>
          </Grid>
          <Grid container spacing={2} xs={8} sx={{ margin: 0 }}>
            {ticket?.labels.map(label => {
              const labelVal = createLabelBasic(label.name, label.id);
              return (
                <Grid item>
                  <LabelChip labelTypeList={labelTypes} labelVal={labelVal} />
                </Grid>
              );
            })}
          </Grid>
          {editable && (
            <LoadingButton
              variant="text"
              size="small"
              color="info"
              sx={{ marginLeft: 'auto', maxHeight: '2em' }}
              onClick={() => {
                setEditMode(true);
              }}
            >
              EDIT
            </LoadingButton>
          )}
        </Grid>
        <Grid container sx={{ marginBottom: '20px' }}>
          <Grid item xs={theXs}>
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{ display: 'block', width: '120px' }}
            >
              Additional Fields:
            </Typography>
          </Grid>
          <Grid container spacing={2} xs={8} sx={{ ml: '-12px' }}>
            {ticket?.['ticket-additional-fields']?.map(item => {
              const type = item.additionalFieldType.name;
              console.log(type);
              const valueOf = item.additionalFieldType.type === AdditionalFieldTypeEnum.DATE ? new Date(item.valueOf).toLocaleDateString('en-AU') : item.valueOf;
              return (
                <Grid item>
                  <Card sx={{ padding: '5px' }}>
                    <CardActionArea>
                      <Typography variant="caption" fontWeight="bold">
                        {type}
                      </Typography>
                      <Divider></Divider>
                      <Typography variant="body1" sx={{ paddingTop: '5px' }}>
                        {valueOf}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
          <Grid item xs={theXs}>
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{ display: 'block', width: '120px' }}
            >
              Iteration:
            </Typography>
          </Grid>
          {ticket?.iteration?.name ? (
            <Grid item>
              <Chip
                color={'warning'}
                label={ticket?.iteration?.name}
                size="small"
                sx={{ color: 'black' }}
              />
            </Grid>
          ) : (
            <div />
          )}
        </Grid>
        <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
          <Grid item xs={theXs}>
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{ display: 'block', width: '120px' }}
            >
              State:
            </Typography>
          </Grid>
          {ticket?.state.label ? (
            <Grid item>
              <Chip
                color={'primary'}
                label={ticket?.state.label}
                size="small"
                sx={{ color: 'white' }}
              />
            </Grid>
          ) : (
            <div />
          )}
        </Grid>
      </>
    );
  }
}
