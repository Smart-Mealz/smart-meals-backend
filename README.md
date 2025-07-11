# 🍽️ SmartMealz – Meal Kit Ordering Platform (Backend)

SmartMealz is a secure and scalable backend application that enables customers to order pre-portioned meal kits for convenient and healthy home cooking. Built using **Node.js**, **Express**, and **MongoDB**, it provides a robust RESTful API to manage users, carts, orders, region-based pricing, and meal kit inventory.

---

## 📚 Project Background

SmartMealz was inspired by the growing demand for quick and healthy meal preparation. The traditional approach of grocery shopping and meal planning can be time-consuming and wasteful. With SmartMealz, users can order curated meal kits that come with all the necessary ingredients in exact portions, making home cooking both effortless and efficient.

As the backend developer, I focused on building a reliable and secure API that supports core functionalities such as user authentication, dynamic pricing, order lifecycle management, and admin control over product offerings. The project simulates the real-world operations of a meal kit delivery service and is structured to support future scaling.



## 🛠 Tech Stack

- **Backend Framework:** Node.js + Express  
- **Database:** MongoDB 
- **Authentication:** JWT (JSON Web Tokens), bcrypt  
- **File Uploads:** Multer, Cloudinary  
- **Validation:** Joi
- **Email Service:** Nodemailer
- **Security:** CORS



## 📁 Project Structure

```text
smartmealz-backend/
├── src/
│   ├── controllers/        # Handles business logic
│   ├── routes/             # API Route definitions
│   ├── models/             # Mongoose schemas
│   ├── middleware/         # Authentication and error handlers
│   ├── utils/              # Utility functions (email, tokens, etc.)
├── config/                 # Environment configs
│   └── index.ts            # App entry point

