import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import io from "socket.io-client";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`;

export const appApi = createApi({
  reducerPath: "AppAPI",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  refetchOnReconnect: true,
  refetchOnFocus: true,
  endpoints: (builder) => ({
    //BUSINESSES--------------------------------------
    //---  GET BUSINESSES  ---//
    getBusinesses: builder.query({
      query: ({
        search,
        category,
        state,
        property,
        date_filter,
        sort_price,
        limit,
        page,
      }) => ({
        url: `/business?search=${search}&category=${category}&state=${state}&property=${property}&date_filter=${date_filter}&sort_price=${sort_price}&limit=${limit}&page=${page}`,
        method: "get",
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = io(import.meta.env.VITE_BASE_URL);
        try {
          await cacheDataLoaded;

          socket.onAny((eventName, result) => {
            if (eventName === "update_businesses") {
              updateCachedData((draft) => {
                draft.push(newBusiness);
              });
            }
            if (eventName === "delete_update") {
              updateCachedData((draft) => {
                const updated = draft.filter(
                  (product) => product._id !== result.product_id
                );
                return (draft = updated);
              });
            }
            if (eventName === "update_business") {
              updateCachedData((draft) => {
                const updated = draft.forEach((business, i) => {
                  if (business._id === result._id) {
                    draft[i] = result;
                  }
                });
                return (draft = updated);
              });
            }
          });
        } catch {
          (err) => console.log(err.message);
        }
        await cacheEntryRemoved;
      },
    }),

    //---  GET INT BUSINESSES  ---//
    getIntBusinesses: builder.query({
      query: ({
        search,
        category,
        country,
        property,
        date_filter,
        sort_price,
        limit,
        page,
      }) => ({
        url: `/business/int?search=${search}&category=${category}&country=${country}&property=${property}&date_filter=${date_filter}&sort_price=${sort_price}&limit=${limit}&page=${page}`,
        method: "get",
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = io(import.meta.env.VITE_BASE_URL);
        try {
          await cacheDataLoaded;

          socket.onAny((eventName, result) => {
            if (eventName === "update_businesses") {
              updateCachedData((draft) => {
                draft.push(newBusiness);
              });
            }
            if (eventName === "delete_update") {
              updateCachedData((draft) => {
                const updated = draft.filter(
                  (product) => product._id !== result.product_id
                );
                return (draft = updated);
              });
            }
            if (eventName === "update_business") {
              updateCachedData((draft) => {
                const updated = draft.forEach((business, i) => {
                  if (business._id === result._id) {
                    draft[i] = result;
                  }
                });
                return (draft = updated);
              });
            }
          });
        } catch {
          (err) => console.log(err.message);
        }
        await cacheEntryRemoved;
      },
    }),

    //---  GET SAVED BUSINESS  ---//
    getSavedBusinesses: builder.query({
      query: ({ body }) => ({
        url: `/business/saved`,
        method: "post",
        body,
      }),
    }),

    //---  GET ONE BUSINESS  ---//
    getOneBusiness: builder.query({
      query: ({ business_id }) => ({
        url: `/business/business_details/${business_id}`,
        method: "get",
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = io(import.meta.env.VITE_BASE_URL);
        try {
          await cacheDataLoaded;

          socket.on("update_business", (arg) => {
            updateCachedData((draft) => {
              Object.assign(draft, arg);
            });
          });
        } catch {}
        await cacheEntryRemoved;
      },
    }),

    //---  GET ONE BUSINESS  ---//
    getOneIntBusiness: builder.query({
      query: ({ business_id }) => ({
        url: `/business/int/business_details/${business_id}`,
        method: "get",
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = io(import.meta.env.VITE_BASE_URL);
        try {
          await cacheDataLoaded;

          socket.on("update_business", (arg) => {
            updateCachedData((draft) => {
              Object.assign(draft, arg);
            });
          });
        } catch {}
        await cacheEntryRemoved;
      },
    }),

    //---  GET USER BUSINESS  ---//
    getUserBusinesses: builder.query({
      query: ({ user_id, token }) => ({
        url: `/business/user_listing/${user_id}`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //--- CREATE BUSINESS ---//
    createBusiness: builder.mutation({
      query: ({ token, seller_id, body }) => ({
        url: `/business/create/${seller_id}`,
        method: "post",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  EDIT BUSINESS  ---//
    editBusiness: builder.mutation({
      query: ({ token, body, seller_id, business_id }) => ({
        url: `/business/edit/${seller_id}/${business_id}`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body,
      }),
    }),

    //---  DELETE BUSINESS  ---//
    deleteBusiness: builder.mutation({
      query: ({ token, user_id, business_id }) => ({
        url: `/business/delete/${user_id}/${business_id}`,
        method: "delete",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  GET ENQUIRIES  ---//
    getEnquiries: builder.query({
      query: ({ seller_id, token }) => ({
        url: `/business/enquiries/${seller_id}`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  GET ORDERS  ---//
    getOrders: builder.query({
      query: ({ buyer_id, token }) => ({
        url: `/business/orders/${buyer_id}`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  GET OVERVIEW  ---//
    accountOverview: builder.query({
      query: ({ user_id, token }) => ({
        url: `/business/overview/${user_id}`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  GET CHATS  ---//
    getChats: builder.query({
      query: ({ user_id, token }) => ({
        url: `/chat/${user_id}`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      keepUnusedDataFor: 5,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = io(import.meta.env.VITE_BASE_URL);
        try {
          await cacheDataLoaded;

          socket.on("update_messages", (new_message) => {
            updateCachedData((draft) => {
              const updated = draft.forEach((chat, i) => {
                if (chat._id === new_message.updatedChat._id) {
                  draft[i] = new_message.updatedChat;
                }
              });
              return (draft = updated);
            });
          });
        } catch {
          (err) => console.log(err.message);
        }
        await cacheEntryRemoved;
      },
    }),

    //---  GET ONE CHAT  ---//
    getOneChat: builder.query({
      query: ({ user_id, chat_id, token }) => ({
        url: `/chat/chat_details/${user_id}/${chat_id}`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  CREATE CHAT  ---//
    createChats: builder.mutation({
      query: ({ user_id, body, token }) => ({
        url: `/chat/create/${user_id}`,
        method: "post",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  GET MESSAGES  ---//
    getMessage: builder.query({
      query: ({ chat_id, token }) => ({
        url: `/message/${chat_id}`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = io(import.meta.env.VITE_BASE_URL);
        try {
          await cacheDataLoaded;

          socket.onAny((eventName, result) => {
            if (eventName === "update_messages") {
              updateCachedData((draft) => {
                draft.push(result.message);
              });
            }
            if (eventName === "update_message") {
              updateCachedData((draft) => {
                const updated = draft.forEach((message, i) => {
                  if (message._id === result._id) {
                    draft[i] = result;
                  }
                });
                return (draft = updated);
              });
            }
          });
        } catch {
          (err) => console.log(err.message);
        }
        await cacheEntryRemoved;
      },
    }),

    //---  CREATE MESSAGE  ---//
    createMessage: builder.mutation({
      query: ({ sender_id, body, token }) => ({
        url: `/message/create/${sender_id}`,
        method: "post",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  EDIT MESSAGE OFFER  ---//
    withdrawOffer: builder.mutation({
      query: ({ sender_id, message_id, token }) => ({
        url: `/message/edit_offer/${sender_id}/${message_id}`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  EDIT MESSAGE STATUS  ---//
    updatePaymentStatus: builder.mutation({
      query: ({ payment_id, message_id, token }) => ({
        url: `/message/edit_status/${message_id}/${payment_id}`,
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //USERS -----------------------------------------
    //---  REGISTER USER  ---//
    registerUser: builder.mutation({
      query: ({ body }) => ({
        url: `/user/register`,
        method: "post",
        body,
      }),
    }),

    // ---  VERIFY PHONE NUMBER  ---//
    verifyPhoneNumber: builder.mutation({
      query: ({ phone_number }) => ({
        url: `/user/verify/phone_number`,
        method: "post",
        body: { phone_number },
      }),
    }),

    // ---  VERIFY PHONE CODE  ---//
    verifyPhoneNumberCode: builder.mutation({
      query: ({ code, sid }) => ({
        url: `/user/verify/code/phone_number`,
        method: "post",
        body: { code, sid },
      }),
    }),

    // ---  CHANGE PHONE NUMBER  ---//
    changePhone: builder.mutation({
      query: ({ token, user_id, oldPhone, newPhone }) => ({
        url: `/user/change/phone_number/${user_id}`,
        method: "post",
        body: { oldPhone, newPhone },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    // ---  VERIFY NEW PHONE NUMBER  ---//
    verifyNewPhone: builder.mutation({
      query: ({ token, user_id, newPhone, code, sid }) => ({
        url: `/user/verify/new/phone_number/${user_id}`,
        method: "post",
        body: { newPhone, code, sid },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    // ---  VERIFY EMAIL  ---//
    verifyEmail: builder.mutation({
      query: ({ token, user_id, email_to }) => ({
        url: `/user/verify/email`,
        method: "post",
        body: { email_to, user_id },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    // ---  VERIFY EMAIL CODE  ---//
    verifyEmailCode: builder.mutation({
      query: ({ token, user_id, email, code, sid }) => ({
        url: `/user/verify/code/email`,
        method: "post",
        body: { user_id, email, code, sid },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    // ---  CHANGE EMAIL  ---//
    changeEmail: builder.mutation({
      query: ({ token, user_id, old_email, new_email }) => ({
        url: `/user/change/email/${user_id}`,
        method: "post",
        body: { old_email, new_email },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    // ---  VERIFY NEW EMAIL  ---//
    verifyNewEmail: builder.mutation({
      query: ({ token, user_id, new_email, code, sid }) => ({
        url: `/user/verify/new/email/${user_id}`,
        method: "post",
        body: { new_email, code, sid },
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  LOGIN USER  ---//
    loginUser: builder.mutation({
      query: ({ body }) => ({
        url: `/user/login`,
        method: "post",
        body,
      }),
    }),

    //---  GET USER INFO  ---//
    getUserInfo: builder.query({
      query: ({ user_id, token }) => ({
        url: `/user/user_info/${user_id}`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  EDIT USER INFO  ---//
    editUserInfo: builder.mutation({
      query: ({ user_id, token, body }) => ({
        url: `/user/edit_user/${user_id}`,
        method: "PATCH",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  EDIT USER AVATAR  ---//
    editUserAvatar: builder.mutation({
      query: ({ user_id, token, body }) => ({
        url: `/user/edit_avatar/${user_id}`,
        method: "PATCH",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  CHANGE USER PASSWORD  ---//
    changeUserPassword: builder.mutation({
      query: ({ user_id, token, body }) => ({
        url: `/user/change_password/${user_id}`,
        method: "PATCH",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //---  GET USER PROFILE  ---//
    getUserProfile: builder.query({
      query: ({ first_name, user_id }) => ({
        url: `/user/profile/${first_name}/${user_id}`,
        method: "get",
      }),
    }),

    // ---  REPORT BUSINESS  ---//
    reportBusiness: builder.mutation({
      query: ({ token, user_id, business_id, body }) => ({
        url: `/report/create/${user_id}/${business_id}`,
        method: "post",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    // ---  CREATE PAYMENT  ---//
    createPayment: builder.mutation({
      query: ({ token, user_id, business_id, body }) => ({
        url: `/payment/create/${user_id}/${business_id}`,
        method: "post",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //--- UPLOAD IMAGES ---//
    getSignedCloudinary: builder.mutation({
      query: ({ token, body }) => ({
        url: `/signUploadRoute`,
        method: "post",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //--- DELETE IMAGES ---//
    deleteImageCloudinary: builder.mutation({
      query: ({ token, body }) => ({
        url: `/delete_image`,
        method: "post",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    // ---  BUCKET GET SECURE LINK  ---//
    getSecureLink: builder.mutation({
      query: ({ token, body }) => ({
        url: `/s3Url`,
        method: "post",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    //ANALYTICS
    // ---  GET VIEW COUNT ANALYTICS  ---//
    getViewCount: builder.query({
      query: ({ token, user_id, business_id }) => ({
        url: `/analytics/views_count/${user_id}/${business_id}`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    // --- UPDATE VIEW COUNT ANALYTICS  ---//
    updateViewCount: builder.mutation({
      query: ({ token, body, user_id }) => ({
        url: `/analytics/views_count/create/${user_id}`,
        method: "post",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),

    // ---  GET SAVED COUNT ANALYTICS  ---//
    getSavedCount: builder.query({
      query: ({ token, user_id, business_id }) => ({
        url: `/analytics/saved_count/${user_id}/${business_id}`,
        method: "get",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
    // --- UPDATE SAVED COUNT ANALYTICS  ---//
    updateSavedCount: builder.mutation({
      query: ({ token, body, user_id }) => ({
        url: `/analytics/saved_count/create/${user_id}`,
        method: "post",
        body,
        headers: {
          authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const {
  useGetBusinessesQuery,
  useGetIntBusinessesQuery,
  useGetSavedBusinessesQuery,
  useGetOneBusinessQuery,
  useGetOneIntBusinessQuery,
  useGetUserBusinessesQuery,
  useCreateBusinessMutation,
  useEditBusinessMutation,
  useDeleteBusinessMutation,
  useGetEnquiriesQuery,
  useGetOrdersQuery,
  useAccountOverviewQuery,
  useGetChatsQuery,
  useGetOneChatQuery,
  useCreateChatsMutation,
  useGetMessageQuery,
  useCreateMessageMutation,
  useWithdrawOfferMutation,
  useUpdatePaymentStatusMutation,
  useRegisterUserMutation,
  useVerifyPhoneNumberMutation,
  useVerifyPhoneNumberCodeMutation,
  useChangePhoneMutation,
  useVerifyNewPhoneMutation,
  useVerifyEmailMutation,
  useVerifyEmailCodeMutation,
  useChangeEmailMutation,
  useVerifyNewEmailMutation,
  useLoginUserMutation,
  useGetUserInfoQuery,
  useEditUserAvatarMutation,
  useEditUserInfoMutation,
  useChangeUserPasswordMutation,
  useGetUserProfileQuery,
  useGetSecureLinkMutation,
  useReportBusinessMutation,
  useCreatePaymentMutation,
  useGetSignedCloudinaryMutation,
  useDeleteImageCloudinaryMutation,
  useGetViewCountQuery,
  useUpdateViewCountMutation,
  useGetSavedCountQuery,
  useUpdateSavedCountMutation,
} = appApi;
