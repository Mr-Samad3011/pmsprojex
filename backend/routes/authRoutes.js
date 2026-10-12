
// import express from "express";
// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const router = express.Router();

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1️⃣ Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ msg: "Invalid email or password" });
//     }

//     let isPasswordValid = false;

//     // 2️⃣ Check password (hashed or old plain text)
//     if (user.password.startsWith("$2")) {
//       isPasswordValid = await bcrypt.compare(password, user.password);
//     } else {
//       isPasswordValid = password === user.password;
//       if (isPasswordValid) {
//         const hashed = await bcrypt.hash(password, 10);
//         user.password = hashed;
//         await user.save();
//       }
//     }

//     if (!isPasswordValid) {
//       return res.status(401).json({ msg: "Invalid email or password" });
//     }

//     // 3️⃣ JWT token (only include user ID)
//    const token = jwt.sign(
//   {
//     id: user._id,
//     userId: user.userId,
//      firstName: user.firstName,   // 🔥 ADD THIS
//     lastName: user.lastName,
//     departments: Array.isArray(user.departments) ? user.departments : [user.departments],
//   },
//   process.env.JWT_SECRET,
//   { expiresIn: "1d" }
// );

//     // 4️⃣ Ensure departments is always an array
//     const departments = Array.isArray(user.departments)
//       ? user.departments
//       : [user.departments];

//     // 5️⃣ Send response
//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name || `${user.firstName} ${user.lastName}`,
//         email: user.email,
//         userId: user.userId,
//         departments, // <-- use this for frontend redirects
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// export default router;


import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

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
      // 🔍 Validation check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, password, userId, role } = req.body;

      // check existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // hash password
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

      res.status(201).json({ msg: "Signup successful" });
    } catch (err) {
      console.error("Signup Error:", err);
      res.status(500).json({ msg: "Server error" });
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
      // 🔍 Validation check
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      console.log("🔐 Login attempt:", email);

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ msg: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ msg: "Invalid email or password" });
      }

      // 🔐 JWT Token
      const token = jwt.sign(
        {
          id: user._id,
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          departments: Array.isArray(user.departments)
            ? user.departments
            : [user.departments],
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // 🍪 Secure Cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        msg: "Login successful",
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          userId: user.userId,
          role: user.role,
          departments: Array.isArray(user.departments)
            ? user.departments
            : [user.departments],
        },
      });
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);


router.get("/auth/me", async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        message: "Please log in.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        authenticated: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        id: user._id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email,
        userId: user.userId,
        role: user.role,
        departments: Array.isArray(user.departments)
          ? user.departments
          : user.department
            ? [user.department]
            : [],
      },
    });
  } catch (error) {
    console.error("Session verification error:", error.message);

    return res.status(401).json({
      authenticated: false,
      message: "Invalid or expired session.",
    });
  }
});

// ================= LOGOUT =================
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    //  res.clearCookie("_csrf");
    res.json({ msg: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
