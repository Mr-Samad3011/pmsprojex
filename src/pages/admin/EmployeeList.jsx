// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FaEdit, FaTrash, FaBan } from "react-icons/fa";

// export default function EmployeeList() {
//   const token = localStorage.getItem("token");

//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({});

//   // 🔹 Fetch employees
//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("https://amd-mind-share-1.onrender.com/api/admin/employees", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Ensure fields always exist
//       const normalizedEmployees = res.data.map((emp) => ({
//         ...emp,
//         contactNumber: emp.contactNumber || "",
//         dob: emp.dob || "",
//         departments: emp.departments || [],
//       }));

//       setEmployees(normalizedEmployees);
//       setLoading(false);
//       console.log("Employees:", normalizedEmployees);
//     } catch (err) {
//       console.error("Fetch Employees Error:", err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // 🔹 Handle input changes
//   const handleChange = (e) => {
//     setEditForm({ ...editForm, [e.target.name]: e.target.value });
//   };

//   // 🔹 Update employee
//   const handleUpdate = async (id) => {
//     try {
//       const payload = {
//         ...editForm,
//         departments: editForm.departments
//           ? editForm.departments.split(",").map((d) => d.trim())
//           : [],
//       };

//       await axios.put(`/api/admin/employees/${id}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setEditingId(null);
//       fetchEmployees();
//     } catch (err) {
//       console.error("Update Employee Error:", err);
//     }
//   };

//   // 🔹 Delete employee
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this employee?")) return;
//     try {
//       await axios.delete(`/api/admin/employees/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchEmployees();
//     } catch (err) {
//       console.error("Delete Employee Error:", err);
//     }
//   };

//   // 🔹 Block / Unblock employee
//   const handleBlock = async (id, currentStatus) => {
//     try {
//       await axios.put(
//         `/api/admin/employees/block/${id}`,
//         { blocked: !currentStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchEmployees();
//     } catch (err) {
//       console.error("Block/Unblock Error:", err);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="bg-white p-6 rounded shadow">
//       <h2 className="text-xl font-semibold mb-4">Employee List</h2>

//       <div className="overflow-x-auto">
//         <table className="w-full border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100 text-center">
//               <th>User ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Departments</th>
//               <th>Position</th>
//               <th>Contact</th>
//               <th>DOB</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {employees.map((emp) => (
//               <tr key={emp._id} className="border-t text-center hover:bg-gray-50">
//                 {/* USER ID */}
//                 <td>{emp.userId}</td>

//                 {/* NAME */}
//                 <td>
//                   {editingId === emp._id ? (
//                     <div className="flex justify-center gap-1">
//                       <input
//                         name="firstName"
//                         value={editForm.firstName || ""}
//                         onChange={handleChange}
//                         className="border px-1 py-0.5 w-20 rounded"
//                       />
//                       <input
//                         name="lastName"
//                         value={editForm.lastName || ""}
//                         onChange={handleChange}
//                         className="border px-1 py-0.5 w-20 rounded"
//                       />
//                     </div>
//                   ) : (
//                     `${emp.firstName} ${emp.lastName}`
//                   )}
//                 </td>

//                 {/* EMAIL */}
//                 <td>
//                   {editingId === emp._id ? (
//                     <input
//                       name="email"
//                       value={editForm.email || ""}
//                       onChange={handleChange}
//                       className="border px-1 py-0.5 w-40 rounded"
//                     />
//                   ) : (
//                     emp.email
//                   )}
//                 </td>

//                 {/* DEPARTMENTS */}
//                 <td>
//                   {editingId === emp._id ? (
//                     <input
//                       name="departments"
//                       value={editForm.departments || ""}
//                       onChange={handleChange}
//                       className="border px-1 py-0.5 w-36 rounded"
//                       placeholder="Comma separated"
//                     />
//                   ) : (
//                     emp.departments.join(", ")
//                   )}
//                 </td>

//                 {/* POSITION */}
//                 <td>
//                   {editingId === emp._id ? (
//                     <input
//                       name="position"
//                       value={editForm.position || ""}
//                       onChange={handleChange}
//                       className="border px-1 py-0.5 w-28 rounded"
//                     />
//                   ) : (
//                     emp.position || "-"
//                   )}
//                 </td>

//                 {/* CONTACT */}
//                 <td>
//                   {editingId === emp._id ? (
//                     <input
//                       name="contactNumber"
//                       value={editForm.contactNumber || ""}
//                       onChange={handleChange}
//                       className="border px-1 py-0.5 w-28 rounded"
//                       placeholder="Enter contact"
//                     />
//                   ) : (
//                     emp.contactNumber || "-"
//                   )}
//                 </td>

