import Analytics from "../models/analyticsModel.js";
import Businesses, { Int_Businesses } from "../models/BusinessModel.js";
import Chats from "../models/chatModel.js";
import Users from "../models/userModel.js";

export async function getBusinesses(req, res) {
  try {
    const search = req.query.search || "";
    let category = req.query.category || "All";
    let state = req.query.state || "All";
    let property = req.query.property || "All";
    let date_filter = req.query.date_filter || "Anytime";
    const sort_price = req.query.sort_price || "All";
    const limit = +req.query.limit || 25;
    const page = +req.query.page - 1 || 0;

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
      "Akwa_Ibom",
      "Anambra",
      "Bauchi",
      "Bayelsa",
      "Benue",
      "Borno",
      "Cross_River",
      "Delta",
      "Ebonyi",
      "Edo",
      "Ekiti",
      "Enugu",
      "FCT_Abuja",
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

    // Filtering by category
    category === "All"
      ? (category = [...categoryOptions])
      : (category = req.query.category.split(","));

    // Filtering by state
    state === "All"
      ? (state = [...stateOptions])
      : (state = req.query.state.split(","));

    // Filtering by property
    property === "All"
      ? (property = [...propertyOptions])
      : (property = req.query.property.split(","));

    // Filtering by date
    let dateFilterBy = new Date(2024, 1, 1);
    if (date_filter.length > 1) {
      switch (date_filter) {
        case "Anytime":
          dateFilterBy = new Date(2024, 1, 1);
          break;
        case "less_5D":
          dateFilterBy = new Date(
            new Date().getTime() - 6 * 24 * 60 * 60 * 1000
          );
          break;
        case "less_14D":
          dateFilterBy = new Date(
            new Date().getTime() - 15 * 24 * 60 * 60 * 1000
          );
          break;
        case "less_1M":
          dateFilterBy = new Date(
            new Date().getTime() - 32 * 24 * 60 * 60 * 1000
          );
          break;
        case "greater_3M":
          dateFilterBy = new Date(
            new Date().getTime() - 100 * 24 * 60 * 60 * 1000
          );
          break;
        default:
          dateFilterBy = new Date(2024, 1, 1);
          break;
      }
    }

    // sorting by price
    let sortPriceBy = { $gt: 0 };
    if (sort_price.length > 1) {
      switch (sort_price) {
        case "All":
          sortPriceBy = { $gt: 0 };
          break;
        case "less_500k":
          sortPriceBy = { $lt: 500001 };
          break;
        case "less_1M":
          sortPriceBy = { $lt: 1000001 };
          break;
        case "less_3M":
          sortPriceBy = { $lt: 3000001 };
          break;
        case "greater_3M":
          sortPriceBy = { $gt: 3000000 };
          break;
        default:
          sortPriceBy = { $gt: 0 };
          break;
      }
    }

    const businesses = await Businesses.find({
      $or: [
        {
          "listing_details.listing_title": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "business_details.business_location.city": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "business_details.business_location.state": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "listing_details.listing_summary": {
            $regex: search,
            $options: "i",
          },
        },
      ],
      asking_price: sortPriceBy,
    })
      .where("business_details.category")
      .in([...category])
      .where("business_details.business_location.state")
      .in([...state])
      .where("business_details.property_details.type")
      .in([...property])
      .where("createdAt")
      .gte(dateFilterBy)
      .lte(new Date())
      .skip(page * limit)
      .limit(limit)
      .populate("seller_id", "-password")
      .select("-business_documents");

    const totalResults = await Businesses.countDocuments({
      $or: [
        {
          "listing_details.listing_title": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "business_details.business_location.city": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "business_details.business_location.state": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "listing_details.listing_summary": {
            $regex: search,
            $options: "i",
          },
        },
      ],
      asking_price: sortPriceBy,
      "business_details.category": { $in: [...category] },
      "business_details.business_location.state": { $in: [...state] },
      "business_details.property_details.type": { $in: [...property] },
      createdAt: { $gt: dateFilterBy, $lt: new Date() },
    });

    if (!businesses.length) throw new Error("No business found.");

    res.status(200).json({
      businesses,
      resultCount: totalResults,
      limit,
      currentPage: page + 1,
      searched: search,
    });
  } catch (error) {
    res
      .status(400)
      .json(
        error.message === "No business found." ? error.message : error.message
      );
  }
}

