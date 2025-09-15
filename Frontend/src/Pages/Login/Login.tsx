import React from "react";
import { useNavigate } from "react-router-dom";

import GitHubHoverLogo from "../../assets/github-hover.svg";
import GitHubLogo from "../../assets/github.svg";
import Back from "../../assets/back_arrow.svg";
import { logout } from "../../Services/api";
import { useLoaderContext } from "../../Utils/utils";
import { LoaderContext } from "../../App";

const Login: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const { setLoad } = useLoaderContext(LoaderContext);
  return (
    <section className="w-screen h-screen flex justify-center items-center">
      <div className="p-8 h-[45%] rounded-3xl bg-white shadow-sm flex justify-center flex-col text-gray-800 gap-y-3">
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-2xl font-[Poppins] font-medium">
            Welcome to AI Code Reviewer
          </h2>
          <span className="text-gray-600/75 font-[Poppins]">
            Sign in with GitHub to continue.
          </span>
        </div>
        <button
          className="w-full bg-black py-3 rounded-3xl hover:shadow-sm text-gray-50/90 group hover:bg-white flex justify-center items-center gap-x-2 border-none"
          onClick={() =>
            (window.location.href =
              (import.meta.env.VITE_NODE_ENV !== "dev"
                ? import.meta.env.VITE_BACKEND_URL
                : "http://localhost:3000") + "/auth/github")
          }
        >
          <img
            src={GitHubLogo}
            alt="github logo"
            className="hidden group-hover:block h-8"
          />
          <img
            src={GitHubHoverLogo}
            alt=""
            className="block group-hover:hidden h-8"
          />
          <span className="group-hover:text-gray-800">Sign in with GitHub</span>
        </button>
        <div className="flex justify-between p-1 mt-4">
          <button
            className="bg-transparent px-5 py-3 rounded-3xl hover:bg-gray-100 border-none opacity-75 flex justify-center items-center gap-x-1"
            onClick={() => navigate("/")}
          >
            <img src={Back} alt="back_arrow icon" className="h-4" />
            <span>Back</span>
          </button>
          <button
            className="px-4 py-3 border border-red-400 hover:bg-red-100 text-red-500 hover:border-red-500 rounded-3xl hover:shadow-sm"
            onClick={() => {
              setLoad(true);
              logout(() => setLoad(false));
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </section>
  );
});

export default Login;
{
  /* <button onClick={() => navigate("/")}>back</button>
            <button onClick={() => window.location.href = (import.meta.env.VITE_NODE_ENV !== "dev" ? import.meta.env.VITE_BACKEND_URL : "http://localhost:3000") + "/auth/github"}>Sign in with github</button> */
}
