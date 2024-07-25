import React, { useContext, useEffect, useState } from "react";
import AppButtons from "../../../components/reuseable/AppButtons";
import { setProtocol, setSellBusiness } from "../../../store/features/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ListingInput from "../../../components/reuseable/ListingInput";
import appContext from "../../../contexts/AppContext";
import SelectInput from "../../../components/reuseable/SelectInput";
import { TiDeleteOutline } from "react-icons/ti";
import FormSection from "../../../components/reuseable/FormSection";

export default function Details() {
  const {
    listingProtocols,
    sellBusiness: { business_details, asking_price },
  } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const { categoryOptions, stateOptions, propertyOptions } =
    useContext(appContext);
  const [businessDetailsVal, setBusinessDetailsVal] = useState(
    business_details ?? {
      business_name: "",
      business_phone_number: "",
      business_email: "",
      business_description: "",
      category: "",
      services: ["", "", ""],
      business_location: {
        address: "",
        LGA: "",
        city: "",
        postal_code: "",
        state: "",
        country: "Nigeria",
      },
      financial_details: {
        turnover: "",
        net_profit: "",
      },
      property_details: {
        type: "",
        rent: 0,
      },
    }
  );
  useEffect(() => {
    if (!listingProtocols.business_details) {
      navigate("/sell_business");
    }
  }, []);

  function handleChange(e) {
    setBusinessDetailsVal({
      ...businessDetailsVal,
      [e.target.name]: e.target.value,
    });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (
      businessDetailsVal.business_name.length > 0 &&
      businessDetailsVal.business_phone_number.length > 0 &&
      businessDetailsVal.business_email.length > 0 &&
      businessDetailsVal.business_description.length > 0 &&
      businessDetailsVal.category.length > 0 &&
      businessDetailsVal.services.length > 2 &&
      Object.values(businessDetailsVal.business_location).every(
        (val) => val.length > 0
      ) &&
      Object.values(businessDetailsVal.property_details).every(
        (val) => val.length > 0
      ) &&
      asking_price.length > 0
    ) {
      dispatch(
        setSellBusiness({
          objKey: "business_details",
          newObj: businessDetailsVal,
        })
      );
      dispatch(setProtocol({ protocolKey: "documents", protocol: true }));
      navigate("/sell_business/business_docs");
    }
  }

  const notCompletedForm =
    Object.values(businessDetailsVal).some((val) => val.length < 1) ||
    Object.values(businessDetailsVal.business_location).some(
      (val) => val.length < 1
    ) ||
    Object.values(businessDetailsVal.property_details).some(
      (val) => val?.length < 1
    ) ||
    asking_price.length < 1;

  return (
    listingProtocols.business_details && (
      <section className="bg-White">
        <div className="w-[min(92rem,100%)] mx-auto px-4 md:px-12 lg:px-32 pt-10 pb-16 space-y-7">
          <p className="font-medium text-3xl">
            Input details about your business
          </p>
          <form onSubmit={handleSubmit} className="">
            <ListingInput
              guide="Please type in the business name as it appears on your business
                certificate"
              type="text"
              name="business_name"
              id="business_name"
              label="Business name"
              onChange={handleChange}
              value={businessDetailsVal.business_name}
              required={true}
            />
            <FormSection
              guide="Input your 11 digit business phone number."
              className="items-center"
            >
              <label
                htmlFor="business_phone_number"
                className="text-lg font-medium"
              >
                Business phone Number
              </label>
              <div className="border border-gray-400 p-2 flex items-center rounded-sm focus-within:border-Orange w-full">
                <p className="text-lg">+234</p>
                <input
                  type="number"
                  name="business_phone_number"
                  id="business_phone_number"
                  className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 focus:border-Blue rounded-sm w-full"
                  onChange={handleChange}
                  value={businessDetailsVal.business_phone_number}
                  maxLength={11}
                  required
                />
              </div>
            </FormSection>
            <ListingInput
              guide="Input valid business email"
              type="email"
              name="business_email"
              id="business_email"
              label="Business email"
              onChange={handleChange}
              value={businessDetailsVal.business_email}
              required={true}
            />
            <FormSection
              guide="Give a short description of the business you want to list.
                  Avoid sharing sensitive information."
              className="items-center"
            >
              <label
                htmlFor="business_description"
                className="text-lg font-medium"
              >
                Business description
              </label>
              <textarea
                name="business_description"
                id="business_description"
                rows={5}
                value={businessDetailsVal.business_description}
                onChange={handleChange}
                className="border border-gray-400 outline-none text-lg bg-transparent p-2 focus:border-Orange rounded-sm w-full shrink-0"
                required
              />
            </FormSection>
            <FormSection
              guide="Please select the category that best describes your business. This will help potential buyers quickly find your listing. - Choose a category from the dropdown list. - Select the category that most closely aligns with your business's primary activity or industry."
              className="items-center"
            >
              <label htmlFor="category" className="text-lg font-medium">
                Choose category
              </label>
              <div className="">
                <SelectInput
                  options={categoryOptions.map((opt) => ({
                    label: opt,
                    value: opt,
                  }))}
                  value={businessDetailsVal.category}
                  onChange={(e) =>
                    setBusinessDetailsVal({
                      ...businessDetailsVal,
                      category: e.target.value,
                    })
                  }
                  placeholder="Select category"
                  required={true}
                />
              </div>
            </FormSection>
            <FormSection
              guide={`Please enter the services that your business offers to customers in the fields provided - Be specific and concise (e.g. "Web Design", "Accounting Services", "Event Planning"). - Be accurate and only list services that your business currently offers. - You must enter at least three services to proceed.`}
              className="items-center"
            >
              <p className="text-lg font-medium">Services</p>
              <div className="grid gap-3">
                <ul className="grid gap-3">
                  {businessDetailsVal.services.map((service, index) => (
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
                            let arr = [...businessDetailsVal.services];
                            arr.splice(index, 1, value);
                            setBusinessDetailsVal({
                              ...businessDetailsVal,
                              services: arr,
                            });
                          }}
                          className="border-b border-b-gray-400 outline-none text-lg bg-transparent p-2 focus:border-Orange w-full rounded-sm self-center"
                          required
                        />
                        {index + 1 > 3 && (
                          <TiDeleteOutline
                            onClick={(e) => {
                              let arr = [...businessDetailsVal.services];
                              arr.splice(index, 1),
                                setBusinessDetailsVal({
                                  ...businessDetailsVal,
                                  services: arr,
                                });
                            }}
                            className="text-xl cursor-pointer"
                          />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="underline mr-auto mt-3"
                  onClick={() =>
                    setBusinessDetailsVal({
                      ...businessDetailsVal,
                      services: [...businessDetailsVal.services, ""],
                    })
                  }
                >
                  Add more services
                </button>
              </div>
            </FormSection>
            <FormSection guide="Please provide the following information to help us identify the location of your business: - Address: Enter the physical address of your business. - LGA: Enter the Local Govt. Area where your business is located - City: Enter the city where your business is located. - State: Select the state where your business is located. - Postcode: Enter the postcode or zip code of your business. Note: Only the city and state will be visible to potential buyers. The address will be kept confidential for security purposes.">
              <p className="font-bold mb-3">Business location</p>
              <div className="grid gap-4">
                <div className="grid">
                  <label htmlFor="address" className="text-lg font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    name="business_location.address"
                    id="business_location.address"
                    value={businessDetailsVal.business_location.address}
                    onChange={(e) =>
                      setBusinessDetailsVal({
                        ...businessDetailsVal,
                        business_location: {
                          ...businessDetailsVal.business_location,
                          address: e.target.value,
                        },
                      })
                    }
                    className="border border-gray-400 outline-none text-lg bg-transparent p-2 focus:border-Orange rounded-sm w-full self-center"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid">
                    <label htmlFor="LGA" className="text-lg font-medium">
                      LGA
                    </label>
                    <input
                      type="text"
                      name="business_location.LGA"
                      id="business_location.LGA"
                      value={businessDetailsVal.business_location.LGA}
                      onChange={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          business_location: {
                            ...businessDetailsVal.business_location,
                            LGA: e.target.value,
                          },
                        })
                      }
                      className="border border-gray-400 outline-none text-lg bg-transparent p-2 focus:border-Orange rounded-sm w-full self-center"
                      required
                    />
                  </div>
                  <div className="grid">
                    <label htmlFor="city" className="text-lg font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={businessDetailsVal.business_location.city}
                      onChange={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          business_location: {
                            ...businessDetailsVal.business_location,
                            city: e.target.value,
                          },
                        })
                      }
                      className="border border-gray-400 outline-none text-lg bg-transparent p-2 focus:border-Orange rounded-sm w-full self-center"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="grid">
                    <label htmlFor="state" className="text-lg font-medium">
                      State
                    </label>
                    <SelectInput
                      options={stateOptions.map((opt) => ({
                        label: opt,
                        value: opt,
                      }))}
                      value={businessDetailsVal.business_location.state?.replace(
                        "_",
                        " "
                      )}
                      placeholder="Select state"
                      onChange={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          business_location: {
                            ...businessDetailsVal.business_location,
                            state: e.target.value?.replace(" ", "_"),
                          },
                        })
                      }
                      required={true}
                    />
                  </div>
                  <div className="grid">
                    <label
                      htmlFor="postal_code"
                      className="text-lg font-medium"
                    >
                      Postal code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      id="postal_code"
                      value={businessDetailsVal.business_location.postal_code}
                      onChange={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          business_location: {
                            ...businessDetailsVal.business_location,
                            postal_code: e.target.value,
                          },
                        })
                      }
                      className="border border-gray-400 outline-none text-lg bg-transparent p-2 focus:border-Orange rounded-sm w-full self-center"
                      required
                    />
                  </div>
                </div>
              </div>
            </FormSection>
            <FormSection guide="To help us better understand your business and attract potential buyers, please provide the following financial information: - Annual Revenue: Enter your business's total annual income before taxes and expenses. - Annual Net Profit: Enter your business's annual net profit after taxes and expenses.">
              <p className="font-bold mb-3">Financial Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid">
                  <label htmlFor="turnover" className="text-lg font-medium">
                    Annual revenue
                  </label>
                  <div className="border border-gray-400 p-2 flex items-center rounded-sm focus-within:border-Orange w-full">
                    <p className="text-lg">&#8358;</p>
                    <input
                      type="text"
                      id="turnover"
                      name="turnover"
                      className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 focus:border-Blue rounded-sm w-full"
                      value={businessDetailsVal.financial_details.turnover}
                      onChange={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          financial_details: {
                            ...businessDetailsVal.financial_details,
                            turnover: e.target.value,
                          },
                        })
                      }
                      onBlur={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          financial_details: {
                            ...businessDetailsVal.financial_details,
                            turnover: e.target.value.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            ),
                          },
                        })
                      }
                      onFocus={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          financial_details: {
                            ...businessDetailsVal.financial_details,
                            turnover: e.target.value.replaceAll(",", ""),
                          },
                        })
                      }
                      required
                      pattern="^\d{1,3}(?:,\d{3})*$"
                    />
                  </div>
                </div>
                <div className="grid">
                  <label htmlFor="net_profit" className="text-lg font-medium">
                    Annual Net profit
                  </label>
                  <div className="border border-gray-400 p-2 flex items-center rounded-sm focus-within:border-Orange w-full">
                    <p className="text-lg">&#8358;</p>
                    <input
                      type="text"
                      id="net_profit"
                      name="net_profit"
                      className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 focus:border-Blue rounded-sm w-full"
                      value={businessDetailsVal.financial_details.net_profit}
                      onChange={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          financial_details: {
                            ...businessDetailsVal.financial_details,
                            net_profit: e.target.value,
                          },
                        })
                      }
                      onBlur={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          financial_details: {
                            ...businessDetailsVal.financial_details,
                            net_profit: e.target.value.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            ),
                          },
                        })
                      }
                      onFocus={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          financial_details: {
                            ...businessDetailsVal.financial_details,
                            net_profit: e.target.value.replaceAll(",", ""),
                          },
                        })
                      }
                      required
                      pattern="^\d{1,3}(?:,\d{3})*$"
                    />
                  </div>
                </div>
              </div>
            </FormSection>
            <FormSection
              guide="Freehold – You own the property and the land it's built on for
                as long as you want. Leasehold – You own the property for a set
                period, but not the land it's built on. Relocatable - The
                business is mobile, e.g. online businesses."
            >
              <p className="font-bold mb-3">Property Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid">
                  <label
                    htmlFor="property_type"
                    className="text-lg font-medium"
                  >
                    Property type
                  </label>
                  <SelectInput
                    options={propertyOptions.map((opt) => ({
                      label: opt,
                      value: opt,
                    }))}
                    value={businessDetailsVal.property_details.type}
                    placeholder="Select type"
                    onChange={(e) =>
                      setBusinessDetailsVal({
                        ...businessDetailsVal,
                        property_details: {
                          ...businessDetailsVal.property_details,
                          type: e.target.value,
                        },
                      })
                    }
                    required={true}
                  />
                </div>
                <div className="grid">
                  <label htmlFor="rent" className="text-lg font-medium">
                    Rent
                  </label>
                  <div className="border border-gray-400 p-2 flex items-center rounded-sm focus-within:border-Orange w-full">
                    <p className="text-lg">&#8358;</p>
                    <input
                      type="text"
                      id="rent"
                      name="rent"
                      className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 focus:border-Blue rounded-sm w-full"
                      value={businessDetailsVal.property_details.rent}
                      onChange={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          property_details: {
                            ...businessDetailsVal.property_details,
                            rent: e.target.value,
                          },
                        })
                      }
                      onBlur={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          property_details: {
                            ...businessDetailsVal.property_details,
                            rent: e.target.value.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            ),
                          },
                        })
                      }
                      onFocus={(e) =>
                        setBusinessDetailsVal({
                          ...businessDetailsVal,
                          property_details: {
                            ...businessDetailsVal.property_details,
                            rent: e.target.value.replaceAll(",", ""),
                          },
                        })
                      }
                      required
                      pattern="^\d{1,3}(?:,\d{3})*$"
                    />
                  </div>
                </div>
              </div>
            </FormSection>
            <FormSection
              guide="Setting a realistic asking price for your business is crucial
                  to attract serious buyers, build trust, and ensure a
                  smooth sales process."
            >
              <label htmlFor="asking_price" className="text-lg font-medium">
                Asking price
              </label>
              <div className="border border-gray-400 p-2 flex items-center rounded-sm focus-within:border-Orange w-full shrink-0">
                <p className="text-lg">&#8358;</p>
                <input
                  type="text"
                  id="asking_price"
                  name="asking_price"
                  className="outline-none text-lg bg-transparent placeholder:text-white placeholder:italic placeholder:font-normal focus:placeholder:text-transparent placeholder:transition-all px-2 focus:border-Blue rounded-sm w-full"
                  value={asking_price}
                  onChange={(e) =>
                    dispatch(
                      setSellBusiness({
                        objKey: "asking_price",
                        newObj: e.target.value,
                      })
                    )
                  }
                  onBlur={(e) =>
                    dispatch(
                      setSellBusiness({
                        objKey: "asking_price",
                        newObj: e.target.value.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        ),
                      })
                    )
                  }
                  onFocus={(e) =>
                    dispatch(
                      setSellBusiness({
                        objKey: "asking_price",
                        newObj: e.target.value.replaceAll(",", ""),
                      })
                    )
                  }
                  required
                  pattern="^\d{1,3}(?:,\d{3})*$"
                />
              </div>
            </FormSection>
            {showAlert && notCompletedForm && (
              <p className="text-red-400 text-center md:text-left text-sm pt-8">
                You have not completed the compulsory parts of the form
              </p>
            )}
            <div className="grid md:flex gap-3 py-6">
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
                  className="bg-Blue text-White rounded-sm px-10 disabled:opacity-60"
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
