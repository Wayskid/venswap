import React from "react";
import { CgClose } from "react-icons/cg";

export default function AppModalBox({
  children,
  show,
  setShow,
  className,
  showClose,
}) {
  return (
    <div
      className={`fixed w-full h-full top-0 left-0 z-50 grid ${
        show ? "grid" : "hidden"
      }`}
    >
      <div className="bg-[#000000b0]" onClick={() => setShow(false)}></div>
      <div
        className={`absolute w-full md:w-[min(43rem,90%)] h-full md:h-[min(30rem,100%)] place-self-center bg-White rounded-sm p-8 md:p-10 grid items-center overflow-scroll shadow-xl ${className}`}
      >
        {children}
      </div>
      {showClose && (
        <CgClose
          onClick={() => setShow(false)}
          className="absolute right-1 top-1 text-4xl cursor-pointer text-Blue"
        />
      )}
    </div>
  );
}
