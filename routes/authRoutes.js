//  authRoutes.js file 

const express = require("express");
const router = express.Router();
const {
    registerUser, loginUser, getProfile, updateProfile, changePassword
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/change-password", changePassword);

module.exports = router;