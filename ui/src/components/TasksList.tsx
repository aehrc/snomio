import useTaskStore from '../stores/TaskStore';
import {
  DataGrid,
  GridColDef, GridFilterInputValueProps, GridFilterItem, GridFilterOperator,
  GridRenderCellParams,
  GridToolbarQuickFilter,
  GridValueFormatterParams, GridValueGetterParams,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { Assignee, Classification, Reviewer, Task } from '../types/task';
import {Chip, Grid, Link, Stack, Typography, Tooltip, TextField} from '@mui/material';
import MainCard from './MainCard';

import { ReactNode, useState } from 'react';
import Gravatar from 'react-gravatar';



interface TaskListProps {
  tasks: Task[];
  heading: string;
}
function InputCustomFilter(props: GridFilterInputValueProps) {
  const { item, applyValue, focusElementRef = null } = props;
  const [filterValueState, setFilterValueState] = useState<[string, Assignee]>(
      item.value ?? '',
  );
  const [applying, setIsApplying] = useState(false);
  console.log("heree")
 console.log(item.value);
  return (
      <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'row',
            alignItems: 'end',
            height: 48,
            pl: '20px',
          }}
      >
        <TextField
            name="lower-bound-input"
            placeholder="Name"
            label="Name"
            variant="standard"
            value={filterValueState[0]}
            type="string"
            inputRef={focusElementRef}
            sx={{ mr: 2 }}
        />

      </Box>
  );
}

const customFilterOperators: GridFilterOperator[] = [
  {
    label: 'Contains',
    value: 'contains',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      console.log("$$$$$");
      console.log(filterItem.value);
      return ({ value }) => {
        console.log(value);
        return (
            value !== null &&
            filterItem.value.includes(value)
        );
      };
    },
    InputComponent: InputCustomFilter,
  },
];


const columns: GridColDef[] = [
  { field: 'summary', headerName: 'Name', width: 150 },
  {
    field: 'key',
    headerName: 'Task ID',
    width: 150,
    renderCell: (params: GridRenderCellParams<any, string>): ReactNode => (
      <Link href={`/dashboard/tasks/edit/${params.value}`}>
        {params.value!.toString()}
      </Link>
    ),
  },
  {
    field: 'updated',
    headerName: 'Modified',
    width: 150,
    valueFormatter: ({ value }: GridValueFormatterParams<string>) => {
      const date = new Date(value);
      return date.toLocaleDateString('en-AU');
    },
  },
  { field: 'labels', headerName: 'Tickets', width: 150 },
  { field: 'branchState', headerName: 'Rebase', width: 150,
    renderCell: (params: GridRenderCellParams<any, string>): ReactNode => (
        <ValidationBadge params={params.formattedValue} />
    ),
  },
  {
    field: 'latestClassificationJson',
    headerName: 'Classification',
    width: 150,
    renderCell: (
      params: GridRenderCellParams<any, Classification>,
    ): ReactNode => <ValidationBadge params={params.value?.status} />,
  },
  {
    field: 'latestValidationStatus',
    headerName: 'Validation',
    width: 150,
    renderCell: (params: GridRenderCellParams<any, string>): ReactNode => (
      <ValidationBadge params={params.formattedValue} />
    ),
  },

  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params: GridRenderCellParams<any, string>): ReactNode => (
      <ValidationBadge params={params.formattedValue} />
    ),
  },
  {
    field: 'assignee',
    headerName: 'Owner',
    width: 200,

    renderCell: (params: GridRenderCellParams<any, Assignee>): ReactNode => (
      <Tooltip title={params.value?.displayName} followCursor>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
          <Gravatar
            email={params.value?.email}
            rating="pg"
            default="monsterid"
            style={{ borderRadius: '50px' }}
            size={30}
            className="CustomAvatar-image"
          />
        </Stack>
      </Tooltip>
    ),
    filterOperators:customFilterOperators
  },
  {
    field: 'reviewers',
    headerName: 'Reviewers',
    width: 200,

    renderCell: (params: GridRenderCellParams<any, Reviewer[]>): ReactNode => {
      if (params.value) {
        const reviewers = params.value;
        const ordersWithLinks = reviewers.map((reviewer, index) => (
          <Tooltip title={reviewer.displayName} followCursor>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ p: 0.5 }}
            >
              <Gravatar
                email={reviewer.email}
                rating="pg"
                default="monsterid"
                style={{ borderRadius: '50px' }}
                size={30}
                className="CustomAvatar-image"
              />
            </Stack>
          </Tooltip>
        ));
        return ordersWithLinks;
      }
    },
  },
  {
    field: 'feedbackMessagesStatus',
    headerName: 'Feedback',
    width: 150,
  },
];

function QuickSearchToolbar() {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput: string) =>
          searchInput
            .split(',')
            .map(value => value.trim())
            .filter(value => value !== '')
        }
      />
    </Box>
  );
}

function ValidationBadge(formattedValue: { params: string | undefined }) {
  // have to look up how to do an enum with the message,
  // because obviously this is something you can do with ts
  // the message should be a set of values, will have to look through snomeds doc
  // pending and completed are total guesses
  enum ValidationColor {
    Error = 'error',
    Success = 'success',
    Info = 'info',
  }
  const message = formattedValue.params;
  let type: ValidationColor;
  switch (message) {
    case 'NOT_TRIGGERED':
      type = ValidationColor.Error;
      break;
    case 'PENDING':
      type = ValidationColor.Success;
      break;
    case 'COMPLETED':
    default:
      type = ValidationColor.Info;
  }
  console.log(type);
  console.log(message);
  return (
    <>
      <Chip color={type} label={message} size="small" variant="light" />
    </>
  );
}

function TasksList({ tasks, heading }: TaskListProps) {
  return (
    <>
      <Grid container>
        <Grid item xs={12} lg={12}>
          <MainCard title={heading} sx={{ width: '100%' }}>
            <DataGrid
              getRowId={(row: Task) => row.key}
              rows={tasks}
              columns={columns}
              disableColumnSelector
              disableDensitySelector
              slots={{ toolbar: QuickSearchToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10, 15, 20]}
              //checkboxSelection
            />
          </MainCard>
        </Grid>
      </Grid>
      {/* <Box sx={{ height: 400, width: 1 }}>
        <h1>{heading}</h1>
        
      </Box> */}
    </>
  );
}
export default TasksList;
