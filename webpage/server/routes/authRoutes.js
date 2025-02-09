const express = require("express");
const router = express.Router();
const cors = require("cors");
const { loginUser, registerUser } = require("../controllers/authController");
const { submitPreferences, getPreferences } = require("../controllers/userController");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { authenticateUser } = require("../controllers/userController");

// Middleware
router.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
        // origin: "https://cover-clever.vercel.app",
        exposedHeaders: ['Authorization']  // Important for token access
    })
);

// Public routes
router.post("/login", loginUser);
router.post("/register", registerUser);

// Protected routes
router.get("/profile", authenticateUser, getProfile);
router.put("/profile", authenticateUser, updateProfile);
router.get("/preferences", authenticateUser, getPreferences);
router.post("/preferences", authenticateUser, submitPreferences);

module.exports = router;
