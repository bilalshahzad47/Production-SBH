const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyHomeServiceProviderController,
  applyBeautyParlourController,
  getAllNotificationController,
  deleteAllNotificationController,
  sendUrgentNotificationToHomeServiceProvidersController,
  getAllHomeServiceProvidersController,
  getAllBeautyParlourController,
  bookeAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//AUTH || POST
router.post("/getUserData", authMiddleware, authController);

//APPLY BEAUTY APRLOUR || POST
router.post("/apply-beautyparlour", authMiddleware, applyBeautyParlourController);

//APPLY HOME SERVICE PROVIDER || POST
router.post("/apply-home-service-provider", authMiddleware, applyHomeServiceProviderController);

//GET ALL NOTIFICATIONS || POST
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

//DELETE ALL NOTIFICATIONS || POST
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

//URGENT NOTIFICATION
router.post("/urgent-notification", authMiddleware, sendUrgentNotificationToHomeServiceProvidersController);

//GET ALL SERVICE PROVIDERS
router.get("/getAllServiceProviders", authMiddleware, getAllHomeServiceProvidersController);

//GET ALL BEAUTY PARLOURS
router.get("/getAllBeautyParlours", authMiddleware, getAllBeautyParlourController);

//BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookeAppointmnetController);

//Booking Avliability
router.post(
  "/booking-availbility",
  authMiddleware,
  bookingAvailabilityController
);

//Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;
