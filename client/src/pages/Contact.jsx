import React, { useState } from "react";
import { IoIosMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { AppButtonsSecondary } from "../components/reuseable/AppButtons";
import emailjs from "@emailjs/browser";
import { Helmet } from "react-helmet-async";

export default function Contact() {
  const [contactSuccess, setContactSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactVal, setContactVal] = useState({
    name: "",
    phone_number: "",
    email: "",
    message: "",
  });

  function handleInputs(e) {
    setContactVal({ ...contactVal, [e.target.name]: e.target.value });
  }

  function handleContactUs(e) {
    e.preventDefault();
    setLoading(true);

    const service = import.meta.env.VITE_EMAILJS_SERVICE;
    const template = import.meta.env.VITE_EMAILJS_TEMPLATE;
    const key = import.meta.env.VITE_EMAILJS_KEY;

    emailjs
      .send(
        service,
        template,
        {
          ...contactVal,
        },
        key
      )
      .then(
        (result) => {
          setContactSuccess(true);
          setLoading(false);
          setContactVal({
            name: "",
            phone_number: "",
            email: "",
            message: "",
          });
          setTimeout(() => {
            setContactSuccess(false);
          }, 10000);
        },
        (error) => {
          setLoading(false);
        }
      );
  }

  return (
    <section className="bg-White">
      <Helmet>
        <title>Venswap | Contact</title>
        <meta
          name="description"
          content="Contact Venswap - Business Marketplace Support."
        />
        <link rel="canonical" href="/contact" />
      </Helmet>
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pb-16 pt-10 grid md:grid-cols-[1fr,1.5fr] gap-5 items-center">
        <div className="">
          <p className="text-3xl">Contact us</p>
          <p className="mt-2">
            Uncertain about your needs? Don't worry! The Venswap team is here to
            listen and offer expert guidance, providing personalized support to
            help you find what you're looking for.
          </p>
          <div className="grid gap-2 mt-4">
            <div className="flex items-center gap-2">
              <IoIosMail className="text-xl" />
              <p className="">info@venswap.com</p>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt />
              <p className="">Support +23408085624058</p>
            </div>
          </div>
        </div>
        <div className="bg-Blue rounded-sm text-White p-5">
          <p className="text-2xl">
            Inquire Today: <br /> Let's explore how we can help
          </p>
          <form className="pt-5 grid" onSubmit={handleContactUs}>
            <div className="space-y-5 grid justify-items-center">
              <div className="grid w-full">
                <label htmlFor="name" className="text-lg">
                  Name
                </label>
                <input
                  type="name"
                  id="name"
                  name="name"
                  className="border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 focus:border-Orange rounded-sm w-full"
                  onChange={handleInputs}
                  value={contactVal.name}
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-5 w-full">
                <div className="grid w-full">
                  <label htmlFor="phone" className="text-lg">
                    Phone Number
                  </label>
                  <div className="border border-gray-400 p-2 flex items-center focus-within:border-Orange">
                    <p className="text-lg">+234</p>
                    <input
                      type="number"
                      id="phone_number"
                      name="phone_number"
                      className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 md:px-3 rounded-sm w-full"
                      onChange={handleInputs}
                      value={contactVal.phone_number}
                      maxLength={11}
                      required
                    />
                  </div>
                </div>
                <div className="grid w-full">
                  <label htmlFor="email" className="text-lg">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 focus:border-Orange rounded-sm w-full"
                    onChange={handleInputs}
                    value={contactVal.email}
                    required
                  />
                </div>
              </div>
              <div className="grid w-full">
                <label htmlFor="message" className="text-lg">
                  Your message
                </label>
                <textarea
                  type="message"
                  id="message"
                  name="message"
                  rows={5}
                  className="border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 focus:border-Orange rounded-sm w-full"
                  onChange={handleInputs}
                  value={contactVal.message}
                  required
                />
              </div>
            </div>
            {contactSuccess && (
              <p className="mt-5 text-green-400">
                Your message has been sent to us. We will respond as quickly as
                possible
              </p>
            )}
            <AppButtonsSecondary
              className="bg-Orange border border-Orange rounded-sm text-White transition mt-9 disabled:opacity-60 sm:mr-auto !px-10"
              label={loading ? "Sending..." : "Send"}
              isDisabled={
                loading ||
                Object.values(contactVal).some((val) => val.length < 1)
              }
            />
          </form>
        </div>
      </div>
    </section>
  );
}
