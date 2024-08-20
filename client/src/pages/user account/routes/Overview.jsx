import React, { useContext } from "react";
import { Link } from "react-router-dom";
import appContext from "../../../contexts/AppContext";
import { useAccountOverviewQuery } from "../../../services/appApi";
import { Helmet } from "react-helmet-async";

export default function Overview() {
  const { userInfo, token } = useContext(appContext);
  const { data: overviewResult, isLoading } = useAccountOverviewQuery({
    token,
    user_id: userInfo._id,
  });
  return (
    <section className="bg-White">
      <Helmet>
        <title>Venswap | Account Overview</title>
        <meta name="robots" content="noindex." />
      </Helmet>
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 space-y-4">
        <p className="font-medium text-3xl">Hello {userInfo.first_name}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="shadow-md rounded-sm p-3 md:p-5">
            <p className="text-xl">Listings</p>
            <p className="text-Blue font-bold text-[4.5rem] my-2">
              {isLoading ? "0" : overviewResult?.no_of_listings}
            </p>
            <Link
              to="/account/listings"
              className="underline font-medium text-sm"
            >
              View all{" >>"}
            </Link>
          </div>
          <div className="shadow-md rounded-sm p-3 md:p-5">
            <p className="text-xl">Enquiries</p>
            <p className="text-Blue font-bold text-[4.5rem] my-2">
              {isLoading ? "0" : overviewResult?.no_of_enquiries}
            </p>
            <Link
              to="/account/listings/enquiries"
              className="underline font-medium text-sm"
            >
              View all{" >>"}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="shadow-md rounded-sm p-3 md:p-5">
            <p className="text-xl">Orders</p>
            <p className="text-Blue font-bold text-[4.5rem] my-2">
              {isLoading ? "0" : overviewResult?.no_of_orders}
            </p>
            <Link to="/account/buys" className="underline font-medium text-sm">
              View all{" >>"}
            </Link>
          </div>
          <div className="shadow-md rounded-sm p-3 md:p-5">
            <p className="text-xl">Total views</p>
            <p className="text-Blue font-bold text-[4.5rem] my-2">
              {isLoading ? "0" : overviewResult?.total_no_of_views}
            </p>
            <Link
              to="/account/listings"
              className="underline font-medium text-sm"
            >
              View all{" >>"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
