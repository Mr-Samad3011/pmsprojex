


// /* eslint-disable no-unused-vars */
// import { Navigate } from "react-router-dom";

// /**
//  * ProtectedRoute ensures that only authorized users can access a route.
//  * @param {ReactNode} children - Components to render if access is allowed
//  * @param {Array<string>} allowedDepartments - Array of allowed departments (case-insensitive)
//  * @param {string} permission - Optional permission check
//  */
// export default function ProtectedRoute({ children, allowedDepartments = [], permission }) {
//   const token = localStorage.getItem("token");
//   let user = null;

//   // Safely parse user from localStorage
//   try {
//     user = JSON.parse(localStorage.getItem("user"));
//   } catch (err) {
//     console.warn("Failed to parse user from localStorage:", err);
//     user = null;
//   }

//   // 🚫 Not logged in
//   if (!token || !user) return <Navigate to="/" replace />;

//   // Ensure departments is always an array
//   const departments = Array.isArray(user.departments) ? user.departments : [user.departments];

//   // Case-insensitive department check
//   const allowedLower = allowedDepartments.map((dep) => dep.toLowerCase());
//   const userLower = departments.map((dep) => dep.toLowerCase());

//   const hasAccess = userLower.some((dep) => allowedLower.includes(dep));

//   if (allowedDepartments.length > 0 && !hasAccess) {
//     return <Navigate to="/" replace />;
//   }

//   // Optional permission check
//   if (permission && !user.permissions?.includes(permission)) {
//     return <Navigate to="/" replace />;
//   }

//   // ✅ Authorized: render children
//   return children;
// }



import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProtectedRoute({
  children,
  allowedDepartments = [],
  permission,
}) {
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        // Backend se cookie-based authentication verify karo
        const response = await axios.get(
          `${BASE_URL}/api/auth/me`,
          { withCredentials: true }
        );

        if (!active) return;

        const currentUser = response.data.user;

        if (!currentUser) {
          setStatus("unauthenticated");
          return;
        }

        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));

        const departments = (
          Array.isArray(currentUser.departments)
            ? currentUser.departments
            : [currentUser.departments].filter(Boolean)
        ).map((department) => String(department).toLowerCase());

        const allowed = allowedDepartments.map((department) =>
          String(department).toLowerCase()
        );

        if (
          allowed.length > 0 &&
          !departments.some((department) => allowed.includes(department))
        ) {
          setStatus("forbidden");
          return;
        }

        if (
          permission &&
          !currentUser.permissions?.includes(permission)
        ) {
          setStatus("forbidden");
          return;
        }

        setStatus("authenticated");
      } catch (error) {
        if (!active) return;

        console.error(
          "Session verification failed:",
          error.response?.data || error.message
        );

        setStatus("unauthenticated");
      }
    };

    verifySession();

    return () => {
      active = false;
    };
  }, [allowedDepartments, permission]);

  if (status === "checking") {
    return <div className="p-6 text-center">Checking login...</div>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/" replace />;
  }

  if (status === "forbidden") {
    return <Navigate to="/" replace />;
  }

  return children;
}
