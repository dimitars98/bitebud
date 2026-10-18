import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import FormInput from "../components/FormInput";
import { useNavigate } from "react-router-dom";
import { fetchUserWithRole } from "../services/fetchUserWithRole";
import { useDispatch } from "react-redux";
import { useAuthIntent } from "../contexts/AuthIntentContext";
import { Trans, useTranslation } from "react-i18next";
import { authErrorMessage } from "../i18n/authError";

export default function AuthModal({
  initialMode = "login",
  onSuccess,
  onClose,
}) {
  const [mode, setMode] = useState(initialMode); // "login" or "signup"
  const [step, setStep] = useState(
    mode === "login" ? "loginEmail" : "signupStart",
  );
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { authIntent, setAuthIntent } = useAuthIntent();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const resetState = (newMode = mode) => {
    setMode(newMode);
    setStep(newMode === "login" ? "loginEmail" : "signupStart");
    setEmail("");
    setError("");
    setIsLoading(false);
  };

  // Social sign-ins don't go through the sign-up form, so make sure the user
  // has a users/ document the first time.
  async function ensureCustomerDoc(user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
        role: "customer",
      });
    }
  }

  // After any successful sign-in: put the user (and role) in Redux, tell the
  // parent, then continue to checkout if that's why they signed in, otherwise
  // to Explore.
  async function finishLogin({ isSignup }) {
    await fetchUserWithRole(dispatch);
    onSuccess?.({ isSignup });
    if (authIntent === "checkout") {
      setAuthIntent(null);
      navigate("checkout");
    } else {
      navigate("explore");
    }
    resetState();
  }

  // --- Social login handlers (shared for both login/signup)
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await ensureCustomerDoc(user);
      await finishLogin({ isSignup: mode === "signup" });
    } catch (err) {
      setError(authErrorMessage(t, err, "auth.googleFailed"));
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      provider.addScope("email");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await ensureCustomerDoc(user);
      await finishLogin({ isSignup: mode === "signup" });
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const fbEmail = error.customData.email;
        const pendingCred = FacebookAuthProvider.credentialFromError(error);
        try {
          const methods = await fetchSignInMethodsForEmail(auth, fbEmail);
          if (methods.includes("google.com")) {
            const googleProvider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, googleProvider);
            await linkWithCredential(result.user, pendingCred);
            await finishLogin({ isSignup: mode === "signup" });
          } else {
            setError(
              t("auth.otherProvider", { provider: methods[0] }),
            );
          }
        } catch (linkError) {
          console.error("Error linking Facebook to Google account:", linkError);
          setError(t("auth.linkFailed"));
        }
      } else {
        setError(authErrorMessage(t, error, "auth.facebookFailed"));
      }
    }
  };

  // --- Form submission handler
  const onSubmit = async (data) => {
    if (mode === "login") {
      // --- Login flow
      if (step === "loginEmail") {
        setEmail(data.email);
        setStep("loginPassword");
        return;
      }

      if (step === "loginPassword") {
        setIsLoading(true);
        try {
          // inside login password branch (after signInWithEmailAndPassword & fetchUserWithRole)
          await signInWithEmailAndPassword(auth, email, data.password);
          await finishLogin({ isSignup: false });
        } catch (err) {
          setError("password", {
            type: "manual",
            message: authErrorMessage(t, err, "auth.loginFailed"),
          });
        } finally {
          setIsLoading(false);
        }
        return;
      }
    }

    if (mode === "signup") {
      // --- Signup flow
      if (step === "signupForm") {
        const { email: signupEmail, password, repeatPassword } = data;

        if (password !== repeatPassword) {
          setError("repeatPassword", {
            type: "manual",
            message: t("auth.passwordsMismatch"),
          });
          return;
        }

        setIsLoading(true);
        try {
          const methods = await fetchSignInMethodsForEmail(auth, signupEmail);
          if (methods.length > 0) {
            setError("email", {
              type: "manual",
              message: t("authErrors.email-already-in-use"),
            });
            setIsLoading(false);
            return;
          }

          const userCredential = await createUserWithEmailAndPassword(
            auth,
            signupEmail,
            password,
          );
          const user = userCredential.user;

          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            createdAt: new Date(),
            role: "customer",
          });

          // inside signup success branch (after createUserWithEmailAndPassword, setDoc, fetchUserWithRole)
          await sendEmailVerification(user);
          toast.success(t("auth.accountCreated"));
          await finishLogin({ isSignup: true });
        } catch (err) {
          setError("email", {
            type: "manual",
            message: authErrorMessage(t, err, "auth.signupFailed"),
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="space-y-6 mb-4 dark:bg-neutral-950 md:p-6 rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center dark:text-gray-100">
        {mode === "login" ? t("auth.welcomeBack") : t("auth.createAccount")}
      </h2>

      {/* --- Social Buttons for both login and signupStart --- */}
      {(step === "loginEmail" || step === "signupStart") && (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full relative flex items-center justify-center text-white bg-black rounded-lg py-4 hover:bg-[#111]"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 absolute left-3"
            />
            {t("auth.google")}
          </button>
          <button
            onClick={handleFacebookLogin}
            className="w-full relative text-white rounded-lg py-4 bg-[var(--color-facebook)] hover:bg-[var(--color-facebook-hover)] flex items-center justify-center gap-2"
          >
            <img
              src="/Facebook_Logo_Secondary.png"
              alt="Facebook"
              className="w-5 h-5 absolute left-3"
            />
            {t("auth.facebook")}
          </button>
        </div>
      )}

      {/* --- Divider --- */}
      {(step === "loginEmail" || step === "signupStart") && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
          <span className="h-px w-10 sm:w-20 bg-gray-400"></span>
          <span className="whitespace-nowrap text-gray-400">
            {mode === "login" ? t("auth.orEmail") : t("auth.or")}
          </span>
          <span className="h-px w-10 sm:w-20 bg-gray-400"></span>
        </div>
      )}

      {/* --- Login Email Form --- */}
      {mode === "login" && step === "loginEmail" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          <FormInput
            type="email"
            placeholder={t("auth.emailPh")}
            {...register("email", { required: t("auth.emailRequired") })}
            error={errors.email?.message}
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white py-4 rounded-lg w-full hover:bg-yellow-600"
          >
            {t("auth.continue")}
          </button>
        </form>
      )}

      {/* --- Login Password Form --- */}
      {mode === "login" && step === "loginPassword" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          <p className="text-sm text-gray-400">
            <Trans
              i18nKey="auth.loggingInAs"
              values={{ email }}
              components={{ strong: <strong /> }}
            />
          </p>
          <FormInput
            type="password"
            placeholder={t("auth.passwordPh")}
            {...register("password", { required: t("auth.passwordRequired") })}
            error={errors.password?.message}
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white py-4 rounded-lg w-full hover:bg-yellow-600"
          >
            {t("auth.login")}
          </button>
        </form>
      )}

      {/* --- Signup Continue Button --- */}
      {mode === "signup" && step === "signupStart" && (
        <div className="mt-4 flex justify-center">
          <button
            className="bg-yellow-500 text-white py-4 rounded-lg w-full hover:bg-yellow-600"
            onClick={() => setStep("signupForm")}
          >
            {t("auth.continueEmail")}
          </button>
        </div>
      )}

      {/* --- Signup Form --- */}
      {mode === "signup" && step === "signupForm" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
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
          <FormInput
            type="password"
            placeholder={t("auth.repeatPassword")}
            {...register("repeatPassword", {
              required: t("auth.repeatRequired"),
            })}
            error={errors.repeatPassword?.message}
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white py-4 rounded-lg w-full hover:bg-yellow-600"
            disabled={isLoading}
          >
            {isLoading ? t("auth.signingUp") : t("auth.signUp")}
          </button>

          <button
            type="button"
            onClick={() => setStep("signupStart")}
            className="text-sm text-gray-400 hover:text-gray-500 mt-2"
          >
            {t("auth.goBack")}
          </button>
        </form>
      )}

      {/* --- Switch Mode Link --- */}
      <p className="text-center text-gray-400 text-sm mt-4">
        {mode === "login" ? (
          <>
            {t("auth.noAccount")}{" "}
            <button
              onClick={() => resetState("signup")}
              className="cursor-pointer text-yellow-400 hover:text-yellow-500"
            >
              {t("auth.signUpLink")}
            </button>
          </>
        ) : (
          <>
            {t("auth.haveAccount")}{" "}
            <button
              onClick={() => resetState("login")}
              className="cursor-pointer text-yellow-400 hover:text-yellow-500"
            >
              {t("auth.logInLink")}
            </button>
          </>
        )}
      </p>
    </div>
  );
}
