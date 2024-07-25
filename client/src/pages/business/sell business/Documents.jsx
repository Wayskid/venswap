import React, { useContext, useEffect, useState } from "react";
import AppButtons from "../../../components/reuseable/AppButtons";
import { setProtocol, setSellBusiness } from "../../../store/features/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import appContext from "../../../contexts/AppContext";

export default function Documents() {
  const {
    listingProtocols,
    sellBusiness: { business_documents },
  } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { convertToBase64 } = useContext(appContext);
  const [showAlert, setShowAlert] = useState(false);

  const [businessDocsVal, setBusinessDocsVal] = useState(
    business_documents ?? {
      CAC_certificate: {
        company_reg_no: "",
        date_of_reg: null,
        doc_file: "",
      },
      // financial_statement: "",
      // property_details: "",
    }
  );

  console.log(businessDocsVal);
  useEffect(() => {
    if (!listingProtocols.documents) {
      navigate("/sell_business");
    }
  }, []);

  async function handleCACFileChange(e) {
    const doc = e.target.files[0];
    if (doc.size > 30971520) {
      setFileUploadErr("Size of this file is too big");
      setTimeout(() => {
        setFileUploadErr("");
      }, 6000);
    } else {
      const promise = await convertToBase64(doc);
      setBusinessDocsVal({
        ...businessDocsVal,
        CAC_certificate: {
          ...businessDocsVal.CAC_certificate,
          doc_file: promise,
        },
      });
    }
  }

  // async function handleFileChange(e) {
  //   const doc = e.target.files[0];
  //   if (doc.size > 30971520) {
  //     setFileUploadErr("Size of this file is too big");
  //     setTimeout(() => {
  //       setFileUploadErr("");
  //     }, 6000);
  //   } else {
  //     const promise = await convertToBase64(doc);
  //     setBusinessDocsVal({
  //       ...businessDocsVal,
  //       [e.target.name]: promise,
  //     });
  //   }
  // }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(
      setSellBusiness({
        objKey: "business_documents",
        newObj: businessDocsVal,
      })
    );
    dispatch(setProtocol({ protocolKey: "preview", protocol: true }));
    navigate("/sell_business/preview");
  }

  const notCompletedForm = Object.values(businessDocsVal.CAC_certificate).some(
    (val) => val?.length < 1
  );

  return (
    listingProtocols.documents && (
      <section className="bg-White">
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 space-y-7">
          <p className="font-medium text-3xl">Documents upload</p>
          <p className="">
            Your documents are securely stored and protected with us. We
            guarantee confidentiality and utilize state-of-the-art security
            measures to ensure their integrity. Additionally, your documents
            will not be shared or disclosed to any other users or third parties.
          </p>
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="">
              <p className="text-lg font-medium">CAC certificate</p>
              <div className="grid md:flex items-center gap-4">
                <div className="w-full md:w-2/3 relative space-y-4">
                  <div className="relative">
                    <input
                      type="file"
                      name="CAC"
                      id="CAC"
                      accept="application/pdf"
                      className="opacity-0 absolute w-full h-full cursor-pointer"
                      onChange={handleCACFileChange}
                    />
                    <label
                      htmlFor="CAC"
                      className="border border-gray-400 grid grid-cols-[1fr,auto]"
                    >
                      <div
                        className={`grid place-content-center text-lg ${
                          businessDocsVal.CAC_certificate.doc_file
                            ? "bg-[#55e37416]"
                            : ""
                        }`}
                      >
                        {businessDocsVal.CAC_certificate.doc_file ? (
                          <div className="flex items-center gap-2">
                            Upload successful
                            <FaCheck className="text-green-700" />
                          </div>
                        ) : (
                          "Upload a pdf file. Max size 20mb"
                        )}
                      </div>
                      <button
                        className={`text-lg p-3 text-White ${
                          businessDocsVal.CAC_certificate.doc_file
                            ? "bg-green-700"
                            : "bg-gray-700"
                        }`}
                      >
                        {businessDocsVal.CAC_certificate.doc_file
                          ? "Change file"
                          : "Choose file"}
                      </button>
                    </label>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid">
                      <label
                        htmlFor="company_reg_no"
                        className="text-lg font-medium"
                      >
                        Company registration number
                      </label>
                      <input
                        type="number"
                        name="company_reg_no"
                        id="company_reg_no"
                        value={businessDocsVal.CAC_certificate.company_reg_no}
                        onChange={(e) =>
                          setBusinessDocsVal({
                            ...businessDocsVal,
                            CAC_certificate: {
                              ...businessDocsVal.CAC_certificate,
                              company_reg_no: e.target.value,
                            },
                          })
                        }
                        className="border border-gray-400 outline-none text-lg bg-transparent p-2 md:p-3 focus:border-Orange rounded-sm w-full shrink-0 self-center"
                        // required
                      />
                    </div>
                    <div className="grid">
                      <label
                        htmlFor="date_of_reg"
                        className="text-lg font-medium"
                      >
                        Registration date
                      </label>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          format="DD-MM-YYYY"
                          value={moment(
                            businessDocsVal.CAC_certificate.date_of_reg,
                            "DD-MM-YYYY"
                          )}
                          onChange={(value) =>
                            setBusinessDocsVal({
                              ...businessDocsVal,
                              CAC_certificate: {
                                ...businessDocsVal.CAC_certificate,
                                date_of_reg: value,
                              },
                            })
                          }
                          slotProps={{
                            textField: {
                              required: false,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
                <p className="text-sm self-center text-gray-600 ">
                  Upload your CAC certificate. This is optional.
                </p>
              </div>
            </div>
            {/* <div className="">
              <p className="text-lg font-medium">Financial statements</p>
              <div className="grid md:flex items-center gap-4">
                <div className="w-full md:w-2/3 relative">
                  <input
                    type="file"
                    name="financial_statement"
                    id="financial_statement"
                    accept="application/pdf"
                    className="cursor-pointer opacity-0 absolute w-full h-full"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="property_details"
                    className="border border-gray-400 grid grid-cols-[1fr,auto]"
                  >
                    <div
                      className={`grid place-content-center text-lg ${
                        businessDocsVal.financial_statement
                          ? "bg-[#55e37416]"
                          : ""
                      }`}
                    >
                      {businessDocsVal.financial_statement ? (
                        <div className="flex items-center gap-2">
                          Upload successful
                          <FaCheck className="text-green-700" />
                        </div>
                      ) : (
                        "Upload a pdf file. Max size 20mb"
                      )}
                    </div>
                    <button
                      className={`text-lg p-3 text-White ${
                        businessDocsVal.financial_statement
                          ? "bg-green-700"
                          : "bg-gray-700"
                      }`}
                    >
                      {businessDocsVal.financial_statement
                        ? "Change file"
                        : "Choose file"}
                    </button>
                  </label>
                </div>
                <p className="text-sm self-center text-gray-600 ">
                  Upload your business bank statements.
                </p>
              </div>
            </div>
            <div className="">
              <p className="text-lg font-medium">Property details</p>
              <div className="grid md:flex items-center gap-4">
                <div className="w-full md:w-2/3 relative">
                  <input
                    type="file"
                    name="property_details"
                    id="property_details"
                    accept="application/pdf"
                    className="cursor-pointer opacity-0 absolute w-full h-full"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="property_details"
                    className="border border-gray-400 grid grid-cols-[1fr,auto]"
                  >
                    <div
                      className={`grid place-content-center text-lg ${
                        businessDocsVal.property_details ? "bg-[#55e37416]" : ""
                      }`}
                    >
                      {businessDocsVal.property_details ? (
                        <div className="flex items-center gap-2">
                          Upload successful
                          <FaCheck className="text-green-700" />
                        </div>
                      ) : (
                        "Upload a pdf file. Max size 20mb"
                      )}
                    </div>
                    <button
                      className={`text-lg p-3 text-White ${
                        businessDocsVal.property_details
                          ? "bg-green-700"
                          : "bg-gray-700"
                      }`}
                    >
                      {businessDocsVal.property_details
                        ? "Change file"
                        : "Choose file"}
                    </button>
                  </label>
                </div>
                <p className="text-sm self-center text-gray-600 ">
                  Upload your property details.
                </p>
              </div>
            </div> */}
            {showAlert && notCompletedForm && (
              <p className="text-red-400 text-center md:text-left text-sm">
                You have not completed the compulsory parts of the form
              </p>
            )}
            <div className="grid md:flex gap-3">
              <div className="grid relative">
                {/* {notCompletedForm && (
                  <button
                    type="button"
                    className="w-full h-full absolute z-10 cursor-default"
                    onClick={() => {
                      if (notCompletedForm) setShowAlert(true);
                    }}
                  ></button>
                )} */}
                <AppButtons
                  className="bg-Blue text-White rounded-sm px-10 disabled:opacity-75"
                  label="Preview listing"
                  // isDisabled={notCompletedForm}
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
    // <p className="text-5xl">Coming SOon...</p>
  );
}
