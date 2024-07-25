import React, { useContext, useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import {
  useDeleteBusinessMutation,
  useDeleteImageCloudinaryMutation,
  useEditUserAvatarMutation,
  useEditUserInfoMutation,
  useGetSignedCloudinaryMutation,
  useGetUserInfoQuery,
} from "../../../../services/appApi";
import appContext from "../../../../contexts/AppContext";
import Loading from "../../../../components/reuseable/Loading";
import { SetCookie } from "../../../../hooks/cookies";
import ChangePhoneNumber from "./ChangePhoneNumber";
import ChangePassword from "./ChangePassword";
import ChangeEmail from "./ChangeEmail";
import axios from "axios";
import { extractPublicId } from "cloudinary-build-url";
import { Helmet } from "react-helmet-async";
import { MdWarning } from "react-icons/md";
import VerifyEmail from "./VerifyEmail";

export default function Settings() {
  //Set current user info
  const { userInfo, token, setUserInfo, convertToBase64 } =
    useContext(appContext);
  const {
    data: userInfoData,
    isError,
    error,
  } = useGetUserInfoQuery({
    user_id: userInfo._id,
    token,
  });
  useEffect(() => {
    if (userInfo) {
      setAvatarVal(userInfo?.avatar);
      setEditUserVal({
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
      });
    }
  }, []);

  //Edit avatar
  const [imageUploadErr, setImageUploadErr] = useState("");
  async function handleImageChange(e) {
    const image = e.target.files[0];
    if (image.size > 20971520) {
      setImageUploadErr("The size of this image is too big");
      setTimeout(() => {
        setImageUploadErr("");
      }, 6000);
    } else setAvatarVal(await convertToBase64(image));
  }

  const [getSignedApi] = useGetSignedCloudinaryMutation();
  const [editAvatarApi] = useEditUserAvatarMutation();
  const [deleteCurrentImageApi] = useDeleteImageCloudinaryMutation();
  const [isLoading, setIsLoading] = useState(false);
  async function handleUpdateImage(currentImg) {
    setIsLoading(true);

    const publicId = extractPublicId(currentImg);
    const formData = new FormData();

    getSignedApi({
      token,
      body: {
        folder: import.meta.env.VITE_CLOUDINARY_AVATAR_FOLDER,
        tags: userInfo._id,
      },
    })
      .unwrap()
      .then(async ({ timestamp, signature }) => {
        formData.append("file", avatarVal);
        formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("tags", userInfo._id);
        formData.append(
          "folder",
          import.meta.env.VITE_CLOUDINARY_AVATAR_FOLDER
        );

        await axios
          .post(import.meta.env.VITE_CLOUDINARY_URL, formData)
          .then(({ data }) => {
            editAvatarApi({
              user_id: userInfo._id,
              token,
              body: { avatar: data.secure_url },
            })
              .unwrap()
              .then((res) => {
                SetCookie("User", JSON.stringify(res), true);
                setUserInfo(res);
                setAvatarVal(res.avatar);

                if (publicId)
                  deleteCurrentImageApi({
                    token,
                    body: { public_id: publicId },
                  })
                    .unwrap()
                    .then((res) => {
                      setIsLoading(false);
                    });
                else setIsLoading(false);
              });
          })
          .catch((err) => {
            setIsLoading(false);
          });
      });
  }

  //Edit user info
  const [
    editUserApi,
    {
      isLoading: isEditUserLoading,
      isError: isEditUserError,
      error: editUserError,
    },
  ] = useEditUserInfoMutation();
  const [isEditUserSuccessful, setIsEditUserSuccessful] = useState(false);
  const [avatarVal, setAvatarVal] = useState("");
  const [editUserVal, setEditUserVal] = useState({
    first_name: "",
    last_name: "",
  });

  function handleEditUser(e) {
    e.preventDefault();
    editUserApi({ user_id: userInfo._id, token, body: editUserVal })
      .unwrap()
      .then((res) => {
        SetCookie("User", JSON.stringify(res), true);
        setUserInfo(res);
        setEditUserVal({
          first_name: res.first_name,
          last_name: res.last_name,
        });
        setIsEditUserSuccessful(true);
        setTimeout(() => {
          setIsEditUserSuccessful(false);
        }, 5000);
      });
  }

  const [showNewEmailVerify, setShowNewEmailVerify] = useState(false);
  const [showEmailVerify, setShowEmailVerify] = useState(false);
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <section className="bg-White">
      <Helmet>
        <title>Venswap | Account Settings</title>
        <meta name="robots" content="noindex." />
      </Helmet>
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 space-y-4">
        <p className="text-3xl">Account settings</p>
        {userInfoData ? (
          <div className="grid">
            <div className="space-y-3 pb-3">
              <p className="font-medium">Avatar</p>
              <div className="bg-slate-700 relative rounded-sm transition h-40 w-44 grid cursor-pointer mb-5 overflow-hidden">
                <label
                  htmlFor="avatar"
                  className="absolute opacity-60 md:opacity-0 bg-slate-800 hover:bg-slate-800 hover:opacity-70 w-full h-full z-10 grid place-items-center cursor-pointer"
                >
                  <FiEdit3 className="text-4xl text-White" />
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    className="hidden"
                    onChange={(e) => handleImageChange(e)}
                    accept="image/*"
                  />
                </label>
                {avatarVal.length > 0 || userInfo.avatar ? (
                  <img
                    src={avatarVal ?? userInfo.avatar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-White rounded-sm grid place-items-center text-[7rem] font-bold">
                    {editUserVal.first_name.slice(0, 1)}
                  </p>
                )}
              </div>
              {imageUploadErr && (
                <p className="text-red-500">{imageUploadErr}</p>
              )}
              <button
                className="bg-Blue text-White py-1 px-4 font-medium rounded-sm disabled:opacity-60"
                onClick={() => handleUpdateImage(userInfo.avatar)}
                disabled={isLoading || avatarVal === userInfo.avatar}
              >
                {isLoading ? "Changing avatar..." : "Save change"}
              </button>
            </div>
            <form onSubmit={handleEditUser} className="border-t py-3 space-y-3">
              <p className="font-medium">Profile</p>
              <div className="mt-3 grid gap-3">
                <div className="grid md:flex gap-1 items-center">
                  <p className="text-sm font-medium w-32">First Name</p>
                  <input
                    type="text"
                    className="border py-1 px-2 rounded-sm"
                    value={editUserVal.first_name}
                    onChange={(e) =>
                      setEditUserVal({
                        ...editUserVal,
                        first_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid md:flex gap-1 items-center">
                  <p className="text-sm font-medium w-32">Last Name</p>
                  <input
                    type="text"
                    className="border py-1 px-2 rounded-sm"
                    value={editUserVal.last_name}
                    onChange={(e) =>
                      setEditUserVal({
                        ...editUserVal,
                        last_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              {isEditUserError && (
                <p className="text-red-400">{editUserError.data}</p>
              )}
              {isEditUserSuccessful && (
                <p className="text-green-400">Your profile has been updated</p>
              )}
              <button
                className="bg-Blue text-White py-1 px-4 font-medium rounded-sm disabled:opacity-60"
                disabled={
                  editUserVal.first_name === userInfo.first_name &&
                  editUserVal.last_name === userInfo.last_name
                }
              >
                {isEditUserLoading ? "Saving..." : "Save changes"}
              </button>
            </form>
            {userInfo.user_verifications.email.verified ? (
              <button
                className="underline justify-self-start mt-3"
                onClick={() => setShowNewEmailVerify(true)}
              >
                Change Email
              </button>
            ) : (
              <button
                className="underline justify-self-start mt-3"
                onClick={() => setShowEmailVerify(true)}
              >
                Verify Email{" "}
                <MdWarning className="inline text-yellow-500 text-lg mb-1" />
              </button>
            )}
            <button
              className="underline justify-self-start mt-3"
              onClick={() => setShowPhoneVerify(true)}
            >
              Change Phone number
            </button>
            <button
              className="underline justify-self-start mt-3"
              onClick={() => setShowChangePassword(true)}
            >
              Change Password
            </button>
          </div>
        ) : isError ? (
          <p className="py-10 text-center">{error.data}</p>
        ) : (
          <div className="grid">
            <Loading />
          </div>
        )}
      </div>
      {showEmailVerify && (
        <ChangeEmail
          showNewEmailVerify={showNewEmailVerify}
          setShowNewEmailVerify={setShowNewEmailVerify}
        />
      )}
      {showEmailVerify && (
        <VerifyEmail
          showEmailVerify={showEmailVerify}
          setShowEmailVerify={setShowEmailVerify}
        />
      )}
      {showChangePassword && (
        <ChangePassword
          showChangePassword={showChangePassword}
          setShowChangePassword={setShowChangePassword}
        />
      )}
      {showPhoneVerify && (
        <ChangePhoneNumber
          showPhoneVerify={showPhoneVerify}
          setShowPhoneVerify={setShowPhoneVerify}
        />
      )}
    </section>
  );
}
