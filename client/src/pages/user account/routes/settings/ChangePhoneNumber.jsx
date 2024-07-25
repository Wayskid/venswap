import React, { useContext, useState } from "react";
import AppButtons from "../../../../components/reuseable/AppButtons";
import AppModalBox from "../../../../components/reuseable/AppModalBox";
import {
  useChangePhoneMutation,
  useVerifyNewPhoneMutation,
} from "../../../../services/appApi";
import appContext from "../../../../contexts/AppContext";
import { MdTextsms } from "react-icons/md";
import { SetCookie } from "../../../../hooks/cookies";

export default function ChangePhoneNumber({
  showPhoneVerify,
  setShowPhoneVerify,
}) {
  const { userInfo, setUserInfo, setToken, token } = useContext(appContext);

  const [phoneVerifyVal, setPhoneVerifyVal] = useState({
    oldPhone: "",
    newPhone: "",
  });

  //Verify user
  const [changePhoneNumberApi, { isLoading: isChanging }] =
    useChangePhoneMutation();
  const [showVerify, setShowVerify] = useState(false);
  const [sid, setSid] = useState("");

  function handleChangePhoneNumber(e) {
    e.preventDefault();
    changePhoneNumberApi({
      token,
      oldPhone: phoneVerifyVal.oldPhone.replaceAll(/^0+(?!$)/g, ""),
      newPhone: phoneVerifyVal.newPhone.replaceAll(/^0+(?!$)/g, ""),
      user_id: userInfo._id,
    })
      .unwrap()
      .then((res) => {
        setSid(res);
        setShowVerify(true);
      });
  }

  const [codeVal, setCodeVal] = useState("");
  const [verifyNewPhoneApi, { isLoading: isVerifyingCode }] =
    useVerifyNewPhoneMutation();
  function handleVerifyNewPhoneNumber(e) {
    e.preventDefault();
    verifyNewPhoneApi({
      token,
      user_id: userInfo._id,
      newPhone: phoneVerifyVal.newPhone.replaceAll(/^0+(?!$)/g, ""),
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
        setShowPhoneVerify(false);
      });
  }

  return (
    <AppModalBox show={showPhoneVerify} setShow={setShowPhoneVerify}>
      {!showVerify ? (
        <div className="">
          <p className="text-2xl font-semibold text-center">
            Change my phone number
          </p>
          <form onSubmit={handleChangePhoneNumber} className="mt-10 grid gap-5">
            <div className="grid w-full">
              <label htmlFor="phone" className="text-lg">
                Old phone Number
              </label>
              <div className="border border-gray-400 p-2 md:p-3 flex items-center">
                <p className="text-lg">+234</p>
                <input
                  type="number"
                  id="old_phone"
                  name="old_phone"
                  className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 md:px-3 focus:border-Blue rounded-sm w-full"
                  onChange={(e) =>
                    setPhoneVerifyVal({
                      ...phoneVerifyVal,
                      oldPhone: e.target.value,
                    })
                  }
                  value={phoneVerifyVal.oldPhone}
                  required
                />
              </div>
            </div>
            <div className="grid w-full">
              <label htmlFor="phone" className="text-lg">
                New phone Number
              </label>
              <div className="border border-gray-400 p-2 md:p-3 flex items-center">
                <p className="text-lg">+234</p>
                <input
                  type="number"
                  id="new_phone"
                  name="new_phone"
                  className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 md:px-3 focus:border-Blue rounded-sm w-full"
                  onChange={(e) =>
                    setPhoneVerifyVal({
                      ...phoneVerifyVal,
                      newPhone: e.target.value,
                    })
                  }
                  value={phoneVerifyVal.newPhone}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <AppButtons
                label={isChanging ? "Sending code" : "Verify new phone"}
                className="bg-Blue text-White disabled:opacity-60"
                isDisabled={
                  isChanging ||
                  Object.values(phoneVerifyVal).some((val) => val.length < 1)
                }
              />
              <AppButtons
                label="Cancel"
                className="text-Blue"
                type="button"
                onClick={() => {
                  setShowPhoneVerify(false);
                  setPhoneVerifyVal({ oldPhone: "", newPhone: "" });
                }}
              />
            </div>
          </form>
        </div>
      ) : (
        <form
          className="absolute w-[min(50rem,100%)] h-full md:h-[min(35rem,100%)] place-self-center bg-White rounded-sm p-8 md:p-10 grid justify-items-center items-center"
          onSubmit={handleVerifyNewPhoneNumber}
        >
          <p className="text-2xl font-semibold text-center">
            Let's verify your new phone number
          </p>
          <MdTextsms className="text-[6rem] text-Orange" />
          <p className="text-xl text-Blue font-bold text-center">
            Enter OTP code sent via sms
          </p>
          <p className="text-sm text-center">
            A 6 digit verification code has been sent to ...
            {phoneVerifyVal.newPhone.slice(8)}
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
