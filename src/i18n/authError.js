// Firebase Auth errors come back as English text like
// "Firebase: Error (auth/wrong-password)." Show a translated message for the
// common codes instead, and the given fallback for anything else.
export function authErrorMessage(t, err, fallbackKey) {
  const code = err?.code?.replace(/^auth\//, "");
  return t(`authErrors.${code}`, { defaultValue: t(fallbackKey) });
}
