import { useForm } from "react-hook-form";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../firebase/firebase";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { authErrorMessage } from "../i18n/authError";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function PartnerSignup() {
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

  // helper for slugs
  const slugify = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  async function onSubmit(data) {
    try {
      // 1) Create Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // 2) Upload images (optional)
      const { password, confirmPassword, ...safeData } = data;
      let coverPhotoUrl = null;
      let logoUrl = null;

      if (data.coverPhoto?.[0]) {
        coverPhotoUrl = await uploadFile(
          data.coverPhoto[0],
          `partners/${user.uid}/coverPhoto`
        );
      }
      if (data.logo?.[0]) {
        logoUrl = await uploadFile(data.logo[0], `partners/${user.uid}/logo`);
      }

      // 3) Write partner profile
      const partnerRef = doc(db, "partners", user.uid);
      await setDoc(partnerRef, {
        uid: user.uid,
        ...safeData,
        coverPhoto: coverPhotoUrl,
        logo: logoUrl,
        createdAt: serverTimestamp(),
        status: "pending", // business status (pending approval)
        role: "partner",
      });

      // 4) Create restaurant document
      const restaurantsRef = collection(db, "restaurants");
      const restaurantDoc = doc(restaurantsRef); // auto-ID
      await setDoc(restaurantDoc, {
        restaurantId: restaurantDoc.id,
        partnerId: user.uid, // 🔑 link restaurant to partner
        ownerId: user.uid, // you can keep this for clarity, but partnerId is key
        slug: slugify(data.restaurantName),
        name: data.restaurantName,
        address: data.address,
        zone: data.zone || "",
        city: "Skopje",
        logo: logoUrl || "",
        bannerImage: coverPhotoUrl || "",
        rating: 0,
        orderNum: 0,
        minDeliveryTime: Number(data.minDeliveryTime) || 20,
        maxDeliveryTime: Number(data.maxDeliveryTime) || 45,
        tags: ["Free delivery"],
        categories: "Fusion",
        cuisine: "Fusion",
        menu: {},
        location: { lat: 41.9983, lng: 21.425 },
        createdAt: serverTimestamp(),
        status: "open",
      });

      toast.success(t("partnerSignup.submitted"));
    } catch (error) {
      console.error("Partner signup error:", error);
      toast.error(authErrorMessage(t, error, "partnerSignup.failed"));
    }
  }

  const inputStyle = `
    w-full 
    border border-zinc-300 
    dark:border-(--border-form)
    bg-(--bg-main) 
    dark:bg-slate-800
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

  return (
    <div className="bg-gray-50 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl dark:text-(--text-primary) font-bold mb-8 text-center">
          {t("partnerSignup.title")}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Vendor Info */}
          <section className="bg-(--bg-main) dark:bg-(--brand-bg-primary) p-6 rounded-xl shadow-sm">
            <h2 className="text-xl dark:text-(--text-primary) font-semibold mb-4">
              {t("partnerSignup.partnerInfo")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block dark:text-(--text-secondary) mb-1 font-medium">
                  {t("partnerSignup.restaurantName")}
                </label>
                <input
                  {...register("restaurantName", { required: true })}
                  className={inputStyle}
                  placeholder={t("partnerSignup.restaurantNamePh")}
                />
              </div>

              <div>
                <label className="block dark:text-(--text-secondary) mb-1 font-medium">
                  {t("partnerSignup.restaurantAddress")}
                </label>
                <input
                  {...register("address", { required: true })}
                  className={inputStyle}
                  placeholder={t("partnerSignup.restaurantAddressPh")}
                />
              </div>

              <div>
                <label className="block dark:text-(--text-secondary) mb-1 font-medium">
                  {t("partnerSignup.zone")}
                </label>
                <select {...register("zone")} className={inputStyle}>
                  <option value="">{t("courierSignup.selectZone")}</option>
                  <option value="center">{t("partnerSignup.center")}</option>
                  <option value="east">{t("courier.zones.east")}</option>
                  <option value="west">{t("courier.zones.west")}</option>
                </select>
              </div>

              <div>
                <label className="block dark:text-(--text-secondary) mb-1 font-medium">
                  {t("partnerSignup.minTime")}
                </label>
                <input
                  {...register("minDeliveryTime")}
                  type="number"
                  className={inputStyle}
                  placeholder={t("partnerSignup.minPh")}
                />
              </div>

              <div>
                <label className="block dark:text-(--text-secondary) mb-1 font-medium">
                  {t("partnerSignup.maxTime")}
                </label>
                <input
                  {...register("maxDeliveryTime")}
                  type="number"
                  className={inputStyle}
                  placeholder={t("partnerSignup.maxPh")}
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              <div className="border-2 border-dashed rounded-xl p-6 text-center dark:border-(--border-form) dark:text-(--text-form-secondary)">
                <p className="font-medium mb-2">{t("partnerSignup.cover")}</p>
                <input
                  type="file"
                  {...register("coverPhoto")}
                  className={inputStyle}
                />
              </div>

              <div className="border-2 border-dashed rounded-xl p-6 text-center dark:border-(--border-form) dark:text-(--text-form-secondary)">
                <p className="font-medium mb-2">{t("partnerSignup.logo")}</p>
                <input
                  type="file"
                  {...register("logo")}
                  className={inputStyle}
                />
              </div>
            </div>
          </section>

          {/* Owner Info */}
          <section className="bg-(--bg-main) dark:bg-(--brand-bg-primary) p-6 rounded-xl shadow-sm">
            <h2 className="text-xl dark:text-(--text-primary) font-semibold mb-4">
              {t("partnerSignup.owner")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block dark:text-(--text-secondary) mb-1 font-medium">
                  {t("partnerSignup.firstName")}
                </label>
                <input
                  {...register("firstName", { required: true })}
                  className={inputStyle}
                  placeholder={t("checkout.firstNamePh")}
                />
              </div>

              <div>
                <label className="block dark:text-(--text-secondary) mb-1 font-medium">
                  {t("partnerSignup.lastName")}
                </label>
                <input
                  {...register("lastName", { required: true })}
                  className={inputStyle}
                  placeholder={t("checkout.lastNamePh")}
                />
              </div>

              <div>
                <label className="block dark:text-(--text-secondary) mb-1 font-medium">
                  {t("partnerSignup.phone")}
                </label>
                <input
                  {...register("phone", { required: true })}
                  className={inputStyle}
                  placeholder="+389..."
                />
              </div>
            </div>
          </section>

          {/* Account Info */}
          <section className="bg-(--bg-main) dark:bg-(--brand-bg-primary) p-6 rounded-xl shadow-sm">
            <h2 className="text-xl dark:text-(--text-primary) font-semibold mb-4">
              {t("courierSignup.account")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block dark:text-(--text-secondary) mb-1 font-medium">
                  {t("partnerSignup.email")}
                </label>
                <input
                  {...register("email", { required: true })}
                  className={inputStyle}
                  type="email"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block dark:text-(--text-secondary) mb-1 font-medium">
                  {t("partnerSignup.password")}
                </label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  className={inputStyle}
                  placeholder="••••••••"
                />
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

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <button
              type="reset"
              className="px-6 py-2 border
              border-(--border-primary) dark:border-(--border-form) rounded-lg dark:text-(--text-form-primary) transition hover:bg-(--bg-secondary) dark:hover:bg-(--brand-bg-secondary)"
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
