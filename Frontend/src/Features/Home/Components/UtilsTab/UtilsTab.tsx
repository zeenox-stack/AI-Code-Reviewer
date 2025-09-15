import React from "react";
import { tabFocus } from "../../../../Utils/utils";

interface UtilType {
  img: {
    src: string;
    alt: string;
  };
  title: string; 
  onClick?: () => void;
}

interface UtilsTabType {
  utils: UtilType[];
  position: string; 
}

const UtilsTab: React.FC<UtilsTabType> = React.memo(
  ({ utils, position }) => {
    return (
      <div
        className={
          "rounded-2xl absolute bg-white inset-y-16 min-w-[8.5rem] max-w-fit h-fit text-black shadow-lg flex flex-col justify-center transition-all duration-150 gap-y-1 " +
          position
        }
      >
        {utils.map((util, i) => {
          return (
            <div
              className="flex justify-around items-center hover:cursor-pointer px-2 py-2 bg-transparent hover:bg-gray-100 rounded-xl transition-all duration-150"
              key={i}
              tabIndex={0}
              onClick={() => util.onClick?.()}
              onKeyDown={(e) => tabFocus(e, util.onClick)}
            >
              <img src={util.img.src} alt={util.img.alt} />
              <span>{util.title}</span>
            </div>
          );
        })}
      </div>
    );
  }
);

export default UtilsTab;
