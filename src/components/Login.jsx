import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  linkWithCredential,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useForm } from "react-hook-form";

export default function Login({ onSuccess }) {
  const [step, setStep] = useState("email"); // "email" | "password"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  // const handleEmailSubmit = (e) => {
  //   e.preventDefault();
  //   if (!email) {
  //     setError("Please enter your email.");
  //     return;
  //   }
  //   setError("");
  //   setStep("password");
  // };

  // const handlePasswordSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError("");

  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     if (onSuccess) onSuccess();
  //   } catch (err) {
  //     setError(err.message || "Failed to log in.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit = async (data) => {
    const { email: submittedEmail, password: submittedPassword } = data;

    if (step === "email") {
      setEmail(submittedEmail);
      setStep("password");
      return;
    }

    if (step === "password") {
      setIsLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, submittedPassword);
        if (onSuccess) onSuccess();
      } catch (err) {
        setError("password", {
          type: "manual",
          message: err.message || "Failed to log in.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Google login failed.");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      provider.addScope("email");
      await signInWithPopup(auth, provider);
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData.email;
        const pendingCred = FacebookAuthProvider.credentialFromError(error);

        // Find which sign-in methods the user already used
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods[0] === "google.com") {
          const googleProvider = new GoogleAuthProvider();

          try {
            const result = await signInWithPopup(auth, googleProvider);
            // Link Facebook to this Google account
            await linkWithCredential(result.user, pendingCred);
            if (onSuccess) onSuccess();
          } catch (linkError) {
            console.error(
              "Error linking Facebook to Google account:",
              linkError
            );
            setError("Could not link Facebook to existing account.");
          }
        } else {
          setError(
            `An account already exists with a different provider: ${methods[0]}. Please use that to log in.`
          );
        }
      } else {
        setError(error.message || "Facebook login failed.");
      }
    }
  };

  return (
    <div className="space-y-6 dark:bg-[var(--color-grey-800)]">
      <h2 className="text-xl font-semibold text-center dark:text-gray-100">
        Welcome Back
      </h2>

      {/* Social Login Buttons – only show at email step */}
      {step === "email" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full relative flex items-center justify-center text-white bg-black rounded-lg py-4 hover:bg-[#111] outline-none cursor-pointer"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 absolute left-3"
            />
            Continue with Google
          </button>

          <button
            onClick={handleFacebookLogin}
            className="w-full relative  text-white rounded-lg py-4  bg-[var(--color-facebook)] hover:bg-[var(--color-facebook-hover)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <img
              src="/Facebook_Logo_Secondary.png"
              alt="Facebook"
              className="w-5 h-5 absolute left-3"
            />
            Continue with Facebook
          </button>
        </div>
      )}

      {/* Divider – only show at email step */}
      {step === "email" && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
          <span className="h-px w-10 sm:w-20 text-gray-50 bg-gray-300"></span>
          <span className="whitespace-nowrap text-gray-50">
            or continue with email
          </span>
          <span className="h-px w-10 sm:w-20 text-gray-50 bg-gray-300"></span>
        </div>
      )}

      {/* Email or Password Step */}
      {step === "email" ? (
        <div className="login-modal">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-400 placeholder:text-gray-400 caret-gray-400 rounded-lg p-4 w-full"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
            <button
              type="submit"
              className="bg-yellow-500 text-white py-4 rounded-lg hover:bg-yellow-600 cursor-pointer"
            >
              Continue
            </button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <p className="text-sm text-gray-100">
            Logging in as <strong>{email}</strong>
          </p>

          <input
            type="password"
            placeholder="Enter your password"
            className="border p-2 rounded w-full dark:placeholder:text-gray-400"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
          <button
            type="submit"
            className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={() => setStep("email")}
            className="text-sm dark:text-gray-100 text-gray-500 underline dark:hover:text-gray-200 hover:text-gray-700 cursor-pointer"
          >
            ← Go back
          </button>
        </form>
      )}

      {/* {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-100 px-4 py-2 rounded">
          {error}
        </div>
      )} */}
    </div>
  );
}
