const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const appointmentModel = require("../models/appointmentModel");
const HomeServiceProviderModel = require("../models/homeServiceProviderModel");
const beautyParlourModel = require("../models/beautyParlourModel");
const moment = require("moment");

//Register Callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// Login Callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

//GET USER
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

//Apply For Beauty Parlour API
const applyBeautyParlourController = async (req, res) => {
  try {
    const newBeautyParlour = new beautyParlourModel({ ...req.body, status: "pending" });
    await newBeautyParlour.save();

    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notifcation;
    notification.push({
      type: "apply-beauty-parlour-request",
      message: `${newBeautyParlour.name} Has Applied For A Beauty Parlour Account`,
      data: {
        beautyParlourId: newBeautyParlour._id,
        name: newBeautyParlour.name,
        onClickPath: "/admin/beautyparlours",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });

    res.status(201).send({
      success: true,
      message: "Beauty Parlour Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying For Beauty Parlour",
    });
  }
};

//Apply For HOME SERVICE PROVIDER
const applyHomeServiceProviderController = async (req, res) => {
  try {
    const newServiceProvider = await HomeServiceProviderModel({ ...req.body, status: "pending" });
    await newServiceProvider.save();
    
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notifcation;
    notification.push({
      type: "apply-home-service-provider-request",
      message: `${newServiceProvider.firstName} ${newServiceProvider.lastName} Has Applied as a Home Service Provider`,
      data: {
        serviceProviderId: newServiceProvider._id,
        name: newServiceProvider.firstName + " " + newServiceProvider.lastName,
        onClickPath: "/admin/service-providers",
      },
    });
    
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    
    res.status(201).send({
      success: true,
      message: "Home Service Provider Application Submitted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Applying as Home Service Provider",
    });
  }
};


//GET ALL Notifications
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notifcation = user.notifcation;
    seennotification.push(...notifcation);
    user.notifcation = [];
    user.seennotification = notifcation;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

// Delete ALL Notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notifcation = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

//SEND URGENT NOTIFICATION TO ALL HOME SERVICE PROVIDERS
const sendUrgentNotificationToHomeServiceProvidersController = async (req, res) => {
  try {
    const { message } = req.body;
    // Find all home service providers
    const providers = await userModel.find({ isServiceProvider: true });

    // Loop through each provider and send the urgent notification
    for (const provider of providers) {
      provider.notifcation.push({
        type: "urgent",
        message: message,
      });
      await provider.save();
    }

    res.status(200).send({
      success: true,
      message: "Urgent notification sent to all home service providers",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while sending urgent notification",
    });
  }
};

//GET ALL BEAUTY PARLOURS
const getAllBeautyParlourController = async (req, res) => {
  try {
    const beautyParlours = await beautyParlourModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Beauty Parlours List Fetched Successfully",
      data: beautyParlours,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Beauty Parlours",
    });
  }
};

//GET ALL HOME SERVICE PROVIDERS
const getAllHomeServiceProvidersController = async (req, res) => {
  try {
    const serviceProviders = await HomeServiceProviderModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Home Service Providers List Fetched Successfully",
      data: serviceProviders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Home Service Providers",
    });
  }
};

// BOOK APPOINTMENT
const bookeAppointmnetController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.beautyparlourInfo.userId });
    user.notifcation.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

// Booking Availability Controller
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const beautyparlourId = req.body.beautyparlourId;
    const appointments = await appointmentModel.find({
      beautyparlourId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Available at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};


//USER BOOK APPOINTMENT 
const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch SUccessfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyBeautyParlourController,
  applyHomeServiceProviderController,
  getAllNotificationController,
  deleteAllNotificationController,
  sendUrgentNotificationToHomeServiceProvidersController,
  getAllHomeServiceProvidersController,
  getAllBeautyParlourController,
  bookeAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController,
};
