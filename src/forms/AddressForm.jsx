import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { geocodeAddress } from "../utils/geocode";
import CustomLabelDropdown from "../ui/CustomLabelDropdown";
import Modal from "../modals/Modal";
import DropdownActionsMenu from "../ui/DropdownActionsMenu";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import Error from "../ui/Error";
import { useAddresses } from "./useAddresses";

const defaultValues = {
  street: "",
  entranceInfo: "",
  floor: "",
  elevator: false,
  entranceInstructions: "",
  additionalInfo: "",
  phone: "",
  label: "Home",
  default: false,
};

function AddressForm({ onSuccess }) {
  const [openForm, setOpenForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  function handleEditAddress(address) {
    Object.entries(address).forEach(([key, value]) => {
      if (key in defaultValues) {
        setValue(key, value);
      }
    });

    setEditingAddress(address.id);
    setOpenForm(true);
  }

  const onSubmit = async (data) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to save an address.");
        return;
      }

      const location = await geocodeAddress(data.street);
      const dataToSave = {
        ...data,
        location,
      };

      if (editingAddress) {
        const addressDocRef = doc(
          db,
          "users",
          user.uid,
          "addresses",
          editingAddress
        );
        await setDoc(addressDocRef, dataToSave);
      } else {
        const addressRef = collection(db, "users", user.uid, "addresses");
        await addDoc(addressRef, dataToSave);
      }

      toast.success(editingAddress ? "Changes saved" : "Address saved!");
      reset();
      setOpenForm(false);
      setEditingAddress(null);
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to save address. Try again.");
    }
  };

  const { addresses, loading: addressesLoading } = useAddresses();

  async function confirmDelete() {
    if (!addressToDelete) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to delete an address.");
        return;
      }

      const addressRef = doc(
        db,
        "users",
        user.uid,
        "addresses",
        addressToDelete.id
      );
      await deleteDoc(addressRef);

      toast.success("Address deleted successfully!");

      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
    } catch (error) {
      toast.error("Failed to delete address. Try again.");
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      <Modal isOpen={openForm} onClose={() => setOpenForm(false)}>
        <Modal.CloseButton />
        <Modal.Header>
          {editingAddress ? "Edit Address" : "Add Delivery Address"}
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-xl mx-auto mt-2 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl space-y-6"
          >
            <div className="space-y-5 text-gray-700 dark:text-white">
              <div>
                <label className="block text-sm font-medium">
                  Street address and number
                </label>
                <input
                  type="text"
                  name="street"
                  {...register("street", {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                  placeholder="123 Main Street"
                />
                {errors.street && <Error>{errors.street.message}</Error>}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Entrance / Apt / Building info
                </label>
                <input
                  type="text"
                  name="entranceInfo"
                  {...register("entranceInfo", {
                    required: "This field is required",
                  })}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Floor</label>
                <input
                  type="text"
                  name="floor"
                  {...register("floor", { required: "This field is required" })}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                />
                {errors.floor && <Error>{errors.floor.message}</Error>}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="elevator"
                  {...register("elevator")}
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
                  {...register("entranceInstructions")}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Additional notes for courier (optional)
                </label>
                <textarea
                  name="additionalInfo"
                  {...register("additionalInfo")}
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
                  {...register("phone", { required: "This field is required" })}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g. 071 123 456"
                />
                {errors.phone && <Error>{errors.phone.message}</Error>}
              </div>

              <div>
                {/* <label className="block text-sm font-medium">
                  Address label
                </label> */}
                <CustomLabelDropdown
                  value={watch("label")}
                  onChange={(val) => setValue("label", val)}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="default"
                  {...register("default")}
                  id="default"
                  className="w-4 h-4 text-amber-400 border-gray-300 focus:ring-amber-400"
                />
                <label htmlFor="default" className="text-sm">
                  Set as default address
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setOpenForm(false);
                  setEditingAddress(null);
                }}
                className="px-4 py-2  bg-gray-200 rounded-lg dark:bg-gray-700 dark:hover:bg-gray-600 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-400 transition"
              >
                {editingAddress ? "Save Changes" : "Save Address"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {addresses.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          You haven’t added any addresses yet
        </p>
      )}
      {addresses.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Saved Addresses
          </h3>
          <ul className="space-y-4">
            {addresses.map((address) => (
              <li
                key={address.id}
                className={`p-4 rounded-xl text-sm sm:text-base bg-white dark:bg-gray-800 cursor-pointer transition-colors duration-300 ease-in shadow ${
                  openDropdownId === address.id
                    ? ""
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex justify-between">
                  <div className="flex flex-col">
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
                  </div>
                  <div className="flex items-center">
                    <DropdownActionsMenu
                      isOpen={openDropdownId === address.id}
                      onOpen={() => setOpenDropdownId(address.id)}
                      onClose={() => setOpenDropdownId(null)}
                      menuItems={[
                        {
                          label: "Edit",
                          onClick: () => handleEditAddress(address),
                          icon: (
                            <span className="material-symbols-rounded">
                              edit
                            </span>
                          ),
                        },
                        {
                          label: "Delete",
                          onClick: () => {
                            setAddressToDelete(address);
                            setIsDeleteModalOpen(true);
                          },
                          danger: true,
                          icon: (
                            <span className="material-symbols-rounded">
                              delete
                            </span>
                          ),
                        },
                      ]}
                    />
                  </div>
                </div>
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
          className="w-full sm:w-auto px-5 py-3 mt-6 bg-amber-400 rounded-xl text-white font-medium hover:bg-amber-500 transition"
        >
          + Add new address
        </button>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Modal.CloseButton />
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this address?
          <p className="mt-2 font-semibold ">{addressToDelete?.street}</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-gray-900 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-300 rounded-md hover:bg-gray-400 transition-all duration-300 ease-in"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-amber-400 text-white rounded-md hover:bg-amber-500 transition-all duration-300 ease-in"
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddressForm;
