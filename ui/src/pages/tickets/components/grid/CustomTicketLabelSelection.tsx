/* eslint-disable */
import { useEffect, useState } from 'react';

import { Chip, MenuItem, Tooltip } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Stack } from '@mui/system';
import StyledSelect from '../../../../components/styled/StyledSelect.tsx';
import {
  LabelBasic,
  LabelType,
  Ticket,
} from '../../../../types/tickets/ticket.ts';
import useTicketStore from '../../../../stores/TicketStore.ts';
import TicketsService from '../../../../api/TicketsService.ts';
import { labelExistsOnTicket } from '../../../../utils/helpers/tickets/labelUtils.ts';
import { ValidationColor } from '../../../../types/validationColor.ts';
import LabelChip from '../LabelChip.tsx';

interface CustomTicketLabelSelectionProps {
  id: string;
  typedLabels?: LabelType[];
  labelTypeList: LabelType[];
  border?: boolean;
}

export default function CustomTicketLabelSelection({
  id,
  typedLabels,
  labelTypeList,
  border,
}: CustomTicketLabelSelectionProps) {
  const { getTicketById, getLabelByName, mergeTickets } = useTicketStore();
  // const [typedLabels, setTypedLabels] = useState<LabelBasic[]>();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  function createTypeLabel(label: string): LabelBasic {
    const returnVal = label.split('|');
    return {
      labelTypeId: returnVal[0],
      labelTypeName: returnVal[1],
    };
  }

  function createTypedLabels(labels: string[] | undefined): LabelBasic[] {
    if (labels === undefined) return [];
    const labelArray: LabelBasic[] | undefined = labels?.map(item => {
      return createTypeLabel(item);
    });
    return labelArray;
  }
  const updateLabels = (labelType: LabelType) => {
    const ticket = getTicketById(Number(id));
    if (ticket === undefined) return;
    const shouldDelete = labelExistsOnTicket(ticket, labelType);
    if (shouldDelete) {
      TicketsService.deleteTicketLabel(id, labelType.id)
        .then(res => {
          updateTicket(ticket, res, 'delete');
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      TicketsService.addTicketLabel(id, labelType.id)
        .then(res => {
          updateTicket(ticket, res, 'add');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  // useEffect(() => {
  //   setTypedLabels(createTypedLabels(labels));
  // }, [labels]);

  const updateTicket = (ticket: Ticket, label: LabelType, action: string) => {
    if (action === 'delete') {
      const updatedLabels = ticket.labels.filter(existingLabel => {
        return existingLabel.id !== label.id;
      });
      ticket.labels = updatedLabels;
    } else {
      ticket.labels.push(label);
    }

    mergeTickets(ticket);
    setDisabled(false);
  };

  const getLabelInfo = (id: string | undefined): ValidationColor => {
    if (id === undefined) ValidationColor.Info;
    const thisLabelType = labelTypeList.find(labelType => {
      return labelType.id === Number(id);
    });
    return thisLabelType?.displayColor || ValidationColor.Info;
  };

  const getLabelIsChecked = (labelType: LabelType): boolean => {
    let checked = false;
    typedLabels?.forEach(label => {
      // label.
      if (Number(label.id) === labelType.id) {
        checked = true;
        return;
      }
    });
    return checked;
  };

  const handleChange = (event: SelectChangeEvent<typeof typedLabels>) => {
    setDisabled(true);
    const {
      target: { value },
    } = event;
    if (value === undefined) {
      setDisabled(false);
      return;
    }
    // const valueArray = value as unknown as string[];
    const labelValue = value[value.length - 1] as string;
    if (labelValue === undefined) {
      setDisabled(false);
      return;
    }
    let labelType: LabelType | undefined =
      getLabelByName(labelValue as unknown as string)
    
    if (labelType === undefined) return;
    updateLabels(labelType);
  };

  const handleChangeFocus = () => {
    setFocused(!focused);
  };

  return (
    <Select
      key={id}
      multiple={true}
      value={typedLabels}
      onChange={handleChange}
      onFocus={handleChangeFocus}
      disabled={disabled}
      sx={{ width: '100%' }}
      input={border ? <Select /> : <StyledSelect />}
      renderValue={selected => (
        <Stack gap={1} direction="row" flexWrap="wrap">
          {selected.map(value => {
            // let labelVal = createTypeLabel(value);
            return (
              <LabelChip
                label={value}
                labelTypeList={labelTypeList}
                key={`${value.id}`}
              />
            );
          })}
        </Stack>
      )}
    >
      {labelTypeList.map(labelType => (
        <MenuItem key={labelType.id} value={labelType.name}>
          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%"
            alignItems="center"
          >
            <Chip
              color={labelType.displayColor}
              label={labelType.name}
              size="small"
              sx={{ color: 'black' }}
            />

            <Checkbox checked={getLabelIsChecked(labelType)} />
          </Stack>
        </MenuItem>
      ))}
    </Select>
  );
}
