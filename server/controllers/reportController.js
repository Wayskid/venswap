import Reports from "../models/reportModel.js";

export const getReports = async (req, res) => {
  try {
    const { user_id } = req.params;

    const reports = await Reports.find({})
      .populate("user_id", "-password")
      .populate("business_id", "listing_details seller_id")
      .populate("seller_id", "-password");

    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const reportBusiness = async (req, res) => {
  try {
    const { user_id, business_id } = req.params;
    const { seller_id, subject, description } = req.body;

    //Create chat
    const newReport = await Reports.create({
      user_id,
      business_id,
      seller_id,
      subject,
      description,
    });

    //Populate
    const updatedReport = await Reports.findById(newReport._id)
      .populate("user_id", "-password")
      .populate("business_id", "listing_details seller_id")
      .populate("seller_id", "-password");

    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
