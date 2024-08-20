import React, { useEffect } from "react";
import { sanityClient } from "../../../venswapblog/sanityclient";
import { useDispatch, useSelector } from "react-redux";
import { setBlogPosts } from "../../store/features/appSlice";
import imageUrlBuilder from "@sanity/image-url";
import { Link } from "react-router-dom";
import moment from "moment";

export default function HomeBlog() {
  const dispatch = useDispatch();
  const blogPosts = useSelector((state) => state.app.blogPosts);
  const builder = imageUrlBuilder(sanityClient);
  function urlFor(source) {
    return builder.image(source);
  }
  useEffect(() => {
    sanityClient
      .fetch('*[_type == "post"]')
      .then((data) => dispatch(setBlogPosts(data)));
  }, []);

  return (
    blogPosts?.length > 0 && (
      <div className="bg-[#c5c1fd] text-gray-900">
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 py-16 grid">
          <p className="text-3xl font-semibold">On the blog</p>
          <p className="mt-3 mb-7">
            The Business Exchange Blog: News, Insights, and Resources for Buyers
            and Sellers
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {blogPosts?.map((post) => (
              <Link
                to={`/blog/${post.title.replaceAll(" ", "_")}/${post._id}`}
                key={post._id}
                className="space-y-1 shadow-md pb-2"
              >
                <div className="grid h-52 overflow-hidden">
                  {post.mainImage && (
                    <img
                      src={urlFor(post.mainImage.asset._ref)}
                      alt={post.title}
                      className="w-full h-full object-cover cursor-pointer hover:scale-[1.04] transition duration-700"
                    />
                  )}
                </div>
                <div className="space-y-1 px-2">
                  <p className="text-sm">
                    {moment(post.publishedAt).format("MMMM Do YYYY")}
                  </p>
                  <p className="font-semibold text-2xl">{post.title}</p>
                  <button className="underline">Read Article</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  );
}
