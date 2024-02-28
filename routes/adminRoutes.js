const express = require("express");
const {
  getAllUsersController,
  getAllHomeServiceProvidersController,
  getAllBeautyParloursController,
  changeAccountStatusControllerBP,
  changeAccountStatusControllerHSP,
} = require("../controllers/adminCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//GET METHOD || BEAUTY PARLOURS
router.get("/getAllBeautyParlours", authMiddleware, getAllBeautyParloursController);
router.get("/getAllServiceProviders", authMiddleware, getAllHomeServiceProvidersController);
router.post(
  "/changeAccountStatusHSP",
  authMiddleware,
  changeAccountStatusControllerHSP
);
router.post(
  "/changeAccountStatusBP",
  authMiddleware,
  changeAccountStatusControllerBP
);

module.exports = router;