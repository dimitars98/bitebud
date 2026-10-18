import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { authErrorMessage } from "../i18n/authError";
import { useState } from "react";
import FormInput from "../components/FormInput";
import SpinnerMini from "../ui/SpinnerMini";
import FloatingInput from "../ui/FloatingInput";

export default function CourierLogin() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { t } = useTranslation();

  async function onSubmit(data) {
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      // ONLY validate courier role (optional)
      const courierDoc = await getDoc(doc(db, "couriers", user.uid));
      if (!courierDoc.exists() || courierDoc.data().role !== "courier") {
        toast.error(t("courierLogin.noAccount"));
        return;
      }

      // AuthListener will handle role fetching + Redux
      navigate("/courier-dashboard");
      toast.success(t("courierLogin.welcome"));
    } catch (error) {
      toast.error(authErrorMessage(t, error, "auth.loginFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center dark:text-(--text-primary)">
          {t("courierLogin.title")}
        </h1>

        {/* <FormInput
          type="email"
          placeholder="Email"
          {...register("email", { required: "Email is required" })}
          error={errors.email?.message}
        /> */}
        <FloatingInput
          id="email"
          label={t("auth.email")}
          type="email"
          {...register("email", { required: t("auth.emailRequired") })}
          error={errors.email?.message}
          borderClass="border-slate-300 dark:border-slate-700"
          focusBorderClass="focus:border-(--brand)"
          focusRingClass="focus:ring-(--brand)/25"
          focusLabelClass="peer-focus:text-(--brand)"
        />

        <FloatingInput
          id="password"
          label={t("auth.password")}
          type="password"
          {...register("password", { required: t("auth.passwordRequired") })}
          error={errors.password?.message}
          borderClass="border-slate-300 dark:border-slate-700"
          focusBorderClass="focus:border-(--brand)"
          focusRingClass="focus:ring-(--brand)/25"
          focusLabelClass="peer-focus:text-(--brand)"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg shadow-sm transition font-semibold bg-(--brand-primary) hover:bg-(--brand-hover) text-white ${
            loading ? "cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <SpinnerMini size={20} color="text-white" />
              {t("auth.loggingIn")}
            </span>
          ) : (
            t("auth.logIn")
          )}
        </button>
      </form>
    </div>
  );
}
