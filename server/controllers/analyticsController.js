import Analytics from "../models/analyticsModel.js";
import Businesses from "../models/BusinessModel.js";
import Chats from "../models/chatModel.js";
import Users from "../models/userModel.js";

export const getViewCount = async (req, res) => {
  try {
    const { user_id, business_id } = req.params;

    const user = await Users.findById(user_id);
    if (!user) throw new Error("Access Denied");

    const business = await Businesses.findOne({
      _id: business_id,
      seller_id: user_id,
    });
    if (!business) throw new Error("Can't find this business");

    const analytics = await Analytics.findOne({});

    const viewCounts = analytics.views_count.filter((viewCount) => {
      if (
        viewCount.seller_id.toHexString() === user_id &&
        viewCount.business_id.toHexString() === business_id
      ) {
        return viewCount;
      }
    });

    res.status(200).json(viewCounts);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const updateViewCount = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { business_id, seller_id } = req.body;

    const business = await Businesses.findOne({ _id: business_id, seller_id });
    if (!business) throw new Error("Can't find this business");

    if (user_id !== seller_id) {
      const newAnalytics = {
        business_id,
        seller_id,
        viewed_by_id: user_id,
      };

      const analytics = await Analytics.findOne(
        {},
        {
          views_count: {
            $elemMatch: { business_id, seller_id, viewed_by_id: user_id },
          },
        }
      );

      if (analytics.views_count.length === 0) {
        const anal = await Analytics.findOne({});
        anal.views_count.push(newAnalytics);
        await anal.save();
        res.status(200).json({ status: "ok" });
      } else {
        res.status(200).json(null);
      }
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getSavedCount = async (req, res) => {
  try {
    const { user_id, business_id } = req.params;

    const user = await Users.findById(user_id);
    if (!user) throw new Error("Access Denied");

    const business = await Businesses.findOne({
      _id: business_id,
      seller_id: user_id,
    });
    if (!business) throw new Error("Can't find this business");

    const analytics = await Analytics.findOne({});

    const savedCounts = analytics.saved_count.filter((savedCount) => {
      if (
        savedCount.seller_id.toHexString() === user_id &&
        savedCount.business_id.toHexString() === business_id
      ) {
        return savedCount;
      }
    });

    res.status(200).json(savedCounts);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const updateSavedCount = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { business_id, seller_id } = req.body;

    const business = await Businesses.findOne({ _id: business_id, seller_id });
    if (!business) throw new Error("Can't find this business");

    if (user_id !== seller_id) {
      const newAnalytics = {
        business_id,
        seller_id,
        saved_by_id: user_id,
      };

      const analytics = await Analytics.findOne(
        {},
        {
          saved_count: {
            $elemMatch: { business_id, seller_id, saved_by_id: user_id },
          },
        }
      );

      if (analytics.saved_count.length === 0) {
        const anal = await Analytics.findOne({});
        anal.saved_count.push(newAnalytics);
        await anal.save();
        res.status(200).json({ status: "ok" });
      } else {
        res.status(200).json("null");
      }
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};
