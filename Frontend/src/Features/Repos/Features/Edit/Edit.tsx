import React, { useState } from "react";
import type { DataType } from "../../../../store/RepoStore";
import PromptMenu from "../../../../Components/PromptMenu";
import RepoStore from "../../../../store/RepoStore";
import { handleRepoUpdates } from "../../../../Services/api";
import { isEqual } from "../../../../Utils/utils";

interface EditPropsType {
  repo: DataType;
  close: () => void;
}

const Edit: React.FC<EditPropsType> = React.memo(({ repo, close }) => {
  const { setRepo } = RepoStore();
  const [payload, setPayload] = useState(repo.events);
  const [loader, setLoader] = useState<boolean>(false);
  const saveUpdates = () => {
    setLoader(true);
    handleRepoUpdates(repo.repo_id, payload, (val: DataType) => {
      setRepo(val);
      setLoader(false);
      close();
    });
  };

  return (
    <section className="absolute w-full h-full flex justify-center items-center backdrop-blur-sm z-10 top-0 left-0">
      {loader && payload.length === 0 ? (
        <PromptMenu
          title="Are you sure, you want to save changes? Saving changes will set the repo webhook as inactive"
          onClick={saveUpdates}
          close={() => setLoader(false)}
        />
      ) : (
        <div
          className="flex flex-col p-6 rounded-2xl text-gray-800 w-full md:w-2/5 h-fit bg-white shadow-lg"
        >
          <div className="flex justify-end items-center">
            <button
              className="flex justify-end items-center hover:border-transparent"
              onClick={() => close()}
            >
              X
            </button>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Edit Webhooks for {repo.name.split("/")[1]}
          </h1>
          <p className="font-[Poppins] text-gray-600">
            Choose which events you want this repository to listen for.
          </p>
          <div className="flex flex-col gap-y-5 mt-3 mb-6">
            {[
              {
                title: "push",
                description: "Trigered whenever you push code to this repo.",
              },
              {
                title: "pull",
                description: "Triggered when you open a pull request.",
              },
            ].map(({ title, description }, i) => {
              return (
                <div className="flex items-start gap-x-5" key={i}>
                  <input
                    type="checkbox"
                    name={title}
                    checked={payload.includes(title)}
                    className="mt-2 w-5 h-5 border rounded-sm border-gray-300"
                    onChange={() => {
                      setPayload((n) =>
                        !n.includes(title)
                          ? [...n, title]
                          : n.filter((e) => e !== title)
                      );
                    }}
                  />
                  <div className="flex flex-col content-between justify-start mt-1">
                    <label htmlFor={title} className="text-md font-[Poppins]">
                      {`${title[0].toUpperCase()}${title.slice(1)}`}
                      {title === "pull" && " Request"} Events
                    </label>
                    <p className="text-gray-600/80">{description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end items-center gap-x-2">
            <button
              className="px-3 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-3xl"
              onClick={() => close()}
            >
              Cancel
            </button>
            <button
              className="px-3 py-2 rounded-3xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:cursor-not-allowed"
              onClick={() => {
                if (payload.length === 0) {
                  setLoader(true);
                  return;
                }

                saveUpdates();
              }}
              disabled={loader || isEqual(payload, repo.events)}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </section>
  );
});

export default Edit;
