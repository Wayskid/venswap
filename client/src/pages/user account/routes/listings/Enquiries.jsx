import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetEnquiriesQuery } from "../../../../services/appApi";
import appContext from "../../../../contexts/AppContext";
import Loading from "../../../../components/reuseable/Loading";

export default function Enquiries() {
  const navigate = useNavigate();
  const {
    userInfo: { _id },
    token,
  } = useContext(appContext);
  const {
    data: userEnquiriesResult,
    isLoading,
    isError,
    error,
  } = useGetEnquiriesQuery({
    token,
    seller_id: _id,
  });

  return (
    <div className="rounded-sm py-3 my-3 md:py-5 space-y-3 grid">
      <div className="grid md:flex justify-between">
        <p className="text-xl">All Enquiries Received</p>
        <Link
          to="../../../business_list"
          className="underline justify-self-start text-sm font-medium"
        >
          Buy a business
        </Link>
      </div>
      {isLoading ? (
        <div className="py-10 grid">
          <Loading />
        </div>
      ) : isError ? (
        <p className="text-center text-gray-500 py-16 text-lg">{error.data}</p>
      ) : (
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
                Buyer name
              </th>
              <th scope="col" className="py-3 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-lg">
            {userEnquiriesResult?.map((enq, index) => (
              <tr key={index} className="*:py-7 border-y">
                <th scope="row" className="whitespace-nowrap text-left">
                  {index + 1}
                </th>
                <td
                  className="text-center underline cursor-pointer"
                  onClick={() =>
                    navigate(`../../../business_details/${enq.business_id._id}`)
                  }
                >
                  {enq.business_id.listing_details.listing_title.slice(0, 20)}
                  {enq.business_id.listing_details.listing_title.length > 20
                    ? "..."
                    : ""}
                </td>
                <td className="text-center">
                  {enq.users.find((user) => user._id !== _id).first_name}{" "}
                  {enq.users.find((user) => user._id !== _id).last_name}
                </td>
                <td
                  className="text-right underline cursor-pointer"
                  onClick={() => navigate(`../../messages/${enq._id}`)}
                >
                  view
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
