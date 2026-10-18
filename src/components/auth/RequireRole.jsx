import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../hooks/useAuth";
import i18n from "../../i18n";

// Shows `children` only to a signed-in user with the given role. The user and
// role come from Redux (filled by AuthListener), so no extra Firestore reads.
export default function RequireRole({ role, children }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Just signed in but Redux hasn't caught up yet: wait instead of bouncing
  // the user back to the login page.
  const pending =
    loading || (auth.currentUser && user?.uid !== auth.currentUser.uid);
  const authorized = !pending && user?.role === role;

  useEffect(() => {
    if (pending || authorized) return;
    if (user) toast.error(i18n.t("common.accessDenied"));
    navigate(`/${role}-login`);
  }, [pending, authorized, user, role, navigate]);

  return authorized ? children : null;
}
