const HomeServiceProviderModel = require("../models/homeServiceProviderModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModels");

//GET SERVICE PROVIDER INFO
const getServiceProviderInfoController = async (req, res) => {
  try {
    const serviceProvider = await HomeServiceProviderModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Service provider data fetch success",
      data: serviceProvider,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching service provider details",
    });
  }
};

//UPDATE PROFILE
const updateProfileController = async (req, res) => {
  try {
    const serviceProvider = await HomeServiceProviderModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Service Provider Profile Updated",
      data: serviceProvider,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Service Provider Profile Update issue",
      error,
    });
  }
};

//GET SERVICE PROVIDER BY ID
const getServiceProviderByIdController = async (req, res) => {
  try {
    const serviceProvider = await HomeServiceProviderModel.findOne({ _id: req.body.serviceProviderId });
    res.status(200).send({
      success: true,
      message: "Single Service Provider Info Fetched",
      data: serviceProvider,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching single service provider info",
    });
  }
};

//SERVICE PROVIDER APPOINTMENTS
const serviceProviderAppointmentsController = async (req, res) => {
  try {
    const serviceProvider = await HomeServiceProviderModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      serviceProviderId: serviceProvider._id,
    });
    res.status(200).send({
      success: true,
      message: "Service Provider Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in service provider appointments",
    });
  }
};

//UPDATE STATUS
const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });
    const notification = user.notifcation;
    notification.push({
      type: "status-updated",
      message: `Your appointment has been updated to ${status}`,
      onClickPath: "/service-provider-appointments",
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
      message: "Error in updating appointment status",
    });
  }
};

module.exports = {
  getServiceProviderInfoController,
  updateProfileController,
  getServiceProviderByIdController,
  serviceProviderAppointmentsController,
  updateStatusController,
};
