// // middleware/authMiddleware.js
// import jwt from "jsonwebtoken";

// export const verifyToken = (allowedDepartments = []) => {
//   return (req, res, next) => {
//     try {
//       const authHeader = req.headers.authorization;

//       // Authorization header missing
//       if (!authHeader) {
//         return res.status(401).json({ message: "Authorization header missing" });
//       }

//       // Bearer token format check
//       if (!authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Invalid token format" });
//       }

//       const token = authHeader.split(" ")[1];

//       if (!token) {
//         return res.status(401).json({ message: "Token not provided" });
//       }

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");

//       // Ensure departments is an array
//       const userDepartments = Array.isArray(decoded.departments)
//         ? decoded.departments.map((d) => d.toLowerCase())
//         : [decoded.departments?.toLowerCase() || ""];

//       // Check allowed departments (case-insensitive)
//       const allowed = allowedDepartments.map((d) => d.toLowerCase());
//       if (allowedDepartments.length && !userDepartments.some((d) => allowed.includes(d))) {
//         return res.status(403).json({ message: "Access denied: insufficient department" });
//       }

//       // Attach user to request
//       req.user = decoded;

//       next();
//     } catch (err) {
//       console.error("Auth Error:", err.message);
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }
//   };
// };


// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (allowedDepartments = [], allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // 🍪 1. Token from cookie (PRIMARY METHOD)
      let token = req.cookies?.token;

      // 🔄 2. Fallback for Postman / testing (Authorization header)
      if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }

      // ❌ 3. No token found
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized: No token provided",
        });
      }

      // 🔐 4. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ================= 🧠 USER DATA NORMALIZATION =================

      // Ensure departments is always array + lowercase
      const userDepartments = Array.isArray(decoded.departments)
        ? decoded.departments.map((d) => d.toLowerCase())
        : [decoded.departments?.toLowerCase() || ""];

      // Normalize roles
      const userRole = decoded.role?.toLowerCase() || "";

      // ================= 🎯 ACCESS CONTROL =================

      // Normalize allowed departments
      const allowedDeptLower = allowedDepartments.map((d) =>
        d.toLowerCase()
      );

      // Normalize allowed roles
      const allowedRolesLower = allowedRoles.map((r) =>
        r.toLowerCase()
      );

      // ✅ Department check
      if (
        allowedDepartments.length &&
        !userDepartments.some((dept) =>
          allowedDeptLower.includes(dept)
        )
      ) {
        return res.status(403).json({
          message: "Access denied: insufficient department",
        });
      }

      // ✅ Role check
      if (
        allowedRoles.length &&
        !allowedRolesLower.includes(userRole)
      ) {
        return res.status(403).json({
          message: "Access denied: insufficient role",
        });
      }

      // ================= ✅ SUCCESS =================

      // Attach full user data
      req.user = decoded;

      next();
    } catch (err) {
      console.error("Auth Error:", err.message);

      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
};