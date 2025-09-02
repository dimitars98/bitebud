import {
  fetchSignInMethodsForEmail,
  linkWithCredential,
  signInWithPopup,
} from "firebase/auth";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth/web-extension";

export async function handleAccountLinking({
  auth,
  error,
  pendingProvider,
  onSuccess,
  setError,
}) {
  const email = error.customData?.email;
  if (!email) {
    setError("No email found for account linking.");
    return;
  }

  const pendingCred = pendingProvider.credentialFromError(error);
  const methods = await fetchSignInMethodsForEmail(auth, email);

  if (methods.includes("password")) {
    setError(
      "An account already exists with this email. Please log in with your email and password, then link your account from your profile."
    );
    return;
  }

  let existingProvider = null;

  if (methods.includes("google.com")) {
    existingProvider = new GoogleAuthProvider();
  } else if (methods.includes("facebook.com")) {
    existingProvider = new FacebookAuthProvider();
  }

  if (existingProvider) {
    try {
      const result = await signInWithPopup(auth, existingProvider);
      await linkWithCredential(result.user, pendingCred);
      onSuccess();
    } catch (err) {
      setError(
        "Could not link account to existing provider. Please try logging in with the original method."
      );
    }
  } else {
    setError(
      `An account already exists with a different provider: ${methods[0]}. Please use that to log in.`
    );
  }
}
