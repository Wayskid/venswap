import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import appContext from "../../contexts/AppContext";
import Loading from "../../components/reuseable/Loading";
import { useGetSavedBusinessesQuery } from "../../services/appApi";
import { useDispatch, useSelector } from "react-redux";
import { saveBusiness } from "../../store/features/appSlice";

export default function SavedBusinesses() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const saved = useSelector((state) => state.app.savedBusinesses);
  const { formatter } = useContext(appContext);
  const { data, isLoading, isError, error } = useGetSavedBusinessesQuery({
    body: { saved },
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
    <section className="bg-White">
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pb-16">
        <p className="text-3xl my-5">Saved listings</p>
        <div className="grid mt-10">
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
                <th scope="col" className="py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-lg">
              {data?.map((b, index) => (
                <tr key={b._id} className="*:py-7 border-y">
                  <th scope="row" className="whitespace-nowrap text-left">
                    {index + 1}
                  </th>
                  <td
                    className="text-center underline cursor-pointer"
                    onClick={() => navigate(`../../business_details/${b._id}`)}
                  >
                    {b.listing_details.listing_title.slice(0, 20)}
                    {b.listing_details.listing_title.length > 20 ? "..." : ""}
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
                  <td
                    className="text-right underline cursor-pointer"
                    onClick={() => dispatch(saveBusiness(b._id))}
                  >
                    remove
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
