import React, { useContext, useState } from "react";
import AppButtons from "../../../../components/reuseable/AppButtons";
import AppModalBox from "../../../../components/reuseable/AppModalBox";
import {
  useVerifyEmailCodeMutation,
  useVerifyEmailMutation,
} from "../../../../services/appApi";
import appContext from "../../../../contexts/AppContext";
import { MdTextsms } from "react-icons/md";
import { SetCookie } from "../../../../hooks/cookies";

export default function VerifyEmail({ showEmailVerify, setShowEmailVerify }) {
  const { userInfo, setUserInfo, setToken, token } = useContext(appContext);

  const [emailVerifyVal, setEmailVerifyVal] = useState(
    userInfo.user_verifications.email.content
  );

  //Verify user
  const [verifyEmailApi, { isLoading: isChanging }] = useVerifyEmailMutation();
  const [showVerify, setShowVerify] = useState(false);
  const [sid, setSid] = useState("");

  function handleChangeEmail(e) {
    e.preventDefault();
    verifyEmailApi({
      token,
      email_to: emailVerifyVal,
      user_id: userInfo._id,
    })
      .unwrap()
      .then((res) => {
        setSid(res);
        setShowVerify(true);
      });
  }

  const [codeVal, setCodeVal] = useState("");
  const [verifyEmailCodeApi, { isLoading: isVerifyingCode }] =
    useVerifyEmailCodeMutation();
  function handleVerifyEmailCode(e) {
    e.preventDefault();
    verifyEmailCodeApi({
      token,
      user_id: userInfo._id,
      email: emailVerifyVal,
      sid,
      code: codeVal,
    })
      .unwrap()
      .then((result) => {
        SetCookie("User", JSON.stringify(result.userInfo), true);
        SetCookie("Token", JSON.stringify(result.token), true);
        setUserInfo(result.userInfo);
        setToken(result.token);
        setShowVerify(false);
        setShowEmailVerify(false);
      });
  }

  return (
    <AppModalBox show={showEmailVerify} setShow={setShowEmailVerify}>
      {!showVerify ? (
        <div className="">
          <p className="text-2xl font-semibold text-center">Verify my email</p>
          <form onSubmit={handleChangeEmail} className="mt-10 grid gap-5">
            <div className="grid w-full">
              <label htmlFor="email" className="text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border border-gray-400  outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 md:p-3 focus:border-Blue rounded-sm w-full"
                onChange={(e) => setEmailVerifyVal(e.target.value)}
                value={emailVerifyVal}
                required
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <AppButtons
                label={isChanging ? "Sending code" : "Verify email"}
                className="bg-Blue text-White disabled:opacity-60"
                isDisabled={isChanging || emailVerifyVal.length < 1}
              />
              <AppButtons
                label="Cancel"
                className="text-Blue"
                type="button"
                onClick={() => {
                  setShowEmailVerify(false);
                  setEmailVerifyVal("");
                }}
              />
            </div>
          </form>
        </div>
      ) : (
        <form
          className="absolute w-[min(50rem,100%)] h-full md:h-[min(35rem,100%)] place-self-center bg-White rounded-sm p-8 md:p-10 grid justify-items-center items-center"
          onSubmit={handleVerifyEmailCode}
        >
          <p className="text-2xl font-semibold text-center">
            Let's verify your email number
          </p>
          <MdTextsms className="text-[6rem] text-Orange" />
          <p className="text-xl text-Blue font-bold text-center">
            Enter OTP code sent to your email
          </p>
          <p className="text-sm text-center">
            A 6 digit verification code has been sent to{" "}
            {`${emailVerifyVal.split("@")[0].slice(0, 1)}.....@${
              emailVerifyVal.split("@")[1]
            }`}
          </p>
          <input
            type="text"
            id="code"
            name="code"
            maxLength={6}
            className="border-b-2 border-b-gray-400 outline-none text-5xl bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 md:p-3 focus:border-Blue rounded-sm w-[6ch] text-center mx-auto my-5"
            autoFocus={true}
            onChange={(e) => setCodeVal(e.target.value)}
            value={codeVal}
            required
          />
          <div className="grid gap-2">
            <AppButtons
              className="bg-Blue rounded-sm text-White w-full px-32"
              label={isVerifyingCode ? "Verifying..." : "Verify"}
              isDisabled={isVerifyingCode || codeVal.length < 1}
            />
            <AppButtons
              className="rounded-sm text-Blue w-full"
              label="Go back"
              onClick={() => setShowVerify(false)}
              type="button"
            />
          </div>
        </form>
      )}
    </AppModalBox>
  );
}
