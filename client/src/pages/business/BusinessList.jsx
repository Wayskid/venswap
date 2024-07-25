import React, { useEffect, useState } from "react";
import { PiPlusThin } from "react-icons/pi";
import AppSelectField from "../../components/reuseable/AppSelectField";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetBusinessesQuery } from "../../services/appApi";
import BusinessListResults from "./BusinessListResults";
import PaginationRounded from "../../components/reuseable/Pagination";
import { LuSettings2 } from "react-icons/lu";
import { AiFillCloseSquare } from "react-icons/ai";
import SelectInput from "../../components/reuseable/SelectInput";
import { Helmet } from "react-helmet-async";

export default function BusinessList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [state, setState] = useState(searchParams.get("state") ?? "");
  const [property, setProperty] = useState(searchParams.get("property") ?? "");
  const [date_filter, setDate_filter] = useState(
    searchParams.get("date_filter") ?? "Anytime"
  );
  const [sort_price, setSort_price] = useState(
    searchParams.get("sort_price") ?? ""
  );
  const [limit, setLimit] = useState(searchParams.get("limit") ?? 25);
  const [page, setPage] = useState(searchParams.get("page") ?? 1);

  const categoryOptions = [
    "Automotive",
    "Business",
    "Computers",
    "Construction",
    "Education",
    "Entertainment",
    "Food",
    "Health",
    "Home",
    "Legal",
    "Manufacturing",
    "Merchants",
    "Miscellaneous",
    "Care",
    "Estate",
    "Travel",
  ];
  const stateOptions = [
    "Abia",
    "Adamawa",
    "Akwa_Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT_Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];
  const propertyOptions = ["Freehold", "Leasehold", "Relocatable"];
  const dateOptions = [
    { label: "Anytime", value: "Anytime" },
    { label: "Last 5 Days", value: "less_5D" },
    { label: "Last 14 Days", value: "less_14D" },
    { label: "Last Month", value: "less_1M" },
    { label: "Last 3 Months", value: "greater_3M" },
  ];
  const priceSortOptions = [
    { label: "All price", value: "All" },
    { label: "500k and lower", value: "less_500k" },
    { label: "1M and lower", value: "less_1M" },
    { label: "3M and lower", value: "less_3M" },
    { label: "Higher than 3M", value: "greater_3M" },
  ];
  const limitOptions = [
    { label: "Show 25", value: "25" },
    { label: "Show 50", value: "50" },
    { label: "Show 100", value: "100" },
    { label: "Show 500", value: "500" },
  ];

  const {
    data: businessListResult,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBusinessesQuery({
    search: searchParams.get("search") ?? "",
    category,
    state,
    property,
    date_filter,
    sort_price,
    limit,
    page,
  });

  function handleSearch(e) {
    e.preventDefault();
    navigate(
      `?search=${search
        .replace(/\s+/g, " ")
        .replace(
          /^\s+|\s+$/g,
          ""
        )}&category=${category}&state=${state}&property=${property}&date_filter=${date_filter}&sort_price=${sort_price}&limit=${limit}&page=${page}`
    );
  }

  function handleChange(e, initState, updateState) {
    if (initState.includes(e.target.value)) {
      const array = initState.split(",");
      const index = array.indexOf(e.target.value);
      if (index > -1) array.splice(index, 1);
      updateState(array.join(","));
    } else {
      initState.length > 0
        ? updateState(`${initState},${e.target.value}`)
        : updateState(`${e.target.value}`);
    }
  }

  useEffect(() => {
    navigate(
      `?search=${search
        .replace(/\s+/g, " ")
        .replace(
          /^\s+|\s+$/g,
          ""
        )}&category=${category}&state=${state}&property=${property}&date_filter=${date_filter}&sort_price=${sort_price}&limit=${limit}&page=${page}`
    );
    setShowFilter(false);
  }, [category, state, property, date_filter, sort_price, limit, page]);

  const [showFilter, setShowFilter] = useState(false);

  return (
    <section className="bg-White">
      <Helmet>
        <title>Venswap | Search businesses</title>
        <meta
          name="description"
          content="Search for Businesses and Companies for Sale: Find Your Ideal Investment Opportunity."
        />
        <link rel="canonical" href="/business_list" />
      </Helmet>
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16">
        <p className="mb-5 text-3xl">Search Businesses</p>
        <div className="flex space-x-0 custom_screen:space-x-4 lg:space-x-5 relative">
          <div
            className={`fixed w-full left-0 z-10 h-[calc(100%-92px)] bottom-0 overflow-scroll bg-Blue text-White custom_screen:[position:unset] custom_screen:w-fit rounded-sm custom_screen:rounded-none custom_screen:shrink-0 custom_screen:grid self-start transition-transform ${
              showFilter
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0 custom_screen:translate-y-0 custom_screen:opacity-100"
            }`}
          >
            <div className="py-7 custom_screen:py-5 pl-7 pr-9 border-b flex justify-between items-center">
              <p className=" font-bold text-xl">Filter Search</p>
              <AiFillCloseSquare
                className="text-3xl cursor-pointer custom_screen:hidden"
                onClick={() => setShowFilter(false)}
              />
            </div>
            <div className="space-y-2 py-5 pl-7 pr-10 border-b">
              <p className="font-semibold">By Category</p>
              {category.length > 0 && (
                <div className="">
                  <input
                    type="checkbox"
                    id="Selected_categories"
                    className="hidden peer/accordion"
                    defaultChecked
                  />
                  <label
                    id="Selected_categories"
                    htmlFor="Selected_categories"
                    className="grid grid-cols-[1fr_0.15fr] justify-between items-center cursor-pointer peer-checked/accordion:[&>*:last-child]:rotate-[45deg]"
                  >
                    <p className="text-sm">Selected Categories</p>
                    <PiPlusThin className="text-2xl justify-self-end transition-all" />
                  </label>
                  <div className="grid grid-rows-[0] overflow-hidden peer-checked/accordion:grid-rows-1">
                    <div className="mt-1">
                      {category?.split(",").map((cat, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[1fr_auto] py-[5px] items-center"
                        >
                          <div className="border rounded-sm flex items-center gap-4 relative cursor-pointer p-[3px] mr-[4.3px]">
                            <input
                              type="checkbox"
                              className="peer/radio absolute w-full h-full opacity-0 z-30 cursor-pointer"
                              id={cat}
                              name={cat}
                              value={cat}
                              checked={category.includes(cat)}
                              onChange={(e) =>
                                handleChange(e, category, setCategory)
                              }
                            />
                            <div className="p-[4.5px] z-20 peer-checked/radio:bg-Orange grid place-items-center transition rounded-xs"></div>
                          </div>
                          <label
                            id={cat}
                            htmlFor={cat}
                            className="text-sm font-light cursor-pointer row-start-1"
                          >
                            {cat}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="">
                <input
                  type="checkbox"
                  id="All_categories"
                  className="hidden peer/accordion"
                />
                <label
                  id="All_categories"
                  htmlFor="All_categories"
                  className="grid grid-cols-[1fr_0.15fr] justify-between items-center cursor-pointer peer-checked/accordion:[&>*:last-child]:rotate-[45deg]"
                >
                  <p className="text-sm">All Categories</p>
                  <PiPlusThin className="text-2xl justify-self-end transition-all" />
                </label>
                <div className="grid grid-rows-[0] overflow-hidden peer-checked/accordion:grid-rows-1">
                  <div className="mt-1">
                    {categoryOptions?.map((cat, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[1fr_auto] py-[5px] items-center"
                      >
                        <div className="border rounded-sm flex items-center gap-4 relative cursor-pointer p-[3px] mr-[4.3px]">
                          <input
                            type="checkbox"
                            className="peer/radio absolute w-full h-full opacity-0 z-30 cursor-pointer"
                            id={cat}
                            name={cat}
                            value={cat}
                            checked={category.includes(cat)}
                            onChange={(e) =>
                              handleChange(e, category, setCategory)
                            }
                          />
                          <div className="p-[4.5px] z-20 peer-checked/radio:bg-Orange grid place-items-center transition rounded-xs"></div>
                        </div>
                        <label
                          id={cat}
                          htmlFor={cat}
                          className="text-sm font-light cursor-pointer row-start-1"
                        >
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2 py-5 pl-7 pr-10 border-b">
              <p className="font-semibold">By Location</p>
              {state.length > 0 && (
                <div className="">
                  <input
                    type="checkbox"
                    id="Selected_states"
                    className="hidden peer/accordion"
                    defaultChecked
                  />
                  <label
                    id="Selected_states"
                    htmlFor="Selected_states"
                    className="grid grid-cols-[1fr_0.15fr] justify-between items-center cursor-pointer peer-checked/accordion:[&>*:last-child]:rotate-[45deg]"
                  >
                    <p className="text-sm">Selected States</p>
                    <PiPlusThin className="text-2xl justify-self-end transition-all" />
                  </label>
                  <div className="grid grid-rows-[0] overflow-hidden peer-checked/accordion:grid-rows-1">
                    <div className="mt-1">
                      {state?.split(",").map((sta, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[1fr_auto] py-[5px] items-center"
                        >
                          <div className="border rounded-sm flex items-center gap-4 relative cursor-pointer p-[3px] mr-[4.3px]">
                            <input
                              type="checkbox"
                              className="peer/radio absolute w-full h-full opacity-0 z-30 cursor-pointer"
                              id={sta}
                              name={sta}
                              value={sta}
                              checked={state.includes(sta)}
                              onChange={(e) => handleChange(e, state, setState)}
                            />
                            <div className="p-[4.5px] z-20 peer-checked/radio:bg-Orange grid place-items-center transition rounded-xs"></div>
                          </div>
                          <label
                            id={sta}
                            htmlFor={sta}
                            className="text-sm font-light cursor-pointer row-start-1"
                          >
                            {sta.replace("_", " ")}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="">
                <input
                  type="checkbox"
                  id="All_states"
                  className="hidden peer/accordion"
                />
                <label
                  id="All_states"
                  htmlFor="All_states"
                  className="grid grid-cols-[1fr_0.15fr] justify-between items-center cursor-pointer peer-checked/accordion:[&>*:last-child]:rotate-[45deg]"
                >
                  <p className="text-sm">All States</p>
                  <PiPlusThin className="text-2xl justify-self-end transition-all" />
                </label>
                <div className="grid grid-rows-[0] overflow-hidden peer-checked/accordion:grid-rows-1">
                  <div className="mt-1">
                    {stateOptions?.map((sta, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[1fr_auto] py-[5px] items-center"
                      >
                        <div className="border rounded-sm flex items-center gap-4 relative cursor-pointer p-[3px] mr-[4.3px]">
                          <input
                            type="checkbox"
                            className="peer/radio absolute w-full h-full opacity-0 z-30 cursor-pointer"
                            id={sta}
                            name={sta}
                            value={sta}
                            checked={state.includes(sta)}
                            onChange={(e) => handleChange(e, state, setState)}
                          />
                          <div className="p-[4.5px] z-20 peer-checked/radio:bg-Orange grid place-items-center transition rounded-xs"></div>
                        </div>
                        <label
                          id={sta}
                          htmlFor={sta}
                          className="text-sm font-light cursor-pointer row-start-1"
                        >
                          {sta.replace("_", " ")}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2 py-5 pl-7 pr-10 border-b">
              <p className="font-semibold">Property Filter</p>
              <div className="">
                <input
                  type="checkbox"
                  id="All_properties"
                  className="hidden peer/accordion"
                />
                <label
                  id="All_properties"
                  htmlFor="All_properties"
                  className="grid grid-cols-[1fr_0.15fr] justify-between items-center cursor-pointer peer-checked/accordion:[&>*:last-child]:rotate-[45deg]"
                >
                  <p className="text-sm">All Properties</p>
                  <PiPlusThin className="text-2xl justify-self-end transition-all" />
                </label>
                <div className="grid grid-rows-[0] overflow-hidden peer-checked/accordion:grid-rows-1">
                  <div className="mt-1">
                    {propertyOptions?.map((prop, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[1fr_auto] py-[5px] items-center"
                      >
                        <div className="border rounded-sm flex items-center gap-4 relative cursor-pointer p-[3px] mr-[4.3px]">
                          <input
                            type="checkbox"
                            className="peer/radio absolute w-full h-full opacity-0 z-30 cursor-pointer"
                            id={prop}
                            name={prop}
                            value={prop}
                            checked={property.includes(prop)}
                            onChange={(e) =>
                              handleChange(e, property, setProperty)
                            }
                          />
                          <div className="p-[4.5px] z-20 peer-checked/radio:bg-Orange grid place-items-center transition rounded-xs"></div>
                        </div>
                        <label
                          id={prop}
                          htmlFor={prop}
                          className="text-sm font-light cursor-pointer row-start-1"
                        >
                          {prop}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2 py-5 pl-7 pr-10">
              <p className="font-semibold">By Date Listed</p>
              <div className="">
                {dateOptions.map((date, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_auto] py-[7px] items-center"
                  >
                    <div className="border rounded-sm flex items-center gap-4 relative cursor-pointer p-[3px] mr-[5px]">
                      <input
                        type="radio"
                        className="peer/radio absolute w-full h-full opacity-0 z-30 cursor-pointer"
                        id={date.label}
                        name="Date_Listed"
                        value={date.value}
                        onChange={(e) => setDate_filter(e.target.value)}
                        checked={
                          dateOptions.find((d) => d.value === date_filter)
                            .value === date.value
                        }
                      />
                      <div className="p-[4.5px] z-20 peer-checked/radio:bg-Orange grid place-items-center transition rounded-xs"></div>
                    </div>
                    <label
                      id={date.label}
                      htmlFor={date.label}
                      className="text-sm font-light cursor-pointer row-start-1"
                    >
                      {date.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <button className="bg-Orange text-White py-2 px-6 ml-7 mb-7 rounded-sm self-end custom_screen:hidden">
              <Link
                reloadDocument
                onClick={() => {
                  navigate(`../account/listings`);
                  setShowFilter(false);
                }}
              >
                Clear Filter
              </Link>
            </button>
          </div>
          <div className="grid w-full grid-rows-[auto_1fr_auto]">
            <div className="">
              <div className="flex justify-between mb-1">
                {
                  <p className="">
                    {businessListResult?.resultCount} Result
                    {businessListResult?.resultCount > 1 ? "s" : ""}
                    {businessListResult?.searched.length > 0 && (
                      <span className="">
                        <span className=""> for </span>
                        <span className="font-semibold">
                          "{businessListResult.searched}"
                        </span>
                      </span>
                    )}
                  </p>
                }
                {(search.length > 0 ||
                  category.length > 0 ||
                  state.length > 0 ||
                  property.length > 0 ||
                  date_filter !== "Anytime" ||
                  sort_price > 0) && (
                  <button className="hidden custom_screen:flex ml-auto text-Blue items-center rounded-sm">
                    <Link className="text-" reloadDocument>
                      Clear filters
                    </Link>
                    <LuSettings2 className="text-lg ml-1" />
                  </button>
                )}
                <button
                  className="flex custom_screen:hidden ml-auto text-Blue items-center rounded-sm"
                  onClick={() => setShowFilter(true)}
                >
                  Filter result
                  <LuSettings2 className="text-lg ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-[1fr_0.8fr_0.8fr] items-center gap-2 md:gap-0">
                <form
                  className="border border-gray-400 flex p-[6.01px] focus-within:border-Orange space-x-1 col-span-2 md:col-span-1"
                  onSubmit={handleSearch}
                >
                  <input
                    type="text"
                    className="outline-none w-full bg-transparent placeholder:text-gray-800 placeholder:italic placeholder:font-light pl-1 focus:placeholder:text-transparent placeholder:transition-all"
                    placeholder="e.g. Restaurant"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="bg-Blue text-White py-1 px-2 rounded-sm">
                    Search
                  </button>
                </form>
                <SelectInput
                  options={priceSortOptions}
                  onChange={(e) => setSort_price(e.target.value)}
                  value={
                    priceSortOptions?.find(
                      (option) => sort_price === option.value
                    )?.value ?? ""
                  }
                  placeholder="Sort By Price"
                />
                <SelectInput
                  options={limitOptions}
                  onChange={(e) => setLimit(e.target.value)}
                  value={
                    limitOptions?.find((option) => limit === option.value)
                      ?.value ?? ""
                  }
                  placeholder="Results per page"
                />
              </div>
            </div>
            <BusinessListResults
              businessListResult={businessListResult?.businesses}
              isLoading={isLoading}
              isError={isError}
              error={error}
            />
            <div className="grid justify-items-center mt-4">
              <p className="text-center mb-2 text-sm">
                Showing{" "}
                {businessListResult?.businesses.indexOf(
                  businessListResult?.businesses[0]
                ) +
                  1 +
                  (page * limit - limit)}
                -
                {businessListResult?.businesses.indexOf(
                  businessListResult?.businesses.slice(-1)[0]
                ) +
                  1 +
                  (page * limit - limit)}{" "}
                of {businessListResult?.resultCount} results
              </p>
              <PaginationRounded
                spacing={3}
                count={
                  businessListResult
                    ? Math.ceil(
                        +businessListResult?.resultCount /
                          +businessListResult?.limit
                      )
                    : 1
                }
                onChange={(e, value) => setPage(value)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
