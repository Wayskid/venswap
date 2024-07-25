import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import appContext from "../../../../contexts/AppContext";
import { useGetUserBusinessesQuery } from "../../../../services/appApi";
import Loading from "../../../../components/reuseable/Loading";

export default function AllListings() {
  const navigate = useNavigate();
  const {
    userInfo: { _id },
    token,
    formatter,
  } = useContext(appContext);
  const {
    data: userListingsResult,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserBusinessesQuery({ token, user_id: _id });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="rounded-sm py-3 my-3 md:py-5 space-y-5">
      <div className="grid md:flex justify-between">
        <p className="text-xl">All businesses on sale</p>
        <Link
          to="../../sell_business"
          className="underline justify-self-start text-sm font-medium"
        >
          Sell a business
        </Link>
      </div>
      <div className="grid">
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <p className="text-center text-gray-500 py-16 text-lg">
            {error.data}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="uppercase border-y">
              <tr>
                <th scope="col" className="py-3 text-left hidden md:block">
                  #
                </th>
                <th scope="col" className="py-3 text-left md:text-center">
                  Title
                </th>
                <th scope="col" className="py-3">
                  No. of Views
                </th>
                <th scope="col" className="py-3">
                  Asking price
                </th>
                <th scope="col" className="py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-lg">
              {userListingsResult?.map((b, index) => (
                <tr key={b.business._id} className="*:py-7 border-y">
                  <th
                    scope="row"
                    className="whitespace-nowrap text-left hidden md:block"
                  >
                    {index + 1}
                  </th>
                  <td
                    className="md:text-center underline cursor-pointer"
                    onClick={() =>
                      navigate(`../../business_details/${b.business._id}`)
                    }
                  >
                    {b.business.listing_details.listing_title.slice(0, 20)}
                    {b.business.listing_details.listing_title.length > 20
                      ? "..."
                      : ""}
                  </td>
                  <td className="text-center">{b.viewCount}</td>
                  <td className="text-center">
                    {formatter.format(b.business.asking_price)}
                  </td>
                  <td
                    className="text-right underline cursor-pointer"
                    onClick={() =>
                      navigate(`../edit_business/${b.business._id}`)
                    }
                  >
                    edit
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
