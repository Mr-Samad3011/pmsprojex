import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateSupplierModal from "./UpdateSupplierModal";
import { useNavigate } from "react-router-dom";
import AddSupplier from "./AddSupplier";

export default function SupplierList({ setActivePage }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/suppliers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuppliers(res.data);
      setSelectedSupplier(res.data[0] || null);
    } catch (err) {
      alert("Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center">Loading suppliers...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white shadow rounded p-6">

      {/* ================= LEFT LIST ================= */}
      <div className="border rounded p-4">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Find suppliers"
            className="border p-2 rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredSuppliers.map((s) => (
            <div
              key={s._id}
              onClick={() => setSelectedSupplier(s)}
              className={`flex gap-3 p-3 rounded cursor-pointer ${
                selectedSupplier?._id === s._id
                  ? "bg-teal-50 border border-teal-500"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="w-9 h-9 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                {s.supplierName.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{s.supplierName}</p>
                <p className="text-xs text-gray-500">
                  {s.city}, {s.country}
                </p>
              </div>
            </div>
          ))}
        </div>

       <button
  onClick={() => setActivePage("addSupplier")}
  className="mt-4 w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
>
  + Add Supplier
</button>

      </div>

      {/* ================= RIGHT DETAILS ================= */}
      {selectedSupplier && (
        <div className="md:col-span-2 space-y-5">

          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold">
                {selectedSupplier.supplierName}
              </h2>
              <p className="text-gray-500">
                {selectedSupplier.city}, {selectedSupplier.country}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setUpdateModalOpen(true);
                }}
              >
                <FaEdit className="text-yellow-600 text-lg" />
              </button>

              <button
                onClick={() => deleteSupplier(selectedSupplier._id)}
              >
                <FaTrash className="text-red-600 text-lg" />
              </button>
            </div>
          </div>

          {/* BILLING ADDRESS */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Billing Address</h3>
            <p className="text-sm text-gray-700">
              {selectedSupplier.address1}, {selectedSupplier.address2},
              <br />
              {selectedSupplier.city}, {selectedSupplier.state},
              <br />
              {selectedSupplier.country} - {selectedSupplier.zip}
            </p>
          </div>

          {/* REDIRECT LINKS */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-3">Redirect Links</h3>

            <div className="text-sm space-y-2">
              <p><b>Complete URL:</b> {selectedSupplier.completeUrl}</p>
              <p><b>Terminate URL:</b> {selectedSupplier.terminateUrl}</p>
              <p><b>Quotafull URL:</b> {selectedSupplier.quotafullUrl}</p>
              <p><b>Security Terminate URL:</b> {selectedSupplier.securityTerminateUrl}</p>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {updateModalOpen && selectedSupplier && (
        <UpdateSupplierModal
          supplier={selectedSupplier}
          token={token}
          onClose={() => setUpdateModalOpen(false)}
          onUpdate={fetchSuppliers}
        />
      )}
    </div>
  );

  async function deleteSupplier(id) {
    if (!window.confirm("Delete this supplier?")) return;
    await axios.delete(
      `${BASE_URL}/api/admin/suppliers/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchSuppliers();
  }
}
