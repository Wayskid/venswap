import React, { useContext, useState } from "react";
import { CgArrowLeft, CgChevronDown, CgPrinter, CgShare } from "react-icons/cg";
import { CiLocationOn } from "react-icons/ci";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { MdOutlineReport } from "react-icons/md";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { useGetOneIntBusinessQuery } from "../../services/appApi";
import Loading from "../../components/reuseable/Loading";
import moment from "moment";
import appContext from "../../contexts/AppContext";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReportBusiness from "../business/ReportBusiness";
import AppModalBox from "../../components/reuseable/AppModalBox";
import { useDispatch, useSelector } from "react-redux";
import { saveBusiness } from "../../store/features/appSlice";
import { PiHeart, PiHeartFill } from "react-icons/pi";

export default function Int_BusinessDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const saved = useSelector((state) => state.app.savedBusinesses);
  const url = window.location.href;
  const { business_id } = useParams();
  const { formatter, userInfo } = useContext(appContext);
  const {
    data: businessDetResult,
    isLoading: isBusinessDetLoading,
    isError: isBusinessDetError,
    error: BusinessDetError,
  } = useGetOneIntBusinessQuery({ business_id });

  const [copied, setCopied] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [imageToView, setImageToView] = useState(null);

  return (
    <section className="bg-White">
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pb-16 grid">
        <div className="flex justify-between border-y mt-0 md:mt-2 py-3">
          <Link to={-1} className="flex gap-2 items-center">
            <CgArrowLeft className="text-2xl" />
            <p className="text-sm">Back to listings</p>
          </Link>
          <div className="flex gap-5 items-center">
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => dispatch(saveBusiness(businessDetResult._id))}
            >
              {saved?.includes(businessDetResult?._id) ? (
                <PiHeartFill className="text-2xl" />
              ) : (
                <PiHeart className="text-2xl" />
              )}
              <p className="text-sm">
                {saved?.includes(businessDetResult?._id) ? "Saved" : "Save"}
              </p>
            </div>
            <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
              <div className="flex items-center gap-1 cursor-pointer">
                <CgShare className="text-2xl" />
                <p className="text-sm">{!copied ? "Share" : "Link copied"}</p>
              </div>
            </CopyToClipboard>
          </div>
        </div>
        {isBusinessDetLoading ? (
          <Loading />
        ) : isBusinessDetError ? (
          <p className="text-center text-gray-500 py-28 md:py-72 text-lg">
            {BusinessDetError.data}
          </p>
        ) : (
          businessDetResult && (
            <div className="grid lg:grid-cols-[1fr,auto] gap-4 mt-3">
              <div className="">
                <div className="pb-3">
                  <p className="text-3xl">
                    {businessDetResult.listing_details.listing_title}
                  </p>
                  <div className="flex items-center gap-1">
                    <CiLocationOn className="" />
                    <p className="text-sm text-Blue font-medium">{`${
                      businessDetResult.business_details.business_location.city
                    }, ${businessDetResult.business_details.business_location.state.replace(
                      "_",
                      " "
                    )}, ${
                      businessDetResult.business_details.business_location
                        .country
                    }`}</p>
                  </div>
                </div>
                <div className="h-[400px] mt-1 rounded-sm overflow-hidden">
                  <img
                    src={businessDetResult.listing_details.images[0]}
                    alt=""
                    className={`w-full h-full object-cover cursor-pointer`}
                    onClick={() =>
                      setImageToView(
                        businessDetResult.listing_details.images[0]
                      )
                    }
                  />
                </div>
                <div className="mt-3 h-20 flex gap-3 *:shrink-0 overflow-x-hidden relative">
                  {businessDetResult.listing_details.images.map(
                    (image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        className={`w-28 h-full object-cover cursor-pointer`}
                        onClick={() => setImageToView(image)}
                      />
                    )
                  )}
                </div>
                <div className="mt-3 flex gap-7 border-y py-3">
                  <div className="">
                    <p className="text-sm">Status</p>
                    <p className="">{businessDetResult.status}</p>
                  </div>
                  <div className="">
                    <p className="text-sm">Date Submitted</p>
                    <p className="">
                      {moment(businessDetResult.createdAt).format(
                        "MMMM Do YYYY"
                      )}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 py-3 md:grid-cols-2">
                  <div className="flex gap-3 items-center">
                    <p className="text-sm">Asking price:</p>
                    <p className="font-semibold">
                      {formatter.format(businessDetResult.asking_price)}
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <p className="text-sm">Net profit:</p>
                    <p className="font-semibold">
                      {formatter.format(
                        businessDetResult.business_details.financial_details
                          .net_profit
                      )}
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <p className="text-sm">Property type:</p>
                    <p className="font-semibold">
                      {businessDetResult.business_details.property_details.type}
                    </p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <p className="text-sm">Rent:</p>
                    <p className="font-semibold">
                      {formatter.format(
                        businessDetResult.business_details.property_details.rent
                      )}
                    </p>
                  </div>
                </div>
                <div className="border-y py-3 ">
                  <input
                    type="checkbox"
                    id="details"
                    className="hidden peer/accordion"
                    defaultChecked={true}
                  />
                  <label
                    htmlFor="details"
                    className="grid grid-cols-[1fr_0.15fr] justify-between items-center cursor-pointer peer-checked/accordion:[&>*:last-child]:rotate-[180deg] text-Dark"
                  >
                    <p className="text-lg text-gray-500">Listing Description</p>
                    <CgChevronDown className="justify-self-end transition-all text-xl" />
                  </label>
                  <div className="grid grid-rows-[0] overflow-hidden peer-checked/accordion:grid-rows-1">
                    <p className="py-3">
                      {businessDetResult.listing_details.listing_summary}
                    </p>
                  </div>
                </div>
                <div className="border-b py-3 ">
                  <input
                    type="checkbox"
                    id="services"
                    className="hidden peer/accordion"
                  />
                  <label
                    htmlFor="services"
                    className="grid grid-cols-[1fr_0.15fr] justify-between items-center cursor-pointer peer-checked/accordion:[&>*:last-child]:rotate-[180deg] text-Dark"
                  >
                    <p className="text-lg text-gray-500">Services</p>
                    <CgChevronDown className="justify-self-end transition-all text-xl" />
                  </label>
                  <div className="grid grid-rows-[0] overflow-hidden peer-checked/accordion:grid-rows-1">
                    <ul className="list-disc list-inside py-3">
                      {businessDetResult.business_details.services.map(
                        (service, index) => (
                          <li key={index} className="">
                            {service}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-80 self-start shrink-0 grid md:grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="grid gap-5 shadow shrink-0 rounded-sm p-5">
                  <div className="">
                    <p className="text-xs text-gray-500">MARKETED BY</p>
                    <p className="">{`${businessDetResult.seller_id.first_name} ${businessDetResult.seller_id.last_name}`}</p>
                    <Link
                      to={`../profile/${businessDetResult.seller_id.first_name}/${businessDetResult.seller_id._id}`}
                      className="text-xs text-Blue"
                    >
                      More from this user
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-5 items-center">
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() =>
                        dispatch(saveBusiness(businessDetResult._id))
                      }
                    >
                      {saved?.includes(businessDetResult?._id) ? (
                        <PiHeartFill className="text-2xl" />
                      ) : (
                        <PiHeart className="text-2xl" />
                      )}
                      <p className="text-sm">
                        {saved?.includes(businessDetResult?._id)
                          ? "Saved"
                          : "Save"}
                      </p>
                    </div>
                    <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
                      <div className="flex items-center gap-1 cursor-pointer">
                        <CgShare className="text-2xl" />
                        <p className="text-sm">
                          {!copied ? "Share" : "Link copied"}
                        </p>
                      </div>
                    </CopyToClipboard>
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => window.print()}
                    >
                      <CgPrinter className="text-2xl" />
                      <p className="text-sm">Print</p>
                    </div>
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => setShowReport(!showReport)}
                    >
                      <MdOutlineReport className="text-2xl" />
                      <p className="text-sm">Report</p>
                    </div>
                  </div>
                  {businessDetResult.seller_id._id === userInfo?._id ? (
                    <button
                      className="bg-Blue text-White py-2 rounded-sm self-end"
                      onClick={() => navigate(`../account/listings`)}
                    >
                      Manage Business
                    </button>
                  ) : (
                    <button
                      className="bg-Blue text-White py-2 rounded-sm self-end"
                      onClick={() =>
                        navigate(
                          `/business_details/${businessDetResult._id}/contact`
                        )
                      }
                    >
                      Contact Seller
                    </button>
                  )}
                </div>
                <div className="grid gap-5 shadow shrink-0 rounded-sm p-5">
                  <div className="flex items-center gap-1 text-[#ff4040]">
                    <AiOutlineSafetyCertificate className="text-2xl" />
                    <p className="text-sm">Stay Safe</p>
                  </div>
                  <p className="text-sm">
                    To avoid potential scams or fraud, we strongly advise
                    against paying private individuals outside of our platform.
                    Instead, please keep all communication and payments within
                    our website, where our secure systems can protect you. This
                    will help ensure a smooth and trustworthy experience for all
                    users.
                  </p>
                  <NavLink
                    to="../../escrow"
                    className="bg-Orange text-White py-2 rounded-sm grid justify-center"
                  >
                    Learn more
                  </NavLink>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      {showReport && (
        <ReportBusiness
          seller_id={businessDetResult?.seller_id._id}
          setShowReport={setShowReport}
        />
      )}
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
    </section>
  );
}
