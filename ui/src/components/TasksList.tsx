import useTaskStore from '../stores/TaskStore';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

interface TaskListProps {
  listAllTasks?: boolean;
  heading: string;
}
const columns: GridColDef[] = [
  { field: 'summary', headerName: 'Name', width: 150 },
  { field: 'key', headerName: 'Task ID', width: 150 },
  { field: 'updated', headerName: 'Modified', width: 150 },
  { field: 'labels', headerName: 'Tickets', width: 150 },
  { field: 'branchState', headerName: 'Rebase', width: 150 },
  { field: 'projectKey', headerName: 'Classification', width: 150 },
  { field: 'latestValidationStatus', headerName: 'Validation', width: 150 },
  { field: 'feedbackMessagesStatus', headerName: 'Feedback', width: 150 },
  { field: 'status', headerName: 'Status', width: 150 },
  {
    field: 'assignee',
    headerName: 'Review',
    width: 150,
    valueFormatter: ({ value }) => value.displayName,
  },
];

function TasksList({ listAllTasks, heading }: TaskListProps) {
  const { tasks, allTasks } = useTaskStore();
  const taskData = listAllTasks ? allTasks : tasks;

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <h1>{heading}</h1>
        <DataGrid
          getRowId={row => row.key}
          rows={taskData}
          columns={columns}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          slots={{ toolbar: GridToolbar }}
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
          //checkboxSelection
        />
      </div>
    </>
  );
}
export default TasksList;
