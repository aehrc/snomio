import { create } from 'zustand';
import { Task } from '../types/task';
import TasksServices from '../api/TasksService';
interface TaskStoreConfig {
  fetching: boolean;
  tasks: Task[];
  allTasks: Task[];
  fetchTasks: () => Promise<void>;
  fetchAllTasks: () => Promise<void>;
}

const useTaskStore = create<TaskStoreConfig>()(set => ({
  fetching: false,
  tasks: [],
  allTasks: [],
  fetchTasks: async () => {
    set(() => ({
      fetching: true,
    }));

    try {
      const tasks = await TasksServices.getUserTasks();
      set({ tasks: [...tasks] });
      set({ fetching: false });
    } catch (error) {
      console.log(error);
    }
  },
  fetchAllTasks: async () => {
    set(() => ({
      fetching: true,
    }));

    try {
      const allTasks = await TasksServices.getAllTasks();
      set({ allTasks: [...allTasks] });
      set({ fetching: false });
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useTaskStore;
