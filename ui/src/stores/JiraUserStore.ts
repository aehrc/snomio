import { create } from 'zustand';
import { JiraUser } from '../types/JiraUserResponse.ts';
import JiraUserService from '../api/JiraUserService.ts';

interface JiraUserStoreConfig {
  fetching: boolean;
  jiraUsers: JiraUser[];
  fetchJiraUsers: () => Promise<void>;
  setJiraUsers: (users: JiraUser[]) => void;
}

const useJiraUserStore = create<JiraUserStoreConfig>()(set => ({
  fetching: false,
  jiraUsers: [],

  fetchJiraUsers: async () => {
    set(() => ({
      fetching: true,
    }));

    try {
      const users = await JiraUserService.getAllJiraUsers();
      set({ jiraUsers: [...users] });
      set({ fetching: false });
    } catch (error) {
      console.log(error);
    }
  },
  setJiraUsers: (users: JiraUser[]) => {
    set({ jiraUsers: [...users] });
  }
}));

export default useJiraUserStore;
