import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { geocodeAddressOSM } from "../../services/geocode";
import CustomLabelDropdown from "../../ui/CustomLabelDropdown";
import Modal from "../../ui/Modal";
import DropdownActionsMenu from "../../ui/DropdownActionsMenu";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import Error from "../../ui/Error";
import { useAddresses } from "../../hooks/useAddresses";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
        toast.error(t("address.loginToSave"));
        return;
      }

      const location = await geocodeAddressOSM(data.street);
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
          editingAddress,
        );
        await setDoc(addressDocRef, dataToSave);
      } else {
        const addressRef = collection(db, "users", user.uid, "addresses");
        await addDoc(addressRef, dataToSave);
      }

      toast.success(
        editingAddress ? t("address.changesSaved") : t("address.saved"),
      );
      reset();
      setOpenForm(false);
      setEditingAddress(null);
      onSuccess?.();
    } catch (err) {
      toast.error(t("address.saveFailed"));
    }
  };

  const { addresses, loading: addressesLoading } = useAddresses();

  async function confirmDelete() {
    if (!addressToDelete) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error(t("address.loginToDelete"));
        return;
      }

      const addressRef = doc(
        db,
        "users",
        user.uid,
        "addresses",
        addressToDelete.id,
      );
      await deleteDoc(addressRef);

      toast.success(t("address.deleted"));

      setIsDeleteModalOpen(false);
      setAddressToDelete(null);
    } catch {
      toast.error(t("address.deleteFailed"));
    }
  }

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      <Modal isOpen={openForm} onClose={() => setOpenForm(false)}>
        <Modal.CloseButton />
        <Modal.Header>
          {editingAddress ? t("address.editTitle") : t("address.addTitle")}
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-xl mx-auto mt-2 p-4 sm:p-6 bg-white dark:bg-(--brand-bg-secondary) rounded-2xl shadow-xl space-y-6"
          >
            <div className="space-y-5 text-(--text-secondary) dark:text-(--text-primary)">
              <div>
                <label className="block text-sm font-medium">
                  {t("address.street")}
                </label>
                <input
                  type="text"
                  name="street"
                  {...register("street", {
                    required: t("common.required"),
                  })}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-(--brand)"
                  placeholder={t("address.streetPh")}
                />
                {errors.street && <Error>{errors.street.message}</Error>}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  {t("address.entrance")}
                </label>
                <input
                  type="text"
                  name="entranceInfo"
                  {...register("entranceInfo", {
                    required: t("common.required"),
                  })}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-(--brand)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  {t("address.floor")}
                </label>
                <input
                  type="text"
                  name="floor"
                  {...register("floor", { required: t("common.required") })}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-(--brand)"
                />
                {errors.floor && <Error>{errors.floor.message}</Error>}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="elevator"
                  {...register("elevator")}
                  id="elevator"
                  className="w-4 h-4 text-(--brand) border-gray-300 focus:ring-(--brand)"
                />
                <label htmlFor="elevator" className="text-sm">
                  {t("address.elevator")}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  {t("address.instructions")}
                </label>
                <input
                  type="text"
                  name="entranceInstructions"
                  {...register("entranceInstructions")}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-(--brand)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  {t("address.notes")}
                </label>
                <textarea
                  name="additionalInfo"
                  {...register("additionalInfo")}
                  rows={3}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-(--brand)"
                  placeholder={t("address.notesPh")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  {t("address.phone")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  {...register("phone", { required: t("common.required") })}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-(--brand)"
                  placeholder={t("address.phonePh")}
                />
                {errors.phone && <Error>{errors.phone.message}</Error>}
              </div>

              <div>
                <CustomLabelDropdown
                  value={watch("label")}
                  onChange={(val) => setValue("label", val)}
                  className="mt-1 block w-full border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-(--brand)"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="default"
                  {...register("default")}
                  id="default"
                  className="w-4 h-4 text-(--brand) border-gray-300 focus:ring-(--brand)"
                />
                <label htmlFor="default" className="text-sm">
                  {t("address.setDefault")}
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
                className="px-4 py-2  bg-(--bg-secondary) rounded-lg dark:bg-(--brand-bg-secondary-hover) dark:hover:bg-gray-600 hover:bg-gray-300 transition"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-(--brand-primary) text-white rounded-lg hover:bg-(--brand) transition"
              >
                {editingAddress
                  ? t("common.saveChanges")
                  : t("address.saveAddress")}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {addresses.length === 0 && (
        <p className="text-gray-500 dark:text-(--text-muted)">
          {t("address.none")}
        </p>
      )}
      {addresses.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-(--text-secondary) dark:text-white">
            {t("address.savedTitle")}
          </h3>
          <ul className="space-y-4">
            {addresses.map((address) => (
              <li
                key={address.id}
                className={`p-4 rounded-xl text-sm sm:text-base bg-white dark:bg-(--brand-bg-secondary) cursor-pointer transition-colors duration-300 ease-in shadow ${
                  openDropdownId === address.id
                    ? ""
                    : "hover:bg-(--bg-primary) dark:hover:bg-(--brand-bg-secondary-hover)"
                }`}
              >
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <p>
                      <strong>{t("address.streetLabel")}</strong>{" "}
                      {address.street}
                    </p>
                    <p>
                      <strong>{t("address.floorLabel")}</strong>{" "}
                      {address.floor || t("orders.na")}
                    </p>
                    <p>
                      <strong>{t("address.phoneLabel")}</strong> {address.phone}
                    </p>
                    <p>
                      <strong>{t("address.labelLabel")}</strong>{" "}
                      {t(`address.labels.${address.label}`, {
                        defaultValue: address.label,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <DropdownActionsMenu
                      isOpen={openDropdownId === address.id}
                      onOpen={() => setOpenDropdownId(address.id)}
                      onClose={() => setOpenDropdownId(null)}
                      menuItems={[
                        {
                          label: t("common.edit"),
                          onClick: () => handleEditAddress(address),
                          icon: (
                            <span className="material-symbols-rounded">
                              edit
                            </span>
                          ),
                        },
                        {
                          label: t("common.delete"),
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
                  <span className="inline-block mt-2 text-xs px-2 py-1 bg-(--brand-soft) text-(--brand-hover) rounded-full">
                    {t("address.default")}
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
          className="w-full sm:w-auto px-5 py-3 mt-6 bg-(--brand) rounded-xl text-white font-medium hover:bg-(--brand-primary) transition"
        >
          {t("address.addNew")}
        </button>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Modal.CloseButton />
        <Modal.Header>{t("address.confirmDelete")}</Modal.Header>
        <Modal.Body>
          {t("address.confirmDeleteBody")}
          <p className="mt-2 font-semibold ">{addressToDelete?.street}</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-(--text-primary) dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 bg-gray-300 rounded-md hover:bg-gray-400 transition-all duration-300 ease-in"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-(--brand) text-white rounded-md hover:bg-(--brand-primary) transition-all duration-300 ease-in"
          >
            {t("common.delete")}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddressForm;
