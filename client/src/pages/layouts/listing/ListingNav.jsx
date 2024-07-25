import React from "react";
import { NavLink } from "react-router-dom";

export default function ListingNav() {
  return (
    <nav className="fixed z-40 top-0 bg-White w-full">
      <div className="flex items-center w-[min(92rem,100%)] mx-auto relative z-40 justify-between bg-White px-4 md:px-12 lg:px-32 py-7">
        <div className="w-full flex items-center justify-between">
          <NavLink to="/" className="text-3xl font-semibold text-Blue">
            Venswap
          </NavLink>
          <p className="text-gray-500 font-semibold">Sell a Business</p>
        </div>
        <div className="md:flex lg:gap-12 md:gap-5 hidden"></div>
      </div>
    </nav>
  );
}
