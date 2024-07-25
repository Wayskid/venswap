import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import ListingNav from "./ListingNav";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

export default function ListingLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { listingProtocols } = useSelector((state) => state.app);

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
        <title>Venswap | Sell a businesses</title>
        <meta
          name="description"
          content="List Your Business for Sale and Reach a Global Network of Potential Buyers."
        />
        <link rel="canonical" href="/sell_business" />
      </Helmet>
      <ListingNav />
      <div className="mt-[92px] overflow-x-hidden">
        <div className="w-[min(92rem,100%)] mx-auto flex md:grid md:grid-cols-6 gap-1 md:gap-2 px-4 md:px-12 lg:px-[128px] pt-2 overflow-x-scroll scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [::-webkit-scrollbar{display:none}] text-center transition-all">
          <button
            onClick={() => navigate("/sell_business")}
            className={`min-w-[135px] md:w-[unset] py-2 px-5 border-x border-t transition-all ${
              matchRoute("/sell_business") && "bg-White border-Blue font-bold"
            } rounded-t-sm`}
            disabled={!listingProtocols.setup}
          >
            <p className="">Setup</p>
          </button>
          <button
            onClick={() => navigate("build_listing")}
            className={`min-w-[135px] md:w-[unset] py-2 px-5 border-x border-t transition-all ${
              matchRoute("/sell_business/build_listing") &&
              "bg-White border-Blue font-bold"
            } rounded-t-sm disabled:opacity-70`}
            disabled={!listingProtocols.build_listing}
          >
            <p className="">Build Listing</p>
          </button>
          <button
            onClick={() => navigate("business_details")}
            className={`min-w-[135px] md:w-[unset] py-2 px-5 border-x border-t transition-all ${
              matchRoute("/sell_business/business_details") &&
              "bg-White border-Blue font-bold"
            } rounded-t-sm disabled:opacity-70`}
            disabled={!listingProtocols.business_details}
          >
            <p className="">Details</p>
          </button>
          <button
            onClick={() => navigate("business_docs")}
            className={`min-w-[135px] md:w-[unset] py-2 px-5 border-x border-t transition-all ${
              matchRoute("/sell_business/business_docs") &&
              "bg-White border-Blue font-bold"
            } rounded-t-sm disabled:opacity-70`}
            disabled={!listingProtocols.documents}
          >
            <p className="">Documents</p>
          </button>
          <button
            onClick={() => navigate("preview")}
            className={`min-w-[135px] md:w-[unset] py-2 px-5 border-x border-t transition-all ${
              matchRoute("/sell_business/preview") &&
              "bg-White border-Blue font-bold"
            } rounded-t-sm disabled:opacity-70`}
            disabled={!listingProtocols.preview}
          >
            <p className="">Preview</p>
          </button>
          <button
            onClick={() => navigate("success")}
            className={`min-w-[135px] md:w-[unset] py-2 px-5 border-x border-t transition-all ${
              matchRoute("/sell_business/success") &&
              "bg-White border-Blue font-bold"
            } rounded-t-sm disabled:opacity-70`}
            disabled={true}
          >
            <p className="">Success</p>
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
