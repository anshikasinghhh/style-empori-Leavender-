# 🪷 Vastra Elegance — Premium Ethnic Fashion E-Commerce

A full-stack production-ready e-commerce platform for Indian ethnic fashion.

## 🎨 Color Theme
- **Primary:** Deep Violet `#7C3AED`  
- **Accent:** Rose Gold `#E11D48`  
- **Gold:** `#B45309`  
- **Background:** Ivory `#FDFAF6` + Champagne `#F5E6D3`  

## 🚀 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Redux Toolkit, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Role-Based |
| Payments | Razorpay + Stripe + COD |
| Charts | Recharts |

## ⚙️ Setup
```bash
# 1. Install all dependencies
npm run install-all

# 2. Copy and fill environment variables
cp server/.env.example server/.env

# 3. Run development servers
npm run dev
# Frontend → http://localhost:3000
# Backend  → http://localhost:5000
```

## 🔑 Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@vastra.com | admin123 |
| 🛍️ Customer | customer@vastra.com | customer123 |

## 📁 Project Structure
```
vastra-elegance/
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── common/            # Navbar, Footer, ProductCard
│   │   ├── pages/
│   │   │   ├── customer/          # All customer-facing pages
│   │   │   └── admin/             # Admin panel pages
│   │   ├── slices/                # Redux state management
│   │   └── utils/                 # API helper, product data
│   └── tailwind.config.js
└── server/                        # Express backend
    ├── models/                    # MongoDB schemas
    ├── routes/                    # REST API routes
    └── middleware/                # Auth middleware
```

## ✨ Features
### Customer
- Hero carousel with 3 banner slides
- Category showcase (8 categories)
- Product listing with filters (category, price, occasion)
- Product detail with image gallery, size picker, reviews
- Cart with quantity controls + coupon codes (VASTRA10, WELCOME20)
- 3-step checkout (Address → Payment → Review)
- Order tracking with status stepper
- Wishlist, Profile, Password change
- Flash sale timer + Festival collections

### Admin Panel
- Analytics dashboard (area chart, bar chart, pie chart)
- Product CRUD with image support
- Order management with inline status updates
- Customer management with tiers (Gold/Silver/Bronze)
- Inventory with stock bars + restock button
- Coupon management with usage tracking
- Store settings, payment toggles, brand colors

## 🏷️ Coupon Codes (Demo)
- `VASTRA10` — 10% off on orders above ₹999
- `WELCOME20` — 20% off on first order
