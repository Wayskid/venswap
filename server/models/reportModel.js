import mongoose from "mongoose";

const reportSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Businesses",
      require: true,
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
    subject: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Reports = mongoose.model("Reports", reportSchema);

export default Reports;
