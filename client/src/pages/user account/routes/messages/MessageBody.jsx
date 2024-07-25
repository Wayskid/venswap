import React, { useContext, useEffect, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { CgAttachment, CgImage } from "react-icons/cg";
import { IoCloseSharp } from "react-icons/io5";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import MessageList from "./MessageList";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import appContext from "../../../../contexts/AppContext";
import {
  useCreateMessageMutation,
  useGetOneChatQuery,
  useGetSecureLinkMutation,
  useGetSignedCloudinaryMutation,
} from "../../../../services/appApi";
import Loading from "../../../../components/reuseable/Loading";
import { useSocket } from "../../../../contexts/SocketProvider";
import AppModalBox from "../../../../components/reuseable/AppModalBox";
import AppButtons from "../../../../components/reuseable/AppButtons";
import MessageInput from "./MessageInput";
import axios from "axios";
import { Buffer } from "buffer";
import { GrDocumentPdf } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { clearNotifications } from "../../../../store/features/appSlice";

export default function MessageBody() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const { chat_id } = useParams();
  const [showCreatePayment, setShowCreatePayment] = useState(false);
  const { token, userInfo, convertToBase64 } = useContext(appContext);
  const [setShowMessage] = useOutletContext();
  const {
    data: chatResult,
    isError: isChatError,
    error: chatError,
    isLoading: isChatLoading,
    refetch,
  } = useGetOneChatQuery({ user_id: userInfo._id, chat_id, token });

  useEffect(() => {
    refetch();
    dispatch(clearNotifications());
  }, []);

  const receiver = chatResult?.users.find((user) => user._id !== userInfo._id);

  const [messageVal, setMessageVal] = useState({
    message_text: "",
    message_images: [],
    message_files: [],
  });

  async function handleImageChange(e) {
    const files = e.target.files;
    const imageFiles = Object.values(files);
    const array = [];
    imageFiles.forEach(async (image) => {
      if (image.size > 20971520) {
        setImageUploadErr("Size of one or more of the files is too big");
        setTimeout(() => {
          setImageUploadErr("");
        }, 6000);
      } else {
        const promise = await convertToBase64(image);
        array.push(promise);
        setMessageVal({
          ...messageVal,
          message_images: [...messageVal.message_images, ...array],
        });
      }
    });
  }
  async function handleFileChange(e) {
    const files = e.target.files;
    const pdfFiles = Object.values(files);
    const array = [];
    pdfFiles.forEach(async (file) => {
      if (file.size > 20971520) {
        setImageUploadErr("Size of one or more of the files is too big");
        setTimeout(() => {
          setImageUploadErr("");
        }, 6000);
      } else {
        const promise = await convertToBase64(file);
        array.push(promise);
        setMessageVal({
          ...messageVal,
          message_files: [...messageVal.message_files, ...array],
        });
      }
    });
  }
  function removeImages(index) {
    const array = [...messageVal.message_images];
    array.splice(index, 1);
    setMessageVal({
      ...messageVal,
      message_images: array,
    });
  }
  function removeFiles(index) {
    const array = [...messageVal.message_files];
    array.splice(index, 1);
    setMessageVal({
      ...messageVal,
      message_files: array,
    });
  }

  const [isLoading, setIsLoading] = useState(false);
  const [getSignedCloudinary] = useGetSignedCloudinaryMutation();
  const [createMessageApi] = useCreateMessageMutation();
  const [getSecureLinkApi] = useGetSecureLinkMutation();
  async function handleSendMessage(e) {
    e.preventDefault();
    setIsLoading(true);
    if (
      messageVal.message_text.length > 0 ||
      messageVal.message_files.length > 0 ||
      messageVal.message_images.length > 0
    ) {
      if (
        messageVal.message_images.length < 1 &&
        messageVal.message_files.length < 1 &&
        messageVal.message_text.length > 0
      ) {
        sendMessage({});
      }

      if (
        messageVal.message_images.length > 0 &&
        messageVal.message_text.length >= 0
      ) {
        //Upload images and send message

        const { data: signData } = await getSignedCloudinary({
          token,
          body: {
            folder:
              import.meta.env.VITE_CLOUDINARY_MESSAGES_FOLDER + "/" + chat_id,
            tags: chat_id,
          },
        }).catch((err) => setIsLoading(false));
        const formData = new FormData();

        async function imgArray() {
          const imgArray = [];
          for (let i = 0; i < messageVal.message_images.length; i++) {
            let image = messageVal.message_images[i];
            formData.append("file", image);
            formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
            formData.append("timestamp", signData.timestamp);
            formData.append("signature", signData.signature);
            formData.append(
              "folder",
              import.meta.env.VITE_CLOUDINARY_MESSAGES_FOLDER + "/" + chat_id
            );
            formData.append("tags", chat_id);

            await axios
              .post(import.meta.env.VITE_CLOUDINARY_URL, formData)
              .then(({ data }) => {
                imgArray.push(data.secure_url);
              })
              .catch(() => {
                setIsLoading(false);
              });
          }
          return imgArray;
        }

        imgArray().then((res) => {
          sendMessage({ images: true, res });
        });
      }

      if (
        messageVal.message_files.length > 0 &&
        messageVal.message_text.length >= 0
      ) {
        const documents = [...messageVal.message_files];
        async function getSignedUrl() {
          return new Promise((resolve, reject) => {
            getSecureLinkApi({
              token,
              body: { key: chat_id },
            })
              .unwrap()
              .then(async (res) => {
                resolve(res.url);
              });
          });
        }

        async function process(items) {
          const arr = [];
          for (let item of items) {
            const signedUrl = await getSignedUrl();
            arr.push({ doc: item, signedUrl });
          }
          return arr;
        }

        async function uploadFiles() {
          const filesArr = [];
          await process(documents).then(async (res) => {
            for (let item of res) {
              const base64Data = new Buffer.from(
                item.doc.replace(/^data:application\/\w+;base64,/, ""),
                "base64"
              );
              await axios.put(item.signedUrl, base64Data).then((res) => {
                filesArr.push(item.signedUrl.split("?")[0]);
              });
            }
          });
          return filesArr;
        }

        uploadFiles().then(async (result) => {
          sendMessage({ files: true, images: false, res: result });
        });
      }

      function sendMessage({ files, images, res }) {
        createMessageApi({
          token,
          sender_id: userInfo._id,
          body: {
            content: images
              ? { ...messageVal, message_images: res }
              : files
              ? { ...messageVal, message_files: res }
              : { message_text: messageVal.message_text },
            chat_id,
          },
        })
          .unwrap()
          .then((res) => {
            setMessageVal({
              message_text: "",
              message_images: [],
              message_files: [],
            });
            socket.emit("new_message", res);
            setIsLoading(false);
          });
      }
    }
  }

  //Create payment
  const [createPaymentVal, setCreatePaymentVal] = useState({
    amount: "",
    offer_description: "",
  });

  function createPayment(e) {
    e.preventDefault();

    const tax = 0;
    const escrow_fee = 0.2 * createPaymentVal.amount.replaceAll(",", "");
    const total_amount =
      tax + escrow_fee + +createPaymentVal.amount.replaceAll(",", "");

    createMessageApi({
      token,
      sender_id: userInfo._id,
      body: {
        chat_id,
        is_payment: true,
        content: {
          message_text: "Here's your offer",
          message_files: [],
        },
        payment_info: {
          amount_details: {
            amount: createPaymentVal.amount.replaceAll(",", ""),
            tax,
            escrow_fee,
            total_amount,
          },
          status: "pending",
          offer_description: createPaymentVal.offer_description,
          business_details: {
            business_title:
              chatResult?.business_id.listing_details.listing_title,
            business_id: chatResult?.business_id._id,
          },
        },
      },
    })
      .unwrap()
      .then((res) => {
        setCreatePaymentVal({
          amount: "",
          offer_description: "",
        });
        setShowCreatePayment(false);
        socket.emit("new_message", res);
      });
  }

  return isChatLoading ? (
    <Loading />
  ) : isChatError ? (
    <p className="text-center text-gray-500 py-28 md:py-72 text-lg">
      {chatError.data}
    </p>
  ) : (
    chatResult && (
      <>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center py-3 md:px-4 shadow-md">
            <div className="flex gap-4 items-center">
              <FaArrowLeft
                className="text-xl cursor-pointer md:hidden"
                onClick={() => {
                  navigate("/account/messages");
                  setShowMessage(false);
                }}
              />
              <div className="grid">
                <Link
                  to={`../../../profile/${receiver.last_name.toLowerCase()}/${
                    receiver._id
                  }`}
                  className="text-lg font-semibold"
                >
                  {receiver && `${receiver.first_name} ${receiver.last_name}`}
                </Link>
                <Link
                  to={`../../../business_details/${chatResult.business_id._id}`}
                  className="font-light underline text-sm"
                >
                  {chatResult.business_id.listing_details.listing_title}
                </Link>
              </div>
            </div>
            <CiMenuKebab className="text-2xl cursor-pointer" />
          </div>
          <div className="overflow-y-auto h-10 md:px-4 py-4 pb-0 grow">
            <div className="grid">
              <div className="py-2 text-center font-semibold flex mx-auto items-center gap-2">
                <AiFillSafetyCertificate />
                We have your back
                <FaLock className="text-sm" />
              </div>
              <p className="border-t text-center py-3 px-4 text-sm">
                For added safety and your protection, keep payments and
                communications within Venswap. Learn more
              </p>
            </div>
            <MessageList />
          </div>
          <form
            className="grid py-3 md:px-3 shadow-2xl"
            onSubmit={handleSendMessage}
          >
            <div className="">
              <MessageInput
                className="grid w-full border rounded-sm p-2 focus-within:border-Orange"
                handleChange={(e) =>
                  setMessageVal({ ...messageVal, message_text: e.target.value })
                }
                name="message_text"
                placeholder="Write message..."
                value={messageVal.message_text}
              />
              {messageVal.message_images.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] mt-1 border-b pb-1 gap-1">
                  {messageVal.message_images?.map((file, index) => (
                    <div className="relative border" key={index}>
                      <img
                        src={file}
                        alt="File"
                        className="w-full h-20 object-cover"
                      />
                      <div
                        className="bg-red-300 absolute top-0 right-0 cursor-pointer"
                        onClick={() => removeImages(index)}
                      >
                        <IoCloseSharp />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {messageVal.message_files.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(85px,1fr))] mt-1 border-b pb-1 gap-1">
                  {messageVal.message_files?.map((file, index) => (
                    <div className="relative border py-5 grid" key={index}>
                      <GrDocumentPdf className="text-5xl justify-self-center" />
                      <div
                        className="bg-red-300 absolute top-0 right-0 cursor-pointer"
                        onClick={() => removeFiles(index)}
                      >
                        <IoCloseSharp />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center">
                {messageVal.message_files.length < 1 && (
                  <div className="px-3 border-r">
                    <input
                      type="file"
                      className="hidden"
                      name="images"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <CgImage className="text-xl" />
                    </label>
                  </div>
                )}
                {messageVal.message_images.length < 1 && (
                  <div className="px-3 border-r">
                    <input
                      type="file"
                      className="hidden"
                      name="file"
                      id="file"
                      multiple
                      accept="application/pdf"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      <CgAttachment className="text-xl" />
                    </label>
                  </div>
                )}
                {userInfo._id === chatResult.business_id.seller_id && (
                  <button
                    className="bg-Orange text-White p-2 text-sm rounded-sm font-medium ml-3"
                    type="button"
                    onClick={() => setShowCreatePayment(true)}
                  >
                    Create payment
                  </button>
                )}
              </div>
              <button
                className="bg-Blue text-White py-1 px-4 font-medium rounded-sm disabled:opacity-60"
                disabled={
                  isLoading ||
                  (messageVal.message_text.length < 1 &&
                    messageVal.message_images.length < 1 &&
                    messageVal.message_files.length < 1)
                }
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
        <AppModalBox show={showCreatePayment}>
          <form className="grid" onSubmit={createPayment}>
            <p className="text-2xl font-semibold text-center">Create payment</p>
            <div className="my-10 space-y-5">
              <div className="grid w-full">
                <label htmlFor="business_title" className="text-lg font-medium">
                  Payment for
                </label>
                <input
                  type="text"
                  id="business_title"
                  name="business_title"
                  className="border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 focus:border-Blue rounded-sm w-full"
                  value={chatResult.business_id.listing_details.listing_title}
                  readOnly
                  required
                />
              </div>
              <div className="grid w-full">
                <label htmlFor="amount" className="text-lg font-medium">
                  Asking price
                </label>
                <div className="border border-gray-400 p-2 flex items-center rounded-sm focus-within:border-Orange w-full shrink-0">
                  <p className="text-lg">&#8358;</p>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 focus:border-Blue rounded-sm w-full"
                    value={createPaymentVal.amount}
                    onChange={(e) =>
                      setCreatePaymentVal({
                        ...createPaymentVal,
                        amount: e.target.value,
                      })
                    }
                    placeholder="Amount to pay"
                    onBlur={(e) =>
                      setCreatePaymentVal({
                        ...createPaymentVal,
                        amount: e.target.value.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        ),
                      })
                    }
                    onFocus={(e) =>
                      setCreatePaymentVal({
                        ...createPaymentVal,
                        amount: e.target.value.replaceAll(",", ""),
                      })
                    }
                    required
                    pattern="^\d{1,3}(?:,\d{3})*$"
                  />
                </div>
              </div>
              <div className="grid w-full">
                <label
                  htmlFor="offer_description"
                  className="text-lg font-medium"
                >
                  Payment description
                </label>
                <textarea
                  type="text"
                  id="offer_description"
                  rows={5}
                  name="offer_description"
                  className="border border-gray-400 outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all p-2 focus:border-Blue rounded-sm w-full"
                  value={createPaymentVal.offer_description}
                  placeholder="Short description of the offer"
                  onChange={(e) =>
                    setCreatePaymentVal({
                      ...createPaymentVal,
                      offer_description: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <AppButtons
              className="bg-Blue border border-Blue rounded-sm text-White w-full hover:border-Blue hover:bg-White hover:text-Blue transition mb-3 disabled:opacity-60 disabled:hover:bg-Blue disabled:hover:text-White"
              label={isLoading ? "Creating payment..." : "Create payment"}
              isDisabled={
                isLoading ||
                Object.values(createPaymentVal).some((val) => val.length < 1)
              }
            />
            <AppButtons
              className="rounded-sm text-Blue w-full transition disabled:opacity-60"
              label="Cancel"
              onClick={() => setShowCreatePayment(false)}
              type="button"
            />
          </form>
        </AppModalBox>
      </>
    )
  );
}
