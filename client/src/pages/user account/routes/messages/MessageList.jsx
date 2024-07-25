import React, { useContext, useEffect, useRef, useState } from "react";
import {
  useCreatePaymentMutation,
  useGetMessageQuery,
  useUpdatePaymentStatusMutation,
  useWithdrawOfferMutation,
} from "../../../../services/appApi";
import { useParams } from "react-router-dom";
import appContext from "../../../../contexts/AppContext";
import moment from "moment";
import { useSocket } from "../../../../contexts/SocketProvider";
import { PaystackButton } from "react-paystack";
import AppModalBox from "../../../../components/reuseable/AppModalBox";
import { GrDocumentPdf } from "react-icons/gr";

export default function MessageList() {
  //Scroll to bottom
  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  const { token, formatter, userInfo } = useContext(appContext);
  const { chat_id } = useParams();
  const {
    data: messageListResult,
    isError: isMessageListError,
    error: messageListError,
    refetch,
  } = useGetMessageQuery({ chat_id, token });

  useEffect(() => {
    refetch();
  }, []);

  const [imageToView, setImageToView] = useState(null);
  const { socket } = useSocket();
  const [withdrawOfferApi, { isLoading: withdrawingOffer }] =
    useWithdrawOfferMutation();
  function withdrawOffer(id) {
    withdrawOfferApi({
      token,
      sender_id: userInfo._id,
      message_id: id,
    })
      .unwrap()
      .then((res) => {
        socket.emit("edit_message_offer", res);
      });
  }

  const [createPaymentApi] = useCreatePaymentMutation();
  const [updatePaymentApi] = useUpdatePaymentStatusMutation();

  function payWithPaystack({
    amount_details,
    message_id,
    chat_id,
    seller_id,
    business_id,
  }) {
    const text = "Make payment";
    const amount = amount_details.total_amount * 100;
    const email = userInfo.user_verifications.email.content;
    const publicKey = "pk_test_f7dd65b03a10db0209b9ebb6a5a75e4b732e4d18";
    const currency = "NGN";
    const onSuccess = (res) => {
      createPaymentApi({
        token,
        user_id: userInfo._id,
        business_id,
        body: {
          amount_details,
          message_id,
          chat_id,
          payment_info: res,
          seller_id,
        },
      })
        .unwrap()
        .then((res) => {
          updatePaymentApi({
            token,
            payment_id: res._id,
            message_id,
          })
            .unwrap()
            .then((res) => {
              socket.emit("edit_message_offer", res);
            });
        });
    };
    const onClose = () => {
      alert("Wait! Are you sure you want to go?");
    };
    const firstname = userInfo.first_name;
    const className =
      "bg-Blue text-White py-2 px-3 rounded-sm font-medium ml-auto mt-3 disabled:opacity-60";

    return {
      text,
      amount,
      email,
      publicKey,
      currency,
      onSuccess,
      onclose,
      firstname,
      className,
    };
  }

  return (
    <>
      <ul className="overflow-y-scroll space-y-7 border-t pt-5 grid">
        {isMessageListError ? (
          <p className="text-center py-40">{messageListError.data}</p>
        ) : (
          messageListResult &&
          messageListResult.map((message) => (
            <li
              className={`flex space-x-2 ${
                message.sender_id._id === userInfo._id && ""
              }`}
              key={message._id}
            >
              {message.sender_id.avatar ? (
                <img
                  src={message.sender_id.avatar}
                  className="w-8 h-8 object-cover cursor-pointer rounded-sm"
                  onClick={() => setImageToView(message.sender_id.avatar)}
                />
              ) : (
                <p className="w-8 h-8 rounded-full bg-slate-800 grid place-items-center font-bold text-White shrink-0">
                  {message.sender_id.first_name.slice(0, 1)}
                </p>
              )}
              <div className="space-y-1 w-full">
                <div className="flex space-x-1 text-sm items-center">
                  <p className="font-bold">{`${message.sender_id.first_name} ${message.sender_id.last_name}`}</p>
                  <p>-</p>
                  <p className="text-xs">
                    {moment(message.createdAt).format("MMM D, YYYY, h:mm A")}
                  </p>
                </div>
                {message.content.message_images.length > 0 && (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(128px,1fr))] mt-1 pb-2 gap-1">
                    {message.content.message_images?.map((image, index) => (
                      <div
                        className="relative border cursor-pointer"
                        key={index}
                        onClick={() => setImageToView(image)}
                      >
                        <img
                          src={image}
                          alt="File"
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {message.content.message_files.length > 0 && (
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(85px,1fr))] mt-1 pb-2 gap-1">
                    {message.content.message_files?.map((file, index) => (
                      <a
                        className="relative cursor-pointer border p-3 grid"
                        key={index}
                        href={file}
                        download
                      >
                        <GrDocumentPdf className="text-5xl justify-self-center" />
                        <p className="text-sm text-Blue mt-1">Download</p>
                      </a>
                    ))}
                  </div>
                )}
                {message.content.message_text && (
                  <p className="[overflow-wrap:anywhere] hyphens-auto text-lg">
                    {message.content.message_text}
                  </p>
                )}
                {message.is_payment && (
                  <div className="border p-4">
                    <div className="grid gap-2">
                      <p className="text-lg font-semibold">
                        {message.payment_info.business_details.business_title}
                      </p>
                      <p className="font-medium text-lg">
                        Pay:{" "}
                        {formatter.format(
                          message.payment_info.amount_details.total_amount
                        )}
                      </p>
                      <p className="text-lg">
                        {message.payment_info.offer_description}
                      </p>
                      {message.payment_info.status === "paid" ? (
                        <p className="bg-green-500 text-White py-2 px-5 rounded-sm font-medium ml-auto mt-3">
                          Paid
                        </p>
                      ) : message.sender_id._id === userInfo._id ? (
                        <button
                          className="bg-Orange text-White py-2 px-3 rounded-sm font-medium ml-auto mt-3 disabled:opacity-60"
                          type="button"
                          onClick={() => withdrawOffer(message._id)}
                          disabled={
                            withdrawingOffer ||
                            message.payment_info.status === "withdrawn"
                          }
                        >
                          {message.payment_info.status === "withdrawn"
                            ? "Offer withdrawn"
                            : "Withdraw offer"}
                        </button>
                      ) : message.sender_id._id !== userInfo._id &&
                        message.payment_info.status === "pending" ? (
                        <PaystackButton
                          {...payWithPaystack({
                            amount_details: {
                              amount:
                                message.payment_info.amount_details.amount,
                              tax: message.payment_info.amount_details.tax,
                              escrow_fee:
                                message.payment_info.amount_details.escrow_fee,
                              total_amount:
                                message.payment_info.amount_details
                                  .total_amount,
                            },
                            message_id: message._id,
                            chat_id: message.chat_id._id,
                            seller_id: message.chat_id.users.find(
                              (user) => user !== userInfo._id
                            ),
                            business_id:
                              message.payment_info.business_details.business_id,
                          })}
                        />
                      ) : (
                        message.sender_id._id !== userInfo._id &&
                        message.payment_info.status === "withdrawn" && (
                          <p className="bg-Orange text-White py-2 px-3 rounded-sm font-medium ml-auto mt-3 opacity-60">
                            Offer withdrawn
                          </p>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))
        )}
        <div className="" ref={scrollRef}></div>
      </ul>
      {imageToView && (
        <AppModalBox
          show={imageToView}
          setShow={setImageToView}
          className="!p-0 md:!p-3 md:!w-full md:!h-full !bg-Black"
          showClose={true}
        >
          <img
            src={imageToView}
            className="w-full md:h-full md:w-[unset] md:place-self-center object-cover"
          />
        </AppModalBox>
      )}
    </>
  );
}
