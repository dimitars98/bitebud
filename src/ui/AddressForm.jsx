import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

function AddressForm() {
  const [openForm, setOpenForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null); // null means "add new"
  const [formData, setFormData] = useState({
    street: "",
    entranceInfo: "",
    floor: "",
    elevator: false,
    entranceInstructions: "",
    additionalInfo: "",
    phone: "",
    label: "Home",
    default: false,
  });

  function handleEditAddress(address) {
    setFormData({
      street: address.street || "",
      entranceInfo: address.entranceInfo || "",
      floor: address.floor || "",
      elevator: address.elevator || false,
      entranceInstructions: address.entranceInstructions || "",
      additionalInfo: address.additionalInfo || "",
      phone: address.phone || "",
      label: address.label || "Home",
      default: address.default || false,
    });
    setEditingAddress(address.id);
    setOpenForm(true);
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to save an address.");
        return;
      }

      if (editingAddress) {
        // Update existing
        const addressDocRef = doc(
          db,
          "users",
          user.uid,
          "addresses",
          editingAddress
        );
        await setDoc(addressDocRef, formData);
        console.log("Address updated:", formData);
      } else {
        // Add new
        const addressRef = collection(db, "users", user.uid, "addresses");
        await addDoc(addressRef, formData);
        console.log("Address saved:", formData);
      }

      setOpenForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Try again.");
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const addressRef = collection(db, "users", user.uid, "addresses");

    const unsubscribe = onSnapshot(addressRef, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAddresses(fetched);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  return (
    <div className="p-4">
      <AnimatePresence>
        {openForm && (
          <motion.form
            key="address-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="max-w-xl w-full mx-auto mt-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl space-y-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {editingAddress ? "Edit Address" : "Add Delivery Address"}
            </h2>

            <div className="space-y-4 text-gray-700 dark:text-white">
              <div>
                <label className="block text-sm font-medium">
                  Street address and number
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Entrance / Apt / Building info
                </label>
                <input
                  type="text"
                  name="entranceInfo"
                  value={formData.entranceInfo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g. Apt 3B, Bldg 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Floor</label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g. 2"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="elevator"
                  checked={formData.elevator}
                  onChange={handleInputChange}
                  id="elevator"
                  className="w-4 h-4 text-amber-400 border-gray-300 focus:ring-amber-400"
                />
                <label htmlFor="elevator" className="text-sm">
                  Building has elevator
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Entrance instructions (e.g. door code or "open")
                </label>
                <input
                  type="text"
                  name="entranceInstructions"
                  value={formData.entranceInstructions}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Additional notes for courier (optional)
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g. Use side entrance, ring the bell..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g. 071 123 456"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Address label
                </label>
                <select
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="default"
                  checked={formData.default}
                  onChange={handleInputChange}
                  id="default"
                  className="w-4 h-4 text-amber-400 border-gray-300 focus:ring-amber-400"
                />
                <label htmlFor="default" className="text-sm">
                  Set as default address
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenForm(false)}
                  className="px-4 py-2 dark:bg-gray-900 bg-gray-200 rounded-lg dark:hover:bg-gray-950 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                >
                  {editingAddress ? "Save Changes" : "Save Address"}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {addresses.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Saved Addresses
          </h3>
          <ul className="space-y-4">
            {addresses.map((address) => (
              <li
                onClick={() => handleEditAddress(address)}
                key={address.id}
                className="p-4 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors duration-300 ease-in shadow"
              >
                <p>
                  <strong>Street:</strong> {address.street}
                </p>
                <p>
                  <strong>Floor:</strong> {address.floor || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {address.phone}
                </p>
                <p>
                  <strong>Label:</strong> {address.label}
                </p>
                {address.default && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                    Default
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!openForm && (
        <button
          onClick={() => setOpenForm(true)}
          className="px-5 py-3 mt-6 bg-amber-400 rounded-xl text-white font-medium hover:bg-amber-500 transition"
        >
          + Add new address
        </button>
      )}
    </div>
  );
}

export default AddressForm;
