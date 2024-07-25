import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Listings() {
  const { pathname } = useLocation();

  function matchRoute(route) {
    if (pathname === route) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <section className="bg-White">
      <Helmet>
        <title>Venswap | Account Listings</title>
        <meta name="robots" content="noindex." />
      </Helmet>
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16">
        <p className="text-3xl">Manage Listings</p>
        <div className="flex pb-[14px] space-x-5 border-b mt-5">
          <Link
            to="/account/listings"
            className={`after:h-3 after:w-3 after:border after:bg-White after:absolute relative after:-bottom-5 after:rotate-45 grid justify-items-center ${
              matchRoute("/account/listings")
                ? "after:opacity-100 font-semibold"
                : "after:opacity-0"
            }`}
          >
            All Listings
          </Link>
          <Link
            to="/account/listings/enquiries"
            className={`after:h-3 after:w-3 after:border after:bg-White after:absolute relative after:-bottom-5 after:rotate-45 grid justify-items-center ${
              matchRoute("/account/listings/enquiries")
                ? "after:opacity-100 font-semibold"
                : "after:opacity-0"
            }`}
          >
            Enquiries
          </Link>
        </div>
        <div className="bg-White h-40 relative grid z-20">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
