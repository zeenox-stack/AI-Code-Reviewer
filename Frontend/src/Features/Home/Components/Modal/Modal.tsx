import React, { useState } from "react";
import type { DataType } from "../../../../store/RepoStore";
import {
  getEventBasedStyle,
  getModifiedDate,
  tabFocus,
} from "../../../../Utils/utils";
import UtilsTab from "../UtilsTab/UtilsTab"; 
import Edit from "../../../Repos/Features/Edit/Edit";
import { handleImmediateReview } from "../../../../Services/api";

import EditIcon from "../../../../assets/edit.svg";
import SeeMoreIcon from "../../../../assets/see_more.svg";
import Review from "../../../../assets/review.svg"


interface ModalType {
  repo: DataType;
}

const Modal: React.FC<ModalType> = React.memo(({ repo }) => {
  const [utilState, setUtilState] = useState<boolean>(false);
  const [loadEditor, setLoadEditor] = useState<boolean>(false);

  return (
    <>
      {loadEditor && <Edit repo={repo} close={() => setLoadEditor(false)} />}
      <div
        className="p-5 rounded-2xl shadow-sm hover:shadow-md flex flex-col justify-start border border-gray-200 bg-white text-gray-800 h-48"
        tabIndex={0}
        inert={loadEditor}
      >
        <div className="flex p-1 justify-between items-center relative">
          <h2 className="font-[Poppins] text-2xl">{repo.name.split("/")[1]}</h2>
          <span
            onClick={() => setUtilState((n) => !n)}
            tabIndex={0}
            onKeyDown={(e) => tabFocus(e, () => setUtilState((n) => !n))}
          >
            <img src={SeeMoreIcon} alt="see more icon" />
          </span>
          {utilState && (
            <UtilsTab
              utils={[
                {
                  img: {
                    src: EditIcon,
                    alt: "edit icon",
                  },
                  title: "Edit",
                  onClick: () => setLoadEditor(true),
                },
                {
                  img: {
                    src: Review,
                    alt: "review icon",
                  },
                  title: "Review",
                  onClick: () => handleImmediateReview(repo.name.split("/")[1]),
                },
              ]}
              position="right-0"
            />
          )}
        </div>
        <span>Created on {getModifiedDate(repo.created_at)}</span>
        <hr className="my-3" />
        <div className="flex justify-start items-center gap-x-3">
          {repo?.events &&
            repo?.events?.map((ev, i) => {
              return (
                <span
                  className={"px-3 py-2 rounded-3xl " + getEventBasedStyle(ev)}
                  key={i}
                >
                  {`${ev[0].toUpperCase()}${ev.slice(1)}`}
                  {ev === "pull" ? " Request" : null}
                </span>
              );
            })}
        </div>
      </div>
    </>
  );
});

export default Modal;
