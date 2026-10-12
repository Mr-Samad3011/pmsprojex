


// // middleware/authMiddleware.js
// import jwt from "jsonwebtoken";

// export const verifyToken = (allowedDepartments = [], allowedRoles = []) => {
//   return (req, res, next) => {
//     try {
//       // 🍪 1. Token from cookie (PRIMARY METHOD)
//       let token = req.cookies?.token;

//       // 🔄 2. Fallback for Postman / testing (Authorization header)
//       if (!token && req.headers.authorization?.startsWith("Bearer ")) {
//         token = req.headers.authorization.split(" ")[1];
//       }

//       // ❌ 3. No token found
//       if (!token) {
//         return res.status(401).json({
//           message: "Unauthorized: No token provided",
//         });
//       }

//       // 🔐 4. Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // ================= 🧠 USER DATA NORMALIZATION =================

//       // Ensure departments is always array + lowercase
//       const userDepartments = Array.isArray(decoded.departments)
//         ? decoded.departments.map((d) => d.toLowerCase())
//         : [decoded.departments?.toLowerCase() || ""];

//       // Normalize roles
//       const userRole = decoded.role?.toLowerCase() || "";

//       // ================= 🎯 ACCESS CONTROL =================

//       // Normalize allowed departments
//       const allowedDeptLower = allowedDepartments.map((d) =>
//         d.toLowerCase()
//       );

//       // Normalize allowed roles
//       const allowedRolesLower = allowedRoles.map((r) =>
//         r.toLowerCase()
//       );

//       // ✅ Department check
//       if (
//         allowedDepartments.length &&
//         !userDepartments.some((dept) =>
//           allowedDeptLower.includes(dept)
//         )
//       ) {
//         return res.status(403).json({
//           message: "Access denied: insufficient department",
//         });
//       }

//       // ✅ Role check
//       if (
//         allowedRoles.length &&
//         !allowedRolesLower.includes(userRole)
//       ) {
//         return res.status(403).json({
//           message: "Access denied: insufficient role",
//         });
//       }

//       // ================= ✅ SUCCESS =================

//       // Attach full user data
//       req.user = decoded;

//       next();
//     } catch (err) {
//       console.error("Auth Error:", err.message);

//       return res.status(401).json({
//         message: "Invalid or expired token",
//       });
//     }
//   };
// };


import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= SIGNUP =================
router.post(
  "/signup",
  [
    body("firstName").notEmpty().withMessage("First name required"),
    body("lastName").notEmpty().withMessage("Last name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, password, userId, role } =
        req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        userId,
        role: role || "Employee",
      });

      await user.save();

      return res.status(201).json({
        msg: "Signup successful",
      });
    } catch (err) {
      console.error("Signup Error:", err);
      return res.status(500).json({ msg: "Server error" });
    }
  }
);

// ================= LOGIN =================
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      console.log("Login attempt:", email);

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          msg: "Invalid email or password",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          msg: "Invalid email or password",
        });
      }

      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured");
        return res.status(500).json({ msg: "Server configuration error" });
      }

      const departments = Array.isArray(user.departments)
        ? user.departments
        : user.departments
          ? [user.departments]
          : [];

      const token = jwt.sign(
        {
          id: user._id,
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          departments,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const isProduction = process.env.NODE_ENV === "production";

      res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({
        msg: "Login successful",
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          userId: user.userId,
          role: user.role,
          departments,
        },
      });
    } catch (err) {
      console.error("Login Error:", err);
      return res.status(500).json({ msg: "Server error" });
    }
  }
);

// ================= CURRENT LOGGED-IN USER =================
// URL: GET /api/auth/me
router.get("/auth/me", verifyToken(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const departments = Array.isArray(user.departments)
      ? user.departments
      : user.departments
        ? [user.departments]
        : [];

    return res.json({
      authenticated: true,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        userId: user.userId,
        role: user.role,
        departments,
      },
    });
  } catch (err) {
    console.error("Current User Error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ================= LOGOUT =================
router.post("/logout", (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.json({
      msg: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

export default router;
