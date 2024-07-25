import mongoose, { Schema } from "mongoose";

const analyticsSchema = mongoose.Schema(
  {
    views_count: [
      {
        type: new Schema(
          {
            business_id: {
              type: mongoose.Schema.Types.ObjectId,
              require: true,
              ref: "Businesses",
            },
            seller_id: {
              type: mongoose.Schema.Types.ObjectId,
              require: true,
              ref: "Users",
            },
            viewed_by_id: {
              type: mongoose.Schema.Types.ObjectId,
              require: true,
              ref: "Users",
            },
          },
          { timestamps: true }
        ),
      },
    ],
    saved_count: [
      {
        type: new Schema(
          {
            business_id: {
              type: mongoose.Schema.Types.ObjectId,
              require: true,
              ref: "Businesses",
            },
            seller_id: {
              type: mongoose.Schema.Types.ObjectId,
              require: true,
              ref: "Users",
            },
            saved_by_id: {
              type: mongoose.Schema.Types.ObjectId,
              require: true,
              ref: "Users",
            },
          },
          { timestamps: true }
        ),
      },
    ],
  },
  { timestamps: true }
);

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
