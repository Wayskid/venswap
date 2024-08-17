import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "../../../venswapblog/sanityclient";
import { setBlogPosts } from "../../store/features/appSlice";
import { useEffect } from "react";
import { useState } from "react";
import { useGetBusinessesQuery } from "../../services/appApi";
import { Skeleton } from "@mui/material";
import { PortableText } from "@portabletext/react";
import { RichTextComponents } from "../../components/RichTextComponents";
import appContext from "../../contexts/AppContext";
import moment from "moment";

export default function BlogPost() {
  const { post_id } = useParams();
  const { formatter } = useContext(appContext);

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

  const blogPosts = useSelector((state) => state.app.blogPosts);
  const builder = imageUrlBuilder(sanityClient);
  function urlFor(source) {
    return builder.image(source);
  }
  const [post, setPost] = useState({});
  useEffect(() => {
    setPost(blogPosts.find((post) => post._id === post_id));
  }, [post_id]);

  console.log(post);

  return (
    post?._id && (
      <section className="bg-White">
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 grid md:grid-cols-[1fr,auto] gap-5">
          <div className="grid gap-3 self-start border-b-2 pb-5">
            <p className="text">
              {moment(post.publishedAt).format("MMMM Do YYYY")}
            </p>
            <p className="text-5xl font-semibold">{post.title}</p>
            <img
              src={urlFor(post.mainImage.asset._ref)}
              alt=""
              className="w-full h-80 md:h-96 object-cover"
            />
            <PortableText value={post.body} components={RichTextComponents} />
          </div>
          <div className="w-full md:w-72 lg:w-96 self-start shrink-0 grid shadow-md p-5 bg-[#c5c1fd]">
            <p className="font-semibold text-2xl mb-5 text-White">Featured</p>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-7">
                <div className="grid justify-items-center">
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={"160px"}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={"100%"}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={"75%"}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={"60%"}
                  />
                </div>
                <div className="grid justify-items-center">
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={"160px"}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={"100%"}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={"75%"}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={"60%"}
                  />
                </div>
                <div className="grid justify-items-center">
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={"160px"}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={"100%"}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={"75%"}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={"60%"}
                  />
                </div>
                <div className="grid justify-items-center">
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={"160px"}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={"100%"}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={"75%"}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={"60%"}
                  />
                </div>
              </div>
            ) : isError ? (
              <p className="text-center text-gray-500 py-28 md:py-72 text-lg">
                {error.data}
              </p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-7 relative">
                {businessListResult &&
                  businessListResult.businesses
                    .filter((b) => {
                      if (b.featured === true) {
                        return b;
                      }
                    })
                    .map((business) => (
                      <li
                        key={business._id}
                        className="grid relative bg-White shadow-lg rounded-sm overflow-hidden text-Blue"
                        onClick={() => {
                          navigate(`/business_details/${business._id}`);
                          updateViewCountApi({
                            token,
                            user_id: userInfo._id,
                            body: {
                              business_id: business._id,
                              seller_id: business.seller_id._id,
                            },
                          });
                        }}
                      >
                        {false && (
                          <p className="absolute top-1 right-1 text-white font-light bg-main px-2 py-1 z-10">
                            Sold Out
                          </p>
                        )}
                        <div className="h-[10rem] bg-Blue overflow-hidden">
                          <img
                            src={business.listing_details.images[0]}
                            alt=""
                            className={`w-full h-full object-cover cursor-pointer opacity-90 hover:scale-[1.04] transition duration-700`}
                          />
                        </div>
                        <div className="px-1 my-3 grid text-center justify-center cursor-pointer">
                          <p className="title text-lg font-medium">
                            {business.listing_details.listing_title.slice(
                              0,
                              35
                            )}
                            {business.listing_details.listing_title.length >
                              35 && "..."}
                          </p>
                          <p className="font-light">{`${
                            business.business_details.business_location.city
                          }, ${business.business_details.business_location.state.replace(
                            "_",
                            " "
                          )}, ${
                            business.business_details.business_location.country
                          }`}</p>
                          <p className="text-lg font-light">
                            {formatter.format(business.asking_price)}
                          </p>
                        </div>
                      </li>
                    ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    )
  );
}
