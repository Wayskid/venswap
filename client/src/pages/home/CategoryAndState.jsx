import React from "react";
import AppButtons from "../../components/reuseable/AppButtons";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

export default function CategoryAndState({ result, isLoading }) {
  const navigate = useNavigate();
  const mergeCountStates = result
    ?.map((business) => ({
      state: business.business_details.business_location.state,
      count: 1,
    }))
    .reduce((a, c) => {
      const obj = a.find((obj) => obj.state === c.state);
      if (!obj) {
        a.push(c);
      } else {
        obj.count += c.count;
      }
      return a;
    }, []);

  const mergeCountCategories = result
    ?.map((business) => ({
      category: business.business_details.category,
      count: 1,
    }))
    .reduce((a, c) => {
      const obj = a.find((obj) => obj.category === c.category);
      if (!obj) {
        a.push(c);
      } else {
        obj.count += c.count;
      }
      return a;
    }, []);

  return (
    <>
      <section className="bg-White">
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-12 pb-16 py-48 space-y-7 grid">
          <p className="text-Blue font-semibold text-3xl">Find by Categories</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-7">
            {!isLoading ? (
              mergeCountCategories?.slice(0, 16).map((category, index) => (
                <li
                  key={index}
                  className="grid relative bg-Blue shadow-lg rounded-md overflow-hidden text-White h-[15rem]"
                  onClick={() =>
                    navigate(`business_list?category=${category.category}`)
                  }
                >
                  <img
                    src="https://res.cloudinary.com/diiohnshc/image/upload/v1713641806/Venswap/erik-mclean-ioEjMWHn2nY-unsplash_np90ks.jpg"
                    alt=""
                    className={`w-full h-full object-cover cursor-pointer opacity-50 object-center`}
                  />
                  <div className="px-1 my-3 grid text-center justify-center cursor-pointer absolute self-center justify-self-center">
                    <p className="name font-bold text-xl">
                      {category.category.replace("_", " ")}
                    </p>
                    <p className="name font-semibold text-lg">
                      ({category.count})
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <>
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"240px"}
                />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"240px"}
                />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"240px"}
                />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"240px"}
                />
              </>
            )}
          </div>
          <AppButtons
            className="bg-Blue rounded-sm text-White mx-auto md:ml-0 md:mr-auto"
            label="View more categories"
            onClick={() => navigate(`business_list`)}
          />
        </div>
      </section>
      <section className="bg-White">
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-12 pb-16 py-48 space-y-8 grid">
          <p className="text-Blue font-semibold text-3xl">Find by locations</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-7">
            {!isLoading ? (
              mergeCountStates?.slice(0, 8).map((state, index) => (
                <li
                  key={index}
                  className="grid relative bg-Blue shadow-lg rounded-md overflow-hidden text-White h-[15rem]"
                  onClick={() => navigate(`business_list?state=${state.state}`)}
                >
                  <img
                    src="https://res.cloudinary.com/diiohnshc/image/upload/v1713639297/Venswap/david-rotimi-LxENUKJXh_k-unsplash_ojcwta.jpg"
                    alt=""
                    className={`w-full h-full object-cover cursor-pointer opacity-50 object-center`}
                  />
                  <div className="px-1 my-3 grid text-center justify-center cursor-pointer absolute self-center justify-self-center">
                    <p className="title font-semibold">Businesses in</p>
                    <p className="name font-bold text-xl">
                      {state.state.replace("_", " ")}, Nigeria
                    </p>
                    <p className="name font-semibold text-lg">
                      ({state.count})
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <>
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"240px"}
                />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"240px"}
                />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"240px"}
                />
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"240px"}
                />
              </>
            )}
          </div>
          <AppButtons
            className="bg-Blue rounded-sm text-White mx-auto md:ml-0 md:mr-auto"
            label="View more locations"
            onClick={() => navigate(`business_list`)}
          />
        </div>
      </section>
    </>
  );
}
