import { useEffect } from 'react';
import useTaskStore from '../stores/TaskStore';
import TasksList from '../components/TasksList';
import TaskEditLayout from './TaskEditLayout';
import { Route, Routes } from 'react-router-dom';
import Loading from '../components/Loading';

function TasksLayout() {
  const taskStore = useTaskStore();
  const { myTasks, allTasks } = taskStore;

  useEffect(() => {
    taskStore.fetchAllTasks().catch(err => {
      console.log(err);
    });
    taskStore.fetchTasks().catch(err => {
      console.log(err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (taskStore.fetching) {
    return <Loading />;
  } else {
    return (
      <Routes>
        <Route
          path=""
          element={<TasksList tasks={myTasks} heading={'My Tasks'} />}
        />
        <Route
          path="all"
          element={<TasksList tasks={allTasks} heading={'Tasks'} />}
        />
        <Route path="edit/:id" element={<TaskEditLayout />} />
        {/* not sure about this? Something that chris mentioned - you need to be able to look at the products task?
          dunno how that's different to just a regular task
        */}
        <Route path="products" element={<>products</>} />
      </Routes>
    );
  }
}

export default TasksLayout;
