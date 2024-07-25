import React, { useContext } from "react";
import { useGetUserProfileQuery } from "../../services/appApi";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/reuseable/Loading";
import appContext from "../../contexts/AppContext";
import moment from "moment";

export default function Profile() {
  const navigate = useNavigate();
  const { formatter } = useContext(appContext);
  const { first_name, user_id } = useParams();
  const { data, isLoading, isError, error } = useGetUserProfileQuery({
    first_name,
    user_id,
  });

  return isLoading ? (
    <div className="m-auto grid">
      <Loading />
    </div>
  ) : isError ? (
    <p className="text-center text-gray-500 py-28 md:py-72 text-lg">
      {error.data}
    </p>
  ) : (
    data && (
      <section className="bg-White">
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pb-16">
          <p className="text-3xl my-5">Profile</p>
          <div className="grid md:flex md:items-center">
            {data.userInfo.avatar ? (
              <img
                src={data.userInfo.avatar}
                className="w-40 h-40 object-cover rounded-sm md:mr-5 justify-self-center"
              />
            ) : (
              <p className="w-40 h-40 bg-slate-800 text-White rounded-sm grid place-items-center text-[7rem] font-bold md:mr-5 justify-self-center">
                {data.userInfo.first_name.slice(0, 1)}
              </p>
            )}
            <div className="text-center md:text-left">
              <p className="text-xl font-semibold">
                {data.userInfo.first_name} {data.userInfo.last_name}
              </p>
              <p className="">Joined {moment().format("MMM YYYY")}</p>
              <p className="">
                {data.businesses.length} listing
                {data.businesses.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="mt-10">
            <p className="text-xl mb-5">
              {data.userInfo.first_name} listing
              {data.businesses.length > 1 ? "s" : ""}
            </p>
            <div className="grid">
              <table className="w-full text-sm">
                <thead className="uppercase border-y">
                  <tr>
                    <th scope="col" className="py-3 text-left">
                      #
                    </th>
                    <th scope="col" className="py-3 text-center">
                      Title
                    </th>
                    <th scope="col" className="py-3 hidden sm:grid">
                      Location
                    </th>
                    <th scope="col" className="py-3 text-right">
                      Asking price
                    </th>
                  </tr>
                </thead>
                <tbody className="text-lg">
                  {data?.businesses.map((b, index) => (
                    <tr key={b._id} className="*:py-7 border-y">
                      <th scope="row" className="whitespace-nowrap text-left">
                        {index + 1}
                      </th>
                      <td
                        className="text-center underline cursor-pointer"
                        onClick={() =>
                          navigate(`../../business_details/${b._id}`)
                        }
                      >
                        {b.listing_details.listing_title.slice(0, 20)}
                        {b.listing_details.listing_title.length > 20
                          ? "..."
                          : ""}
                      </td>
                      <td className="text-center hidden sm:grid">
                        {b.business_details.business_location.state.replace(
                          "_",
                          " "
                        )}
                      </td>
                      <td className="text-right">
                        {formatter.format(b.asking_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    )
  );
}
