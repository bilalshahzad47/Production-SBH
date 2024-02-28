const userModel = require("../models/userModels");
const HomeServiceProviderModel = require("../models/homeServiceProviderModel");
const beautyParlourModel = require("../models/beautyParlourModel");

//GET ALL USERS CONTROLLER
const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "erorr while fetching users",
      error,
    });
  }
};


//GET ALL BEAUTY PARLOUR CONTROLLERS
const getAllBeautyParloursController = async (req, res) => {
  try {
    const beautyparlours = await beautyParlourModel.find({});
    res.status(200).send({
      success: true,
      message: "Beauty Parlours Data list",
      data: beautyparlours,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting Beauty Parlours Data",
      error,
    });
  }
};

// Get all home service providers
const getAllHomeServiceProvidersController = async (req, res) => {
  try {
    const homeServiceProviders = await HomeServiceProviderModel.find({});
    res.status(200).send({
      success: true,
      message: "Home Service Providers Data list",
      data: homeServiceProviders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting home service providers data",
      error,
    });
  }
};

// Change home service provider account status
const changeAccountStatusControllerHSP = async (req, res) => {
  try {
    const { serviceProviderId, status } = req.body;
    const serviceProvider = await HomeServiceProviderModel.findByIdAndUpdate(serviceProviderId, { status });
    const user = await userModel.findOne({ _id: serviceProvider.userId });
    const notification = user.notifcation;
    notification.push({
      type: "home-service-provider-account-request-updated",
      message: `Your Home Service Provider Account Request Has ${status} `,
      onClickPath: "/notification",
    });
    user.isServiceProvider = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: serviceProvider,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Account Status",
      error,
    });
  }
};

const changeAccountStatusControllerBP = async (req, res) => {
  try {
    const { beautyparlourId, status } = req.body;
    const beautyparlour = await beautyParlourModel.findByIdAndUpdate(beautyparlourId, { status });
    const user = await userModel.findOne({ _id: beautyparlour.userId });
    const notifcation = user.notifcation;
    notifcation.push({
      type: "beautyparlour-account-request-updated",
      message: `Your Beauty Parlour Account Request Has ${status} `,
      onClickPath: "/notification",
    });
    user.isBeautyParlour = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: beautyparlour,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Account Status",
      error,
    });
  }
};

module.exports = {
  getAllUsersController,
  getAllBeautyParloursController,
  getAllHomeServiceProvidersController,
  changeAccountStatusControllerBP,
  changeAccountStatusControllerHSP
};