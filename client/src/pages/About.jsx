import React from "react";
import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <section className="bg-White">
      <Helmet>
        <title>Venswap | About us</title>
        <meta
          name="description"
          content="About Venswap - Business Marketplace Experts."
        />
        <link rel="canonical" href="/about" />
      </Helmet>
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 grid">
        <div className="grid">
          <p className="text-3xl">About us</p>
          <p className="mt-3 text-lg">
            Welcome to Venswap, the premier online platform for buying and
            selling businesses. We aim to revolutionize the way entrepreneurs,
            investors, and business owners connect, transact, and grow.
          </p>
        </div>

        <div className="grid mt-10">
          <p className="text-xl font-medium">Our mission statement</p>
          <div className="mt-3">
            "To empower entrepreneurs and business owners to achieve their
            dreams by providing a seamless, secure, and innovative platform for
            buying and selling businesses, fostering a community of like-minded
            individuals, and delivering exceptional customer service."
            <br />
            <br />
            We understand the challenges and opportunities that come with buying
            or selling a business. That's why we've created a comprehensive
            platform that streamlines the process, providing a seamless and
            secure experience for all parties involved.
            <br />
            <br />
            Our platform is designed to cater to a diverse range of users, from
            seasoned entrepreneurs to first-time buyers and sellers. Whether
            you're looking to:
            <br />
            <br />
            <ul className="">
              <li className="list-inside list-item list-disc">
                Expand your portfolio and grow your business
              </li>
              <li className="list-inside list-item list-disc">
                Retire and sell your life's work
              </li>
              <li className="list-inside list-item list-disc">
                Start a new venture and pursue your passion
              </li>
              <li className="list-inside list-item list-disc">
                Invest in a promising opportunity
              </li>
            </ul>
          </div>
        </div>

        <div className="grid mt-10">
          <p className="text-xl font-medium">
            We're here to help. With Venswap, you can:
          </p>
          <ul className="mt-3">
            <li className="list-inside list-item list-disc">
              Browse a vast selection of businesses for sale, spanning various
              industries and locations
            </li>
            <li className="list-inside list-item list-disc">
              List your business for sale and reach a global audience of
              potential buyers
            </li>
            <li className="list-inside list-item list-disc">
              Connect with like-minded individuals, negotiate deals, and close
              transactions with confidence
            </li>
            <li className="list-inside list-item list-disc">
              Access our escrow services for secure payments
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
