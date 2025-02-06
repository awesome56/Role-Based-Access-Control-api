# Role-Based Access Control
Authentication &amp; Role-Based Access Control (RBAC)

# Authentication &amp; Role-Based Access Control (RBAC)

A RESTful API built with **Node.js**, **Express**, and **MongoDB Atlas** that primarily provides secure user authentication and role-based access control (RBAC). It implements a shipment calculator that utilizes these roles to manage pricing rules and calculate shipment costs.

---

## 🚀 Overview & Functionalities

The Shipment Pricing API is designed to:
- **Calculate Shipment Costs:** Compute shipping costs based on cargo type, weight, and distance.
- **Manage Pricing Rules:** Allow administrators to create, update, and delete pricing rules.
- **User Authentication:** Enable users to register and log in using JWT for secure access.
- **Role-Based Authorization:** Restrict access to certain endpoints based on user roles (admin, shipper, and carrier).
- **Logging:** Log important events and admin actions using Winston.
- **Validation:** Validate incoming request data with express-validator.

---

## 📡 API Endpoints

### 🚀 Authentication
| Method | Endpoint                   | Description                         | Auth Required |
|--------|----------------------------|-------------------------------------|---------------|
| `POST` | `/api/auth/register`       | Register a new user                 | ❌ No         |
| `POST` | `/api/auth/login`          | Login user & obtain JWT token       | ❌ No         |

### 📦 Pricing Rules
| Method | Endpoint                      | Description                                       | Roles Allowed         |
|--------|-------------------------------|---------------------------------------------------|-----------------------|
| `POST` | `/api/pricing/`               | Create a new pricing rule                         | Admin Only            |
| `PUT`  | `/api/pricing/:id`            | Update an existing pricing rule                   | Admin Only            |
| `DELETE`| `/api/pricing/:id`           | Delete a pricing rule                             | Admin Only            |
| `POST` | `/api/pricing/calculate`      | Calculate shipment cost based on parameters       | Admin, Shipper        |
| `GET`  | `/api/pricing/`               | Retrieve all pricing rules with pagination        | Admin, Shipper, Carrier|

---

## 🛠 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/shipment-pricing-api.git
cd shipment-pricing-api
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Create a .env File
Create a .env file in the project root with the following contents (update with your own credentials):
```env
# Server Configuration
PORT=5000

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/shipment?retryWrites=true&w=majority

# JWT Secret Key for Token Generation
JWT_SECRET=your_secret_key

# AWS Credentials (if applicable)
AWS_REGION=us-east-1
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key

# Node Environment (optional)
NODE_ENV=development
```

### 4️⃣ Start the Server
```sh
npm start
```
The API will run at http://localhost:5000

## 📚 Dependencies
The project relies on the following main dependencies:

- **express: Web framework for Node.js.
- **mongoose: ODM library for MongoDB.
- **dotenv: Loads environment variables from a .env file.
- **jsonwebtoken: Implements JSON Web Tokens (JWT) for secure authentication.
- **bcrypt: Library for hashing and comparing passwords.
- **express-validator: Middleware for validating and sanitizing request data.
- **winston: Logging library for tracking events.
- **cors: Middleware for enabling Cross-Origin Resource Sharing.
- **helmet: Security middleware to set various HTTP headers.

## 🔍 Logging & Validation
- Logging:
The API uses Winston to log key events such as:

Database connections and errors.
Authentication events (login success and failures).
Admin actions (creation, updates, deletion of pricing rules).
Logs are stored in files (e.g., logs/app.log, logs/pricing.log, admin-actions.log).
- Validation:
express-validator is used to validate incoming request data, ensuring that:

Required fields are provided.
Data types are correct (e.g., numeric values for pricing multipliers).
User roles are within the allowed list.

## 🗄 Database
This API uses MongoDB Atlas as its database service:
- Connection String: Provided via the MONGODB_URI in the .env file.
- ODM: Mongoose is used for schema definitions, validations, and interacting with MongoDB.
