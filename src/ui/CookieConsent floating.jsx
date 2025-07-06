import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   const consent = localStorage.getItem("cookieConsent");
  //   if (!consent) {
  //     setVisible(true);
  //   }
  // }, []);

  const handleChoice = (value) => {
    // localStorage.setItem("cookieConsent", value);
    // setVisible(false);
  };

  // if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 z-50 bg-gray-900 text-white px-6 py-5 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 animate-slide-up">
      <div className="max-w-[800px] text-sm md:text-base">
        We use cookies to personalize content, provide essential site functions,
        and analyze traffic. You can accept all, reject all, or allow only
        essential cookies.
      </div>
      <div className="flex flex-wrap gap-2 md:gap-4">
        <button
          onClick={() => handleChoice("necessary")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full transition text-sm"
        >
          Necessary Only
        </button>
        <button
          onClick={() => handleChoice("rejected")}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full transition text-sm"
        >
          Reject All
        </button>
        <button
          onClick={() => handleChoice("accepted")}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full transition text-sm"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}
