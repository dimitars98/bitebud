import { useForm } from "react-hook-form";
import {
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase/firebase";
import Error from "../ui/Error";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useTranslation } from "react-i18next";
import { authErrorMessage } from "../i18n/authError";

export default function CourierSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { t } = useTranslation();

  async function uploadFile(file, path) {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      const { password, confirmPassword, ...safeData } = data;

      let photoUrl = null;
      if (data.photo?.[0]) {
        photoUrl = await uploadFile(
          data.photo[0],
          `couriers/${user.uid}/profilePhoto`
        );
      }

      await setDoc(doc(db, "couriers", user.uid), {
        uid: user.uid,
        ...safeData,
        photo: photoUrl,
        createdAt: serverTimestamp(),
        status: "pending",
        role: "courier",
      });

      toast.success(t("courierSignup.submitted"));
    } catch (error) {
      toast.error(authErrorMessage(t, error, "auth.signupFailed"));
    }
  };

  const inputStyle = `
    w-full 
    border border-zinc-300 
    dark:border-(--border-secondary)
    bg-white 
    dark:bg-(--brand-bg-secondary)
    rounded-lg px-4 py-2
    text-zinc-900 dark:text-slate-100
    placeholder:text-zinc-400 dark:placeholder-slate-500
    transition-all
    focus:outline-none
    focus:ring-2 focus:ring-amber-500/40
    dark:focus:ring-amber-400/30
    hover:border-zinc-400 dark:hover:border-slate-500
    hover:shadow-[0_0_0_3px_rgba(251,191,36,0.2)]
    dark:hover:shadow-[0_0_0_3px_rgba(245,158,11,0.25)]
`;

  const sectionClasses = "bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm";

  return (
    <div className="bg-(--bg-primary) dark:bg-(--bg-main) min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl dark:text-(--text-primary) font-bold mb-8 text-center">
          {t("courierSignup.title")}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* -------- Personal Info -------- */}
          <section className={sectionClasses}>
            <h2 className="text-xl dark:text-(--text-primary) font-semibold mb-4">
              {t("courierSignup.personal")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.firstName")}<span className="text-red-500">*</span>
                </label>
                <input
                  {...register("firstName", {
                    required: t("common.required"),
                  })}
                  className={inputStyle}
                  placeholder={t("checkout.firstNamePh")}
                />
                {errors.firstName && <Error>{errors.firstName.message}</Error>}
              </div>

              <div>
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.lastName")}<span className="text-red-500">*</span>
                </label>
                <input
                  {...register("lastName", {
                    required: t("common.required"),
                  })}
                  className={inputStyle}
                  placeholder={t("checkout.lastNamePh")}
                />
                {errors.lastName && <Error>{errors.lastName.message}</Error>}
              </div>

              <div>
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.email")}<span className="text-red-500">*</span>
                </label>
                <input
                  {...register("email", { required: t("common.required") })}
                  type="email"
                  className={inputStyle}
                  placeholder="example@email.com"
                />
                {errors.email && <Error>{errors.email.message}</Error>}
              </div>

              <div>
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.phone")}<span className="text-red-500">*</span>
                </label>
                <input
                  {...register("phone", { required: t("common.required") })}
                  className={inputStyle}
                  placeholder="+389 xx xxx xxx"
                />
                {errors.phone && <Error>{errors.phone.message}</Error>}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.photo")}
                </label>
                <div className="border-2 border-dashed rounded-xl p-6 text-center dark:border-(--border-form) dark:text-(--text-form-secondary)">
                  <input
                    type="file"
                    {...register("photo")}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* -------- Account Info -------- */}
          <section className={sectionClasses}>
            <h2 className="text-xl dark:text-(--text-primary) font-semibold mb-4">
              {t("courierSignup.account")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.password")}<span className="text-red-500">*</span>
                </label>
                <input
                  {...register("password", {
                    required: t("common.required"),
                  })}
                  type="password"
                  className={inputStyle}
                  placeholder="••••••••"
                />
                {errors.password && <Error>{errors.password.message}</Error>}
              </div>

              <div>
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.confirmPassword")}<span className="text-red-500">*</span>
                </label>
                <input
                  {...register("confirmPassword", {
                    validate: (value) =>
                      value === watch("password") || t("auth.passwordsMismatch"),
                  })}
                  type="password"
                  className={inputStyle}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <Error>{errors.confirmPassword.message}</Error>
                )}
              </div>
            </div>
          </section>

          {/* -------- Vehicle Info -------- */}
          <section className={sectionClasses}>
            <h2 className="text-xl dark:text-(--text-primary) font-semibold mb-4">
              {t("courierSignup.vehicleInfo")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.vehicleType")}<span className="text-red-500">*</span>
                </label>
                <select
                  {...register("vehicleType", {
                    required: t("common.required"),
                  })}
                  className={inputStyle}
                >
                  <option value="">{t("courierSignup.selectVehicle")}</option>
                  <option value="bike">{t("courier.vehicles.bike")}</option>
                  <option value="motorbike">{t("courier.vehicles.motorbike")}</option>
                  <option value="car">{t("courier.vehicles.car")}</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.regNumber")}
                </label>
                <input
                  {...register("vehicleRegNumber")}
                  className={inputStyle}
                  placeholder={t("courierSignup.regPh")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.experience")}
                </label>
                <textarea
                  {...register("experience")}
                  className={inputStyle}
                  placeholder={t("courierSignup.experiencePh")}
                  rows={4}
                />
              </div>
            </div>
          </section>

          {/* -------- Availability / Notes -------- */}
          <section className={sectionClasses}>
            <h2 className="text-xl dark:text-(--text-primary) font-semibold mb-4">
              {t("courierSignup.availabilityNotes")}
            </h2>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.availability")}
                </label>
                <input
                  {...register("availability")}
                  className={inputStyle}
                  placeholder={t("courierSignup.availabilityPh")}
                />
              </div>

              <div>
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.zone")}<span className="text-red-500">*</span>
                </label>
                <select
                  {...register("zone", {
                    required: t("common.required"),
                  })}
                  className={inputStyle}
                >
                  <option value="">{t("courierSignup.selectZone")}</option>
                  <option value="east">{t("courier.zones.east")}</option>
                  <option value="central">{t("courier.zones.central")}</option>
                  <option value="west">{t("courier.zones.west")}</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium dark:text-(--text-form-secondary)">
                  {t("courierSignup.notes")}
                </label>
                <textarea
                  {...register("notes")}
                  className={inputStyle}
                  placeholder={t("courierSignup.notesPh")}
                  rows={3}
                />
              </div>
            </div>
          </section>

          {/* -------- Submit -------- */}
          <div className="flex justify-end gap-4">
            <button
              type="reset"
              className="px-6 py-2 border border-gray-300 dark:border-(--border-form) rounded-lg dark:text-(--text-form-primary) transition hover:bg-(--bg-secondary) dark:hover:bg-(--brand-bg-secondary)"
            >
              {t("courierSignup.reset")}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-(--brand-primary) hover:bg-(--brand-hover) text-white rounded-lg shadow-md transition"
            >
              {t("courierSignup.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
