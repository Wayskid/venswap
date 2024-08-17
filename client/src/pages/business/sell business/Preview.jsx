import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import appContext from "../../../contexts/AppContext";
import { useDispatch, useSelector } from "react-redux";
import AppButtons from "../../../components/reuseable/AppButtons";
import {
  useCreateBusinessMutation,
  useGetSecureLinkMutation,
  useGetSignedCloudinaryMutation,
} from "../../../services/appApi";
import { useSocket } from "../../../contexts/SocketProvider";
import moment from "moment";
import axios from "axios";
import { clearSellBusiness } from "../../../store/features/appSlice";
import { Buffer } from "buffer";

export default function Preview() {
  const navigate = useNavigate();
  const {
    userInfo: {
      first_name,
      last_name,
      user_verifications: {
        email: { content: email },
        phone: { content: phone_number },
      },
      _id,
    },
    token,
  } = useContext(appContext);
  const {
    listingProtocols,
    sellBusiness: {
      listing_details: { listing_title, listing_summary, images },
      business_details: {
        business_name,
        business_phone_number,
        business_email,
        business_description,
        category,
        services,
        business_location: { address, LGA, city, postal_code, state },
        financial_details: { turnover, net_profit },
        property_details: { type, rent },
      },
      business_documents: {
        CAC_certificate: { company_reg_no, date_of_reg, doc_file },
        // financial_statement,
        // property_details,
      },
      asking_price,
      status,
    },
  } = useSelector((state) => state.app);

  useEffect(() => {
    if (!listingProtocols.preview) {
      navigate("/sell_business");
    }
  }, []);

  const { socket } = useSocket();
  const [createBusinessAPI] = useCreateBusinessMutation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [getSignedCloudinary, { isLoading: uploadingImages }] =
    useGetSignedCloudinaryMutation();
  const [getSecureLinkApi] = useGetSecureLinkMutation();

  async function handlePublish() {
    setIsLoading(true);

    if (doc_file.length > 0) {
      //Only CAC
      const documents = [{ type: "CAC", content: doc_file }];

      async function getSignedUrl() {
        return new Promise((resolve, reject) => {
          getSecureLinkApi({
            token,
            body: { key: business_name.replaceAll(" ", "_") },
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
          arr.push({ type: item.type, doc: item.content, signedUrl });
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
              filesArr.push({
                type: item.type,
                content: item.signedUrl.split("?")[0],
              });
            });
          }
        });
        return filesArr;
      }

      uploadFiles().then(async (result) => {
        const files = [...result];
        const { data: signData } = await getSignedCloudinary({
          token,
          body: {
            folder:
              import.meta.env.VITE_CLOUDINARY_LISTING_FOLDER +
              "/" +
              business_name.replace(/[^a-zA-Z ]/g, ""),
            tags: business_name.replace(/[^a-zA-Z ]/g, ""),
          },
        });
        const formData = new FormData();

        async function imgArray() {
          const imgArray = [];
          for (let i = 0; i < images.length; i++) {
            let image = images[i];
            formData.append("file", image);
            formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
            formData.append("timestamp", signData.timestamp);
            formData.append("signature", signData.signature);
            formData.append(
              "folder",
              import.meta.env.VITE_CLOUDINARY_LISTING_FOLDER +
                "/" +
                business_name.replace(/[^a-zA-Z ]/g, "")
            );
            formData.append("tags", business_name.replace(/[^a-zA-Z ]/g, ""));

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
          createBusinessAPI({
            token,
            body: {
              listing_details: {
                listing_title,
                listing_summary,
                images: res,
              },
              business_details: {
                business_name,
                business_phone_number,
                business_email,
                business_description,
                category,
                services,
                business_location: { address, LGA, city, postal_code, state },
                financial_details: { turnover, net_profit },
                property_details: { type, rent },
              },
              business_documents: {
                CAC_certificate: {
                  company_reg_no: company_reg_no ?? "",
                  date_of_reg: date_of_reg ?? "",
                  doc_file: files.find((file) => file.type === "CAC").content,
                },
                // financial_statement: files.find(
                //   (file) => file.type === "Finance"
                // ).content,
                // property_details: files.find((file) => file.type === "Property")
                //   .content,
              },
              asking_price,
              status,
            },
            seller_id: _id,
          })
            .unwrap()
            .then((newBusiness) => {
              socket.emit("new_business", newBusiness);
              setIsLoading(false);
              dispatch(clearSellBusiness());
              navigate(`/sell_business/success/${newBusiness._id}`);
            });
        });
      });
    } else {
      //No document
      const { data: signData } = await getSignedCloudinary({
        token,
        body: {
          folder:
            import.meta.env.VITE_CLOUDINARY_LISTING_FOLDER +
            "/" +
            business_name.replace(/[^a-zA-Z ]/g, ""),
          tags: business_name.replace(/[^a-zA-Z ]/g, ""),
        },
      });
      const formData = new FormData();

      async function imgArray() {
        const imgArray = [];
        for (let i = 0; i < images.length; i++) {
          let image = images[i];
          formData.append("file", image);
          formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
          formData.append("timestamp", signData.timestamp);
          formData.append("signature", signData.signature);
          formData.append(
            "folder",
            import.meta.env.VITE_CLOUDINARY_LISTING_FOLDER +
              "/" +
              business_name.replace(/[^a-zA-Z ]/g, "")
          );
          formData.append("tags", business_name.replace(/[^a-zA-Z ]/g, ""));

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
        createBusinessAPI({
          token,
          body: {
            listing_details: {
              listing_title,
              listing_summary,
              images: res,
            },
            business_details: {
              business_name,
              business_phone_number,
              business_email,
              business_description,
              category,
              services,
              business_location: { address, LGA, city, postal_code, state },
              financial_details: { turnover, net_profit },
              property_details: { type, rent },
            },
            business_documents: {
              CAC_certificate: {
                company_reg_no: "",
                date_of_reg: "",
                doc_file: "Not uploaded",
              },
            },
            asking_price,
            status,
          },
          seller_id: _id,
        })
          .unwrap()
          .then((newBusiness) => {
            socket.emit("new_business", newBusiness);
            setIsLoading(false);
            dispatch(clearSellBusiness());
            navigate(`/sell_business/success/${newBusiness._id}`);
          });
      });
    }
  }

  return (
    listingProtocols.preview && (
      <section className="bg-White">
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 space-y-7">
          <p className="font-medium text-3xl">Preview</p>
          <div className="space-y-7">
            <div className="border-b pb-5">
              <p className="font-medium text-xl mb-4">Your details</p>
              <div className="space-y-3 text-lg *:border-b *:py-2">
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">First name:</p>
                  <p className="font-medium">{first_name}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Last name:</p>
                  <p className="font-medium">{last_name}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Phone number:</p>
                  <p className="font-medium">+234{phone_number}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 !border-none">
                  <p className="">Email:</p>
                  <p className="font-medium">{email}</p>
                </div>
              </div>
              <button
                className="underline mt-4"
                onClick={() => navigate("../../account/settings")}
              >
                Edit your details
              </button>
            </div>
            <div className="border-b pb-5">
              <p className="font-medium text-xl mb-4">Listing details</p>
              <div className="space-y-3 text-lg *:border-b *:py-2">
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Listing title:</p>
                  <p className="font-medium">{listing_title}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Listing summary:</p>
                  <p className="font-medium">{listing_summary}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Status of business:</p>
                  <p className="font-medium">{status}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 !border-none">
                  <p className="">Images:</p>
                  <div className="font-medium grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images?.map((image, index) => (
                      <img
                        key={index}
                        className="w-full h-36 object-cover border"
                        src={image}
                      ></img>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className="underline mt-4"
                onClick={() => navigate("/sell_business/build_listing")}
              >
                Edit listing details
              </button>
            </div>
            <div className="border-b pb-5">
              <p className="font-medium text-xl mb-4">Business details</p>
              <div className="space-y-3 text-lg *:border-b *:py-2">
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Business name:</p>
                  <p className="font-medium">{business_name}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Business phone:</p>
                  <p className="font-medium">+234{business_phone_number}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Business email:</p>
                  <p className="font-medium">{business_email}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Business description:</p>
                  <p className="font-medium">{business_description}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Category:</p>
                  <p className="font-medium">{category}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Services:</p>
                  <div className="grid gap-3">
                    {services.map((service, index) => (
                      <div className="flex gap-2" key={index}>
                        <p className="font-semibold">{index + 1}.</p>
                        <p className="">{service}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Location - address:</p>
                  <p className="font-medium">{address}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Location - LGA:</p>
                  <p className="font-medium">{LGA}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Location - city, state:</p>
                  <p className="font-medium">
                    {city}, {state.replace("_", " ")}
                  </p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Location - postal code:</p>
                  <p className="font-medium">{postal_code}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Turnover:</p>
                  <p className="font-medium">&#8358; {turnover}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Net profit:</p>
                  <p className="font-medium">&#8358; {net_profit}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Property type:</p>
                  <p className="font-medium">{type}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Rent:</p>
                  <p className="font-medium">&#8358; {rent}</p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 !border-none">
                  <p className="">Asking price:</p>
                  <p className="font-medium">&#8358; {asking_price}</p>
                </div>
              </div>
              <button
                className="underline mt-4"
                onClick={() => navigate("/sell_business/business_details")}
              >
                Edit business details
              </button>
            </div>
            <div className="pb-5">
              <p className="font-medium text-xl mb-4">Business documents</p>
              <div className="space-y-3 text-lg *:border-b *:py-2">
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">CAC certificate:</p>
                  <p className="font-medium">
                    {doc_file.length > 0
                      ? "Uploaded successfully"
                      : "Not uploaded yet"}
                  </p>
                </div>
                {doc_file.length > 0 && (
                  <>
                    <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                      <p className="">Company reg no.:</p>
                      <p className="font-medium">{company_reg_no}</p>
                    </div>
                    <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                      <p className="">Date of registration:</p>
                      <p className="font-medium">
                        {moment(date_of_reg).format("Do MMM YYYY")}
                      </p>
                    </div>
                  </>
                )}
                {/* <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10">
                  <p className="">Financial statement:</p>
                  <p className="font-medium">
                    {financial_statement.length > 0
                      ? "Uploaded successfully"
                      : "Not uploaded yet"}
                  </p>
                </div>
                <div className="grid gap-1 sm:grid-cols-[1fr,2fr] md:grid-cols-[1fr,3fr] sm:gap-10 !border-none">
                  <p className="">Property details:</p>
                  <p className="font-medium">
                    {property_details.length > 0
                      ? "Uploaded successfully"
                      : "Not uploaded yet"}
                  </p>
                </div> */}
              </div>
              <button
                className="underline mt-4"
                onClick={() => navigate("/sell_business/business_docs")}
              >
                Edit business documents
              </button>
            </div>
            <div className="grid md:flex gap-3">
              <AppButtons
                className="bg-Blue text-White rounded-sm px-10 disabled:opacity-60"
                label={
                  uploadingImages
                    ? "Uploading images..."
                    : isLoading
                    ? "Publishing..."
                    : "Publish listing"
                }
                isDisabled={uploadingImages || isLoading}
                onClick={handlePublish}
              />
              {/* <AppButtons
                className="bg-Orange text-White rounded-sm"
                label="Save and continue Later"
                type="button"
              /> */}
            </div>
          </div>
        </div>
      </section>
    )
  );
}
