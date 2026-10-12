// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import csrf from "csurf";
import { Server } from "socket.io";

// ROUTES
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

// MIDDLEWARE
import { verifyToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ================= 🌐 CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  "https://inexperienced-wilma-protostelic.ngrok-free.dev",
  "https://rsconsullting.com",
  "https://pmsprojex-sigma.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ================= 🔐 SECURITY =================
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// ================= 🧠 BODY =================
app.use(express.json());
app.use(cookieParser());

// ================= 🔐 CSRF SETUP =================
const csrfProtection = csrf({ cookie: true });

// ✅ CSRF token route (frontend use karega)
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ================= 🔌 SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// attach io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ================= 🗄️ DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ================= 🌍 ROUTES =================

// ✅ PUBLIC ROUTES (NO CSRF)
app.use("/api", authRoutes);

// ================= 🔐 PROTECTED ROUTES =================

// ✅ Apply CSRF ONLY AFTER LOGIN ROUTES
app.use("/api/admin", csrfProtection, verifyToken(["Admin"]), adminRoutes);

app.use(
  "/api/employee",
  csrfProtection,
  verifyToken(["Employee"]),
  employeeRoutes
);

// Projects
app.use(
  "/api/admin/projects",
  csrfProtection,
  verifyToken(["Admin"]),
  projectRoutes
);

// Project Specification
app.use(
  "/api/project-specification",
  csrfProtection,
  verifyToken(["Admin", "Employee"]),
  projectSpecificationRoutes
);

// Admin Employees
app.use(
  "/api/admin/employees",
  csrfProtection,
  verifyToken(["Admin"]),
  adminEmployeeRoutes
);

// Groups
app.use(
  "/api/groups",
  csrfProtection,
  verifyToken(["Admin", "Employee"]),
  groupRoutes
);

// Suppliers
app.use(
  "/api/admin/suppliers",
  csrfProtection,
  verifyToken(["Admin"]),
  supplierRoutes
);

// Customers
app.use(
  "/api/admin/customers",
  csrfProtection,
  verifyToken(["Admin"]),
  customerRoutes
);

// Surveys
app.use(
  "/api/admin/surveys",
  csrfProtection,
  verifyToken(["Admin", "Employee"]),
  surveyRoutes
);

app.use(
  "/api/surveys",
  csrfProtection,
  verifyToken(["Employee", "Admin"]),
  surveyRoutes
);

// ================= 🏠 HOME =================
app.get("/", (req, res) => {
  res.send("🚀 Server running...");
});

// ================= 🚨 ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

// ================= 🚀 SERVER =================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import http from "http";
// import cookieParser from "cookie-parser";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
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

// // ================= 🌐 CORS (SAFE) =================
// app.use(
//   cors({
//     origin: true, // allow all temporarily
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

// // ================= 🔌 SOCKET.IO =================
// const io = new Server(server, {
//   cors: {
//     origin: "*",
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
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => {
//     console.error("❌ MongoDB Error:", err);
//   });

// // ================= 🌍 ROUTES =================

// // PUBLIC
// app.use("/api", authRoutes);

// // PROTECTED
// app.use("/api/admin", verifyToken(["Admin"]), adminRoutes);
// app.use("/api/employee", verifyToken(["Employee"]), employeeRoutes);
// app.use("/api/admin/projects", verifyToken(["Admin"]), projectRoutes);
// app.use("/api/project-specification", verifyToken(["Admin", "Employee"]), projectSpecificationRoutes);
// app.use("/api/admin/employees", verifyToken(["Admin"]), adminEmployeeRoutes);
// app.use("/api/groups", verifyToken(["Admin", "Employee"]), groupRoutes);
// app.use("/api/admin/suppliers", verifyToken(["Admin"]), supplierRoutes);
// app.use("/api/admin/customers", verifyToken(["Admin"]), customerRoutes);
// app.use("/api/admin/surveys", verifyToken(["Admin", "Employee"]), surveyRoutes);
// app.use("/api/surveys", verifyToken(["Employee", "Admin"]), surveyRoutes);

// // ================= 🏠 HOME =================
// app.get("/", (req, res) => {
//   res.send("🚀 Server running...");
// });

// // ================= 🚨 ERROR HANDLER =================
// app.use((err, req, res, next) => {
//   console.error("❌ ERROR:", err.message);
//   res.status(500).json({
//     message: err.message || "Internal Server Error",
//   });
// });

// // ================= 🚀 SERVER =================
// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
