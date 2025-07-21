## 🚀 Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Redux
- **Backend:** >>
- **Node.js + Express (v5)**
- **TypeScript**
- **MongoDB + Mongoose**
- **Stripe Payments**
- **JWT Authentication**
- **Redis (ioredis)**
- **ImageKit for file uploads**
- **Multer for file handling**
- **Node Cache for local caching**

- **Payment Gateway:** Stripe

🔧 Features
🔐 User authentication with JWT and Cookies (register/login)
📦 Admin dashboard for managing products, orders, users
🛒 Add to Cart / Remove from Cart
💳 Stripe Payment Integration
🏷️ Apply Coupon Codes
⭐ Product Reviews and Ratings
🔎 Search, Filter by Category/Price
📦 Order summary and tracking
📁 Upload product images via Cloudinary

## 🧑‍💻 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/dvansari65/ecommerce-website.git
cd ecommerce-website
#frontend

cd frontend
npm install

# Backend
cd ../backend
npm install

#CREATE .env file in both  folders ./frontend and ./backend

#frontend>>
# and these variables in that -
VITE_PROJECT_ID = YOUR_PROJECT_ID
VITE_MESSAGE_SENDER_ID = YOUR_VITE_MESSAGE_SENDER_ID
VITE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
VITE_API_KEY=VITE_API_KEY
VITE_APP_ID=VITE_APP_ID
VITE_SERVER=8000

#backend>>
#add these variables in backend's .env file

PORT=5000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
REDIS_URL=redis://localhost:6379
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

THEN RUN

➤ Development Mode
npm run dev

➤Production Mode
npm run build
npm start


