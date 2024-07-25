import React from "react";
import AccountNav from "./AccountNav";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function AccountLayout() {
  const { pathname } = useLocation();

  function matchRoute(route, multiple) {
    if (multiple) {
      if (pathname.startsWith(route)) {
        return true;
      } else {
        return false;
      }
    } else {
      if (pathname === route) {
        return true;
      } else {
        return false;
      }
    }
  }
  return (
    <div className="h-full grid relative">
      <Helmet>
        <title>Venswap | Account</title>
        <meta name="robots" content="noindex." />
      </Helmet>
      <AccountNav />
      <div className="mt-[76px] overflow-x-hidden">
        <div className="w-[min(92rem,100%)] mx-auto flex md:grid md:grid-cols-5 gap-1 md:gap-2 px-4 md:px-12 lg:px-[128px] pt-2 overflow-x-scroll scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [::-webkit-scrollbar{display:none}] text-center transition-all">
          <NavLink
            to="/account"
            className={`min-w-[135px] md:w-[unset] py-2 px-5 border-x border-t transition-all ${
              matchRoute("/account") && "bg-White border-Blue font-bold"
            } rounded-t-sm`}
          >
            <p className="">Overview</p>
          </NavLink>
          <NavLink
            to="listings"
            className={`min-w-[135px] md:w-[unset] py-2 px-5 border-x border-t transition-all ${
              matchRoute("/account/listings", true) &&
              "bg-White border-Blue font-bold"
            } rounded-t-sm`}
          >
            <p className="">Listings</p>
          </NavLink>
          <NavLink
            to="orders"
            className={`min-w-[135px] md:w-[unset] py-2 px-5 border-x border-t transition-all ${
              matchRoute("/account/orders") && "bg-White border-Blue font-bold"
            } rounded-t-sm`}
          >
            <p className="">Orders</p>
          </NavLink>
          <NavLink
            to="messages"
            className={`min-w-[135px] md:w-[unset] py-2 px-5 border-x border-t transition-all ${
              matchRoute("/account/messages", true) &&
              "bg-White border-Blue font-bold"
            } rounded-t-sm`}
          >
            <p className="">Messages</p>
          </NavLink>
          <NavLink
            to="settings"
            className={`min-w-[135px] md:w-[unset] py-2 px-5 border-x border-t transition-all ${
              matchRoute("/account/settings") &&
              "bg-White border-Blue font-bold"
            } rounded-t-sm`}
          >
            <p className="">Settings</p>
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
