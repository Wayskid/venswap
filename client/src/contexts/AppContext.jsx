import { createContext, useState } from "react";
import { GetCookie } from "../hooks/cookies";
import { useSocket } from "./SocketProvider";

const appContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(GetCookie("User") || "false") || {}
  );
  const [token, setToken] = useState(
    JSON.parse(GetCookie("Token") || "false") || ""
  );

  //Format currency
  const formatter = new Intl.NumberFormat("en-Ng", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  });

  //Convert image to base64
  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const statesOfBusiness = ["Available", "Under negotiation", "Sold"];
  const categoryOptions = [
    "Automotive",
    "Supplies",
    "Computers",
    "Construction",
    "Education",
    "Entertainment",
    "Food",
    "Health",
    "Home",
    "Legal",
    "Manufacturing",
    "Merchants",
    "Miscellaneous",
    "Care",
    "Estate",
    "Travel",
  ];
  const stateOptions = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];
  const propertyOptions = ["Freehold", "Leasehold", "Relocatable"];

  return (
    <appContext.Provider
      value={{
        userInfo,
        setUserInfo,
        token,
        setToken,
        formatter,
        convertToBase64,
        statesOfBusiness,
        categoryOptions,
        stateOptions,
        propertyOptions,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default appContext;
