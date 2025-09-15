import { create } from "zustand";
import { handleGetRepos } from "../Services/api";

export interface DataType {
  id: string;
  name: string;
  owner_id: string;
  is_active?: boolean;
  created_at: string;
  repo_id: string; 
  html_url: string;
  events: string[];
}

export interface RepoType {
  data: DataType;
  isRegistered: boolean;
}

export interface RepoStoreType {
  repos: RepoType[];
  fetchRepos: () => Promise<void>;
  isLoading: boolean;
  setRepo: (repo: DataType) => void;
}

const RepoStore = create<RepoStoreType>((set, get) => ({
  repos: [],
  isLoading: true,
  fetchRepos: async () => {
    if (!get().isLoading) return;

    const repos = await handleGetRepos();

    set({ repos, isLoading: false });
  },
  setRepo: (repo) =>
    set((state) => ({
      repos: state.repos.map((r) =>
        r.data.id === repo.id ? { data: repo, isRegistered: true } : r
      ),
    })),
}));

export default RepoStore;