export async function getIntBusinesses(req, res) {
  try {
    const search = req.query.search || "";
    let category = req.query.category || "All";
    let country = req.query.country || "All";
    let property = req.query.property || "All";
    let date_filter = req.query.date_filter || "Anytime";
    const sort_price = req.query.sort_price || "All";
    const limit = +req.query.limit || 25;
    const page = +req.query.page - 1 || 0;

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
    const countryOptions = [
      "Abia",
      "Adamawa",
      "Akwa_Ibom",
      "Anambra",
      "Bauchi",
      "Bayelsa",
      "Benue",
      "Borno",
      "Cross_River",
      "Delta",
      "Ebonyi",
      "Edo",
      "Ekiti",
      "Enugu",
      "FCT_Abuja",
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

    // Filtering by category
    category === "All"
      ? (category = [...categoryOptions])
      : (category = req.query.category.split(","));

    // Filtering by state
    country === "All"
      ? (country = [...countryOptions])
      : (country = req.query.country.split(","));

    // Filtering by property
    property === "All"
      ? (property = [...propertyOptions])
      : (property = req.query.property.split(","));

    // Filtering by date
    let dateFilterBy = new Date(2024, 1, 1);
    if (date_filter.length > 1) {
      switch (date_filter) {
        case "Anytime":
          dateFilterBy = new Date(2024, 1, 1);
          break;
        case "less_5D":
          dateFilterBy = new Date(
            new Date().getTime() - 6 * 24 * 60 * 60 * 1000
          );
          break;
        case "less_14D":
          dateFilterBy = new Date(
            new Date().getTime() - 15 * 24 * 60 * 60 * 1000
          );
          break;
        case "less_1M":
          dateFilterBy = new Date(
            new Date().getTime() - 32 * 24 * 60 * 60 * 1000
          );
          break;
        case "greater_3M":
          dateFilterBy = new Date(
            new Date().getTime() - 100 * 24 * 60 * 60 * 1000
          );
          break;
        default:
          dateFilterBy = new Date(2024, 1, 1);
          break;
      }
    }

    // sorting by price
    let sortPriceBy = { $gt: 0 };
    if (sort_price.length > 1) {
      switch (sort_price) {
        case "All":
          sortPriceBy = { $gt: 0 };
          break;
        case "less_500k":
          sortPriceBy = { $lt: 500001 };
          break;
        case "less_1M":
          sortPriceBy = { $lt: 1000001 };
          break;
        case "less_3M":
          sortPriceBy = { $lt: 3000001 };
          break;
        case "greater_3M":
          sortPriceBy = { $gt: 3000000 };
          break;
        default:
          sortPriceBy = { $gt: 0 };
          break;
      }
    }

    const businesses = await Int_Businesses.find({
      $or: [
        {
          "listing_details.listing_title": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "business_details.business_location.country": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "listing_details.listing_summary": {
            $regex: search,
            $options: "i",
          },
        },
      ],
      asking_price: sortPriceBy,
    })
      .where("business_details.category")
      .in([...category])
      .where("business_details.business_location.country")
      .in([...country])
      .where("business_details.property_details.type")
      .in([...property])
      .where("createdAt")
      .gte(dateFilterBy)
      .lte(new Date())
      .skip(page * limit)
      .limit(limit)
      .populate("seller_id", "-password")
      .select("-business_documents");

    const totalResults = await Int_Businesses.countDocuments({
      $or: [
        {
          "listing_details.listing_title": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "business_details.business_location.country": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "listing_details.listing_summary": {
            $regex: search,
            $options: "i",
          },
        },
      ],
      asking_price: sortPriceBy,
      "business_details.category": { $in: [...category] },
      "business_details.business_location.country": { $in: [...country] },
      "business_details.property_details.type": { $in: [...property] },
      createdAt: { $gt: dateFilterBy, $lt: new Date() },
    });

    if (!businesses.length) throw new Error("No business found.");

    res.status(200).json({
      businesses,
      resultCount: totalResults,
      limit,
      currentPage: page + 1,
      searched: search,
    });
  } catch (error) {
    res
      .status(400)
      .json(
        error.message === "No business found."
          ? error.message
          : "Something went wrong"
      );
  }
}

export async function getSavedBusinesses(req, res) {
  try {
    const saved = req.body.saved || [];

    const businesses = await Businesses.find({})
      .where("_id")
      .in([...saved])
      .select("-business_documents");

    if (!businesses.length) throw new Error("No business found.");

    res.status(200).json(businesses);
  } catch (error) {
    res
      .status(400)
      .json(
        error.message === "No business found." ? error.message : error.message
      );
  }
}

export async function getOneBusiness(req, res) {
  try {
    const { business_id } = req.params;

    const business = await Businesses.findById(business_id)
      .populate("seller_id", "-password")
      .select("-business_documents");

    if (!business) throw new Error("This business cannot be found");

    res.status(200).json(business);
  } catch (error) {
    res
      .status(400)
      .json(
        error.message === "This business cannot be found"
          ? error.message
          : "Something went wrong"
      );
  }
}

export async function getOneIntBusiness(req, res) {
  try {
    const { business_id } = req.params;

    const business = await Int_Businesses.findById(business_id).populate(
      "seller_id",
      "-password"
    );

    if (!business) throw new Error("This business cannot be found");

    res.status(200).json(business);
  } catch (error) {
    res
      .status(400)
      .json(
        error.message === "This business cannot be found"
          ? error.message
          : "Something went wrong"
      );
  }
}

export async function getUserBusinesses(req, res) {
  try {
    const { user_id } = req.params;

    const businesses = await Businesses.find({ seller_id: user_id })
      .populate("seller_id", "-password")
      .select("-business_documents");

    if (!businesses.length) throw new Error("Business list is empty");

    const analytics = await Analytics.findOne({});

    function businessAnalytics() {
      let businessAnal = [];
      for (let i = 0; i < businesses.length; i++) {
        const business = businesses[i];

        businessAnal.push({
          business,
          viewCount: analytics.views_count.filter((viewCount) => {
            if (
              viewCount.seller_id.toHexString() === user_id &&
              viewCount.business_id.toHexString() === business._id.toHexString()
            ) {
              return viewCount;
            }
          }).length,
        });
      }
      return businessAnal;
    }

    res.status(200).json(businessAnalytics());
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function createBusiness(req, res) {
  try {
    const {
      listing_details: { listing_title, listing_summary, images },
      business_details: {
        business_name,
        business_phone_number,
        business_email,
        business_description,
        category,
        services,
        business_location: { address, LGA, city, postal_code, state, country },
        financial_details: { turnover, net_profit },
        property_details: { type, rent },
      },
      business_documents: {
        CAC_certificate: { company_reg_no, date_of_reg, doc_file },
        financial_statement,
        property_details,
      },
      asking_price,
      status,
    } = req.body;
    const { seller_id } = req.params;

    const user = await Users.findById(seller_id);
    if (!user) throw new Error("Access denied");

    const phoneNumber =
      "234" + business_phone_number.replaceAll(/^0+(?!$)/g, "");

    const business = await Businesses.findOne({
      business_name,
    });
    if (business) throw new Error("This business has already been listed");

    const newBusiness = await Businesses.create({
      seller_id,
      listing_details: { listing_title, listing_summary, images },
      business_details: {
        business_name,
        business_phone_number: phoneNumber,
        business_email,
        business_description,
        category,
        services,
        business_location: { address, LGA, city, postal_code, state, country },
        financial_details: {
          turnover: turnover.replaceAll(",", ""),
          net_profit: net_profit.replaceAll(",", ""),
        },
        property_details: { type, rent: rent.replaceAll(",", "") },
      },
      business_documents: {
        CAC_certificate: { company_reg_no, date_of_reg, doc_file },
        financial_statement,
        property_details,
      },
      asking_price: asking_price.replaceAll(",", ""),
      status,
    });

    const updatedBusiness = await Businesses.findById(newBusiness._id)
      .populate("seller_id", "-password")
      .select("-business_documents");

    res.status(200).json(updatedBusiness);
  } catch (error) {
    res
      .status(400)
      .json(
        error.message === "This business has already been listed" ||
          error.message === "Access denied"
          ? error.message
          : error.message
      );
  }
}

export async function editBusiness(req, res) {
  try {
    const {
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
      status,
      asking_price,
    } = req.body;
    const { seller_id, business_id } = req.params;

    const business = await Businesses.findById(business_id);
    if (!business) throw new Error("Cannot find this business");
    if (business.seller_id.toHexString() !== seller_id)
      throw new Error("Access denied");

    const phoneNumber =
      "234" + business_phone_number.replaceAll(/^0+(?!$)/g, "");

    business.listing_details.listing_title = listing_title;
    business.listing_details.listing_summary = listing_summary;
    business.listing_details.images = images;

    business.business_details.business_name = business_name;
    business.business_details.business_phone_number = phoneNumber;
    business.business_details.business_email = business_email;
    business.business_details.business_description = business_description;
    business.business_details.category = category;
    business.business_details.services = services;

    business.business_details.business_location.address = address;
    business.business_details.business_location.LGA = LGA;
    business.business_details.business_location.city = city;
    business.business_details.business_location.postal_code = postal_code;
    business.business_details.business_location.state = state;

    business.business_details.financial_details.turnover = turnover.replaceAll(
      ",",
      ""
    );
    business.business_details.financial_details.net_profit =
      net_profit.replaceAll(",", "");

    business.business_details.property_details.type = type;
    business.business_details.property_details.rent = rent.replaceAll(",", "");

    business.status = status;
    business.asking_price = asking_price.replaceAll(",", "");

    const modifiedBusiness = await business.save();
    const updatedBusiness = await Businesses.findById(modifiedBusiness._id)
      .populate("seller_id", "-password")
      .select("-business_documents");

    res.status(200).json(updatedBusiness);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function deleteBusiness(req, res) {
  try {
    const { business_id, user_id } = req.params;

    const business = await Businesses.findById(business_id);
    if (!business) throw new Error("Cannot find this business");
    if (business.seller_id.toHexString() !== user_id)
      throw new Error("Access denied");

    //Delete product
    const deletedBusiness = await Businesses.findByIdAndDelete(business_id);

    res.status(200).json(deletedBusiness);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function getEnquiries(req, res) {
  try {
    const { seller_id } = req.params;

    const businesses = await Businesses.find({ seller_id });
    if (!businesses.length) throw new Error("This user has no listing");
    const chats = await Chats.find({
      users: { $all: [seller_id] },
    })
      .where("business_id")
      .in([...businesses.map((b) => b._id)])
      .populate("users", "first_name last_name")
      .populate("business_id", "listing_details")
      .select("-business_documents");
    if (!chats.length) throw new Error("This user has no enquiries");

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function getOrders(req, res) {
  try {
    const { buyer_id } = req.params;

    const businesses = await Businesses.find({ seller_id: { $ne: buyer_id } });
    if (!businesses.length) throw new Error("List is empty");
    const chats = await Chats.find({ users: { $all: [buyer_id] } })
      .where("business_id")
      .in([...businesses.map((b) => b._id)])
      .populate("users", "first_name last_name")
      .populate("business_id", "listing_details")
      .select("-business_documents");
    if (!chats.length) throw new Error("This user has no orders");

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function accountOverview(req, res) {
  try {
    const { user_id } = req.params;

    const businesses = await Businesses.find({ seller_id: user_id });
    const enquiries = await Chats.find({
      users: { $all: [user_id] },
    })
      .where("business_id")
      .in([...businesses.map((b) => b._id)])
      .populate("users", "first_name last_name")
      .populate("business_id", "listing_details")
      .select("-business_documents");

    const businessesNotOwned = await Businesses.find({
      seller_id: { $ne: user_id },
    });
    const orders = await Chats.find({ users: { $all: [user_id] } })
      .where("business_id")
      .in([...businessesNotOwned.map((b) => b._id)])
      .populate("users", "first_name last_name")
      .populate("business_id", "listing_details")
      .select("-business_documents");

    const analytics = await Analytics.findOne({});
    function businessAnalytics() {
      let businessAnal = [];
      for (let i = 0; i < businesses.length; i++) {
        const business = businesses[i];

        businessAnal.push({
          business,
          viewCount: analytics.views_count.filter((viewCount) => {
            if (
              viewCount.seller_id.toHexString() === user_id &&
              viewCount.business_id.toHexString() === business._id.toHexString()
            ) {
              return viewCount;
            }
          }).length,
        });
      }
      return businessAnal;
    }

    res.status(200).json({
      no_of_listings: businesses.length,
      no_of_enquiries: enquiries.length,
      no_of_orders: orders.length,
      total_no_of_views: businessAnalytics().reduce(
        (a, c) => a + c.viewCount,
        0
      ),
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
}

export async function featureBusiness(req, res) {
  try {
    const { business_id } = req.params;

    const business = await Businesses.findById(business_id);
    if (!business) throw new Error("Business not found");
    business.featured = true;
    const featuredBusiness = await business.save();

    res.status(200).json(featuredBusiness);
  } catch (error) {
    res.status(400).json(error.message);
  }
}
