const axios = require("axios");
const { Order } = require("../models/index");

const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

let cachedToken = null;
let tokenExpiry = null;

/**
 * Log in to Shiprocket and return the auth token.
 */
async function loginShiprocket() {
  try {
    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    if (!email || !password) {
      throw new Error("Shiprocket credentials (SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD) are missing from environment variables.");
    }

    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data && response.data.token) {
      cachedToken = response.data.token;
      // Set token expiry to 23 hours from now (tokens usually expire in 24 hours)
      tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
      return cachedToken;
    } else {
      throw new Error("Invalid response from Shiprocket authentication API.");
    }
  } catch (error) {
    console.error(
      "Shiprocket Login Error:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Helper to get active Shiprocket JWT token, returning the cached one if valid.
 */
async function getShiprocketToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  return await loginShiprocket();
}

/**
 * Formats a Date object to YYYY-MM-DD HH:mm format required by Shiprocket.
 */
function formatShiprocketDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Sync an order to Shiprocket automatically.
 * @param {string} orderId - MongoDB ID of the order.
 */
async function createShiprocketOrder(orderId) {
  try {
    const order = await Order.findById(orderId)
      .populate("user")
      .populate("items.product");

    if (!order) {
      console.error(`Order ${orderId} not found for Shiprocket sync.`);
      return;
    }

    // Defensive check to avoid duplicate orders on Shiprocket
    if (order.shiprocketOrderId) {
      console.log(`Order ${order.orderNumber} is already synced to Shiprocket.`);
      return;
    }

    const token = await getShiprocketToken();

    // Map shipping address name
    const addressName = (order.shippingAddress?.name || order.user?.name || "Customer").trim();
    const nameParts = addressName.split(" ");
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || ".";

    // Map payment method
    const paymentMethod = order.paymentMethod === "cod" ? "COD" : "Prepaid";

    // Map items and calculate total package weight / dimensions
    let totalWeight = 0;
    const orderItems = order.items.map((item) => {
      const p = item.product;
      const weight = p?.weight || 0.5; // default 0.5kg
      totalWeight += weight * item.quantity;

      return {
        name: item.name || p?.name || "Product Item",
        sku: p?.sku || p?.productCode || String(item.product?._id || item._id),
        units: item.quantity,
        selling_price: item.price,
        discount: 0,
        tax: 0,
        hsn: "",
      };
    });

    // Make sure weight is greater than 0
    if (totalWeight <= 0) totalWeight = 0.5;

    // Use default dimensions
    const length = 15;
    const breadth = 15;
    const height = 10;

    const payload = {
      order_id: order.orderNumber,
      order_date: formatShiprocketDate(order.createdAt || new Date()),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
      comment: order.notes || "Auto-synced from Vastra Elegance",
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: order.shippingAddress.street || "Not Provided",
      billing_address_2: "",
      billing_city: order.shippingAddress.city || "Not Provided",
      billing_pincode: order.shippingAddress.pincode || "000000",
      billing_state: order.shippingAddress.state || "Not Provided",
      billing_country: "India",
      billing_email: order.user?.email || "customer@example.com",
      billing_phone: order.shippingAddress.phone || "9999999999",
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: paymentMethod,
      shipping_charges: order.shippingCost || 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: order.couponDiscount || 0,
      sub_total: order.subtotal,
      length: length,
      breadth: breadth,
      height: height,
      weight: totalWeight,
    };

    console.log(`Sending order ${order.orderNumber} to Shiprocket...`);

    const response = await axios.post(
      `${BASE_URL}/orders/create/adhoc`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.order_id) {
      const srOrderId = response.data.order_id;
      const srShipmentId = response.data.shipment_id;

      await Order.findByIdAndUpdate(orderId, {
        shiprocketOrderId: String(srOrderId),
        shiprocketShipmentId: String(srShipmentId),
        shiprocketSyncStatus: "synced",
        $push: {
          statusHistory: {
            status: order.orderStatus,
            timestamp: new Date(),
            note: `Auto-synced to Shiprocket (Order ID: ${srOrderId}, Shipment ID: ${srShipmentId})`,
          },
        },
      });

      console.log(`Order ${order.orderNumber} successfully synced to Shiprocket.`);
    } else {
      console.log("Shiprocket unexpected response data:", response.data);
      throw new Error("Shiprocket response did not contain order_id");
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.response?.data || error.message;
    console.error(`Failed to sync order ${orderId} to Shiprocket:`, errorMsg);

    // Save failure status to order record for admin awareness
    try {
      await Order.findByIdAndUpdate(orderId, {
        shiprocketSyncStatus: "failed",
        shiprocketSyncError: typeof errorMsg === "object" ? JSON.stringify(errorMsg) : String(errorMsg),
      });
    } catch (dbErr) {
      console.error("Failed to save Shiprocket error status to DB:", dbErr.message);
    }
  }
}

module.exports = {
  loginShiprocket,
  getShiprocketToken,
  createShiprocketOrder,
};