//                 {/* DOB */}
//                 <td>
//                   {editingId === emp._id ? (
//                     <input
//                       type="date"
//                       name="dob"
//                       value={
//                         editForm.dob
//                           ? new Date(editForm.dob).toISOString().split("T")[0]
//                           : ""
//                       }
//                       onChange={handleChange}
//                       className="border px-1 py-0.5 rounded"
//                     />
//                   ) : emp.dob ? (
//                     new Date(emp.dob).toLocaleDateString("en-IN")
//                   ) : (
//                     "-"
//                   )}
//                 </td>

//                 {/* ACTIONS */}
//                 <td className="flex justify-center gap-2 py-1">
//                   {editingId === emp._id ? (
//                     <>
//                       <button
//                         onClick={() => handleUpdate(emp._id)}
//                         className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={() => setEditingId(null)}
//                         className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
//                       >
//                         Cancel
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button
//                         onClick={() => {
//                           setEditingId(emp._id);
//                           setEditForm({
//                             firstName: emp.firstName || "",
//                             lastName: emp.lastName || "",
//                             email: emp.email || "",
//                             departments: emp.departments.join(", ") || "",
//                             position: emp.position || "",
//                             contactNumber: emp.contactNumber || "",
//                             dob: emp.dob || "",
//                           });
//                         }}
//                         className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
//                       >
//                         <FaEdit />
//                       </button>

//                       <button
//                         onClick={() => handleDelete(emp._id)}
//                         className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                       >
//                         <FaTrash />
//                       </button>

//                       <button
//                         onClick={() => handleBlock(emp._id, emp.blocked)}
//                         className={`px-2 py-1 rounded text-white ${
//                           emp.blocked ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-600 hover:bg-gray-700"
//                         }`}
//                       >
//                         <FaBan />
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


/* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FaEdit, FaTrash, FaBan } from "react-icons/fa";

// export default function EmployeeList() {
//   const token = localStorage.getItem("token");
//   const BASE_URL = import.meta.env.VITE_BACKEND_URL;

//   const [employees, setEmployees] = useState([]);
//   const [admins, setAdmins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({});
//   const [activeTab, setActiveTab] = useState("Employee");

//   // ================= FETCH EMPLOYEES =================
//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/admin/employees`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setEmployees(
//         res.data.map((emp) => ({
//           ...emp,
//           departments: Array.isArray(emp.departments)
//             ? emp.departments
//             : [emp.departments],
//         }))
//       );
//     } catch (err) {
//       console.error("Fetch Employees Error:", err);
//     }
//   };

//   // ================= FETCH ADMINS =================
//   const fetchAdmins = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/admin/admins`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setAdmins(
//         res.data.map((emp) => ({
//           ...emp,
//           departments: Array.isArray(emp.departments)
//             ? emp.departments
//             : [emp.departments],
//         }))
//       );
//     } catch (err) {
//       console.error("Fetch Admins Error:", err);
//     }
//   };

//   // ================= LOAD BOTH =================
//   useEffect(() => {
//     const loadData = async () => {
//       await Promise.all([fetchEmployees(), fetchAdmins()]);
//       setLoading(false);
//     };
//     loadData();
//   }, []);

//   // ================= HANDLE INPUT =================
//   const handleChange = (emp) => {
//    setEditForm({
//   firstName: emp.firstName || "",
//   lastName: emp.lastName || "",
//   email: emp.email || "",
//   position: emp.position || "",
//   contactNumber: emp.contactNumber || "",
//   dob: emp.dob ? emp.dob.split("T")[0] : "",
//   departments: emp.departments.join(", ") || "",
// });
//   };

//   // ================= UPDATE =================
//   // const handleUpdate = async (id) => {
//   //   try {
//   //     const payload = {
//   //       ...editForm,
//   //       departments: editForm.departments
//   //         ? editForm.departments.split(",").map((d) => d.trim())
//   //         : [],
//   //     };

//   //     await axios.put(`${BASE_URL}/api/admin/employees/${id}`, payload, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     });

//   //     setEditingId(null);
//   //     fetchEmployees();
//   //     fetchAdmins();
//   //   } catch (err) {
//   //     console.error("Update Error:", err);
//   //   }
//   // };
//   const handleUpdate = async (id) => {
//   try {
//     const payload = {
//       firstName: editForm.firstName || "",
//       lastName: editForm.lastName || "",
//       email: editForm.email || "",
//       position: editForm.position || "",
//       contactNumber: editForm.contactNumber || "",
//       dob: editForm.dob || "",
//       departments: editForm.departments
//         ? editForm.departments.split(",").map((d) => d.trim())
//         : [],
//       // ❌ userId intentionally NOT included
//     };

//     await axios.put(`${BASE_URL}/api/admin/employees/${id}`, payload, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     setEditingId(null);
//     fetchEmployees();
//     fetchAdmins();
//   } catch (err) {
//     console.error("Update Error:", err);
//   }
// };


//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;

//     try {
//       await axios.delete(`${BASE_URL}/api/admin/employees/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       fetchEmployees();
//       fetchAdmins();
//     } catch (err) {
//       console.error("Delete Error:", err);
//     }
//   };

//   // ================= BLOCK =================
//   const handleBlock = async (id, currentStatus) => {
//     try {
//       await axios.put(
//         `${BASE_URL}/api/admin/employees/block/${id}`,
//         { blocked: !currentStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       fetchEmployees();
//       fetchAdmins();
//     } catch (err) {
//       console.error("Block Error:", err);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   // ================= TAB DATA =================
//   const filteredEmployees =
//     activeTab === "Employee" ? employees : admins;

//   return (
//     <div className="bg-white p-6 rounded shadow">
//       <h2 className="text-xl font-semibold mb-4">
//         {activeTab} List
//       </h2>

//       {/* ================= TABS ================= */}
//       <div className="flex mb-4 border-b">
//         <button
//           onClick={() => setActiveTab("Employee")}
//           className={`px-4 py-2 ${
//             activeTab === "Employee"
//               ? "bg-white border-t border-l border-r"
//               : "bg-gray-100"
//           }`}
//         >
//           Employees
//         </button>

