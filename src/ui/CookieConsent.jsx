import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const handleChoice = (value) => {
    localStorage.setItem("cookieConsent", value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-gray-900 text-white px-6 py-5 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.4)]">
      <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm md:text-base text-center md:text-left">
          We use cookies to improve your experience, personalize content, and
          analyze traffic. You can choose to accept all, reject all, or allow
          only necessary cookies.
        </p>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          <button
            onClick={() => handleChoice("necessary")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm transition"
          >
            Necessary Only
          </button>
          <button
            onClick={() => handleChoice("rejected")}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full text-sm transition"
          >
            Reject All
          </button>
          <button
            onClick={() => handleChoice("accepted")}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full text-sm transition"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
