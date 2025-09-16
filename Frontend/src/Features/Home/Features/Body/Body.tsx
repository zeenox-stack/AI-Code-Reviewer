import React, { useEffect } from "react";
import RepoStore from "../../../../store/RepoStore";
import { useNavigate } from "react-router-dom";
import { authCheck } from "../../../../Services/api";
import Modal from "../../Components/Modal/Modal";

import EmptyBox from "../../../../assets/empty_box.svg";
import { useLoaderContext } from "../../../../Utils/utils";
import { LoaderContext } from "../../../../App";

const Body: React.FC = React.memo(() => {
  const { repos, fetchRepos, isLoading } = RepoStore();
  const navigate = useNavigate();
  const registeredRepos = [...(repos || [])].filter((n) => n?.isRegistered);
  const { setLoad } = useLoaderContext(LoaderContext);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  useEffect(() => {
    const authHandler = async () => {
      setLoad(true);

      const response = await authCheck();
      if (!response) navigate("/auth/login");
      setLoad(false);
    };

    authHandler();
  }, []);
  return (
    <section className="w-full flex flex-col justify-center p-6">
      <div className="flex flex-col justify-center gap-y-3">
        <h1 className="text-2xl text-gray-800 font-semibold font-[Poppins]">
          Welcome to AI Code Reviewer
        </h1>
        <p className="font-[Poppins] text-gray-600 w-2/3">
          Easily review your code automatically when you push changes or open
          pull requests. You can also trigger immediate reviews anytime.
        </p>
      </div>
      <div className="flex flex-col gap-y-3 mt-8">
        <div className="flex justify-between items-center">
          <h3 className="font-normal text-gray-800 font-[Poppins]">
            Your Repositories
          </h3>
          <button
            className="rounded-3xl bg-indigo-500 hover:bg-indigo-300 px-2 py-1 w-[16rem] flex justify-evenly items-center shadow-sm hover:shadow-md hover:-translate-y-1 delay-150"
            onClick={() => navigate("/repo")}
          >
            <span className="font-semibold text-2xl p-1">+</span>
            <span>Add Repository & Webhook</span>
          </button>
        </div>
        <div
          className={
            "gap-3 w-full min-h-[26rem] max-h-fit p-5 " +
            (!isLoading && registeredRepos.length > 0
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col justify-start items-start")
          }
        >
          {!isLoading && registeredRepos.length === 0 && (
            <div className="w-full min-h-fit flex flex-col items-center justify-center gap-y-1">
              <img src={EmptyBox} alt="empty icon" className="h-10 m-3" />
              <h4 className="text-gray-800 text-center text-xl font-semibold font-[Poppins]">
                No repositories connected yet
              </h4>
              <span className="text-center text-gray-600 text-lg">
                Connect your first repository to receive AI code reviews
              </span>
              <button
                className="rounded-3xl bg-indigo-500 hover:bg-indigo-300 px-2 py-1 w-[16rem] flex justify-evenly items-center shadow-sm hover:shadow-md hover:-translate-y-1 delay-150 mt-5"
                onClick={() => navigate("/repo")}
              >
                <span className="font-semibold text-2xl p-1">+</span>
                <span>Add Your First Repository</span>
              </button>
            </div>
          )}
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-800">
              Loading...
            </div>
          ) : (
            registeredRepos.map((repo, i) => <Modal key={i} repo={repo.data} />)
          )}
        </div>
      </div>
    </section>
  );
});

export default Body;
