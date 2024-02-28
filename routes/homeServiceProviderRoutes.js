const express = require("express");
const {
    getServiceProviderInfoController,
    updateProfileController,
    getServiceProviderByIdController,
    serviceProviderAppointmentsController,
    updateStatusController,
} = require("../controllers/homeServiceProviderCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//POST ALL SERVICE PROVIDER INFO
router.post("/getServiceProviderInfo", authMiddleware, getServiceProviderInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST GET SINGLE SERVICE PROVIDER INFO
router.post("/getServiceProviderById", authMiddleware, getServiceProviderByIdController);

//GET Appointments
router.get(
  "/serviceprovider-appointments",
  authMiddleware,
  serviceProviderAppointmentsController
);

//POST Update Status
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;