/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const MenuIcon = (props: any) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      height="2em"
      width="2em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M12 21h40M12 33h40M12 45h40"
      />
    </svg>
  );
};

export default MenuIcon;
