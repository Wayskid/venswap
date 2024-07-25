import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { GrMenu } from "react-icons/gr";
import { PiX } from "react-icons/pi";
import appContext from "../../../contexts/AppContext";
import { RemoveCookie } from "../../../hooks/cookies";
import { FaBell } from "react-icons/fa";
import { Menu, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";
import { IoMdMail } from "react-icons/io";

export default function Nav() {
  const { setUserInfo, token, setToken } = useContext(appContext);
  const { notifications, savedBusinesses } = useSelector((state) => state.app);
  const { pathname } = useLocation();
  const [mobileMenuShown, setMobileMenuShown] = useState(false);

  useEffect(() => {
    setMobileMenuShown(false);
  }, [pathname]);

  function matchRoute(route) {
    if (pathname === route) {
      return true;
    } else {
      return false;
    }
  }

  //Notification
  const [anchorElNo, setAnchorElNo] = useState(null);
  const openNo = Boolean(anchorElNo);
  const handleClickNo = (event) => {
    setAnchorElNo(event.currentTarget);
  };
  const handleCloseNo = () => {
    setAnchorElNo(null);
  };

  return (
    <nav className="fixed z-40 top-0 bg-White w-full">
      <div className="flex items-center w-[min(92rem,100%)] mx-auto relative z-40 bg-White px-4 md:px-12 lg:px-32 py-6">
        <NavLink to="/" className="text-3xl font-semibold text-Blue mr-auto">
          Venswap
        </NavLink>
        <div className="md:flex lg:gap-8 md:gap-5 hidden">
          <NavLink
            to="sell_business"
            className={`px-3 py-2 ${
              matchRoute("/sell_business") && "font-bold"
            }`}
          >
            Sell Now
          </NavLink>
          <NavLink
            to="business_list?search_keyword=&price_filter="
            className={`px-3 py-2 ${
              matchRoute("/business_list") && "font-bold"
            }`}
          >
            Buy a Business
          </NavLink>
          {!token && (
            <NavLink
              to="about"
              className={`px-3 py-2 ${matchRoute("/about") && "font-bold"}`}
            >
              About Us
            </NavLink>
          )}
        </div>
        {token && (
          <div className="flex space-x-3 items-center text-Blue md:ml-5 lg:ml-8">
            <div>
              <div className="relative" onClick={handleClickNo}>
                <FaBell className="text-xl cursor-pointer" />
                {notifications?.filter(
                  (notification) => notification.read === false
                ).length > 0 && (
                  <p className="text-xs absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-White grid place-content-center cursor-pointer">
                    {
                      notifications.filter((notification) => {
                        if (notification.read === false) {
                          return notification;
                        }
                      }).length
                    }
                  </p>
                )}
              </div>
              <Menu
                id="notification-menu"
                anchorEl={anchorElNo}
                open={openNo}
                onClose={handleCloseNo}
                MenuListProps={{
                  "aria-labelledby": "notification-button",
                }}
                transformOrigin={{
                  vertical: -10,
                  horizontal: 180,
                }}
              >
                <p className="font-medium border-b p-3">Notifications</p>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <MenuItem
                      key={index}
                      style={{
                        padding: 0,
                      }}
                      onClick={() => {
                        handleCloseNo();
                        window.location.href = notification.link;
                      }}
                    >
                      <div
                        className={`flex items-center gap-2 p-5 border-b ${
                          notification.read === false && "bg-gray-300"
                        }`}
                      >
                        <img
                          src={notification.avatar}
                          alt=""
                          className="w-10 h-10 rounded-sm"
                        />
                        <p className="">{notification.alertMsg}!</p>
                      </div>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem
                    style={{ paddingRight: "60px", paddingBlock: "20px" }}
                  >
                    No new notification
                  </MenuItem>
                )}
              </Menu>
            </div>
            <NavLink to="/account/messages" className="text-2xl">
              <IoMdMail />
            </NavLink>
          </div>
        )}
        <NavLink
          to={token ? "/account" : "/login"}
          className={`ml-5 lg:ml-8 hidden md:grid px-4 py-2 text-[16px] font-bold bg-Orange text-White ${
            matchRoute(token ? "/account" : "/login") && "font-bold"
          }`}
        >
          {token ? "Account" : "Login"}
        </NavLink>
        <button
          className="md:hidden text-4xl text-Blue transition duration-1000 ml-5 lg:ml-8"
          onClick={() => setMobileMenuShown(!mobileMenuShown)}
        >
          {mobileMenuShown ? (
            <PiX className="transition duration-1000" />
          ) : (
            <GrMenu className="transition duration-1000" />
          )}
        </button>
      </div>
      <div
        className={`fixed bg-White top-0 w-full h-full md:hidden transition-transform z-30 border-t-2 py-10 pt-[92px] ${
          !mobileMenuShown ? "-translate-y-[200%]" : "translate-y-[0]"
        }
        `}
      >
        <div className="grid h-full md:px-12 space-y-6">
          <div className="grid self-start space-y-6 text-4xl">
            <NavLink
              to="sell_business"
              className={`px-3 py-2 ${
                matchRoute("/sell_business") && "font-bold"
              }`}
            >
              Sell Now
            </NavLink>
            <NavLink
              to="business_list?search_keyword=&price_filter="
              className={`px-3 py-2 ${
                matchRoute("/business_list") && "font-bold"
              }`}
            >
              Buy a Business
            </NavLink>
            <NavLink
              to="about"
              className={`px-3 py-2 ${matchRoute("/about") && "font-bold"}`}
            >
              About Us
            </NavLink>
            <NavLink
              to="FAQ"
              className={`px-3 py-2 ${matchRoute("/FAQ") && "font-bold"}`}
            >
              FAQ
            </NavLink>
            <NavLink
              to="contact"
              className={`px-3 py-2 ${matchRoute("/contact") && "font-bold"}`}
            >
              Contact Us
            </NavLink>
            {savedBusinesses?.length > 0 && (
              <NavLink
                to="saved"
                className={`px-3 py-2 ${matchRoute("/saved") && "font-bold"}`}
              >
                Saved listings
              </NavLink>
            )}
          </div>
          <div className="grid self-end space-y-1 text-Blue font-bold text-3xl">
            <NavLink
              to={token ? "/account" : "/login"}
              className={`px-3 py-2 self-end ${
                matchRoute(token ? "/account" : "/login") && "font-bold"
              }`}
            >
              {token ? "Account" : "Login"}
            </NavLink>
            {token ? (
              <button
                className="px-3 py-2 mr-auto"
                onClick={() => {
                  RemoveCookie("User");
                  RemoveCookie("Token");
                  setUserInfo({});
                  setToken("");
                  setMobileMenuShown(false);
                }}
              >
                Log out
              </button>
            ) : (
              <NavLink
                to="sign_up"
                className={`px-3 py-2 ${matchRoute("/sign_up") && "font-bold"}`}
              >
                Sign up
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
