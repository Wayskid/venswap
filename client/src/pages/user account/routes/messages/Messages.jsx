import React, { useContext, useEffect, useState } from "react";
import { IoMailUnreadOutline, IoSearchOutline } from "react-icons/io5";
import { Link, Outlet, useParams } from "react-router-dom";
import appContext from "../../../../contexts/AppContext";
import { useGetChatsQuery } from "../../../../services/appApi";
import Loading from "../../../../components/reuseable/Loading";
import moment from "moment";
import { FaImage } from "react-icons/fa";
import { GrDocumentPdf } from "react-icons/gr";
import { Helmet } from "react-helmet-async";

export default function Messages() {
  const { chat_id } = useParams();
  const {
    token,
    userInfo: { _id },
  } = useContext(appContext);

  const {
    data: chatListResult,
    isError: isChatListError,
    error: chatListError,
    isLoading,
    refetch,
  } = useGetChatsQuery({ user_id: _id, token });

  useEffect(() => {
    refetch();
  }, []);

  const [showMessage, setShowMessage] = useState(chat_id ? true : false);

  return (
    <section className="bg-White h-[calc(100%-49px)] grid">
      <Helmet>
        <title>Venswap | Account Messages</title>
        <meta name="robots" content="noindex." />
      </Helmet>
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 py-5 md:p-5 grid md:grid-rows-[1fr,auto]">
        <div className="flex">
          <div
            className={`overflow-hidden md:min-w-[280px] md:w-2/6 ${
              showMessage ? "w-[0]" : "w-full"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="">All messages</p>
              <IoSearchOutline className="text-2xl" />
            </div>
            <div className="mt-5 grid">
              {isLoading ? (
                <Loading />
              ) : chatListResult ? (
                chatListResult
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.latest_message.updatedAt) -
                      new Date(a.latest_message.updatedAt)
                  )
                  .map((chat) => {
                    const receiver = chat?.users.find(
                      (user) => user._id !== _id
                    );
                    return (
                      <Link
                        key={chat._id}
                        className={`grid grid-cols-[auto,1fr] gap-2 items-center py-2 px-1 rounded-sm ${
                          chat._id === chat_id && "bg-[#dbe1e35c]"
                        }`}
                        to={`/account/messages/${chat._id}`}
                        onClick={() => setShowMessage(true)}
                      >
                        {receiver.avatar ? (
                          <img
                            src={receiver.avatar}
                            className="w-10 h-10 object-cover cursor-pointer rounded-sm"
                          />
                        ) : (
                          <p className="w-10 h-10 rounded-sm bg-slate-800 grid place-items-center text-2xl font-bold text-White">
                            {receiver.first_name.slice(0, 1)}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="">
                            <p className="font-medium">{`${receiver.first_name.slice(
                              0,
                              10
                            )} ${receiver.last_name.slice(0, 10)}`}</p>
                            <div className="text-sm font-light flex gap-1">
                              {chat.latest_message.sender_id === _id && (
                                <span className="[overflow-wrap:anywhere]">
                                  Me:
                                </span>
                              )}
                              {chat.latest_message.is_payment ? (
                                <p>Sent offer</p>
                              ) : chat.latest_message?.content?.message_images
                                  ?.length > 0 ? (
                                <div className="flex gap-1 items-center">
                                  <FaImage className="text-lg" /> Image
                                </div>
                              ) : chat.latest_message?.content?.message_files
                                  ?.length > 0 ? (
                                <div className="flex gap-1 items-center">
                                  <GrDocumentPdf className="text-lg" /> File
                                </div>
                              ) : (
                                <p className="">
                                  {chat.latest_message.content?.message_text?.slice(
                                    0,
                                    23
                                  )}
                                  {chat.latest_message.content?.message_text
                                    ?.length > 23 && "..."}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="grid">
                            <p className="text-sm text-right">
                              {
                                moment(chat.latest_message.updatedAt)
                                  .fromNow(true)
                                  .split(" ")[0]
                              }
                              {moment(chat.latest_message.updatedAt)
                                .fromNow(true)
                                .split(" ")[1]
                                .slice(0, 1)}{" "}
                              ago
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })
              ) : (
                isChatListError && (
                  <p className="text-center py-40">{chatListError.data}</p>
                )
              )}
            </div>
          </div>
          <div
            className={`overflow-hidden md:w-4/6 grid md:border md:ml-3 ${
              showMessage ? "w-full" : "w-[0]"
            }`}
          >
            <Outlet context={[setShowMessage]} />
          </div>
        </div>
        <p className="text-center mt-5 text-sm hidden md:block">
          Avoid paying private individuals outside our platform to prevent scams
          and fraud. Keep communication and payments within our secure site for
          a smooth and trustworthy experience.
        </p>
      </div>
    </section>
  );
}
