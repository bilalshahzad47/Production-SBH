const appointmentModel = require("../models/appointmentModel");
const beautyParlourModel = require("../models/beautyParlourModel");
const userModel = require("../models/userModels");

//GET BEAUTY PARLOUR INFO
const getBeautyParlourInfoController = async (req, res) => {
  try {
    const beautyparlour = await beautyParlourModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "beauty parlour data fetch success",
      data: beautyparlour,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Beauty Parlour Details",
    });
  }
};

// UPDATE PROFILE
const updateProfileController = async (req, res) => {
  try {
    const beautyparlour = await beautyParlourModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Beauty Parlour Profile Updated",
      data: beautyparlour,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Beauty Parlour Profile Update issue",
      error,
    });
  }
};

//GET SINGLE BEAUTY PARLOUR
const getBeautyParlourByIdController = async (req, res) => {
  try {
    const beautyparlour = await beautyParlourModel.findOne({ _id: req.body.beautyparlourId });
    res.status(200).send({
      success: true,
      message: "Single Beauty Parlour Info Fetched",
      data: beautyparlour,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Single Beauty Parlour info",
    });
  }
};

//BEAUTY PARLOUR APPOINTMENTS
const beautyParlourAppointmentsController = async (req, res) => {
  try {
    const beautyparlour = await beautyParlourModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      beautyparlourId: beautyparlour._id,
    });
    res.status(200).send({
      success: true,
      message: "Beauty Parlour Appointments fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Beauty Parlour Appointments",
    });
  }
};

//UPDATE STATUS CONTROLLER
const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });
    const notifcation = user.notifcation;
    notifcation.push({
      type: "status-updated",
      message: `your appointment has been updated ${status}`,
      onCLickPath: "/beautyparlour-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Status",
    });
  }
};

module.exports = {
  getBeautyParlourInfoController,
  updateProfileController,
  getBeautyParlourByIdController,
  beautyParlourAppointmentsController,
  updateStatusController,
};