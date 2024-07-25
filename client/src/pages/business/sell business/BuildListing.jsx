import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProtocol, setSellBusiness } from "../../../store/features/appSlice";
import { useNavigate } from "react-router-dom";
import AppButtons from "../../../components/reuseable/AppButtons";
import { BsUpload } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import ListingInput from "../../../components/reuseable/ListingInput";
import appContext from "../../../contexts/AppContext";
import SelectInput from "../../../components/reuseable/SelectInput";

export default function BuildListing() {
  const {
    listingProtocols,
    sellBusiness: { listing_details, status },
  } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const { statesOfBusiness, convertToBase64 } = useContext(appContext);
  const [listingDetailsVal, setListingDetailsVal] = useState(
    listing_details ?? {
      listing_title: "",
      listing_summary: "",
      images: [],
    }
  );

  useEffect(() => {
    if (!listingProtocols.build_listing) {
      navigate("/sell_business");
    }
  }, []);

  function handleChange(e) {
    setListingDetailsVal({
      ...listingDetailsVal,
      [e.target.name]: e.target.value,
    });
  }

  function removeImages(index) {
    const array = [...listingDetailsVal.images];
    array.splice(index, 1);

    setListingDetailsVal({
      ...listingDetailsVal,
      images: array,
    });
  }

  const [imageUploadErr, setImageUploadErr] = useState("");
  function handleImageChange(e) {
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
        setListingDetailsVal({
          ...listingDetailsVal,
          images: [...listingDetailsVal.images, ...array],
        });
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (Object.values(listingDetailsVal).every((val) => val.length > 0)) {
      dispatch(
        setSellBusiness({
          objKey: "listing_details",
          newObj: listingDetailsVal,
        })
      );
      dispatch(
        setProtocol({ protocolKey: "business_details", protocol: true })
      );
      navigate("/sell_business/business_details");
    }
  }

  const notCompletedForm =
    Object.values(listingDetailsVal).some((val) => val.length < 1) ||
    listingDetailsVal.images.length < 3;

  return (
    listingProtocols.build_listing && (
      <section className="bg-White">
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 space-y-7">
          <p className="font-medium text-3xl">Build your listing</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <ListingInput
              label="Listing title"
              type="text"
              name="listing_title"
              id="listing_title"
              value={listingDetailsVal.listing_title}
              onChange={handleChange}
              max={62}
              guide="Choose a short title for your listing. Max 62 characters"
            />
            <div className="">
              <label htmlFor="listing_summary" className="text-lg font-medium">
                Listing summary
              </label>
              <div className="grid md:grid-cols-[1fr,0.5fr] md:gap-2">
                <textarea
                  type="text"
                  name="listing_summary"
                  id="listing_summary"
                  rows={5}
                  value={listingDetailsVal.listing_summary}
                  onChange={handleChange}
                  className="border border-gray-400 outline-none text-lg bg-transparent p-2 md:p-3 focus:border-Orange rounded-sm w-full"
                />
                <p className="text-sm self-center text-gray-600">
                  Give a short description of the business you want to list.
                  Avoid sharing sensitive information.
                </p>
              </div>
            </div>
            <div className="">
              <label htmlFor="listing_summary" className="text-lg font-medium">
                State of business
              </label>
              <div className="grid md:grid-cols-[1fr,0.5fr] md:gap-2">
                <SelectInput
                  options={statesOfBusiness.map((opt) => ({
                    label: opt,
                    value: opt,
                  }))}
                  value={status}
                  onChange={(e) =>
                    dispatch(
                      setSellBusiness({
                        objKey: "status",
                        newObj: e.target.value,
                      })
                    )
                  }
                  placeholder="Select status"
                  required={true}
                />
                <p className="text-sm self-center text-gray-600">
                  Is this business available, sold or under negotiation?
                </p>
              </div>
            </div>
            <div className="">
              <label htmlFor="email" className="text-lg font-medium">
                Add images
              </label>
              <div className="grid md:grid-cols-[1fr,0.5fr] md:gap-2">
                <div className="px-2 md:px-3 h-48 md:h-52 grid place-items-center rounded-sm space-x-2 border border-gray-700 border-dashed self-center relative">
                  <label
                    htmlFor="images"
                    className="grid justify-items-center cursor-pointer text-center"
                  >
                    <BsUpload className="text-4xl mb-5" />
                    <span className="font-semibold">
                      Drag and drop images here or browse to upload.
                    </span>
                    <span className="text-">
                      <span className="font-medium">Formats:</span> JPEG, JPG,
                      PNG, GIF
                    </span>
                    <span className="text-">
                      <span className="font-medium">Max size per image:</span>{" "}
                      20MB
                    </span>
                  </label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    className="outline-none bg-transparent opacity-0 absolute w-full h-full cursor-pointer"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-sm self-center text-gray-600">
                  Select or drop the images you want to add. You must add at
                  least 3 images. The first image will be the main image for the
                  listing
                </p>
                {imageUploadErr.length > 0 && (
                  <p className="text-red-500">{imageUploadErr}</p>
                )}
                {listingDetailsVal.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 border-y py-5 mt-5">
                    {listingDetailsVal.images.map((image, index) => (
                      <div key={index} className="relative h-36">
                        <img
                          src={image}
                          className="w-full h-full object-cover"
                        />
                        <CgClose
                          className="text-red-400 absolute top-0 right-0 text-3xl cursor-pointer"
                          onClick={() => removeImages(index)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {showAlert && notCompletedForm && (
              <p className="text-red-400 text-center md:text-left text-sm">
                You have not completed the compulsory parts of the form
              </p>
            )}
            <div className="grid md:flex gap-3">
              <div className="grid relative">
                {notCompletedForm && (
                  <button
                    type="button"
                    className="w-full h-full absolute z-10 cursor-default"
                    onClick={() => {
                      if (notCompletedForm) setShowAlert(true);
                    }}
                  ></button>
                )}
                <AppButtons
                  className="bg-Blue text-White rounded-sm md:px-10 disabled:opacity-75"
                  label="Continue to next"
                  isDisabled={notCompletedForm}
                />
              </div>
              {/* <AppButtons
                className="bg-Orange text-White rounded-sm"
                label="Save and continue Later"
                type="button"
              /> */}
            </div>
          </form>
        </div>
      </section>
    )
  );
}
