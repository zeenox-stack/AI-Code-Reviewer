import React from "react";

interface PromptMenuPropsType {
  title: string;
  onClick: () => void;
  close: () => void;
}

const PromptMenu: React.FC<PromptMenuPropsType> = React.memo(
  ({ title, onClick, close }) => {
    return (
      <div className="p-6 rounded-3xl flex flex-col bg-white border-gray-300 shadow-md w-4/5 md:w-2/5 h-fit">
        <h3 className="font-[Poppins] text-lg text-gray-800 mb-6 h-2/3">{title}</h3>
        <div className="flex justify-end items-end gap-x-4">
          <button
            className="px-3 py-2 border border-gray-800 text-gray-800 hover:bg-gray-100 rounded-xl"
            onClick={() => close()}
          >
            Cancel
          </button>
          <button
            className="px-3 py-2 text-white rounded-xl bg-indigo-400 hover:bg-indigo-600"
            onClick={() => onClick()}
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }
);

export default PromptMenu;
