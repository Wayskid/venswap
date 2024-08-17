import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import appContext from "../../contexts/AppContext";
import Skeleton from "@mui/material/Skeleton";
import { useUpdateViewCountMutation } from "../../services/appApi";

export default function FeaturedBusinesses({
  result,
  isLoading,
  isError,
  error,
}) {
  const navigate = useNavigate();
  const { formatter, userInfo, token } = useContext(appContext);
  const [updateViewCountApi] = useUpdateViewCountMutation();

  return isLoading ? (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
      <div className="grid justify-items-center">
        <Skeleton variant="rectangular" width={"100%"} height={"160px"} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"100%"} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"75%"} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"60%"} />
      </div>
      <div className="grid justify-items-center">
        <Skeleton variant="rectangular" width={"100%"} height={"160px"} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"100%"} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"75%"} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"60%"} />
      </div>
      <div className="grid justify-items-center">
        <Skeleton variant="rectangular" width={"100%"} height={"160px"} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"100%"} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"75%"} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"60%"} />
      </div>
      <div className="grid justify-items-center">
        <Skeleton variant="rectangular" width={"100%"} height={"160px"} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"100%"} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"75%"} />
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"60%"} />
      </div>
    </div>
  ) : isError ? (
    <p className="text-center text-gray-500 py-28 md:py-72 text-lg">
      {error.data}
    </p>
  ) : (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7 relative">
      {result &&
        result
          .filter((b) => {
            if (b.featured === true) {
              return b;
            }
          })
          .map((business) => (
            <li
              key={business._id}
              className="grid relative bg-White shadow-lg rounded-sm overflow-hidden text-Blue"
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
              {false && (
                <p className="absolute top-1 right-1 text-white font-light bg-main px-2 py-1 z-10">
                  Sold Out
                </p>
              )}
              <div className="h-[10rem] bg-Blue overflow-hidden">
                <img
                  src={business.listing_details.images[0]}
                  alt=""
                  className={`w-full h-full object-cover cursor-pointer opacity-90 hover:scale-[1.04] transition duration-700`}
                />
              </div>
              <div className="px-1 my-3 grid text-center justify-center cursor-pointer">
                <p className="title text-lg font-medium">
                  {business.listing_details.listing_title.slice(0, 35)}
                  {business.listing_details.listing_title.length > 35 && "..."}
                </p>
                <p className="font-light">{`${
                  business.business_details.business_location.city
                }, ${business.business_details.business_location.state.replace(
                  "_",
                  " "
                )}, ${business.business_details.business_location.country}`}</p>
                <p className="text-lg font-light">
                  {formatter.format(business.asking_price)}
                </p>
              </div>
            </li>
          ))}
    </ul>
  );
}
