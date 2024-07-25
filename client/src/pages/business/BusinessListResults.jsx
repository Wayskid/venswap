import React, { useContext } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { AppButtonsSecondary } from "../../components/reuseable/AppButtons";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/reuseable/Loading";
import appContext from "../../contexts/AppContext";
import { useUpdateViewCountMutation } from "../../services/appApi";

export default function BusinessListResults({
  businessListResult,
  isLoading,
  isError,
  error,
}) {
  const navigate = useNavigate();
  const { formatter, userInfo, token } = useContext(appContext);
  const [updateViewCountApi] = useUpdateViewCountMutation();

  return isLoading ? (
    <Loading />
  ) : isError ? (
    <p className="text-center text-gray-500 py-28 md:py-72 text-lg">
      {error.data}{" "}
      <Link className="text-Blue" reloadDocument>
        Try clearing filters
      </Link>
    </p>
  ) : (
    <ul className="grid mt-2 md:mt-1 space-y-4 lg:space-y-5 align-baseline items-start self-start">
      {businessListResult &&
        businessListResult?.map((business, index) => (
          <li
            key={index}
            className="shadow-md rounded-[3px] grid md:grid-cols-2 lg:grid-cols-[1.25fr_2fr]"
          >
            <div className="md:row-span-2 border-r grid">
              <div
                className="h-[12rem] md:h-[224px] bg-Blue overflow-hidden"
                onClick={() => {
                  navigate(`/business_details/${business._id}`);
                  updateViewCountApi({
                    token,
                    user_id: userInfo._id,
                    body: {
                      business_id: business._id,
                      seller_id: business.seller_id._id,
                    },
                  });
                }}
              >
                <img
                  src={business.listing_details.images[0]}
                  alt=""
                  className={`w-full h-full object-cover cursor-pointer hover:scale-[1.04] transition duration-700`}
                />
              </div>
              <div
                className="px-3 py-2 cursor-pointer"
                onClick={() => navigate(`/business_details/${business._id}`)}
              >
                <p className="font-medium text-lg">
                  {formatter.format(business.asking_price)}
                </p>
                <p className="text-sm">
                  {formatter.format(
                    business.business_details.financial_details.net_profit
                  )}{" "}
                  Net profit
                </p>
              </div>
            </div>
            <div
              className="p-3 py-2 grid cursor-pointer"
              onClick={() => navigate(`/business_details/${business._id}`)}
            >
              <p className="font-medium text-lg text-Blue">
                {business.listing_details.listing_title}
              </p>
              <p className="">{`${
                business.business_details.business_location.city
              }, ${business.business_details.business_location.state.replace(
                "_",
                " "
              )}, ${business.business_details.business_location.country}`}</p>
              <p className="mt-3">
                {business.listing_details.listing_summary.slice(0, 400)}
                {business.listing_details.listing_summary.length > 400 && "..."}
              </p>
            </div>
            <div className="flex justify-between items-center w-full px-3 py-[6px]">
              <p className="text-Blue">
                {business.business_details.property_details.type}
              </p>
              {business.seller_id._id === userInfo?._id ? (
                <AppButtonsSecondary
                  className="bg-Orange rounded-sm text-White"
                  label="Manage business"
                  onClick={() => navigate(`../account/listings`)}
                />
              ) : (
                <AppButtonsSecondary
                  className="bg-Orange rounded-sm text-White"
                  label="Contact seller"
                  onClick={() =>
                    navigate(`/business_details/${business._id}/contact`)
                  }
                />
              )}
            </div>
          </li>
        ))}
    </ul>
  );
}
