// EmailLinkHandler.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function EmailLinkHandler() {
  const [message, setMessage] = useState("Completing sign-in...");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const url = window.location.href;
    const storedEmail = window.localStorage.getItem("emailForSignIn");

    if (isSignInWithEmailLink(auth, url)) {
      const email = storedEmail || window.prompt("Enter your email to confirm");

      signInWithEmailLink(auth, email, url)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
          setMessage("Successfully signed in!");
          setTimeout(() => navigate("/"), 1500);
        })
        .catch((error) => {
          setMessage("Failed to complete sign-in.");
          console.error(error);
        });
    } else {
      setMessage("Invalid sign-in link.");
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg">
      {message}
    </div>
  );
}
