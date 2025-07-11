🍽️ SmartMealz – Meal Kit Ordering Platform (Backend)
SmartMealz is a secure and scalable web application backend that enables customers to order pre-portioned meal kits for convenient and healthy home cooking. Built using Node.js, Express, TypeScript, and MongoDB, it provides a robust RESTful API to manage users, carts, orders, pricing, and meal kit inventory.

📚 Project Background
The demand for fast, healthy, and waste-free meal preparation inspired the creation of SmartMealz. As someone passionate about food and backend engineering, I developed this project to simulate a real-world meal kit delivery platform with features like user authentication, cart management, region-based pricing, and admin functionalities.

🛠 Tech Stack
Runtime: Node.js

Language: TypeScript

Framework: Express.js

Database: MongoDB (Mongoose ODM)

Authentication: JWT, bcrypt

File Uploads: Multer

Validation: Express Validator

Security: Helmet, CORS, Rate Limiting

Architecture: RESTful API

📁 Project Structure
bash
Copy
Edit
smartmealz-backend/
├── src/
│   ├── controllers/       # Route logic and business functions
│   ├── routes/            # API route definitions
│   ├── models/            # Mongoose schemas
│   ├── middleware/        # Auth, validation, and error handling
│   ├── utils/             # Helpers (email, pricing, tokens)
│   └── index.ts           # App entry point
├── .env
├── tsconfig.json
├── package.json
⚙️ Getting Started
📦 Prerequisites
Node.js v18+

MongoDB (local or MongoDB Atlas)

🧪 Installation
bash
Copy
Edit
# Clone the repo
git clone https://github.com/your-username/smartmealz-backend.git
cd smartmealz-backend

# Install dependencies
npm install

# Copy env file and set your environment variables
cp .env.example .env

# Start the development server
npm run dev
🔐 Authentication Routes
Method	Endpoint	Description
POST	/users/register	Register a new user
GET	/users/verify-email	Email verification via token
POST	/users/login	Login and receive JWT
POST	/users/reset-password	Request password reset link
PATCH	/users/:id	Change user role (admin only)

🛒 Cart Routes
Method	Endpoint	Access	Description
POST	/cart/:id	Authenticated	Add meal kit to user cart
GET	/cart/:id	Authenticated	Retrieve user’s cart
GET	/carts	Authenticated	Get all carts
PATCH	/cart/:id	Authenticated	Update cart item
DELETE	/cart/:id	Authenticated	Remove item from cart

🍱 Meal Kit Routes
Method	Endpoint	Access	Description
POST	/mealkits	Admin	Add a new meal kit
GET	/mealkits	Admin	Retrieve all meal kits
GET	/mealkit/:id	Admin	Get meal kit by ID
PUT	/mealkit/admin/:id	Admin	Update a meal kit
PATCH	/mealkit/admin/:id	Admin	Update meal kit image
DELETE	/mealkit/admin/:id	Admin	Delete a meal kit

📦 Pricing Utility
Method	Endpoint	Description
POST	/calculate-total	Calculate order total by delivery region

📬 Contact Endpoint
Method	Endpoint	Description
POST	/contact	Public contact form support

🚀 Features
🔐 Secure JWT Authentication

🔒 Password hashing with bcrypt

📬 Email verification

🛒 Cart management

📦 Dynamic pricing by region

🍱 Admin meal kit CRUD with image upload

⚙️ Role-based access (user/admin)

📂 Modular RESTful API architecture

