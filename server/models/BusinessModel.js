import mongoose from "mongoose";

const businessSchema = mongoose.Schema(
  {
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Users",
    },
    listing_details: {
      listing_title: {
        type: String,
        require: true,
      },
      listing_summary: {
        type: String,
        require: true,
      },
      images: {
        type: Array,
        require: true,
        default: [],
      },
    },
    business_details: {
      business_name: {
        type: String,
        require: true,
      },
      business_phone_number: {
        type: Number,
      },
      business_email: {
        type: String,
      },
      business_description: {
        type: String,
        require: true,
      },
      category: {
        type: String,
        require: true,
      },
      services: {
        type: Array,
        require: true,
      },
      business_location: {
        address: {
          type: String,
        },
        LGA: {
          type: String,
        },
        city: {
          type: String,
        },
        postal_code: {
          type: String,
        },
        state: {
          type: String,
          require: true,
        },
        country: {
          type: String,
          require: true,
          default: "Nigeria",
        },
      },
      financial_details: {
        turnover: {
          type: Number,
        },
        net_profit: {
          type: Number,
        },
      },
      property_details: {
        type: {
          type: String,
          require: true,
        },
        rent: {
          type: Number,
        },
      },
    },
    business_documents: {
      CAC_certificate: {
        doc_file: {
          type: String,
          // require: true,
        },
        company_reg_no: {
          type: String,
          require: true,
          // unique: true,
        },
        date_of_reg: {
          type: String,
          // require: true,
        },
      },
      financial_statement: {
        type: String,
      },
      property_details: {
        type: String,
      },
    },
    asking_price: {
      type: Number,
      require: true,
      default: 0,
    },
    status: {
      type: String,
      require: true,
      default: "Available",
    },
    featured: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Businesses = mongoose.model("Businesses", businessSchema);

export default Businesses;
