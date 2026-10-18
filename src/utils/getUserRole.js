import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Each account type has its own collection. A specific role wins over
// "customer": e.g. a partner who later also signed in with Google gets a
// users/ doc too, but should still be treated as a partner.
const ROLE_COLLECTIONS = [
  ["couriers", "courier"],
  ["partners", "partner"],
  ["users", "customer"],
];

/** Looks up a signed-in user's role ("courier" | "partner" | "customer"), or null. */
export async function getUserRole(uid) {
  const snaps = await Promise.all(
    ROLE_COLLECTIONS.map(([collection]) => getDoc(doc(db, collection, uid))),
  );
  const index = snaps.findIndex((snap) => snap.exists());
  if (index === -1) return null;
  return snaps[index].data().role || ROLE_COLLECTIONS[index][1];
}
