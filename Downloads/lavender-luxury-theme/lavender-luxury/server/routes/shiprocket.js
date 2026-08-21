const express = require("express");
const router = express.Router();

const { loginShiprocket } = require("../services/shiprocketService");

// GET /api/shiprocket/login
router.get("/login", async (req, res) => {
  try {
    const token = await loginShiprocket();

    res.status(200).json({
      success: true,
      message: "Shiprocket login successful",
      token,
    });
  } catch (error) {
    console.error("Shiprocket Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Shiprocket login failed",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;