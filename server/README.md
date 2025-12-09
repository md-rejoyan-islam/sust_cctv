# SUST CCTV Management System API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

**A comprehensive RESTful API for managing CCTV cameras, zones, and user authentication in the SUST (Shahjalal University of Science and Technology) campus security system.**

[Features](#features) • [Installation](#installation) • [API Documentation](#api-documentation) • [Deployment](#deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Request/Response Examples](#requestresponse-examples)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## 🌟 Overview

The **SUST CCTV Management System API** is a backend service designed to manage a network of CCTV cameras across the SUST campus. It provides secure endpoints for:

- User authentication and role-based access control
- Camera management (CRUD operations, bulk operations, status tracking)
- Zone organization (grouping cameras by location)
- Public endpoints for camera IP retrieval and status updates

This API is built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**, following RESTful principles and industry best practices for security, validation, and documentation.

---

## ✨ Features

### 🔐 Authentication & Security

- **JWT-based authentication** with access and refresh tokens
- **Role-based authorization** (Admin/User roles)
- Password hashing with bcrypt
- Secure token rotation and refresh mechanism
- Request validation using Zod schemas

### 📹 Camera Management

- **CRUD operations** for individual cameras
- **Bulk camera creation** (up to 100 cameras at once)
- **Bulk status updates** by IP address
- Camera filtering by zone, status, and search term
- Pagination support for large datasets
- Camera statistics and analytics

### 🗺️ Zone Management

- Zone CRUD operations
- Camera-to-zone relationships
- Optional population of nested camera data
- Zone-based camera filtering

### 👥 User Management

- User CRUD operations (Admin only)
- Profile management for authenticated users
- Email uniqueness validation
- Role assignment and modification

### 🌐 Public Endpoints

- Public camera IP retrieval
- Bulk camera status updates via IP (for edge devices)
- Header-based authentication for public routes

### 📝 Documentation & Validation

- **OpenAPI 3.1** specification
- Request/response validation with Zod
- Comprehensive error handling
- Swagger UI integration

---

## 🛠️ Tech Stack

| Technology     | Purpose               |
| -------------- | --------------------- |
| **Node.js**    | Runtime environment   |
| **TypeScript** | Type-safe JavaScript  |
| **Express**    | Web framework         |
| **MongoDB**    | NoSQL database        |
| **Mongoose**   | ODM for MongoDB       |
| **JWT**        | Authentication tokens |
| **Zod**        | Schema validation     |
| **Bcrypt**     | Password hashing      |
| **Swagger**    | API documentation     |
| **Morgan**     | HTTP request logger   |

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5080
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/sust_cctv
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sust_cctv

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=3600
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_REFRESH_EXPIRES_IN=604800

# CORS Configuration (optional)
CORS_ORIGIN=*

# Public API Header (for public endpoints)
PUBLIC_API_KEY=your_public_api_key_for_edge_devices
```

### Important Notes:

- **Change all secret keys** in production
- Use a strong, random JWT secret (at least 32 characters)
- For production, set `NODE_ENV=production`
- Configure `CORS_ORIGIN` to your frontend domain in production

---

## 🏃 Running the Application

### Development Mode (with auto-reload)

```bash
pnpm run dev
```

The server will start on `http://localhost:5080` (or your configured PORT).

### Production Build

```bash
# Build TypeScript to JavaScript
pnpm run build

# Start the production server
pnpm start
```

### Health Check

Once running, test the server:

```bash
curl http://localhost:5080/api/v1/health
```

Expected response:

```json
{
  "statusCode": 200,
  "message": "API is healthy",
  "payload": {
    "status": "ok",
    "timestamp": "2025-10-24T10:30:00.000Z"
  }
}
```

---

## 📁 Project Structure

```
cctv-server/
├── src/
│   ├── app/
│   │   ├── app.ts                 # Express app configuration
│   │   ├── secret.ts              # Environment variables
│   │   └── types.ts               # TypeScript types/interfaces
│   ├── config/
│   │   ├── db.ts                  # MongoDB connection
│   │   └── swagger.ts             # Swagger UI configuration
│   ├── controllers/
│   │   ├── auth.controller.ts     # Authentication handlers
│   │   ├── camera.controller.ts   # Camera handlers
│   │   ├── user.controller.ts     # User handlers
│   │   └── zone.controller.ts     # Zone handlers
│   ├── docs/
│   │   └── openapi.yaml           # OpenAPI specification
│   ├── middlewares/
│   │   ├── authorized.ts          # Role-based authorization
│   │   ├── error-handler.ts       # Global error handler
│   │   ├── validate-headers.ts    # Header validation (public routes)
│   │   ├── validate.ts            # Zod validation middleware
│   │   └── verify.ts              # JWT verification
│   ├── models/
│   │   ├── camera.model.ts        # Camera schema
│   │   ├── user.model.ts          # User schema
│   │   └── zone.model.ts          # Zone schema
│   ├── routes/
│   │   ├── auth.route.ts          # Auth routes
│   │   ├── camera.route.ts        # Camera routes
│   │   ├── router.ts              # Main router
│   │   ├── user.route.ts          # User routes
│   │   └── zone.route.ts          # Zone routes
│   ├── services/
│   │   ├── auth.services.ts       # Auth business logic
│   │   ├── camera.services.ts     # Camera business logic
│   │   ├── user.services.ts       # User business logic
│   │   └── zone.services.ts       # Zone business logic
│   ├── utils/
│   │   ├── async-handler.ts       # Async error wrapper
│   │   ├── generate-token.ts      # JWT generation
│   │   ├── password.ts            # Password hashing utilities
│   │   ├── response-handler.ts    # Standardized responses
│   │   └── validate-mongo-id.ts   # MongoDB ID validation
│   ├── validator/
│   │   ├── auth.validator.ts      # Auth validation schemas
│   │   ├── camera.validator.ts    # Camera validation schemas
│   │   ├── user.validator.ts      # User validation schemas
│   │   └── zone.validator.ts      # Zone validation schemas
│   └── server.ts                  # Application entry point
├── .env                           # Environment variables (create this)
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

---

## 📖 API Documentation

### Swagger UI

Once the server is running, access the interactive API documentation:

```
http://localhost:5080/api-docs
```

### OpenAPI Specification

The complete OpenAPI 3.1 specification is available at:

```
src/docs/openapi.yaml
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login**: POST to `/api/v1/auth/login` with email and password
2. Receive `accessToken` and `refreshToken`
3. Include `accessToken` in Authorization header: `Bearer <token>`
4. When access token expires, use `/api/v1/auth/refresh` with refresh token

### Authorization Roles

- **Admin**: Full access to all endpoints (user management, camera/zone CRUD)
- **User**: Read access to cameras and zones, profile management

### Protected Routes

Most routes require authentication via JWT. Include the token in the header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗄️ Database Schema

### User Model

```typescript
{
  _id: ObjectId,
  name: string (2-50 chars),
  email: string (unique, validated),
  password: string (hashed with bcrypt),
  role: "admin" | "user",
  createdAt: Date,
  updatedAt: Date
}
```

### Camera Model

```typescript
{
  _id: ObjectId,
  name: string (2-100 chars),
  latitude: number (-90 to 90),
  longitude: number (-180 to 180),
  zone: ObjectId (ref: Zone),
  pole: number (positive integer),
  location?: string (max 200 chars),
  mac_id?: string (MAC address format),
  ip?: string (IPv4 format),
  status: "active" | "inactive",
  notes?: string (max 500 chars),
  history: [{
    date: Date,
    status: "active" | "inactive"
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Zone Model

```typescript
{
  _id: ObjectId,
  name: string (2-100 chars, unique),
  description?: string (max 500 chars),
  location?: string,
  cameras: [ObjectId] (ref: Camera),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint               | Description                 | Auth Required |
| ------ | ---------------------- | --------------------------- | ------------- |
| POST   | `/api/v1/auth/login`   | User login                  | No            |
| POST   | `/api/v1/auth/refresh` | Refresh access token        | No            |
| GET    | `/api/v1/auth/me`      | Get current user profile    | Yes           |
| PUT    | `/api/v1/auth/me`      | Update current user profile | Yes           |

### Users (Admin Only)

| Method | Endpoint            | Description               | Auth Required |
| ------ | ------------------- | ------------------------- | ------------- |
| GET    | `/api/v1/users`     | Get all users (paginated) | Admin         |
| POST   | `/api/v1/users`     | Create new user           | Admin         |
| GET    | `/api/v1/users/:id` | Get user by ID            | Admin         |
| PUT    | `/api/v1/users/:id` | Update user               | Admin         |
| DELETE | `/api/v1/users/:id` | Delete user               | Admin         |

### Cameras

| Method | Endpoint                     | Description                             | Auth Required |
| ------ | ---------------------------- | --------------------------------------- | ------------- |
| GET    | `/api/v1/cameras`            | Get all cameras (paginated, filterable) | Yes           |
| POST   | `/api/v1/cameras`            | Create new camera                       | Admin         |
| POST   | `/api/v1/cameras/bulk`       | Bulk create cameras                     | Admin         |
| GET    | `/api/v1/cameras/stats`      | Get camera statistics                   | Yes           |
| GET    | `/api/v1/cameras/:id`        | Get camera by ID                        | Yes           |
| PUT    | `/api/v1/cameras/:id`        | Update camera                           | Admin         |
| DELETE | `/api/v1/cameras/:id`        | Delete camera                           | Admin         |
| PATCH  | `/api/v1/cameras/:id/status` | Update camera status                    | Admin         |

### Zones

| Method | Endpoint            | Description     | Auth Required |
| ------ | ------------------- | --------------- | ------------- |
| GET    | `/api/v1/zones`     | Get all zones   | Yes           |
| POST   | `/api/v1/zones`     | Create new zone | Admin         |
| GET    | `/api/v1/zones/:id` | Get zone by ID  | Yes           |
| PUT    | `/api/v1/zones/:id` | Update zone     | Admin         |
| DELETE | `/api/v1/zones/:id` | Delete zone     | Admin         |

### Public Endpoints

| Method | Endpoint                     | Description                     | Auth Required     |
| ------ | ---------------------------- | ------------------------------- | ----------------- |
| GET    | `/api/v1/public/cameras-ips` | Get all camera IPs              | Header validation |
| PATCH  | `/api/v1/public/cameras`     | Bulk update camera status by IP | Header validation |

### System

| Method | Endpoint         | Description  | Auth Required |
| ------ | ---------------- | ------------ | ------------- |
| GET    | `/api/v1/health` | Health check | No            |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards

- Follow TypeScript best practices
- Use ESLint and Prettier (if configured)
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation when needed

---

## 👨‍💻 Author

**Md Rejoyan Islam**

- 🌐 Website: [https://md-rejoyan-islam.github.io](https://md-rejoyan-islam.github.io)
- 📧 Email: [rejoyanislam0014@gmail.com](mailto:rejoyanislam0014@gmail.com)
- 🐙 GitHub: [@md-rejoyan-islam](https://github.com/md-rejoyan-islam)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- SUST (Shahjalal University of Science and Technology) for the project opportunity
- The Node.js and TypeScript communities for excellent tools and libraries
- All contributors who help improve this project

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star! ⭐**

Made with ❤️ by [Md Rejoyan Islam](https://github.com/md-rejoyan-islam)

</div>
