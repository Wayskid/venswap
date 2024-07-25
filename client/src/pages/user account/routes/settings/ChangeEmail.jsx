import React, { useContext, useState } from "react";
import AppButtons from "../../../../components/reuseable/AppButtons";
import AppModalBox from "../../../../components/reuseable/AppModalBox";
import {
  useChangeEmailMutation,
  useVerifyNewEmailMutation,
} from "../../../../services/appApi";
import appContext from "../../../../contexts/AppContext";
import { MdTextsms } from "react-icons/md";
import { SetCookie } from "../../../../hooks/cookies";

export default function ChangeEmail({
  showNewEmailVerify,
  setShowNewEmailVerify,
}) {
  const { userInfo, setUserInfo, setToken, token } = useContext(appContext);

  const [emailVerifyVal, setEmailVerifyVal] = useState({
    old_email: "",
    new_email: "",
  });

  //Verify user
  const [changeEmailApi, { isLoading: isChanging }] = useChangeEmailMutation();
  const [showVerify, setShowVerify] = useState(false);
  const [sid, setSid] = useState("");

  function handleChangeEmail(e) {
    e.preventDefault();
    changeEmailApi({
      token,
      old_email: emailVerifyVal.old_email,
      new_email: emailVerifyVal.new_email,
      user_id: userInfo._id,
    })
      .unwrap()
      .then((res) => {
        setSid(res);
        setShowVerify(true);
      });
  }

  const [codeVal, setCodeVal] = useState("");
  const [verifyNewEmailApi, { isLoading: isVerifyingCode }] =
    useVerifyNewEmailMutation();
  function handleVerifyNewEmail(e) {
    e.preventDefault();
    verifyNewEmailApi({
      token,
      user_id: userInfo._id,
      new_email: emailVerifyVal.new_email,
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
        setShowNewEmailVerify(false);
      });
  }

  return (
    <AppModalBox show={showNewEmailVerify} setShow={setShowNewEmailVerify}>
      {!showVerify ? (
        <div className="">
          <p className="text-2xl font-semibold text-center">Change my email</p>
          <form onSubmit={handleChangeEmail} className="mt-10 grid gap-5">
            <div className="grid w-full">
              <label htmlFor="old_email" className="text-lg">
                Old email
              </label>
              <input
                type="email"
                id="old_email"
                name="old_email"
                className="border border-gray-400  outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 md:p-3 focus:border-Blue rounded-sm w-full"
                onChange={(e) =>
                  setEmailVerifyVal({
                    ...emailVerifyVal,
                    old_email: e.target.value,
                  })
                }
                value={emailVerifyVal.old_email}
                required
              />
            </div>
            <div className="grid w-full">
              <label htmlFor="new_email" className="text-lg">
                New email
              </label>
              <input
                type="email"
                id="new_email"
                name="new_email"
                className="border border-gray-400  outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 md:p-3 focus:border-Blue rounded-sm w-full"
                onChange={(e) =>
                  setEmailVerifyVal({
                    ...emailVerifyVal,
                    new_email: e.target.value,
                  })
                }
                value={emailVerifyVal.new_email}
                required
              />
            </div>
            <div className="grid gap-2">
              <AppButtons
                label={isChanging ? "Sending code" : "Verify new email"}
                className="bg-Blue text-White disabled:opacity-60"
                isDisabled={
                  isChanging ||
                  Object.values(emailVerifyVal).some((val) => val.length < 1)
                }
              />
              <AppButtons
                label="Cancel"
                className="text-Blue"
                type="button"
                onClick={() => {
                  setShowNewEmailVerify(false);
                  setEmailVerifyVal({ old_email: "", new_email: "" });
                }}
              />
            </div>
          </form>
        </div>
      ) : (
        <form
          className="absolute w-[min(50rem,100%)] h-full md:h-[min(35rem,100%)] place-self-center bg-White rounded-sm p-8 md:p-10 grid justify-items-center items-center"
          onSubmit={handleVerifyNewEmail}
        >
          <p className="text-2xl font-semibold text-center">
            Let's verify your new email number
          </p>
          <MdTextsms className="text-[6rem] text-Orange" />
          <p className="text-xl text-Blue font-bold text-center">
            Enter OTP code sent to your email
          </p>
          <p className="text-sm text-center">
            A 6 digit verification code has been sent to ...
            {emailVerifyVal.new_email.slice(8)}
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
