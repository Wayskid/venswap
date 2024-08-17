import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useCreateChatsMutation,
  useCreateMessageMutation,
  useGetOneBusinessQuery,
} from "../../services/appApi";
import appContext from "../../contexts/AppContext";
import AppButtons from "../../components/reuseable/AppButtons";
import Loading from "../../components/reuseable/Loading";
import { FaEdit } from "react-icons/fa";

export default function Int_ContactSeller() {
  const {
    token,
    userInfo: {
      _id,
      first_name,
      last_name,
      user_verifications: {
        email: { content: email },
      },
    },
    formatter,
  } = useContext(appContext);
  const navigate = useNavigate();
  const { business_id } = useParams();
  const [contactSellerVal, setContactSellerVal] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country: "Nigeria",
    state: "",
    message: "",
  });

  function handleInputs(e) {
    setContactSellerVal({
      ...contactSellerVal,
      [e.target.name]: e.target.value,
    });
  }

  const {
    data: businessDetResult,
    isLoading,
    isError: isBusinessDetError,
    error: BusinessDetError,
  } = useGetOneBusinessQuery({ business_id });

  useEffect(() => {
    if (first_name && last_name && email)
      setContactSellerVal({
        ...contactSellerVal,
        first_name,
        last_name,
        email,
      });
  }, []);

  const [contactSellerApi, { isLoading: createChatIsLoading }] =
    useCreateChatsMutation();
  const [messageSellerApi, { isLoading: sendMessageIsLoading }] =
    useCreateMessageMutation();
  function handleContactSeller(e) {
    e.preventDefault();
    contactSellerApi({
      user_id: _id,
      token,
      body: {
        seller_id: businessDetResult?.seller_id._id,
        business_id: businessDetResult?._id,
      },
    })
      .unwrap()
      .then((res) =>
        messageSellerApi({
          sender_id: _id,
          token,
          body: {
            content: { message_text: contactSellerVal?.message },
            chat_id: res?._id,
          },
        })
          .unwrap()
          .then((res) =>
            navigate(`../../../account/messages/${res.updatedChat._id}`)
          )
      )
      .catch((err) => {
        if (err.data.startsWith("Chat"))
          navigate(`../../../account/messages/${err.data.split(" ")[2]}`);
      });
  }

  return businessDetResult ? (
    <section className="bg-White">
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pb-16">
        <p className="text-3xl my-5">Contact Seller</p>
        <div className="grid space-y-3 custom_screen:grid-cols-[1fr,0.7fr] space-x-0 custom_screen:space-x-5 custom_screen:space-y-0 lg:space-x-6">
          <div className="custom_screen:grid self-start bg-Blue px-6 py-10 rounded-md text-White">
            <p className="text-xl mb-8 font-bold">
              The seller requires the following information.
            </p>
            <form onSubmit={handleContactSeller} className="grid gap-5">
              <div className="grid w-full">
                <label htmlFor="first_name" className="text-lg font-semibold">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className="border border-gray-400 outline-none text-lg bg-transparent p-2 md:p-3 focus:border-Orange rounded-sm w-full"
                  onChange={handleInputs}
                  value={contactSellerVal.first_name}
                  required
                  readOnly
                />
              </div>
              <div className="grid w-full">
                <label htmlFor="first_name" className="text-lg font-semibold">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className="border border-gray-400 outline-none text-lg bg-transparent p-2 md:p-3 focus:border-Orange rounded-sm w-full"
                  onChange={handleInputs}
                  value={contactSellerVal.last_name}
                  required
                  readOnly
                />
              </div>
              <div className="grid w-full">
                <label htmlFor="email" className="text-lg font-semibold">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="border border-gray-400 outline-none text-lg bg-transparent p-2 md:p-3 focus:border-Orange rounded-sm w-full"
                  onChange={handleInputs}
                  value={contactSellerVal.email}
                  required
                  readOnly
                />
              </div>
              <Link
                to="../../account/settings"
                className="text-sm text-Orange flex items-center"
              >
                <FaEdit className="mr-1" />
                Edit contact details
              </Link>
              <div className="grid w-full">
                <label htmlFor="country" className="text-lg font-semibold">
                  Country of residence
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="border border-gray-400 outline-none text-lg bg-transparent p-2 md:p-3 focus:border-Orange rounded-sm w-full"
                  onChange={handleInputs}
                  value={contactSellerVal.country}
                  required
                />
              </div>
              <div className="grid w-full">
                <label htmlFor="state" className="text-lg font-semibold">
                  State of residence
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="border border-gray-400 outline-none text-lg bg-transparent p-2 md:p-3 focus:border-Orange rounded-sm w-full"
                  onChange={handleInputs}
                  value={contactSellerVal.state}
                  required
                />
              </div>
              <div className="grid w-full">
                <label htmlFor="message" className="text-lg font-semibold">
                  Message to Seller
                </label>
                <textarea
                  type="text"
                  id="message"
                  name="message"
                  rows="6"
                  className="border border-gray-400 outline-none text-lg bg-transparent p-2 md:p-3 focus:border-Orange rounded-sm w-full"
                  onChange={handleInputs}
                  value={contactSellerVal.message}
                  required
                />
              </div>
              <AppButtons
                className="bg-Orange rounded-sm disabled:opacity-60"
                label={
                  createChatIsLoading || sendMessageIsLoading
                    ? "Sending Message..."
                    : "Send Message"
                }
                isDisabled={createChatIsLoading || sendMessageIsLoading}
              />
              <p className="text-sm text-gray-200">
                By submitting this form, you confirm that you have read and
                agree to our{" "}
                <Link to="../../T&C" className="text-Orange">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="../../privacy" className="text-Orange">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>
          <div className="grid rounded-sm overflow-hidden self-start shadow">
            {isLoading ? (
              <Loading />
            ) : isBusinessDetError ? (
              <p className="text-center text-gray-500 py-28 md:py-72 text-lg">
                {BusinessDetError.data}
              </p>
            ) : (
              businessDetResult && (
                <>
                  <img
                    src={businessDetResult.listing_details.images[0]}
                    alt=""
                    className="h-60 w-full object-cover"
                  />
                  <div className="grid bg-White">
                    <div className="border-b py-3 px-2">
                      <p className="text-xl font-semibold">
                        {businessDetResult.listing_details.listing_title}
                      </p>
                      <p className="">{`${
                        businessDetResult.business_details.business_location
                          .city
                      }, ${businessDetResult.business_details.business_location.state.replace(
                        "_",
                        " "
                      )}, ${
                        businessDetResult.business_details.business_location
                          .country
                      }`}</p>
                    </div>
                    <div className="border-b py-3 px-2 space-y-2">
                      <div className="grid grid-cols-2">
                        <p className="">Asking price:</p>
                        <p className="font-medium">
                          {formatter.format(businessDetResult.asking_price)}
                        </p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="">Net profit:</p>
                        <p className="font-medium">
                          {formatter.format(
                            businessDetResult.business_details.financial_details
                              .net_profit
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="border-b py-3 px-2">
                      <p className="">Listed by:</p>
                      <p className="font-medium">{`${businessDetResult.seller_id.first_name} ${businessDetResult.seller_id.last_name}`}</p>
                      <Link
                        to={`/business_details/${business_id}`}
                        className="grid mt-2 text-sm text-Blue"
                      >
                        More business details
                      </Link>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  ) : (
    <div className="grid">
      <Loading />
    </div>
  );
}