//         <button
//           onClick={() => setActiveTab("Admin")}
//           className={`px-4 py-2 ${
//             activeTab === "Admin"
//               ? "bg-white border-t border-l border-r"
//               : "bg-gray-100"
//           }`}
//         >
//           Admins
//         </button>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="overflow-x-auto">
//         <table className="w-full border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100 text-center">
//               <th>User ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Departments</th>
//               <th>Position</th>
//               <th>Contact</th>
//               <th>DOB</th>
//               <th>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredEmployees.map((emp) => (
//               <tr key={emp._id} className="border-t text-center">
//                 <td>{emp.userId}</td>

//                 <td>
//                   {editingId === emp._id ? (
//                     <>
//                       <input
//                         name="firstName"
//                         value={editForm.firstName || ""}
//                         onChange={handleChange}
//                         className="border px-1 w-20"
//                       />
//                       <input
//                         name="lastName"
//                         value={editForm.lastName || ""}
//                         onChange={handleChange}
//                         className="border px-1 w-20"
//                       />
//                     </>
//                   ) : (
//                     `${emp.firstName} ${emp.lastName}`
//                   )}
//                 </td>

//                 <td>{emp.email}</td>

//                 <td>
//                   {editingId === emp._id ? (
//                     <input
//                       name="departments"
//                       value={editForm.departments || ""}
//                       onChange={handleChange}
//                       className="border px-1 w-32"
//                     />
//                   ) : (
//                     emp.departments.join(", ")
//                   )}
//                 </td>

//                 <td>{emp.position || "-"}</td>
//                 <td>{emp.contactNumber || "-"}</td>
//                 <td>
//                   {emp.dob
//                     ? new Date(emp.dob).toLocaleDateString("en-IN")
//                     : "-"}
//                 </td>

//                 <td className="flex justify-center gap-2">
//                   {editingId === emp._id ? (
//                     <>
//                       <button
//                         onClick={() => handleUpdate(emp._id)}
//                         className="bg-green-500 text-white px-2"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={() => setEditingId(null)}
//                         className="bg-gray-400 text-white px-2"
//                       >
//                         Cancel
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button
//                         onClick={() => {
//                           setEditingId(emp._id);
//                           setEditForm({
//                             firstName: emp.firstName,
//                             lastName: emp.lastName,
//                             departments: emp.departments.join(", "),
//                           });
//                         }}
//                         className="bg-blue-500 text-white px-2"
//                       >
//                         <FaEdit />
//                       </button>

//                       <button
//                         onClick={() => handleDelete(emp._id)}
//                         className="bg-red-500 text-white px-2"
//                       >
//                         <FaTrash />
//                       </button>

//                       <button
//                         onClick={() =>
//                           handleBlock(emp._id, emp.blocked)
//                         }
//                         className="bg-gray-600 text-white px-2"
//                       >
//                         <FaBan />
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaBan } from "react-icons/fa";

