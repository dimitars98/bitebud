import { auth } from "../firebase/firebase";
import { setUser } from "../features/auth/authSlice";
import { getUserRole } from "../utils/getUserRole";

// Puts the signed-in user (with role) into Redux right away, e.g. straight
// after logging in, without waiting for AuthListener to catch up.
export async function fetchUserWithRole(dispatch) {
  const user = auth.currentUser;
  if (!user) return;

  const role = await getUserRole(user.uid);

  dispatch(
    setUser({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      role,
    }),
  );
}
