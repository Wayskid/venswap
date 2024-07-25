import React, { useContext } from "react";
import { AppButtonsSecondary } from "../../../components/reuseable/AppButtons";
import { useNavigate } from "react-router-dom";
import appContext from "../../../contexts/AppContext";
import { useGetOrdersQuery } from "../../../services/appApi";
import Loading from "../../../components/reuseable/Loading";
import { Helmet } from "react-helmet-async";

export default function Orders() {
  const navigate = useNavigate();
  const {
    userInfo: { _id },
    token,
  } = useContext(appContext);
  const {
    data: userOrdersResult,
    isLoading,
    isError,
    error,
  } = useGetOrdersQuery({
    token,
    buyer_id: _id,
  });

  return (
    <section className="bg-White">
      <Helmet>
        <title>Venswap | Account Orders</title>
        <meta name="robots" content="noindex." />
      </Helmet>
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 space-y-4">
        <p className="text-3xl">Sent Orders</p>
        {isLoading ? (
          <div className="py-10 grid">
            <Loading />
          </div>
        ) : isError ? (
          <p className="text-center text-gray-500 py-16 text-lg">
            {error.data}
          </p>
        ) : (
          userOrdersResult && (
            <table className="w-full text-sm">
              <thead className="uppercase border-y">
                <tr>
                  <th scope="col" className="py-3 text-left">
                    #
                  </th>
                  <th scope="col" className="py-3 text-center">
                    Title
                  </th>
                  <th scope="col" className="py-3">
                    Seller name
                  </th>
                  <th scope="col" className="py-3 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-lg">
                {userOrdersResult?.map((ord, index) => (
                  <tr key={index} className="*:py-7 border-y">
                    <th scope="row" className="whitespace-nowrap text-left">
                      {index + 1}
                    </th>
                    <td
                      className="text-center underline cursor-pointer"
                      onClick={() =>
                        navigate(
                          `../../../business_details/${ord.business_id._id}`
                        )
                      }
                    >
                      {ord.business_id.listing_details.listing_title.slice(
                        0,
                        20
                      )}
                      {ord.business_id.listing_details.listing_title.length > 20
                        ? "..."
                        : ""}
                    </td>
                    <td className="text-center">
                      {ord.users.find((user) => user._id !== _id).first_name}{" "}
                      {ord.users.find((user) => user._id !== _id).last_name}
                    </td>
                    <td
                      className="text-right underline cursor-pointer"
                      onClick={() => navigate(`../messages/${ord._id}`)}
                    >
                      view
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </section>
  );
}
