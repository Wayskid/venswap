import React, { useContext, useState } from "react";
import AppModalBox from "../../../../components/reuseable/AppModalBox";
import { useChangeUserPasswordMutation } from "../../../../services/appApi";
import AppButtons from "../../../../components/reuseable/AppButtons";
import appContext from "../../../../contexts/AppContext";

export default function ChangePassword({
  showChangePassword,
  setShowChangePassword,
}) {
  const { userInfo, token } = useContext(appContext);
  const [
    changePassApi,
    {
      isLoading: isChangingPassword,
      isError: isChangePassError,
      error: changePassError,
    },
  ] = useChangeUserPasswordMutation();
  const [changePassVal, setChangePassVal] = useState({
    current_pass: "",
    new_pass: "",
    confirm_pass: "",
  });
  function handleChangePassword(e) {
    e.preventDefault();
    changePassApi({ user_id: userInfo._id, token, body: changePassVal })
      .unwrap()
      .then((res) => {
        if (res.isPassChanged) {
          setShowChangePassword(false);
          setChangePassVal({
            current_pass: "",
            new_pass: "",
            confirm_pass: "",
          });
        }
      });
  }

  return (
    <AppModalBox show={showChangePassword} setShow={setShowChangePassword}>
      <div className="">
        <p className="text-2xl font-semibold text-center">
          Change my phone number
        </p>
        <form onSubmit={handleChangePassword} className="mt-10 grid gap-5">
          <div className="grid w-full">
            <label htmlFor="current_pass" className="text-lg">
              Current password
            </label>
            <input
              type="password"
              id="current_pass"
              name="current_pass"
              className="p-2 md:p-3 border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 md:px-3 focus:border-Blue rounded-sm w-full"
              value={changePassVal.current_pass}
              onChange={(e) =>
                setChangePassVal({
                  ...changePassVal,
                  current_pass: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="grid w-full">
            <label htmlFor="new_pass" className="text-lg">
              New password
            </label>
            <input
              type="password"
              id="new_pass"
              name="new_pass"
              className="p-2 md:p-3 border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 md:px-3 focus:border-Blue rounded-sm w-full"
              value={changePassVal.new_pass}
              onChange={(e) =>
                setChangePassVal({
                  ...changePassVal,
                  new_pass: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="grid w-full">
            <label htmlFor="confirm_pass" className="text-lg">
              Confirm password
            </label>
            <input
              type="password"
              id="confirm_pass"
              name="confirm_pass"
              className="p-2 md:p-3 border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 md:px-3 focus:border-Blue rounded-sm w-full"
              value={changePassVal.confirm_pass}
              onChange={(e) =>
                setChangePassVal({
                  ...changePassVal,
                  confirm_pass: e.target.value,
                })
              }
              required
              pattern={changePassVal.new_pass}
            />
          </div>
          {isChangePassError && (
            <p className="text-red-400">{changePassError.data}</p>
          )}
          <div className="grid gap-2">
            <AppButtons
              label={isChangingPassword ? "Changing..." : "Change password"}
              className="bg-Blue text-White disabled:opacity-60"
              isDisabled={
                isChangingPassword ||
                Object.values(changePassVal).some((val) => val.length < 1)
              }
            />
            <AppButtons
              label="Cancel"
              className="text-Blue"
              type="button"
              onClick={() => {
                setShowChangePassword(false);
                setChangePassVal({
                  current_pass: "",
                  new_pass: "",
                  confirm_pass: "",
                });
              }}
            />
          </div>
        </form>
      </div>
    </AppModalBox>
  );
}
