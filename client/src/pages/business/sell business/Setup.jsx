import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import appContext from "../../../contexts/AppContext";
import { setProtocol } from "../../../store/features/appSlice";
import { useNavigate } from "react-router-dom";
import AppButtons from "../../../components/reuseable/AppButtons";
import ListingInput from "../../../components/reuseable/ListingInput";

export default function Setup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    first_name,
    last_name,
    user_verifications: {
      email: { content: email },
      phone: { content: phone_number },
    },
  } = useContext(appContext).userInfo;
  const [contactSellerVal, setContactSellerVal] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
  });
  useEffect(() => {
    if (first_name && last_name && phone_number && email)
      setContactSellerVal({
        ...contactSellerVal,
        first_name,
        last_name,
        phone_number,
        email,
      });
  }, []);

  function handleChange(e) {
    setContactSellerVal({
      ...contactSellerVal,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (Object.values(contactSellerVal).every((val) => val.length > 0)) {
      dispatch(setProtocol({ protocolKey: "build_listing", protocol: true }));
      navigate("/sell_business/build_listing");
    }
  }

  return (
    <section className="bg-White">
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 space-y-7">
        <p className="font-medium text-3xl">Let's start with your details</p>
        <form onSubmit={handleSubmit} className="">
          <ListingInput
            label="First name"
            type="text"
            name="first_name"
            id="first_name"
            value={contactSellerVal.first_name}
            onChange={handleChange}
            readOnly={true}
          />
          <ListingInput
            label="Last name"
            type="text"
            name="last_name"
            id="last_name"
            value={contactSellerVal.last_name}
            onChange={handleChange}
            readOnly={true}
          />
          <div className="grid w-full border-b py-8">
            <label htmlFor="phone" className="text-lg font-medium">
              Phone Number
            </label>
            <div className="border border-gray-400 p-2 md:p-3 flex items-center focus-within:border-Orange w-full md:w-2/3">
              <p className="text-lg">+234</p>
              <input
                type="number"
                id="phone_number"
                name="phone_number"
                className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 md:px-3 focus:border-Blue rounded-sm w-full"
                value={contactSellerVal.phone_number}
                onChange={handleChange}
                maxLength={11}
                readOnly
                required
              />
            </div>
          </div>
          <ListingInput
            label="Email"
            type="email"
            name="email"
            id="email"
            value={contactSellerVal.email}
            onChange={handleChange}
            readOnly={true}
          />
          <div className="grid md:flex gap-3 py-6">
            <AppButtons
              className="bg-Blue text-White rounded-sm md:px-10 disabled:opacity-75"
              label="Continue to next"
              isDisabled={Object.values(contactSellerVal).some(
                (val) => val.length < 1
              )}
            />
            {/* <AppButtons
              className="bg-Orange text-White rounded-sm"
              label="Save and continue Later"
              type="button"
            /> */}
          </div>
        </form>
      </div>
    </section>
  );
}
