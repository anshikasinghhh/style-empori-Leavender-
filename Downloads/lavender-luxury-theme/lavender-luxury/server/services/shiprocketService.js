const axios = require("axios");
console.log("Email:", process.env.SHIPROCKET_EMAIL);
console.log("Password Exists:", !!process.env.SHIPROCKET_PASSWORD);
const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

async function loginShiprocket() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });

    return response.data.token;
  } catch (error) {
    console.error(
      "Shiprocket Login Error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

module.exports = {
  loginShiprocket,
};