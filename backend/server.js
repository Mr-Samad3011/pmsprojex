// // server.js
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import http from "http";
// import cookieParser from "cookie-parser";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import csrf from "csurf";
// import { Server } from "socket.io";

// // ROUTES
// import authRoutes from "./routes/authRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import employeeRoutes from "./routes/employeeRoutes.js";
// import projectSpecificationRoutes from "./routes/projectSpecificationRoutes.js";
// import adminEmployeeRoutes from "./routes/adminEmployeeRoutes.js";
// import projectRoutes from "./routes/projectRoutes.js";
// import groupRoutes from "./routes/groupRoutes.js";
// import supplierRoutes from "./routes/supplierRoutes.js";
// import customerRoutes from "./routes/customerRoutes.js";
// import surveyRoutes from "./routes/surveyRoutes.js";

// // MIDDLEWARE
// import { verifyToken } from "./middleware/authMiddleware.js";

// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// // ================= 🌐 CORS =================
// const allowedOrigins = [
// "https://pmsprojex.vercel.app",
// ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );

// // ================= 🔐 SECURITY =================
// app.use(helmet());

// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//   })
// );

// // ================= 🧠 BODY =================
// app.use(express.json());
// app.use(cookieParser());

// // ================= 🔐 CSRF SETUP =================
// const csrfProtection = csrf({ cookie: true });

// // ✅ CSRF token route (frontend use karega)
// app.get("/api/csrf-token", csrfProtection, (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// // ================= 🔌 SOCKET.IO =================
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("🔌 Socket connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("❌ Socket disconnected:", socket.id);
//   });
// });

// // attach io
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // ================= 🗄️ DATABASE =================
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Atlas Connected"))
//   .catch((err) => console.error("❌ MongoDB Error:", err));

// // ================= 🌍 ROUTES =================

// // ✅ PUBLIC ROUTES (NO CSRF)
// app.use("/api", authRoutes);

// // ================= 🔐 PROTECTED ROUTES =================

// // ✅ Apply CSRF ONLY AFTER LOGIN ROUTES
// app.use("/api/admin", csrfProtection, verifyToken(["Admin"]), adminRoutes);

// app.use(
//   "/api/employee",
//   csrfProtection,
//   verifyToken(["Employee"]),
//   employeeRoutes
// );

// // Projects
// app.use(
//   "/api/admin/projects",
//   csrfProtection,
//   verifyToken(["Admin"]),
//   projectRoutes
// );

// // Project Specification
// app.use(
//   "/api/project-specification",
//   csrfProtection,
//   verifyToken(["Admin", "Employee"]),
//   projectSpecificationRoutes
// );

// // Admin Employees
// app.use(
//   "/api/admin/employees",
//   csrfProtection,
//   verifyToken(["Admin"]),
//   adminEmployeeRoutes
// );

// // Groups
// app.use(
//   "/api/groups",
//   csrfProtection,
//   verifyToken(["Admin", "Employee"]),
//   groupRoutes
// );

// // Suppliers
// app.use(
//   "/api/admin/suppliers",
//   csrfProtection,
//   verifyToken(["Admin"]),
//   supplierRoutes
// );

// // Customers
// app.use(
//   "/api/admin/customers",
//   csrfProtection,
//   verifyToken(["Admin"]),
//   customerRoutes
// );

// // Surveys
// app.use(
//   "/api/admin/surveys",
//   csrfProtection,
//   verifyToken(["Admin", "Employee"]),
//   surveyRoutes
// );

// app.use(
//   "/api/surveys",
//   csrfProtection,
//   verifyToken(["Employee", "Admin"]),
//   surveyRoutes
// );

// // ================= 🏠 HOME =================
// app.get("/", (req, res) => {
//   res.send("🚀 Server running...");
// });

// // ================= 🚨 ERROR HANDLER =================
// app.use((err, req, res, next) => {
//   console.error("❌ ERROR:", err.message);

//   if (err.code === "EBADCSRFTOKEN") {
//     return res.status(403).json({ message: "Invalid CSRF token" });
//   }

//   res.status(500).json({
//     message: err.message || "Internal Server Error",
//   });
// });

// // ================= 🚀 SERVER =================
// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import http from "http";
// import cookieParser from "cookie-parser";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
// import csrf from "csurf";
// import { Server } from "socket.io";

// // ROUTES
// import authRoutes from "./routes/authRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import employeeRoutes from "./routes/employeeRoutes.js";
// import projectSpecificationRoutes from "./routes/projectSpecificationRoutes.js";
// import adminEmployeeRoutes from "./routes/adminEmployeeRoutes.js";
// import projectRoutes from "./routes/projectRoutes.js";
// import groupRoutes from "./routes/groupRoutes.js";
// import supplierRoutes from "./routes/supplierRoutes.js";
// import customerRoutes from "./routes/customerRoutes.js";
// import surveyRoutes from "./routes/surveyRoutes.js";

// // MIDDLEWARE
// import { verifyToken } from "./middleware/authMiddleware.js";

// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// // ================= CORS =================
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://pmsprojex.vercel.app",
//   "https://pmsprojex-sigma.vercel.app",
//   "https://rsconsullting.com",
// ];

// const corsOptions = {
//   origin(origin, callback) {
//     // Requests without Origin (e.g. server-to-server or health checks)
//     if (!origin || allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }

//     console.warn("CORS blocked origin:", origin);
//     return callback(new Error("Origin not allowed by CORS"));
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
// };

// app.use(cors(corsOptions));

// // ================= SECURITY =================
// app.use(helmet());

// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//   })
// );

// // ================= BODY & COOKIES =================
// app.use(express.json());
// app.use(cookieParser());

// // ================= CSRF =================
// const csrfProtection = csrf({ cookie: true });

// app.get("/api/csrf-token", csrfProtection, (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

// // ================= SOCKET.IO =================
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Socket connected:", socket.id);

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });

