import { lazy, Suspense, useContext, useEffect } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import { useLocation } from "react-router-dom";
import AppLoader from "./components/reuseable/AppLoader.jsx";
import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import BusinessList from "./pages/business/BusinessList.jsx";
import appContext from "./contexts/AppContext.jsx";
import Overview from "./pages/user account/routes/Overview.jsx";
import Orders from "./pages/user account/routes/Orders.jsx";
import Messages from "./pages/user account/routes/messages/Messages.jsx";
import MessageBody from "./pages/user account/routes/messages/MessageBody.jsx";
import Listings from "./pages/user account/routes/listings/Listings.jsx";
import AllListings from "./pages/user account/routes/listings/AllListings.jsx";
import Enquiries from "./pages/user account/routes/listings/Enquiries.jsx";
import MessagesOverview from "./pages/user account/routes/messages/MessagesOverview.jsx";
import Settings from "./pages/user account/routes/settings/Settings.jsx";
import BusinessDetails from "./pages/business/BusinessDetails.jsx";
import ContactSeller from "./pages/business/ContactSeller.jsx";
import Profile from "./pages/user account/Profile.jsx";
import PrivateRoutes from "./privateRouter/PrivateRoutes.jsx";
import Setup from "./pages/business/sell business/Setup.jsx";
import BuildListing from "./pages/business/sell business/BuildListing.jsx";
import Details from "./pages/business/sell business/Details.jsx";
import Documents from "./pages/business/sell business/Documents.jsx";
import Preview from "./pages/business/sell business/Preview.jsx";
import Success from "./pages/business/sell business/Success.jsx";
import EditBusiness from "./pages/business/EditBusiness.jsx";
import About from "./pages/About.jsx";
import FAQ from "./pages/FAQ.jsx";
import Contact from "./pages/Contact.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import { useSocket } from "./contexts/SocketProvider.jsx";
import { useDispatch } from "react-redux";
import { setNotifications } from "./store/features/appSlice.js";
import { io } from "socket.io-client";
import SavedBusinesses from "./pages/business/SavedBusinesses.jsx";
import Escrow from "./pages/Escrow.jsx";
import Int_ContactSeller from "./pages/international/Int_ContactSeller.jsx";
import Int_BusinessDetails from "./pages/international/Int_BusinessDetails.jsx";
import Int_BusinessList from "./pages/international/Int_BusinessList.jsx";
import BlogPost from "./pages/blog/BlogPost.jsx";

function App() {
  const { token, userInfo } = useContext(appContext);
  const { pathname } = useLocation();
  const { socket } = useSocket();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const Layout = lazy(() => import("./pages/layouts/default/Layout.jsx"));
  const AccountLayout = lazy(() =>
    import("./pages/layouts/user account/AccountLayout.jsx")
  );
  const ListingLayout = lazy(() =>
    import("./pages/layouts/listing/ListingLayout.jsx")
  );

  //Notifications
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BASE_URL);
    socket.on("update_messages", (res) => {
      if (
        pathname !== `/account/messages/${res.message.chat_id._id}` &&
        res.updatedChat.users.find(
          (user) => user._id !== res.message.sender_id._id
        )._id === userInfo._id
      )
        dispatch(
          setNotifications({
            alertMsg: `New message from ${res.message.sender_id.first_name}`,
            link: `${import.meta.env.VITE_CLIENT_URL}/account/messages/${
              res.message.chat_id._id
            }`,
            avatar: res.message.sender_id.avatar,
            read: false,
          })
        );
    });
    return () => socket.close();
  }, [socket, pathname]);

  return (
    <div className="App h-full text-gray-700">
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />}></Route>
            <Route
              path="login"
              element={token ? <Navigate to={`/`} /> : <Login />}
            ></Route>
            <Route
              path="sign_up"
              element={token ? <Navigate to={`/`} /> : <SignUp />}
            ></Route>
            <Route path="business_list" element={<BusinessList />}></Route>
            <Route
              path="business_details/:business_id"
              element={<BusinessDetails />}
            ></Route>
            <Route
              path="profile/:first_name/:user_id"
              element={<Profile />}
            ></Route>
            <Route element={<PrivateRoutes />}>
              <Route
                path="business_details/:business_id/contact"
                element={<ContactSeller />}
              ></Route>
            </Route>

            {/* International */}
            <Route
              path="international/business_list"
              element={<Int_BusinessList />}
            ></Route>
            <Route
              path="international/business_details/:business_id"
              element={<Int_BusinessDetails />}
            ></Route>
            <Route element={<PrivateRoutes />}>
              <Route
                path="international/business_details/:business_id/contact"
                element={<Int_ContactSeller />}
              ></Route>
            </Route>

            {/* Others */}
            <Route
              path="blog/:post_title/:post_id"
              element={<BlogPost />}
            ></Route>
            <Route path="saved" element={<SavedBusinesses />}></Route>
            <Route path="about" element={<About />}></Route>
            <Route path="faq" element={<FAQ />}></Route>
            <Route path="escrow" element={<Escrow />}></Route>
            <Route path="contact" element={<Contact />}></Route>
            <Route path="terms" element={<Terms />}></Route>
            <Route path="privacy" element={<Privacy />}></Route>
          </Route>
          <Route element={<PrivateRoutes />}>
            <Route path="account" element={<AccountLayout />}>
              <Route index element={<Overview />}></Route>
              <Route path="listings" element={<Listings />}>
                <Route index element={<AllListings />}></Route>
                <Route path="enquiries" element={<Enquiries />}></Route>
              </Route>
              <Route path="orders" element={<Orders />}></Route>
              <Route path="messages" element={<Messages />}>
                <Route index element={<MessagesOverview />}></Route>
                <Route index path=":chat_id" element={<MessageBody />}></Route>
              </Route>
              <Route path="settings" element={<Settings />}></Route>
              <Route
                path="edit_business/:business_id"
                element={<EditBusiness />}
              ></Route>
            </Route>
            <Route
              path="business_details/:business_id/contact"
              element={<ContactSeller />}
            ></Route>
          </Route>
          <Route element={<PrivateRoutes />}>
            <Route path="sell_business" element={<ListingLayout />}>
              <Route index element={<Setup />}></Route>
              <Route path="build_listing" element={<BuildListing />}></Route>
              <Route path="business_details" element={<Details />}></Route>
              <Route path="business_docs" element={<Documents />}></Route>
              <Route path="preview" element={<Preview />}></Route>
              <Route path="success/:business_id" element={<Success />}></Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
