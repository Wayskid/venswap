import React, { useContext, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import AppButtons from "../../components/reuseable/AppButtons";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  useRegisterUserMutation,
  useVerifyPhoneNumberCodeMutation,
  useVerifyPhoneNumberMutation,
} from "../../services/appApi";
import { SetCookie } from "../../hooks/cookies";
import appContext from "../../contexts/AppContext";
import { MdTextsms } from "react-icons/md";
import { Helmet } from "react-helmet-async";

export default function SignUp() {
  const { setUserInfo, setToken } = useContext(appContext);
  const [searchParams] = useSearchParams();
  const [showPass, setShowPass] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const navigate = useNavigate();

  //Save inputs to state
  const [signUpVal, setSignUpVal] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  function handleInputs(e) {
    setSignUpVal({ ...signUpVal, [e.target.name]: e.target.value });
  }

  //Verify user
  const [verifyPhoneNumberApi, { isLoading: isSendingSms }] =
    useVerifyPhoneNumberMutation();
  const [sid, setSid] = useState("");
  function handleVerifyPhoneNumber(e) {
    e.preventDefault();
    verifyPhoneNumberApi({
      phone_number: signUpVal.phone_number.replaceAll(/^0+(?!$)/g, ""),
    })
      .unwrap()
      .then((res) => {
        setSid(res);
        setShowPhoneVerification(true);
      });
  }

  //Verify code and sign up
  const [codeVal, setCodeVal] = useState("");
  const [verifyPhoneNumberCodeApi, { isLoading: isVerifyingCode }] =
    useVerifyPhoneNumberCodeMutation();
  const [signUpUserApi, { isError, error, isLoading: isSigningUp }] =
    useRegisterUserMutation();
  async function handleSignUpUser(e) {
    e.preventDefault();
    verifyPhoneNumberCodeApi({
      code: codeVal,
      sid,
    })
      .unwrap()
      .then((res) => {
        if (res === "approved") {
          setShowPhoneVerification(false);
          setSid("");
          setCodeVal("");
          signUpUserApi({ body: signUpVal })
            .unwrap()
            .then((result) => {
              SetCookie("User", JSON.stringify(result.userInfo), true);
              SetCookie("Token", JSON.stringify(result.token), true);
              setUserInfo(result.userInfo);
              setToken(result.token);
              navigate(searchParams.get("redirect") ?? "/");
            });
        }
      });
  }

  return (
    <section className="bg-White">
      <Helmet>
        <title>Venswap | Sign up</title>
        <meta
          name="description"
          content="Create a Business Marketplace Account."
        />
        <link rel="canonical" href="/sign_up" />
      </Helmet>
      <div className="bg-White w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16">
        <p className="text-3xl text-center">Create and account</p>
        <p className="text-center text-sm my-2">
          Be sure to enter your legal name as it appears on your government
          issued ID.
        </p>
        <p className="text-center text-sm mb-5">All fields are required</p>
        <form
          className="shadow-sm w-[min(40rem,100%)] mx-auto px-4 md:px-6 py-5 grid"
          onSubmit={handleVerifyPhoneNumber}
        >
          <div className="space-y-5 grid justify-items-center">
            <div className="grid md:grid-cols-2 gap-5 w-full">
              <div className="grid w-full">
                <label htmlFor="first_name" className="text-lg">
                  First name
                </label>
                <input
                  type="first_name"
                  id="first_name"
                  name="first_name"
                  className="border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 focus:border-Blue rounded-sm w-full"
                  onChange={handleInputs}
                  value={signUpVal.first_name}
                  required
                />
              </div>
              <div className="grid w-full">
                <label htmlFor="last_name" className="text-lg">
                  Last name
                </label>
                <input
                  type="last_name"
                  id="last_name"
                  name="last_name"
                  className="border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 focus:border-Blue rounded-sm w-full"
                  onChange={handleInputs}
                  value={signUpVal.last_name}
                  required
                />
              </div>
            </div>
            <div className="grid w-full">
              <label htmlFor="phone" className="text-lg">
                Phone number
              </label>
              <div className="border border-gray-400 p-2 flex items-center">
                <p className="text-lg">+234</p>
                <input
                  type="number"
                  id="phone_number"
                  name="phone_number"
                  className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 md:px-3 focus:border-Blue rounded-sm w-full"
                  onChange={handleInputs}
                  value={signUpVal.phone_number}
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
                className="border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 focus:border-Blue rounded-sm w-full"
                onChange={handleInputs}
                value={signUpVal.email}
                required
              />
            </div>
            <div className="grid w-full">
              <label htmlFor="password" className="text-lg">
                Password
              </label>
              <div className="grid relative border border-gray-400 focus-within:placeholder:text-transparent p-2 focus-within:border-Blue rounded-sm grid-cols-[1fr_auto] items-center">
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  name="password"
                  className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal placeholder:transition-all w-full"
                  onChange={handleInputs}
                  value={signUpVal.password}
                  required
                />
                <div
                  className="text-xl cursor-pointer mx-2"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
            </div>
            <div className="grid w-full">
              <label htmlFor="confirm_pass" className="text-lg">
                Confirm Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                id="confirm_pass"
                name="confirm_password"
                className="border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 focus:border-Blue rounded-sm w-full"
                pattern={signUpVal.password}
                onChange={handleInputs}
                value={signUpVal.confirm_password}
                required
              />
            </div>
          </div>
          {isError && (
            <p className="text-red-400 text-center mt-2">{error.data}</p>
          )}
          <AppButtons
            className="bg-Blue border border-Blue rounded-sm text-White w-full hover:border-Blue hover:bg-White hover:text-Blue transition mt-9 disabled:opacity-60 disabled:hover:bg-Blue disabled:hover:text-White"
            label={isSendingSms ? "Creating account..." : "Create account"}
            isDisabled={
              isSendingSms ||
              Object.values(signUpVal).some((val) => val.length < 1)
            }
          />
          <p className="text-xs mt-2">
            This information will be used to process your account and help you
            use the site. Your data is safe with us. Please read our{" "}
            <span
              className="text-Blue underline cursor-pointer"
              onClick={() => navigate("../privacy")}
            >
              privacy policy
            </span>{" "}
            for more information.
          </p>
        </form>
        <div className="text-center mt-5">
          Already have an account?{" "}
          <NavLink
            to={`/login${
              searchParams.get("redirect")?.length
                ? `?redirect=${searchParams?.get("redirect")}`
                : ""
            }`}
            className="font-bold text-Blue"
          >
            Login
          </NavLink>
        </div>
      </div>

      <div
        className={`fixed w-full h-full top-0 z-50 grid ${
          showPhoneVerification && signUpVal.phone_number ? "grid" : "hidden"
        }`}
      >
        <div className="bg-[#000000bb]"></div>
        <form
          className="absolute w-[min(50rem,100%)] h-full md:h-[min(35rem,100%)] place-self-center bg-White rounded-sm p-8 md:p-10 grid justify-items-center items-center"
          onSubmit={handleSignUpUser}
        >
          <p className="text-2xl font-semibold text-center">
            Let's verify your phone number
          </p>
          <MdTextsms className="text-[6rem] text-Orange" />
          <p className="text-xl text-Blue font-bold text-center">
            Enter OTP code sent via sms
          </p>
          <p className="text-sm text-center">
            A 6 digit verification code has been sent to ...
            {signUpVal.phone_number.slice(8)}
          </p>
          <input
            type="text"
            id="code"
            name="code"
            maxLength={6}
            className="border-b-2 border-b-gray-400 outline-none text-5xl bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 focus:border-Blue rounded-sm w-[6ch] text-center mx-auto my-5"
            autoFocus={true}
            onChange={(e) => setCodeVal(e.target.value)}
            value={codeVal}
            required
          />
          <div className="grid gap-2">
            <AppButtons
              className="bg-Blue border border-Blue rounded-sm text-White w-full hover:border-Blue hover:bg-White hover:text-Blue transition px-32"
              label={isVerifyingCode || isSigningUp ? "Verifying..." : "Verify"}
              isDisabled={isVerifyingCode || isSigningUp || codeVal.length < 1}
            />
            <AppButtons
              className="rounded-sm text-Blue w-full hover:border-Orange hover:bg-White hover:text-Orange transition"
              label={isSendingSms ? "Resending..." : "Resend code"}
              onClick={handleVerifyPhoneNumber}
              type="button"
            />
          </div>
        </form>
      </div>
    </section>
  );
}
