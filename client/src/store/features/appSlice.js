import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  listingProtocols: {
    setup: true,
    build_listing: false,
    business_details: false,
    documents: false,
    preview: false,
    success: false,
  },
  sellBusiness: {
    listing_details: {
      listing_title: "",
      listing_summary: "",
      images: [],
    },
    business_details: {
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
        rent: "",
      },
    },
    business_documents: {
      CAC_certificate: {
        company_reg_no: "",
        date_of_reg: null,
        doc_file: "",
      },
      // financial_statement: "",
      // property_details: "",
    },
    asking_price: "",
    status: "Available",
    featured: false,
    files: [],
  },
  notifications: [],
  savedBusinesses: [],
  blogPosts: [],
};

export const AppSlice = createSlice({
  name: "App",
  initialState,
  reducers: {
    setProtocol: (state, action) => {
      state.listingProtocols[action.payload.protocolKey] =
        action.payload.protocol;
    },
    setSellBusiness: (state, action) => {
      state.sellBusiness[action.payload.objKey] = action.payload.newObj;
    },
    clearSellBusiness: (state, action) => {
      state.listingProtocols = {
        setup: true,
        build_listing: false,
        business_details: false,
        documents: false,
        preview: false,
        success: true,
      };
      state.sellBusiness = initialState.sellBusiness;
    },
    setNotifications: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
    },
    clearNotifications: (state, action) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
    },
    saveBusiness: (state, action) => {
      state.savedBusinesses = state.savedBusinesses.includes(action.payload)
        ? state.savedBusinesses.filter((b) => b !== action.payload)
        : [action.payload, ...state.savedBusinesses];
    },
    setBlogPosts: (state, action) => {
      state.blogPosts = action.payload;
    },
  },
});

export const {
  setProtocol,
  setSellBusiness,
  clearSellBusiness,
  setNotifications,
  clearNotifications,
  saveBusiness,
  setBlogPosts,
} = AppSlice.actions;
export default AppSlice.reducer;
