const mongoose = require("mongoose");

const homeServiceProviderSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "first name is required"],
      },
      lastName: {
        type: String,
        required: [true, "last name is required"],
      },
      phone: {
        type: String,
        required: [true, "phone no is required"],
      },
      email: {
        type: String,
        required: [true, "email is required"],
      },
      specialization: {
        type: String,
        required: [true, "specialization is require"],
      },
      experience: {
        type: String,
        required: [true, "experience is required"],
      },
      feesPerCunsaltation: {
        type: Number,
        required: [true, "fee is required"],
      },
  location: {
    type: String,
    required: true,
  },
  services: {
    type: [String], // Array of services provided by the home service provider
    required: true,
  },
  status: {
    type: String,
    default: "pending", // Status of the home service provider, default to "pending"
  },
  timings: {
    type: Object,
    required: [true, "wrok timing is required"],
  },
});

const HomeServiceProvider = mongoose.model("HomeServiceProvider", homeServiceProviderSchema);

module.exports = HomeServiceProvider;