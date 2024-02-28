const mongoose = require("mongoose");

const beautyParlourSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
        },
        name: {
            type: String,
            required: [true, "first name is required"],
        },
        phone: {
            type: String,
            required: [true, "phone no is required"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
        },
        website: {
            type: String,
        },
        address: {
            type: String,
            required: [true, "address is required"],
        },
        specialization: {
            type: String,
            required: [true, "specialization is require"],
        },
        experience: {
            type: String,
            required: [true, "experience is required"],
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
            required: [true, "work timing is required"],
        },
    },
    { timestamps: true }
);

const beautyParlourModel = mongoose.model("beautyparlours", beautyParlourSchema);
module.exports = beautyParlourModel;