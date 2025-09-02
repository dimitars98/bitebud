import { createContext, useContext, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser, logout, setLoading } from "../features/auth/authSlice";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { user, loading } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoUrl: currentUser.photoURL,
          })
        );
      } else {
        dispatch(logout());
      }
      dispatch(setLoading(false));
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
