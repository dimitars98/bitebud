import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useTranslation } from "react-i18next";

export default function EmailLinkHandler() {
  // holds a translation key, so the text follows the current language
  const [message, setMessage] = useState("emailLink.completing");
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const url = window.location.href;
    const storedEmail = window.localStorage.getItem("emailForSignIn");

    if (isSignInWithEmailLink(auth, url)) {
      const email = storedEmail || window.prompt(t("emailLink.prompt"));

      signInWithEmailLink(auth, email, url)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
          setMessage("emailLink.success");
          setTimeout(() => navigate("/"), 1500);
        })
        .catch((error) => {
          setMessage("emailLink.failed");
          console.error(error);
        });
    } else {
      setMessage("emailLink.invalid");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg">
      {t(message)}
    </div>
  );
}
