import React, { useContext, useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  useDeleteBusinessMutation,
  useDeleteImageCloudinaryMutation,
  useEditBusinessMutation,
  useGetOneBusinessQuery,
  useGetSignedCloudinaryMutation,
} from "../../services/appApi";
import Loading from "../../components/reuseable/Loading";
import AppButtons from "../../components/reuseable/AppButtons";
import SelectInput from "../../components/reuseable/SelectInput";
import appContext from "../../contexts/AppContext";
import NumberInput from "../../components/reuseable/NumberInput";
import deepEqual from "deep-equal";
import { useSocket } from "../../contexts/SocketProvider";
import { TiDeleteOutline } from "react-icons/ti";
import { BsPlus } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import axios from "axios";
import { extractPublicId } from "cloudinary-build-url";

export default function EditBusiness() {
  const { business_id } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const {
    statesOfBusiness,
    categoryOptions,
    stateOptions,
    propertyOptions,
    userInfo,
    token,
    convertToBase64,
  } = useContext(appContext);
  const {
    data: businessDetResult,
    isLoading: isBusinessDetLoading,
    isError: isBusinessDetError,
    error: BusinessDetError,
  } = useGetOneBusinessQuery({ business_id });

  const [editBusinessVal, setEditBusinessVal] = useState();

  useEffect(() => {
    if (businessDetResult) {
      const result = {
        listing_details: {
          listing_title: businessDetResult?.listing_details.listing_title,
          listing_summary: businessDetResult?.listing_details.listing_summary,
          images: businessDetResult?.listing_details.images,
        },
        business_details: {
          business_name: businessDetResult?.business_details.business_name,
          business_phone_number:
            businessDetResult?.business_details.business_phone_number
              .toString()
              .replace(/^234+(?!$)/g, 0),
          business_email: businessDetResult?.business_details.business_email,
          business_description:
            businessDetResult?.business_details.business_description,
          category: businessDetResult?.business_details.category,
          services: businessDetResult?.business_details.services,
          business_location: {
            address:
              businessDetResult?.business_details.business_location.address,
            city: businessDetResult?.business_details.business_location.city,
            postal_code:
              businessDetResult?.business_details.business_location.postal_code,
            state: businessDetResult?.business_details.business_location.state,
          },
          financial_details: {
            turnover:
              businessDetResult?.business_details.financial_details.turnover.toLocaleString(),
            net_profit:
              businessDetResult?.business_details.financial_details.net_profit.toLocaleString(),
          },
          property_details: {
            type: businessDetResult?.business_details.property_details.type,
            rent: businessDetResult?.business_details.property_details.rent.toLocaleString(),
          },
        },
        status: businessDetResult?.status,
        asking_price: businessDetResult?.asking_price.toLocaleString(),
      };

      setEditBusinessVal({
        ...result,
        listing_details: {
          ...result.listing_details,
          images: result.listing_details.images.map((image) => ({
            url: image,
            new: false,
            delete: false,
          })),
        },
      });
    }
  }, [business_id, businessDetResult]);

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
        array.push({ url: promise, delete: false, new: true });
        setEditBusinessVal({
          ...editBusinessVal,
          listing_details: {
            ...editBusinessVal.listing_details,
            images: [...editBusinessVal.listing_details.images, ...array],
          },
        });
      }
    });
  }

  function removeImages(index) {
    const array = [...editBusinessVal.listing_details.images];
    if (array[index].new === true) {
      array.splice(index, 1);
    } else {
      array[index].delete = true;
    }

    setEditBusinessVal({
      ...editBusinessVal,
      listing_details: {
        ...editBusinessVal.listing_details,
        images: array,
      },
    });
  }

  //Check for changes and save changes
  const [getSignedCloudinary] = useGetSignedCloudinaryMutation();
  const [editBusinessApi] = useEditBusinessMutation();
  const [deleteCurrentImageApi] = useDeleteImageCloudinaryMutation();
  const [isLoading, setIsLoading] = useState(false);
  async function handleSaveChanges(e) {
    e.preventDefault();
    if (
      !deepEqual(
        {
          listing_details: {
            listing_title: businessDetResult?.listing_details.listing_title,
            listing_summary: businessDetResult?.listing_details.listing_summary,
            images: businessDetResult?.listing_details.images.map((image) => ({
              url: image,
              new: false,
              delete: false,
            })),
          },
          business_details: {
            business_name: businessDetResult?.business_details.business_name,
            business_phone_number:
              businessDetResult?.business_details.business_phone_number
                .toString()
                .replace(/^234+(?!$)/g, 0),
            business_email: businessDetResult?.business_details.business_email,
            business_description:
              businessDetResult?.business_details.business_description,
            category: businessDetResult?.business_details.category,
            services: businessDetResult?.business_details.services,
            business_location: {
              address:
                businessDetResult?.business_details.business_location.address,
              city: businessDetResult?.business_details.business_location.city,
              postal_code:
                businessDetResult?.business_details.business_location
                  .postal_code,
              state:
                businessDetResult?.business_details.business_location.state,
            },
            financial_details: {
              turnover:
                businessDetResult?.business_details.financial_details.turnover.toLocaleString(),
              net_profit:
                businessDetResult?.business_details.financial_details.net_profit.toLocaleString(),
            },
            property_details: {
              type: businessDetResult?.business_details.property_details.type,
              rent: businessDetResult?.business_details.property_details.rent.toLocaleString(),
            },
          },
          status: businessDetResult?.status,
          asking_price: businessDetResult?.asking_price.toLocaleString(),
        },
        editBusinessVal
      )
    ) {
      setIsLoading(true);
      const imagesToUpload = editBusinessVal.listing_details.images.filter(
        (image) => {
          if (image.new === true) {
            return image;
          }
        }
      );

      const imagesToKeep = editBusinessVal.listing_details.images.filter(
        (image) => {
          if (image.delete === false && image.new === false) {
            return image;
          }
        }
      );

      const imagesToRemove = editBusinessVal.listing_details.images.filter(
        (image) => {
          if (image.delete === true) {
            return image;
          }
        }
      );

      function handleSaveChanges(res) {
        editBusinessApi({
          token,
          seller_id: userInfo._id,
          business_id,
          body: res
            ? {
                ...editBusinessVal,
                listing_details: {
                  ...editBusinessVal.listing_details,
                  images: [...imagesToKeep.map((image) => image.url), ...res],
                },
              }
            : {
                ...editBusinessVal,
                listing_details: {
                  ...editBusinessVal.listing_details,
                  images: [...imagesToKeep.map((image) => image.url)],
                },
              },
        })
          .unwrap()
          .then((res) => {
            if (imagesToRemove.length > 0) {
              for (let i = 0; i < imagesToRemove.length; i++) {
                const img = imagesToRemove[i];
                const publicId = extractPublicId(img.url);
                deleteCurrentImageApi({
                  token,
                  body: { public_id: publicId.replaceAll("%20", " ") },
                })
                  .unwrap()
                  .then((res) => {
                    if (res.result === "ok") {
                      socket.emit("edit_business", res);
                      navigate("../../account/listings");
                      setIsLoading(false);
                    }
                  });
              }
            } else {
              socket.emit("edit_business", res);
              navigate("../../account/listings");
              setIsLoading(false);
            }
          });
      }

      if (imagesToUpload.length > 0) {
        const { data: signData } = await getSignedCloudinary({
          token,
          body: {
            folder:
              import.meta.env.VITE_CLOUDINARY_LISTING_FOLDER +
              "/" +
              businessDetResult.business_details.business_name,
            tags: businessDetResult.business_details.business_name,
          },
        });
        const formData = new FormData();

        async function imgArray() {
          const imgArray = [];
          for (let i = 0; i < imagesToUpload.length; i++) {
            let image = imagesToUpload[i];
            formData.append("file", image.url);
            formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
            formData.append("timestamp", signData.timestamp);
            formData.append("signature", signData.signature);
            formData.append(
              "folder",
              import.meta.env.VITE_CLOUDINARY_LISTING_FOLDER +
                "/" +
                businessDetResult.business_details.business_name
            );
            formData.append(
              "tags",
              businessDetResult.business_details.business_name
            );

            await axios
              .post(import.meta.env.VITE_CLOUDINARY_URL, formData)
              .then(({ data }) => {
                imgArray.push(data.secure_url);
              })
              .catch((err) => {
                setIsLoading(false);
              });
          }
          return imgArray;
        }

        imgArray().then((res) => {
          handleSaveChanges(res);
        });
      } else {
        handleSaveChanges();
      }
    }
  }

  //Delete business
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteBusinessApi, { isLoading: deletingBusiness }] =
    useDeleteBusinessMutation();
  function handleDeleteBusiness() {
    deleteBusinessApi({ token, user_id: userInfo._id, business_id })
      .unwrap()
      .then((res) => {
        socket.emit("delete_business", res);
        navigate("../../account/listings");
      });
  }

  return (
    <section className="bg-White">
      <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 grid">
        <p className="text-3xl">Edit listing</p>
        {isBusinessDetLoading ? (
          <Loading />
        ) : editBusinessVal ? (
          <form onSubmit={handleSaveChanges} className="space-y-7">
            <div className="mt-7">
              <p className="font-medium text-xl mb-4">Listing details</p>
              <div className="space-y-3 text-lg *:border-b *:py-5 *:px-3">
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Listing title:</p>
                  <input
                    type="text"
                    className="font-medium outline-none"
                    id="listing_title"
                    name="listing_title"
                    value={editBusinessVal?.listing_details.listing_title}
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        listing_details: {
                          ...editBusinessVal.listing_details,
                          listing_title: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Listing summary:</p>
                  <textarea
                    type="text"
                    className="font-medium outline-none"
                    id="listing_summary"
                    name="listing_summary"
                    rows={5}
                    value={editBusinessVal?.listing_details.listing_summary}
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        listing_details: {
                          ...editBusinessVal.listing_details,
                          listing_summary: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange items-center">
                  <p className="">Status of business:</p>
                  <SelectInput
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        status: e.target.value,
                      })
                    }
                    options={statesOfBusiness.map((opt) => ({
                      label: opt,
                      value: opt,
                    }))}
                    value={editBusinessVal.status}
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Images:</p>
                  <div className="font-medium grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {editBusinessVal.listing_details.images?.map(
                      (image, index) => {
                        if (image.delete === false) {
                          return (
                            <div className="w-full h-36 relative" key={index}>
                              <img
                                className="w-full h-36 object-cover border"
                                src={image.url}
                              ></img>
                              <CgClose
                                className="text-2xl absolute top-0 right-0 text-red-500 cursor-pointer"
                                onClick={() => removeImages(index)}
                              />
                            </div>
                          );
                        }
                      }
                    )}
                    <label
                      htmlFor="addMore"
                      className="grid place-items-center text-5xl text-gray-500 w-full h-36 border-2 border-gray-400 border-dashed cursor-pointer"
                    >
                      <BsPlus />
                      <input
                        type="file"
                        name="addMore"
                        id="addMore"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        multiple
                      />
                    </label>
                  </div>
                  {imageUploadErr && (
                    <p className="text-sm text-red-400">{imageUploadErr}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="">
              <p className="font-medium text-xl mb-4">Business details</p>
              <div className="space-y-3 text-lg *:border-b *:py-5 *:px-3">
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Business name:</p>
                  <input
                    type="text"
                    className="font-medium outline-none"
                    id="business_name"
                    name="business_name"
                    value={editBusinessVal?.business_details.business_name}
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          business_name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Business phone:</p>
                  <div className="flex gap-1 font-medium">
                    <p>+234</p>
                    <input
                      type="text"
                      className="outline-none"
                      id="business_phone_number"
                      name="business_phone_number"
                      value={
                        editBusinessVal?.business_details.business_phone_number
                      }
                      onChange={(e) =>
                        setEditBusinessVal({
                          ...editBusinessVal,
                          business_details: {
                            ...editBusinessVal.business_details,
                            business_phone_number: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Business email:</p>
                  <input
                    type="email"
                    className="font-medium outline-none"
                    id="business_email"
                    name="business_email"
                    value={editBusinessVal?.business_details.business_email}
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          business_email: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Business description:</p>
                  <textarea
                    type="text"
                    className="font-medium outline-none"
                    id="business_description"
                    name="business_description"
                    rows={5}
                    value={
                      editBusinessVal?.business_details.business_description
                    }
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          business_description: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 items-center">
                  <p className="">Category:</p>
                  <SelectInput
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          category: e.target.value,
                        },
                      })
                    }
                    options={categoryOptions.map((opt) => ({
                      label: opt,
                      value: opt,
                    }))}
                    value={editBusinessVal.business_details.category}
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 items-center">
                  <p className="">Services:</p>
                  <div className="grid gap-3 w-full">
                    <ul className="grid gap-3">
                      {editBusinessVal?.business_details.services.map(
                        (service, index) => (
                          <li className="flex items-end gap-2" key={index}>
                            <p className="text-lg">{index + 1}.</p>
                            <div className="flex items-center w-full gap-2">
                              <input
                                type="text"
                                name={"services" + index}
                                id={"services" + index}
                                value={service}
                                onChange={(e) => {
                                  let value = e.target.value;
                                  let arr = [
                                    ...editBusinessVal.business_details
                                      .services,
                                  ];
                                  arr.splice(index, 1, value);
                                  setEditBusinessVal({
                                    ...editBusinessVal,
                                    business_details: {
                                      ...editBusinessVal.business_details,
                                      services: arr,
                                    },
                                  });
                                }}
                                className="border-b border-b-gray-400 outline-none text-lg bg-transparent p-2 focus:border-Orange w-full rounded-sm self-center"
                                required
                              />
                              {index + 1 > 3 && (
                                <TiDeleteOutline
                                  onClick={() => {
                                    let arr = [
                                      ...editBusinessVal.business_details
                                        .services,
                                    ];
                                    arr.splice(index, 1),
                                      setEditBusinessVal({
                                        ...editBusinessVal,
                                        business_details: {
                                          ...editBusinessVal.business_details,
                                          services: arr,
                                        },
                                      });
                                  }}
                                  className="text-xl cursor-pointer"
                                />
                              )}
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                    <button
                      type="button"
                      className="underline mr-auto mt-3"
                      onClick={() =>
                        setEditBusinessVal({
                          ...editBusinessVal,
                          business_details: {
                            ...editBusinessVal.business_details,
                            services: [
                              ...editBusinessVal.business_details.services,
                              "",
                            ],
                          },
                        })
                      }
                    >
                      Add more services
                    </button>
                  </div>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Location - address:</p>
                  <input
                    type="text"
                    className="font-medium outline-none"
                    id="address"
                    name="address"
                    value={
                      editBusinessVal?.business_details.business_location
                        .address
                    }
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          business_location: {
                            ...editBusinessVal.business_details
                              .business_location,
                            address: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Location - city:</p>
                  <input
                    type="text"
                    className="font-medium outline-none"
                    id="city"
                    name="city"
                    value={
                      editBusinessVal?.business_details.business_location.city
                    }
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          business_location: {
                            ...editBusinessVal.business_details
                              .business_location,
                            city: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange items-center">
                  <p className="">Location - state:</p>
                  <SelectInput
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          business_location: {
                            ...editBusinessVal.business_details
                              .business_location,
                            state: e.target.value,
                          },
                        },
                      })
                    }
                    options={stateOptions.map((opt) => ({
                      label: opt,
                      value: opt,
                    }))}
                    value={editBusinessVal.business_details.business_location.state?.replace(
                      "_",
                      " "
                    )}
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Location - postal code:</p>
                  <input
                    type="text"
                    className="font-medium outline-none"
                    id="postal_code"
                    name="postal_code"
                    value={
                      editBusinessVal?.business_details.business_location
                        .postal_code
                    }
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          business_location: {
                            ...editBusinessVal.business_details
                              .business_location,
                            postal_code: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Turnover:</p>
                  <NumberInput
                    name="turnover"
                    onBlur={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          financial_details: {
                            ...editBusinessVal.business_details
                              .financial_details,
                            turnover: e.target.value.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            ),
                          },
                        },
                      })
                    }
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          financial_details: {
                            ...editBusinessVal.business_details
                              .financial_details,
                            turnover: e.target.value,
                          },
                        },
                      })
                    }
                    onFocus={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          financial_details: {
                            ...editBusinessVal.business_details
                              .financial_details,
                            turnover: e.target.value.replaceAll(",", ""),
                          },
                        },
                      })
                    }
                    value={
                      editBusinessVal?.business_details.financial_details
                        .turnover
                    }
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Net profit:</p>
                  <NumberInput
                    name="net_profit"
                    onBlur={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          financial_details: {
                            ...editBusinessVal.business_details
                              .financial_details,
                            net_profit: e.target.value.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            ),
                          },
                        },
                      })
                    }
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          financial_details: {
                            ...editBusinessVal.business_details
                              .financial_details,
                            net_profit: e.target.value,
                          },
                        },
                      })
                    }
                    onFocus={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          financial_details: {
                            ...editBusinessVal.business_details
                              .financial_details,
                            net_profit: e.target.value.replaceAll(",", ""),
                          },
                        },
                      })
                    }
                    value={
                      editBusinessVal?.business_details.financial_details
                        .net_profit
                    }
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange items-center">
                  <p className="">Property type:</p>
                  <SelectInput
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          property_details: {
                            ...editBusinessVal.business_details
                              .property_details,
                            type: e.target.value,
                          },
                        },
                      })
                    }
                    options={propertyOptions.map((opt) => ({
                      label: opt,
                      value: opt,
                    }))}
                    value={
                      editBusinessVal.business_details.property_details.type
                    }
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Rent:</p>
                  <NumberInput
                    name="rent"
                    onBlur={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          property_details: {
                            ...editBusinessVal.business_details
                              .property_details,
                            rent: e.target.value.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            ),
                          },
                        },
                      })
                    }
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          property_details: {
                            ...editBusinessVal.business_details
                              .property_details,
                            rent: e.target.value,
                          },
                        },
                      })
                    }
                    onFocus={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        business_details: {
                          ...editBusinessVal.business_details,
                          property_details: {
                            ...editBusinessVal.business_details
                              .property_details,
                            rent: e.target.value.replaceAll(",", ""),
                          },
                        },
                      })
                    }
                    value={
                      editBusinessVal?.business_details.property_details.rent
                    }
                  />
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 focus-within:border-b-Orange">
                  <p className="">Asking price:</p>
                  <NumberInput
                    name="asking_price"
                    onBlur={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        asking_price: e.target.value.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        ),
                      })
                    }
                    onChange={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        asking_price: e.target.value,
                      })
                    }
                    onFocus={(e) =>
                      setEditBusinessVal({
                        ...editBusinessVal,
                        asking_price: e.target.value.replaceAll(",", ""),
                      })
                    }
                    value={editBusinessVal?.asking_price}
                  />
                </div>
              </div>
            </div>
            <div className="grid md:flex gap-3">
              <AppButtons
                className="bg-Blue text-White rounded-sm px-10 disabled:opacity-60"
                label={isLoading ? "Saving changes..." : "Save changes"}
                isDisabled={
                  isLoading ||
                  deepEqual(
                    {
                      listing_details: {
                        listing_title:
                          businessDetResult?.listing_details.listing_title,
                        listing_summary:
                          businessDetResult?.listing_details.listing_summary,
                        images: businessDetResult?.listing_details.images.map(
                          (image) => ({
                            url: image,
                            new: false,
                            delete: false,
                          })
                        ),
                      },
                      business_details: {
                        business_name:
                          businessDetResult?.business_details.business_name,
                        business_phone_number:
                          businessDetResult?.business_details.business_phone_number
                            .toString()
                            .replace(/^234+(?!$)/g, 0),
                        business_email:
                          businessDetResult?.business_details.business_email,
                        business_description:
                          businessDetResult?.business_details
                            .business_description,
                        category: businessDetResult?.business_details.category,
                        business_location: {
                          address:
                            businessDetResult?.business_details
                              .business_location.address,
                          city: businessDetResult?.business_details
                            .business_location.city,
                          postal_code:
                            businessDetResult?.business_details
                              .business_location.postal_code,
                          state:
                            businessDetResult?.business_details
                              .business_location.state,
                        },
                        financial_details: {
                          turnover:
                            businessDetResult?.business_details.financial_details.turnover.toLocaleString(),
                          net_profit:
                            businessDetResult?.business_details.financial_details.net_profit.toLocaleString(),
                        },
                        property_details: {
                          type: businessDetResult?.business_details
                            .property_details.type,
                          rent: businessDetResult?.business_details.property_details.rent.toLocaleString(),
                        },
                      },
                      status: businessDetResult?.status,
                      asking_price:
                        businessDetResult?.asking_price.toLocaleString(),
                    },
                    editBusinessVal
                  )
                }
              />
              {/* <AppButtons
                  className="bg-Orange text-White rounded-sm"
                  label="Delete Listing"
                  type="button"
                  onClick={() => setDeleteConfirm(true)}
                /> */}
            </div>
          </form>
        ) : (
          isBusinessDetError && (
            <p className="text-center text-gray-500 py-28 md:py-72 text-lg">
              {BusinessDetError.data}
            </p>
          )
        )}
      </div>

      {/* <AppModalBox show={deleteConfirm}>
        <div className="space-y-5">
          <PiWarning className="text-[5rem] mx-auto text-red-500" />
          <p className="text-3xl text-center font-bold">Are you sure?</p>
          <p className="text-xl text-center w-3/4 mx-auto">
            This action cannot be undone. All values associated with this
            business listing will be lost.
          </p>
          <div className="grid gap-2">
            <AppButtons
              className="bg-red-500 border border-red-500 rounded-sm text-White w-full hover:border-red-500 hover:bg-White hover:text-red-500 transition px-32"
              label={deletingBusiness ? "Deleting..." : "Delete listing"}
              onClick={handleDeleteBusiness}
            />
            <AppButtons
              className="rounded-sm text-Blue w-full hover:border-Blue hover:bg-White hover:text-Blue transition"
              type="button"
              onClick={() => setDeleteConfirm(false)}
              label="Cancel"
            />
          </div>
        </div>
      </AppModalBox> */}
    </section>
  );
}
