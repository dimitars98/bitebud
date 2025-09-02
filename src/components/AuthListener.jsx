import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "../firebase/firebase";
import { setUser, logout, setLoading } from "../features/auth/authSlice";

export default function AuthListener({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          })
        );
      } else {
        dispatch(logout());
      }
      dispatch(setLoading(false));
    });

    return unsubscribe;
  }, [dispatch]);

  return children;
}
