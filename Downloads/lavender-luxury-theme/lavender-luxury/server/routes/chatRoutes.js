const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const { Coupon } = require("../models/index");

const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

function ensureGenAI() {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (key) {
      genAI = new GoogleGenerativeAI(key);
    }
  }
  return genAI;
}

router.post("/", async (req, res) => {
  try {

    const { message } = req.body;

    const products = await Product.find({
      isActive: true
    });

    const coupons = await Coupon.find({
      isActive: true
    });

    const productText = products
      .map(
        p =>
          `${p.name}
Category: ${p.category}
Price: ₹${p.price}`
      )
      .join("\n");

    const couponText = coupons
  .map(
    c =>
      `${c.code} - ${c.value} ${c.type === "percentage" ? "% OFF" : "₹ OFF"}`
  )
  .join("\n");

    const ai = ensureGenAI();
    if (!ai) {
      return res.status(500).json({
        success: false,
        reply:
          "Chat service is not configured. Please set GEMINI_API_KEY in the server environment."
      });
    }

    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

 const prompt = `
You are Lavender - The Style Emporio's AI Fashion Assistant and Customer Support Executive.

ABOUT THE STORE

Lavender is a boutique that specializes in:

- Sarees
- Kurtis
- Tops
- Crop Tops
- 3 Piece Sets

CURRENT PRODUCTS

${productText}

CURRENT OFFERS

${couponText}

STORE POLICIES

- 7 Day Return Policy
- Delivery within 3-7 business days
- Cash on Delivery Available
- UPI, Debit Card, Credit Card accepted

HUMAN SUPPORT

Phone: +91-9876543210
Email: support@lavender.com

INSTRUCTIONS

- Act like a professional boutique fashion consultant.
- Help customers choose outfits.
- Suggest products based on occasion and budget.
- Recommend matching items.
- Answer customer support questions.
- Use current products whenever possible.
- Use active offers whenever relevant.
- If customer wants to talk to a person, manager, owner, support team, or asks for contact details, provide the phone number and email.
- Keep responses concise and friendly.
- Maximum 120 words.

CUSTOMER QUESTION

${message}
`;

    const result =
      await model.generateContent(prompt);

    const response =
      result.response.text();

    res.json({
      success: true,
      reply: response
    });

  } catch (err) {
    console.error("Chat route error:", err);

    const status = err?.status || err?.response?.status;

    if (status === 429) {
      return res.status(429).json({
        success: false,
        reply:
          "The Gemini AI service is currently rate-limited or quota-limited. Please check your Google Cloud billing/quota and try again later."
      });
    }

    if (status === 404) {
      return res.status(500).json({
        success: false,
        reply:
          "The configured Gemini model is not available for your API key. Please verify your Gemini API access and model permissions."
      });
    }

    res.status(500).json({
      success: false,
      reply:
        "Sorry, I am currently unavailable. Please verify your Gemini API key, billing, and quota."
    });
  }
});

module.exports = router;