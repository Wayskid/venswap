import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedBusinesses from "./FeaturedBusinesses";
import { useGetBusinessesQuery } from "../../services/appApi";
import CategoryAndState from "./CategoryAndState";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const key = searchVal.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
    navigate(`business_list?search=${key}`);
  }

  const {
    data: businessListResult,
    isLoading,
    isError,
    error,
  } = useGetBusinessesQuery({
    search: "",
    category: "",
    state: "",
    property: "",
    date_filter: "",
    sort_price: "",
    limit: 0,
    page: 1,
  });

  return (
    <div className="mx-auto grid lg:overflow-y-hidden">
      <Helmet>
        <title>Venswap | Buy and sell businesses</title>
        <meta
          name="description"
          content="Buy and sell businesses on Venswap, the premier online marketplace. Browse listings, connect with sellers, and find your next opportunity."
        />
        <link rel="canonical" href="/" />
      </Helmet>
      <section className="bg-White">
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-16 pb-0 grid gap-12 ">
          <div className="grid justify-items-center">
            <p className="text-center font-semibold text-[3rem] md:text-[3.2rem] w-[min(33rem,100%)] py-4 leading-tight">
              A <span className="text-Blue">marketplace</span> to buy or sell a{" "}
              <span className="text-Blue">business</span>
            </p>
            <div className="space-y-7 bg-Blue w-[min(92rem,100%)] grid px-6 py-10 md:px-10 translate-y-28 -mt-16 rounded-sm shadow-lg text-White font-semibold">
              <p className="text-center text-xl">Find a Business</p>
              <form
                className="border grid grid-cols-[1fr_auto] p-2 md:p-3 focus-within:border-Orange rounded-sm space-x-2"
                onSubmit={handleSearch}
              >
                <input
                  type="text"
                  className="outline-none w-[min(92rem,100%)] md:w-[unset] text-lg bg-transparent placeholder:text-White placeholder:italic placeholder:font-[200] pl-1 md:pl-3 focus:placeholder:text-transparent placeholder:transition-all"
                  placeholder="Search business name..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />
                <button className="bg-White text-Blue py-2 px-6 rounded-sm text-lg">
                  Search
                </button>
              </form>
              <button
                className="mx-auto text-sm"
                onClick={() => navigate("/business_list")}
              >
                Advanced search
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-Orange">
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-44 pb-20 py-48 space-y-7 grid">
          <p className="text-White font-semibold text-3xl">Featured</p>
          <FeaturedBusinesses
            result={businessListResult?.businesses}
            isError={isError}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </section>
      <CategoryAndState
        result={businessListResult?.businesses}
        isLoading={isLoading}
      />
    </div>
  );
}
