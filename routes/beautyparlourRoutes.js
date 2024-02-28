const express = require("express");
const {
  getBeautyParlourInfoController,
  updateProfileController,
  getBeautyParlourByIdController,
  beautyParlourAppointmentsController,
  updateStatusController,
} = require("../controllers/beautyParlourCtrl");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

//POST SINGLE BEAUTY PARLOUR INFO
router.post("/getBeautyParlourInfo", authMiddleware, getBeautyParlourInfoController);

//POST UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST  GET SINGLE BEAUTY PARLOUR INFO
router.post("/getBeautyParlourById", authMiddleware, getBeautyParlourByIdController);

//GET ALL BEAUTY PARLOUR Appointments
router.get(
  "/beautyparlour-appointments",
  authMiddleware,
  beautyParlourAppointmentsController
);

//POST Update Status
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;