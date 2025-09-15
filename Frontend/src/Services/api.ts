import axios from "axios";
import type { DataType } from "../store/RepoStore";

const backend =
  import.meta.env.VITE_NODE_ENV !== "dev"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3000";

export const authCheck = async () => {
  try {
    const response = await axios.get(`${backend}/check`, {
      withCredentials: true,
    });

    return response.status === 200;
  } catch (error: any) {
    console.error(error);
  }
};

export const handleGetRepos = async () => {
  try {
    const response = await axios.get(`${backend}/repo/get`, {
      withCredentials: true,
    });

    if (response.status !== 200) throw new Error("Failed to fetch repos");

    return response.data.repos;
  } catch (error: any) {
    console.error(error);
  }
};

export const handleRepoCreation = async (
  payload: Partial<DataType>,
  done: () => void
) => {
  try {
    const response = await axios.post(
      `${backend}/repo/create`,
      {
        ...payload,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status !== 201) throw new Error("Failed to create");
    done();
  } catch (error) {
    console.error(error);
  }
};

export const getProfileData = async (set: (val: any) => void) => {
  try {
    const response = await axios.get(`${backend}/profile`, {
      withCredentials: true,
    });

    if (response.status !== 200) throw new Error("Couldn't fetch profile data");

    set(response.data.avatar);
  } catch (error) {
    console.error(error);
  }
};

export const handleRepoUpdates = async (
  repoId: string,
  events: string[],
  done: (repo: DataType) => void
) => {
  try {
    const response = await axios.post(
      `${backend}/repo/update`,
      {
        repoId,
        events,
      },
      {
        withCredentials: true,
      }
    );

    done(response.data.repo);
    if (response.status !== 200) throw new Error("Couldn't update the repo");
  } catch (error) {
    console.error(error);
  }
};
export const handleImmediateReview = async (name: string) => {
  try {
    const response = await axios.post(
      `${backend}/review`,
      {
        name,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status !== 200) throw new Error("Couldn't provide a review");
  } catch (error) {
    console.error(error);
  }
};

export const logout = async (done: () => void) => {
  try {
    const response = await axios.get(`${backend}/auth/logout`, {
      withCredentials: true,
    }); 

    if (response.status !== 200) throw new Error("Couldn't logout");  
    done();
  } catch (error) {
    console.error(error);
  }
}