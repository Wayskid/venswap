import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <div className="bg-[#111111] text-white lg:z-[3]">
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-12 pb-16 grid lg:grid-cols-2 lg:items-center gap-y-10">
        <div className="lg:justify-self-start">
          <p className="text-3xl font-semibold text-center">Venswap</p>
          <div className="flex items-center justify-between mt-3 w-[min(18rem,100%)] mx-auto *:border *:p-1 *:border-gray-800 *:rounded-sm *:cursor-pointer">
            <div className="">
              <FaXTwitter />
            </div>
            <div className="">
              <FaInstagram />
            </div>
            <div className="">
              <FaFacebookF />
            </div>
            <div className="">
              <FaLinkedinIn />
            </div>
          </div>
        </div>
        <div className="flex justify-between lg:gap-28">
          <div className="grid self-start space-y-4 text-xs">
            <NavLink to="sell_business" className="">
              Sell Now
            </NavLink>
            <NavLink to="business_list" className="">
              Buy a Business
            </NavLink>
            <NavLink to="saved" className="">
              Saved Listings
            </NavLink>
          </div>
          <div className="grid self-start space-y-4 text-xs">
            <NavLink to="about" className="">
              About Us
            </NavLink>
            <NavLink to="contact" className="">
              Contact Us
            </NavLink>
            <NavLink to="escrow" className="">
              Escrow service
            </NavLink>
          </div>
          <div className="grid self-start space-y-4 text-xs">
            <NavLink to="FAQ" className="">
              FAQ
            </NavLink>
            <NavLink to="terms" className="">
              Terms
            </NavLink>
            <NavLink to="privacy" className="">
              Privacy
            </NavLink>
          </div>
        </div>
        <p className="text-xs text-center lg:col-span-3 justify-self-center lg:justify-self-end lg:mt-3">
          Copyright &copy; 2024 Venswap
        </p>
      </div>
    </div>
  );
}
