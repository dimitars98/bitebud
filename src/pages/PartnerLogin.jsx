import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { authErrorMessage } from "../i18n/authError";
import FormInput from "../components/FormInput";
import { useState } from "react";
import SpinnerMini from "../ui/SpinnerMini";

export default function PartnerLogin() {
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

      // Optional: validate partner role BEFORE redirecting
      const partnerDoc = await getDoc(doc(db, "partners", user.uid));
      if (!partnerDoc.exists() || partnerDoc.data().role !== "partner") {
        toast.error(t("partnerLogin.noAccount"));
        return;
      }

      // AuthListener handles Redux + role loading
      navigate("/partner-dashboard");
      toast.success(t("partnerLogin.welcome"));
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
        className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center dark:text-(--text-primary)">
          {t("partnerLogin.title")}
        </h1>

        <FormInput
          type="email"
          placeholder={t("auth.email")}
          {...register("email", { required: t("auth.emailRequired") })}
          error={errors.email?.message}
        />

        <FormInput
          type="password"
          placeholder={t("auth.password")}
          {...register("password", { required: t("auth.passwordRequired") })}
          error={errors.password?.message}
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
