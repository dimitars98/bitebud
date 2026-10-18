import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase/firebase";
import { setUser, logout, setLoading } from "../../features/auth/authSlice";
import { getUserRole } from "../../utils/getUserRole";

// The one place that listens to Firebase Auth. Everything else reads the
// user (and role) from Redux, via useAuth() or useSelector.
export default function AuthListener({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        dispatch(logout());
        return;
      }

      // Signed in, role not known yet: keep guards (RequireRole) waiting.
      dispatch(setLoading(true));
      try {
        const role = await getUserRole(currentUser.uid);
        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role,
          }),
        );
      } catch (err) {
        console.error("Could not load user role:", err);
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return children;
}
