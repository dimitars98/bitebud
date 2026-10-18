// Small helpers for Firestore results.

/** Turns a query snapshot into plain objects that include the document id. */
export function docsWithId(snapshot) {
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
