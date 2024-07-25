import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetOneBusinessQuery,
  useGetUserInfoQuery,
} from "../../../services/appApi";
import Loading from "../../../components/reuseable/Loading";
import appContext from "../../../contexts/AppContext";
import { IoCheckbox } from "react-icons/io5";
import { setProtocol } from "../../../store/features/appSlice";

export default function Success() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { business_id } = useParams();
  const { listingProtocols } = useSelector((state) => state.app);
  const { formatter, userInfo } = useContext(appContext);

  const {
    data: businessDetResult,
    isLoading,
    isError: isBusinessDetError,
    error: BusinessDetError,
  } = useGetOneBusinessQuery({ business_id });

  useEffect(() => {
    if (!listingProtocols.success) {
      navigate(`/business_details/${business_id}`);
    }
    setTimeout(() => {
      dispatch(setProtocol({ protocolKey: "success", protocol: false }));
    }, 10000);
  }, []);

  return listingProtocols.success &&
    businessDetResult &&
    businessDetResult?.seller_id._id === userInfo._id ? (
    <section className="bg-White">
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pb-16">
        <div className="grid space-y-3 custom_screen:grid-cols-[1fr,0.9fr] space-x-0 custom_screen:space-x-5 custom_screen:space-y-0 lg:space-x-6 mt-10 items-center">
          <div className="custom_screen:grid self-start px-6 py-10 rounded-md">
            <p className="text-3xl mb-5 font-bold text-center">
              Congratulations!
            </p>
            <IoCheckbox className="text-[8rem] text-Blue mx-auto mb-5" />
            <p className="text-xl text-center mb-8 font-semibold">
              Your Listing Has Been Published!
            </p>
            <div className="grid">
              <p className="text-lg border-b-2 pb-1 mb-1">What's next?</p>
              <ul className=" list-item list-disc text-lg">
                <li className="">
                  Share your listing on social media to spread the word.
                </li>
                <li className="">
                  Keep your listing up-to-date and fresh to attract more views.
                </li>
                <li className="">Always check your messages for enquiries.</li>
              </ul>
            </div>
          </div>
          <div className="grid rounded-sm overflow-hidden self-start shadow">
            {isLoading ? (
              <Loading />
            ) : isBusinessDetError ? (
              <p className="text-center text-gray-500 py-28 md:py-72 text-lg">
                {BusinessDetError.data}
              </p>
            ) : (
              businessDetResult && (
                <>
                  <img
                    src={businessDetResult.listing_details.images[0]}
                    alt=""
                    className="h-60 w-full object-cover"
                  />
                  <div className="grid bg-White">
                    <div className="border-b py-3 px-2">
                      <p className="text-xl font-semibold">
                        {businessDetResult.listing_details.listing_title}
                      </p>
                      <p className="">{`${
                        businessDetResult.business_details.business_location
                          .city
                      }, ${businessDetResult.business_details.business_location.state.replace(
                        "_",
                        " "
                      )}, ${
                        businessDetResult.business_details.business_location
                          .country
                      }`}</p>
                    </div>
                    <div className="border-b py-3 px-2 space-y-2">
                      <div className="grid grid-cols-2">
                        <p className="">Asking price:</p>
                        <p className="font-medium">
                          {formatter.format(businessDetResult.asking_price)}
                        </p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="">Net profit:</p>
                        <p className="font-medium">
                          {formatter.format(
                            businessDetResult.business_details.financial_details
                              .net_profit
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="border-b py-3 px-2">
                      <p className="">Listed by:</p>
                      <p className="font-medium">{`${businessDetResult.seller_id.first_name} ${businessDetResult.seller_id.last_name}`}</p>
                      <div className="flex gap-5">
                        <Link
                          to={`/business_details/${business_id}`}
                          className="grid mt-2 text-sm text-Blue"
                        >
                          More business details
                        </Link>
                        <Link
                          to={`/account/listings`}
                          className="grid mt-2 text-sm text-Blue"
                        >
                          Manage listings
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  ) : (
    <div className="grid">
      <Loading />
    </div>
  );
}
