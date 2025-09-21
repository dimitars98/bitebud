import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";

export default function AuthModal({
  initialMode = "login",
  onSuccess,
  onClose,
}) {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetState = () => {
    setStep("email");
    setEmail("");
    setPassword("");
    setError("");
    setIsLoading(false);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email: submittedEmail, password: submittedPassword } = data;

    if (step === "email") {
      setIsLoading(true);
      try {
        if (mode === "login") {
          console.log("Login mode: Directly proceeding to password step.");
        } else {
          // mode === "signup"
          const methods = await fetchSignInMethodsForEmail(
            auth,
            submittedEmail
          );

          if (methods.length > 0) {
            setError("email", {
              type: "manual",
              message:
                "An account with this email already exists. Please log in instead.",
            });
            console.log("Error: Account already exists for signup.");
            setIsLoading(false);
            return;
          }
          console.log(
            "Proceeding to password step for new email/password signup."
          );
        }

        setEmail(submittedEmail);
        setStep("password");
      } catch (err) {
        console.error("Error checking email (during signup flow):", err);
        setError("email", {
          type: "manual",
          message: "Something went wrong. Please try again.",
        });
        toast.error(
          "Error checking email: " + (err.message || "Unknown error.")
        );
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (step === "password") {
      setIsLoading(true);
      try {
        if (mode === "login") {
          await signInWithEmailAndPassword(auth, email, submittedPassword);
        } else {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            submittedPassword
          );
          const user = userCredential.user;

          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            createdAt: new Date(),
          });

          await sendEmailVerification(user);
        }
        if (onSuccess) onSuccess({ isSignup: mode === "signup" });
      } catch (err) {
        let message = "Login failed.";

        switch (err.code) {
          case "auth/wrong-password":
            message = "Incorrect password.";
            break;
          case "auth/invalid-email":
            message = "Invalid email format.";
            break;
          case "auth/invalid-credential":
            message = "Invalid credentials.";
            break;
          default:
            message = err.message || "An unknown error occurred.";
        }

        setError("password", {
          type: "manual",
          message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setStep("email");
      setError("");
      // alert("Password reset email sent. Please check your inbox.");
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google login handler - same for login & signup
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      if (onSuccess) onSuccess({ isSignup: false });
      resetState();
    } catch (err) {
      setError(err.message || "Google login failed.");
    }
  };

  // Facebook login with account linking logic
  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      provider.addScope("email");
      await signInWithPopup(auth, provider);
      if (onSuccess) onSuccess({ isSignup: false });
      resetState();
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

            if (onSuccess) onSuccess();
            resetState();
          } else {
            setError(
              `An account already exists with a different provider: ${methods[0]}. Please use that to log in.`
            );
          }
        } catch (linkError) {
          console.error("Error linking Facebook to Google account:", linkError);
          setError("Could not link Facebook to existing account.");
        }
      } else {
        setError(error.message || "Facebook login failed.");
      }
    }
  };

  return (
    <div className="space-y-6 dark:bg-[var(--color-grey-800)] p-6 rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center dark:text-gray-100">
        {mode === "login" ? "Welcome Back" : "Create an Account"}
      </h2>

      {/* Social Login Buttons - show only on email step */}
      {step === "email" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full relative flex items-center justify-center focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400 text-white bg-black rounded-lg py-4 hover:bg-[#111] outline-none cursor-pointer"
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
            className="w-full relative focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400 text-white rounded-lg py-4  bg-[var(--color-facebook)] hover:bg-[var(--color-facebook-hover)] flex items-center justify-center gap-2 cursor-pointer"
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
          <span className="h-px w-10 sm:w-20 bg-gray-400"></span>
          <span className="whitespace-nowrap text-gray-400">
            or continue with email
          </span>
          <span className="h-px w-10 sm:w-20 bg-gray-400"></span>
        </div>
      )}

      {/* Email or Password Step */}
      {step === "email" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-400 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400 placeholder:text-gray-400 caret-gray-400 rounded-lg p-4 w-full"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
          <button
            type="submit"
            className="bg-yellow-500 text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400 py-4 rounded-lg hover:bg-yellow-600 cursor-pointer"
          >
            Continue
          </button>
        </form>
      )}

      {step === "password" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          <p className="text-sm text-gray-400">
            {mode === "login" ? "Logging in" : "Signing up"} as{" "}
            <strong>{email}</strong>
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
            type="button"
            onClick={() => setStep("forgot")}
            className="text-sm text-blue-500 underline self-start hover:text-blue-600"
          >
            Forgot Password?
          </button>

          <label className="text-sm flex items-center gap-2 text-gray-400">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={() => setKeepLoggedIn((prev) => !prev)}
              className="accent-yellow-500"
            />
            Keep me logged in
          </label>

          <button
            type="submit"
            className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
            disabled={isLoading}
          >
            {isLoading
              ? mode === "login"
                ? "Logging in..."
                : "Signing up..."
              : mode === "login"
              ? "Login"
              : "Sign Up"}
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

      {step === "forgot" && (
        <form
          onSubmit={handlePasswordReset}
          className="flex flex-col gap-4 mt-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-400 placeholder:text-gray-400 caret-gray-400 rounded-lg p-4 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white py-4 rounded-lg hover:bg-yellow-600 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Email"}
          </button>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="text-sm text-gray-500 underline hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >
            ← Back to login
          </button>
        </form>
      )}

      {/* Switch Mode Link */}
      <p className="text-center text-gray-400 text-sm mt-4">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              onClick={() => {
                resetState();
                setMode("signup");
              }}
              className="underline cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400 text-yellow-400 hover:text-yellow-500"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => {
                resetState();
                setMode("login");
              }}
              className="underline cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400 text-yellow-400 hover:text-yellow-500"
            >
              Log in
            </button>
          </>
        )}
      </p>

      {/* Error Message */}
      {/* {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-100 px-4 py-2 rounded">
          {error}
        </div>
      )} */}
    </div>
  );
}
