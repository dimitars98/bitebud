import { useState } from "react";
import { auth, db } from "../../firebase"; // Adjust path as needed
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  linkWithCredential,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

import { handleAccountLinking } from "../features/auth/handleAccountLinking";

import { doc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

import { toast } from "react-hot-toast";

import { useMutation } from "@tanstack/react-query";

export default function SignUp({ onSuccess }) {
  const [step, setStep] = useState("options"); // "options" | "form"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const signupMutation = useMutation({
    mutationFn: async () => {
      const validationError = validateInputs();
      if (validationError) throw new Error(validationError);

      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        phone,
        address,
        createdAt: new Date(),
      });

      await sendEmailVerification(user);

      return user;
    },
    onSuccess: () => {
      toast.success("Verification email sent!");
      onSuccess();
    },
    onError: (error) => {
      setError(error.message || "Failed to sign up.");
    },
  });

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user info in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          email: user.email,
          createdAt: new Date(),
          provider: "google",
        },
        { merge: true }
      );

      onSuccess();
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        await handleAccountLinking({
          auth,
          error,
          pendingProvider: GoogleAuthProvider,
          onSuccess,
          setError,
        });
      } else {
        setError(error.message || "Google sign-in failed.");
      }
    }
  };

  const handleFacebookSignUp = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          email: user.email,
          createdAt: new Date(),
          provider: "facebook",
        },
        { merge: true }
      );

      onSuccess(); // Close modal or notify parent
    } catch (err) {
      if (err.code === "auth/account-exists-with-different-credential") {
        await handleAccountLinking({
          auth,
          error: err,
          pendingProvider: FacebookAuthProvider,
          onSuccess,
          setError,
        });
      } else {
        setError(err.message || "Facebook sign-in failed.");
      }
    }
  };

  const validateInputs = () => {
    if (!email || !password || !phone || !address) {
      return "Please fill out all fields.";
    }

    const phoneRegex = /^[0-9]{7,15}$/; // Simple phone check
    if (!phoneRegex.test(phone)) {
      return "Please enter a valid phone number (7-15 digits).";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    return null;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError(""); // clear previous error
    signupMutation.mutate();
  };

  return (
    <div className="py-12">
      {step === "options" && (
        <>
          <button
            onClick={handleGoogleSignUp}
            className="w-full py-4 mb-3 flex items-center justify-center gap-2 rounded-lg hover:shadow-sm transition bg-black"
          >
            <FcGoogle size={20} />
            <span className="text-sm font-medium text-gray-50">
              Continue with Google
            </span>
          </button>

          <button
            onClick={handleFacebookSignUp}
            className="w-full py-4 mb-4 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaFacebook size={18} />
            <span className="text-sm font-medium">Continue with Facebook</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
            <span className="h-px w-10 sm:w-20 bg-gray-300"></span>
            <p className="my-4 text-center text-gray-600 dark:text-gray-400 text-sm">
              or
            </p>
            <span className="h-px w-10 sm:w-20 bg-gray-300"></span>
          </div>

          <button
            onClick={() => setStep("form")}
            className="w-full py-4 px-3 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors duration-300 ease-in"
          >
            Sign up with Email
          </button>
        </>
      )}

      {step === "form" && (
        <>
          <form onSubmit={handleFormSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-3 py-2 focus:ring-amber-400 outline-none bg-gray-700 rounded-lg placeholder:text-gray-400 caret-gray-400"
              required
            />

            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-3 py-2 outline-none bg-gray-700 rounded-lg placeholder:text-gray-400 caret-gray-400"
              required
            />

            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-4 px-3 py-2 outline-none bg-gray-700 rounded-lg placeholder:text-gray-400 caret-gray-400"
              required
            />

            <input
              type="text"
              placeholder="Street address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mb-4 px-3 py-2 outline-none bg-gray-700 rounded-lg placeholder:text-gray-400 caret-gray-400"
              required
            />

            <button
              type="submit"
              disabled={signupMutation.isLoading}
              className="w-full mt-6 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors duration-300 ease-in"
            >
              {signupMutation.isLoading ? "Signing up..." : "Sign Up"}
            </button>

            {/* Back button */}
            <button
              type="button"
              onClick={() => setStep("options")}
              className="w-full mt-3 py-2 text-gray-600 dark:bg-gray-50 dark:hover:bg-gray-100 rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in"
            >
              ← Back
            </button>
          </form>

          {signupMutation.isError && (
            <div className="mt-3 bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
              {signupMutation.error.message}
            </div>
          )}
        </>
      )}
    </div>
  );
}
