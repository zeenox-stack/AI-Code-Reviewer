import React, { useEffect, useState } from "react";
import RepoStore from "../../../../store/RepoStore";
import { handleRepoCreation } from "../../../../Services/api";
import { useNavigate } from "react-router-dom";
import { LoaderContext } from "../../../../App";
import { useLoaderContext } from "../../../../Utils/utils";

export interface PayloadType {
  repoId: string;
  events: string[];
}

const Form: React.FC = React.memo(() => {
  const [payload, setPayload] = useState<PayloadType>({
    repoId: "null",
    events: [],
  });
  const { repos, fetchRepos, isLoading } = RepoStore();
  const [loading, setLoading] = useState<boolean>(false);  
  const { load, setLoad } = useLoaderContext(LoaderContext);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!loading) return;
    const repo = repos.find(
      (n) => n.data.repo_id.toString() === payload.repoId
    )?.data;

    handleRepoCreation(
      {
        name: repo?.name || "",
        repo_id: repo?.repo_id,
        html_url: repo?.html_url,
        events: payload.events,
      },
      () => {
        setLoading(false); 
        navigate("/");
      }
    );
  }, [loading]);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  useEffect(() => {
    setLoad(isLoading);
  }, [isLoading])
  
  return (
    <section className="w-screen h-screen flex justify-center items-center" inert={load || loading}>
      <div className="p-3 rounded-2xl relative bg-white shadow-md text-gray-800">
        <div className="flex flex-col gap-y-3 p-2">
          <div className="flex flex-col">
            <h1 className="text-2xl font-medium pb-0">
              Add Repository & Webhook
            </h1>
            <span className="text-gray-600">
              setup your repositoy and choose the events, where you want to
              receive webhooks.
            </span>
          </div>
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col relative after:absolute after:content-['>'] after:rotate-90 after:top-12 after:right-4 after:text-white after:w-8 after:h-8 after:font-bold after:pointer-events-none">
              <label htmlFor="repositoy">Repository</label>
              <select
                className="p-4 rounded-3xl dark:appearance-none dark:text-white"
                name="repositoy"
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  setPayload((n) => ({ ...n, repoId: value }));
                }}
                defaultValue={""}
              >
                <option value="" disabled>
                  Select a Repository
                </option>
                {repos?.map((repo, i) =>
                  !repo.isRegistered ? (
                    <option value={repo.data.repo_id} key={i}>
                      {repo.data.name.split("/")[1]}
                    </option>
                  ) : null
                )}
              </select>
            </div>
            <div className="flex flex-col">
              <h2 className="mb-2">Webhook Events</h2>
              <div className="flex flex-col gap-y-3">
                {[{
                  title: "Push", 
                  description: "Triggered when you push code to this repo."
                }, {
                  title: "Pull Request", 
                  description: "Triggered when you open or update a pull request."
                }].map(({ title, description }, i) => {
                  return (
                    <div className="flex gap-x-3 px-6 py-4 rounded-3xl border border-gray-200" key={i}>
                      <input
                        type="checkbox" 
                        className="w-5 h-5 mt-1"
                        name={title}
                        onChange={(e) => {
                          const value = title.split(" ")[0].toLowerCase();
                          setPayload((n) => ({
                            ...n,
                            events: e.target.checked
                              ? [...n.events, value]
                              : n.events.filter((val) => val !== value),
                          }));
                        }}
                      />
                      <div className="flex flex-col">
                      <label htmlFor={title} className="mb-1">{title} Event</label>
                      <p className="text-gray-600/80">{description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              className="disabled:cursor-not-allowed"
              disabled={
                payload.repoId === "null" || payload.events.length === 0
              }
              onClick={() => {
                setLoading(true);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Form;
