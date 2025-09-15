import React, { useEffect, useState } from "react";
import { getProfileData, logout } from "../../../../Services/api";
import { useLoaderContext } from "../../../../Utils/utils";
import { LoaderContext } from "../../../../App";
import UtilsTab from "../../Components/UtilsTab/UtilsTab";

import DefaultProfile from "../../../../assets/default_profile.svg";
import Signout from "../../../../assets/sign_out.svg";

const Header: React.FC = React.memo(() => {
  const [profile, setProfile] = useState<string | null>(null);
  const [loadUtils, setLoadUtils] = useState<boolean>(false); 
  const { setLoad } = useLoaderContext(LoaderContext);

  useEffect(() => {
    getProfileData((val: string | null) => setProfile(val));
  }, []);
  return (
    <header className="flex justify-between items-center p-6 w-full h-16 bg-white shadow-sm">
      <h1 className="font-[Poppins] text-blue-400 text-semibold text-xl">
        AI Code Reviewer
      </h1>
      <div
        className="flex justify-between items-center gap-x-2 relative"
        onClick={() => setLoadUtils((n) => !n)}
      >
        <img
          src={profile ? profile : DefaultProfile}
          alt="profile picture"
          className="h-9 rounded-full"
        />
        <span className="rotate-180 font-bold text-black">^</span>
        {loadUtils && (
          <UtilsTab
            utils={[
              {
                img: {
                  src: Signout,
                  alt: "signout icon",
                },
                title: "Sign Out", 
                onClick: () => {
                    setLoad(true); 
                    logout(() => setLoad(false));
                }
              },
            ]}
            position="-inset-x-16"
          />
        )}
      </div>
    </header>
  );
});

export default Header;
