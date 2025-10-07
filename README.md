# 🔐 Authify – Secure JWT-Based Authentication System

**Authify** is a robust authentication and authorization system built with **Spring Boot**, **React.js**, and **JWT (JSON Web Token)**.
It provides secure login, registration, OTP verification, and password reset flows with a modern RESTful design.

---

## 🚀 Features

* **User Authentication** – Login & Registration with JWT.
* **Token-based Authorization** – Stateless session handling using JWT.
* **Email OTP Verification** – Secure verification for account and password reset.
* **Password Reset Flow** – Reset password using OTP sent to registered email.
* **Cookie-based Token Management** – JWT stored in HttpOnly cookies for enhanced security.
* **Logout Handling** – Secure cookie invalidation on logout.
* **CORS Configuration** – Supports frontend (React) integration.
* **Spring Security Integration** – Role-based access and request filtering.

---

## 🧩 Tech Stack

### 🖥 Backend

* **Spring Boot 3+**
* **Spring Security**
* **JWT (JSON Web Token)**
* **Java Mail (Jakarta Mail)**
* **Lombok**
* **MySQL / PostgreSQL**
* **Maven**

### 💻 Frontend

* **React.js**
* **Axios**
* **React Router**
* **React Toastify**

---

## ⚙️ Project Structure

```
Authify/
├── backend/
│   ├── src/main/java/com/authify/
│   │   ├── controllers/      # REST controllers
│   │   ├── filters/          # JWT filter for token validation
│   │   ├── service/          # Service layer for business logic
│   │   ├── utils/            # JWT utilities and helpers
│   │   ├── entities/         # JPA entities
│   │   └── AuthifyApplication.java
│   └── resources/
│       ├── application.properties   # Environment configs
│       └── templates/        # Thymeleaf email templates
│
└── frontend/
    ├── src/
    │   ├── pages/            # Login, Register, ResetPassword, VerifyOTP
    │   ├── context/          # Auth context provider
    │   ├── utils/            # Constants and helpers
    │   └── App.jsx
    └── package.json
```

---

## 🔑 API Endpoints

| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| POST   | `/login`            | Authenticate user and issue JWT |
| POST   | `/register`         | Register new user               |
| GET    | `/is-authenticated` | Verify authentication status    |
| POST   | `/send-otp`         | Send account verification OTP   |
| POST   | `/verify-otp`       | Verify account using OTP        |
| POST   | `/send-reset-otp`   | Send password reset OTP         |
| POST   | `/reset-password`   | Reset user password             |
| POST   | `/logout`           | Invalidate JWT cookie           |

---

## 🔐 JWT Flow Overview

1. User logs in with credentials.
2. Server validates credentials and generates a **JWT**.
3. JWT is stored in **HttpOnly Cookie**.
4. For each request, JWT is validated by the `JwtFilter`.
5. Upon logout, the JWT cookie is cleared.

---

## ⚙️ CORS Configuration

Backend is configured to allow requests from the React frontend:

```java
config.setAllowedOrigins(List.of("http://localhost:5173"));
config.setAllowCredentials(true);
source.registerCorsConfiguration("/**", config);
```

---

## 🧠 How to Run Locally

### 🖥 Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 📧 Email & OTP Template

Authify uses **Thymeleaf** templates for emails (e.g., OTP verification and password reset).
Each email includes:

* Company logo
* Personalized greeting
* Secure OTP (no reset link)

---

## 🧑‍💻 Developer Notes

* Use `@CurrentSecurityContext(expression = "authentication?.name")` to access the logged-in user email in controllers.
* JWT validation is handled globally through a `JwtFilter`.
* CORS and cookie-based authentication are fully enabled for cross-origin frontend-backend communication.

---

## 🧾 License

This project is licensed under the **MIT License**.
Feel free to modify and use it for your own authentication systems.

---

**Developed with ❤️ by [Suman Roy](https://github.com/sumanroy03)**
Backend: Spring Boot | Frontend: React.js | Authentication: JWT