// // Attach Socket.IO instance to requests
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // ================= DATABASE =================
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Atlas Connected"))
//   .catch((err) => console.error("MongoDB Error:", err));

// // ================= ROUTES =================

// // Authentication routes
// app.use("/api", authRoutes);

// // Protected routes
// app.use(
//   "/api/admin",
//   csrfProtection,
//   verifyToken(["Admin"]),
//   adminRoutes
// );

// app.use(
//   "/api/employee",
//   csrfProtection,
//   verifyToken(["Employee"]),
//   employeeRoutes
// );

// app.use(
//   "/api/admin/projects",
//   csrfProtection,
//   verifyToken(["Admin"]),
//   projectRoutes
// );

// app.use(
//   "/api/project-specification",
//   csrfProtection,
//   verifyToken(["Admin", "Employee"]),
//   projectSpecificationRoutes
// );

// app.use(
//   "/api/admin/employees",
//   csrfProtection,
//   verifyToken(["Admin"]),
//   adminEmployeeRoutes
// );

// app.use(
//   "/api/groups",
//   csrfProtection,
//   verifyToken(["Admin", "Employee"]),
//   groupRoutes
// );

// app.use(
//   "/api/admin/suppliers",
//   csrfProtection,
//   verifyToken(["Admin"]),
//   supplierRoutes
// );

// app.use(
//   "/api/admin/customers",
//   csrfProtection,
//   verifyToken(["Admin"]),
//   customerRoutes
// );

// app.use(
//   "/api/admin/surveys",
//   csrfProtection,
//   verifyToken(["Admin", "Employee"]),
//   surveyRoutes
// );

// app.use(
//   "/api/surveys",
//   csrfProtection,
//   verifyToken(["Employee", "Admin"]),
//   surveyRoutes
// );

// // ================= HOME / HEALTH CHECK =================
// app.get("/", (req, res) => {
//   res.status(200).send("Server running");
// });

// // ================= ERROR HANDLER =================
// app.use((err, req, res, next) => {
//   console.error("Server error:", err.message);

//   if (err.code === "EBADCSRFTOKEN") {
//     return res.status(403).json({
//       message: "Invalid or expired CSRF token",
//     });
//   }

//   if (err.message === "Origin not allowed by CORS") {
//     return res.status(403).json({
//       message: "Origin not allowed",
//     });
//   }

//   return res.status(err.status || 500).json({
//     message: err.message || "Internal Server Error",
//   });
// });

// // ================= START SERVER =================
// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import csrf from "csurf";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import projectSpecificationRoutes from "./routes/projectSpecificationRoutes.js";
import adminEmployeeRoutes from "./routes/adminEmployeeRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import surveyRoutes from "./routes/surveyRoutes.js";

import { verifyToken } from "./middleware/authMiddleware.js";

const app = express();
const server = http.createServer(app);
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = [
  "http://localhost:5173",
  "https://pmsprojex.vercel.app",
  "https://pmsprojex-sigma.vercel.app",
  "https://rsconsullting.com",
];

// ================= CORS =================
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn("CORS blocked origin:", origin);
    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
};

app.use(cors(corsOptions));

// ================= SECURITY =================
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ================= BODY & COOKIES =================
app.use(express.json());
app.use(cookieParser());

// ================= CSRF =================
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  },
});

app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({
    csrfToken: req.csrfToken(),
  });
});

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ================= DATABASE =================
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing from environment variables.");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
    });
}

// ================= AUTH ROUTES =================
// These routes are mounted before protected routes.
app.use("/api", authRoutes);

// ================= PROTECTED ROUTES =================
app.use(
  "/api/admin",
  csrfProtection,
  verifyToken([], ["Admin"]),
  adminRoutes
);

app.use(
  "/api/employee",
  csrfProtection,
  verifyToken([], ["Employee"]),
  employeeRoutes
);

app.use(
  "/api/admin/projects",
  csrfProtection,
  verifyToken([], ["Admin"]),
  projectRoutes
);

app.use(
  "/api/project-specification",
  csrfProtection,
  verifyToken([], ["Admin", "Employee"]),
  projectSpecificationRoutes
);

app.use(
  "/api/admin/employees",
  csrfProtection,
  verifyToken([], ["Admin"]),
  adminEmployeeRoutes
);

app.use(
  "/api/groups",
  csrfProtection,
  verifyToken([], ["Admin", "Employee"]),
  groupRoutes
);

app.use(
  "/api/admin/suppliers",
  csrfProtection,
  verifyToken([], ["Admin"]),
  supplierRoutes
);

app.use(
  "/api/admin/customers",
  csrfProtection,
  verifyToken([], ["Admin"]),
  customerRoutes
);

app.use(
  "/api/admin/surveys",
  csrfProtection,
  verifyToken([], ["Admin", "Employee"]),
  surveyRoutes
);

app.use(
  "/api/surveys",
  csrfProtection,
  verifyToken([], ["Employee", "Admin"]),
  surveyRoutes
);

// ================= HOME / HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).send("PMS backend is running.");
});

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found.",
    path: req.originalUrl,
  });
});

// ================= ERROR HANDLER =================
app.use((error, req, res, next) => {
  console.error("Server error:", error.message);

  if (error.code === "EBADCSRFTOKEN") {
    return res.status(403).json({
      message: "Invalid or expired CSRF token.",
    });
  }

  if (error.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      message: "Origin not allowed.",
    });
  }

  return res.status(error.status || 500).json({
    message:
      error.status && error.status < 500
        ? error.message
        : "Internal Server Error.",
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`PMS backend running on port ${PORT}`);
});