export default function EmployeeList() {
  const token = localStorage.getItem("token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const [employees, setEmployees] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState("Employee");

  // ================= FETCH EMPLOYEES =================
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = res.data.reverse(); // 🔥 reverse order
      setEmployees(sorted);
    } catch (err) {
      console.error("Fetch Employees Error:", err);
    }
  };

  // ================= FETCH ADMINS =================
  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = res.data.reverse(); // 🔥 reverse order
      setAdmins(sorted);
    } catch (err) {
      console.error("Fetch Admins Error:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchEmployees(), fetchAdmins()]);
      setLoading(false);
    };
    load();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // ================= UPDATE =================
  const handleUpdate = async (id) => {
    try {
      const payload = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        position: editForm.position,
        contactNumber: editForm.contactNumber,
        dob: editForm.dob,
        departments: [editForm.departments], // 🔥 dropdown based
      };

      await axios.put(`${BASE_URL}/api/admin/employees/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditingId(null);
      fetchEmployees();
      fetchAdmins();
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/admin/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchEmployees();
      fetchAdmins();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // ================= BLOCK =================
  const handleBlock = async (id, currentStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/api/admin/employees/block/${id}`,
        { blocked: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchEmployees();
      fetchAdmins();
    } catch (err) {
      console.error("Block Error:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  const filteredEmployees =
    activeTab === "Employee" ? employees : admins;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{activeTab} List</h2>

      {/* ================= TABS ================= */}
      <div className="flex mb-4 border-b">
        <button
          onClick={() => setActiveTab("Employee")}
          className={`px-4 py-2 ${
            activeTab === "Employee"
              ? "bg-white border-t border-l border-r"
              : "bg-gray-100"
          }`}
        >
          Employees
        </button>

        <button
          onClick={() => setActiveTab("Admin")}
          className={`px-4 py-2 ${
            activeTab === "Admin"
              ? "bg-white border-t border-l border-r"
              : "bg-gray-100"
          }`}
        >
          Admins
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th>Sr No.</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Contact</th>
              <th>DOB</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((emp, index) => (
              <tr key={emp._id} className="border-t text-center">
                <td>{index + 1}</td>

                <td>{emp.userId}</td>

                <td>
                  {editingId === emp._id ? (
                    <>
                      <input
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleChange}
                        className="border px-1 w-20"
                      />
                      <input
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleChange}
                        className="border px-1 w-20"
                      />
                    </>
                  ) : (
                    `${emp.firstName} ${emp.lastName}`
                  )}
                </td>

                <td>
                  {editingId === emp._id ? (
                    <input
                      name="email"
                      value={editForm.email}
                      onChange={handleChange}
                      className="border px-1 w-36"
                    />
                  ) : (
                    emp.email
                  )}
                </td>

                <td>
                  {editingId === emp._id ? (
                    <select
                      name="departments"
                      value={editForm.departments}
                      onChange={handleChange}
                      className="border px-1"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Admin">Admin</option>
                    </select>
                  ) : (
                    emp.departments?.[0]
                  )}
                </td>

                <td>
                  {editingId === emp._id ? (
                    <input
                      name="position"
                      value={editForm.position}
                      onChange={handleChange}
                      className="border px-1 w-28"
                    />
                  ) : (
                    emp.position || "-"
                  )}
                </td>

                <td>
                  {editingId === emp._id ? (
                    <input
                      name="contactNumber"
                      value={editForm.contactNumber}
                      onChange={handleChange}
                      className="border px-1 w-28"
                    />
                  ) : (
                    emp.contactNumber || "-"
                  )}
                </td>

                <td>
                  {editingId === emp._id ? (
                    <input
                      type="date"
                      name="dob"
                      value={editForm.dob}
                      onChange={handleChange}
                      className="border px-1"
                    />
                  ) : emp.dob ? (
                    new Date(emp.dob).toLocaleDateString("en-IN")
                  ) : (
                    "-"
                  )}
                </td>

                <td className="flex justify-center gap-2">
                  {editingId === emp._id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(emp._id)}
                        className="bg-green-500 text-white px-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-2"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(emp._id);
                          setEditForm({
                            firstName: emp.firstName,
                            lastName: emp.lastName,
                            email: emp.email,
                            position: emp.position || "",
                            contactNumber: emp.contactNumber || "",
                            dob: emp.dob
                              ? emp.dob.split("T")[0]
                              : "",
                            departments: emp.departments?.[0],
                          });
                        }}
                        className="bg-blue-500 text-white px-2"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="bg-red-500 text-white px-2"
                      >
                        <FaTrash />
                      </button>

                      <button
                        onClick={() =>
                          handleBlock(emp._id, emp.blocked)
                        }
                        className="bg-gray-600 text-white px-2"
                      >
                        <FaBan />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
