import React, { useContext, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import AppButtons from "../../components/reuseable/AppButtons";
import { useLoginUserMutation } from "../../services/appApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SetCookie } from "../../hooks/cookies";
import appContext from "../../contexts/AppContext";
import { Helmet } from "react-helmet-async";

export default function Login() {
  const { setToken, setUserInfo } = useContext(appContext);
  const [searchParams] = useSearchParams();
  const [showPass, setShowPass] = useState(false);
  //Save inputs to state
  const [loginVal, setLoginVal] = useState({
    email_phone_number: "",
    password: "",
  });

  function handleInputs(e) {
    setLoginVal({ ...loginVal, [e.target.name]: e.target.value });
  }

  //Login user
  const [loginUserApi, { isError, error, isLoading }] = useLoginUserMutation();
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();
  function handleLoginUser(e) {
    e.preventDefault();
    loginUserApi({ body: loginVal })
      .unwrap()
      .then((result) => {
        SetCookie("User", JSON.stringify(result.userInfo), remember);
        SetCookie("Token", JSON.stringify(result.token), remember);
        setUserInfo(result.userInfo);
        setToken(result.token);
        navigate(searchParams.get("redirect") ?? "/");
      })
      .catch((err) => {});
  }

  return (
    <section className="bg-White">
      <Helmet>
        <title>Venswap | Login</title>
        <meta
          name="description"
          content="Access Your Business Marketplace Account."
        />
        <link rel="canonical" href="/login" />
      </Helmet>
      <div className="bg-White w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16">
        <p className="text-3xl text-center mb-5">Login</p>
        <form
          className="shadow-sm w-[min(40rem,100%)] mx-auto px-4 md:px-6 py-5 grid justify-items-center space-y-5"
          onSubmit={handleLoginUser}
        >
          <div className="space-y-4 grid justify-items-center w-full">
            <div className="grid w-full">
              <label htmlFor="email_phone_number" className="text-lg">
                Email or Phone Number
              </label>
              <input
                type="text"
                id="email_phone_number"
                name="email_phone_number"
                className="border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 md:p-3 focus:border-Blue rounded-sm w-full"
                onChange={handleInputs}
                value={loginVal.email_phone_number}
                required
              />
            </div>
            <div className="grid w-full">
              <label htmlFor="password" className="text-lg">
                Password
              </label>
              <div className="grid relative border border-gray-400 focus-within:placeholder:text-transparent p-2 md:p-3 focus-within:border-Blue rounded-sm grid-cols-[1fr_auto] items-center">
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  name="password"
                  className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal placeholder:transition-all w-full"
                  onChange={handleInputs}
                  value={loginVal.password}
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
          </div>
          <div className="flex items-center w-full justify-between">
            <div className="flex py-[7px] items-center">
              <div className="border border-Brown rounded-sm flex items-center gap-4 relative cursor-pointer p-[3.7px] mr-2">
                <input
                  type="checkbox"
                  className="peer/radio absolute w-full h-full opacity-0 z-30 cursor-pointer"
                  id="Remember"
                  name="Remember"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                <div className="p-[4.5px] z-20 peer-checked/radio:bg-Orange grid place-items-center transition rounded-xs"></div>
              </div>
              <label
                id="Remember"
                htmlFor="Remember"
                className="font-light cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <button className="text-right">Forgot password</button>
          </div>
          <AppButtons
            className="bg-Blue rounded-sm text-White w-full disabled:opacity-60"
            label={isLoading ? "Logging in..." : "Login"}
            isDisabled={
              isLoading || Object.values(loginVal).some((val) => val.length < 1)
            }
          />
          {isError && <p className="text-red-400">{error.data}</p>}
        </form>
        <div className="text-center mt-3">
          Don't have an account?{" "}
          <NavLink
            to={`/sign_up${
              searchParams.get("redirect")?.length
                ? `?redirect=${searchParams.get("redirect")}`
                : ""
            }`}
            className="font-bold text-Blue"
          >
            Sign up
          </NavLink>
        </div>
      </div>
    </section>
  );
}
