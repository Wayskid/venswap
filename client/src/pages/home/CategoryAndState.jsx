import React from "react";
import AppButtons from "../../components/reuseable/AppButtons";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

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
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 py-16 space-y-7 grid">
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
                  {/* <img
                    src="https://res.cloudinary.com/diiohnshc/image/upload/v1713641806/Venswap/erik-mclean-ioEjMWHn2nY-unsplash_np90ks.jpg"
                    alt=""
                    className={`w-full h-full object-cover cursor-pointer opacity-50 object-center`}
                  /> */}
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
      <section className="bg-[#c5c1fd]">
        <div className="w-[min(92rem,100%)] mx-auto px-0 md:px-12 lg:px-32 pt-16 pb-1 md:py-16 space-y-7 grid md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="grid gap-6 px-4 md:px-0">
            <p className="text-3xl font-semibold">
              Sell your business yourself
            </p>
            <p className="">
              We connect you with thousands of buyers and give you all the tools
              you need to easily sell your business.
            </p>
            <AppButtons
              className="bg-Orange rounded-sm text-White disabled:opacity-60 !justify-self-start"
              label="Sell Business"
              onClick={() => navigate("/sell_business")}
            />
          </div>
          <div className="grid relative">
            <img
              src="https://res.cloudinary.com/diiohnshc/image/upload/v1723552570/Venswap/assets/linkedin-sales-solutions-EI50ZDA-l8Y-unsplash_q8u7to.jpg"
              alt="Photo by LinkedIn Sales Solutions on https://unsplash.com/photos/man-writing-on-white-paper-EI50ZDA-l8Y?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
              className="h-[360px] w-full object-cover"
            />
            <div className="px-5 pt-5 md:p-5 pr-8 grid bg-white rounded-t-xl -mt-10 md:mt-0 md:rounded-tl-xl md:rounded-br-xl md:rounded-tr-none md:absolute -top-10 -left-10">
              <p className="text-xl font-semibold mb-1">
                How selling a business works
              </p>
              <div className="grid gap-1">
                <div className="flex gap-3 items-center">
                  <IoMdCheckmarkCircleOutline className="text-xl shrink-0" />
                  <p className="text-lg">Create your advert</p>
                </div>
                <div className="flex gap-3 items-center">
                  <IoMdCheckmarkCircleOutline className="text-xl shrink-0" />
                  <p className="text-lg">Showcase your business</p>
                </div>
                <div className="flex gap-3 items-center">
                  <IoMdCheckmarkCircleOutline className="text-xl shrink-0" />
                  <p className="text-lg">Connect with serious buyers</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-5 md:p-5 pr-8 grid bg-white rounded-none md:rounded-tl-xl md:rounded-br-xl md:absolute -bottom-10 -right-10">
              <p className="text-xl font-semibold mb-1">
                Why sell your business yourself
              </p>
              <div className="grid gap-1">
                <div className="flex gap-3 items-center">
                  <IoMdCheckmarkCircleOutline className="text-xl shrink-0" />
                  <p className="text-lg">Avoid paying commission on sale</p>
                </div>
                <div className="flex gap-3 items-center">
                  <IoMdCheckmarkCircleOutline className="text-xl shrink-0" />
                  <p className="text-lg">
                    Flexibility & control from start to finish
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <IoMdCheckmarkCircleOutline className="text-xl shrink-0" />
                  <p className="text-lg">Tailored marketing approach</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-White">
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 py-16 space-y-8 grid">
          <p className="text-Blue font-semibold text-3xl">Find by locations</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-7">
            {!isLoading ? (
              mergeCountStates?.slice(0, 8).map((state, index) => (
                <li
                  key={index}
                  className="grid relative bg-Blue shadow-lg rounded-md overflow-hidden text-White h-[15rem]"
                  onClick={() => navigate(`business_list?state=${state.state}`)}
                >
                  {/* <img
                    src="https://res.cloudinary.com/diiohnshc/image/upload/v1713639297/Venswap/david-rotimi-LxENUKJXh_k-unsplash_ojcwta.jpg"
                    alt=""
                    className={`w-full h-full object-cover cursor-pointer opacity-50 object-center`}
                  /> */}
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
