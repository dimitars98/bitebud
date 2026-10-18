// RatingModal.jsx
import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  doc,
  updateDoc,
  arrayUnion,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useCurrency } from "../contexts/CurrencyContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const faces = ["😡", "😕", "😐", "😊", "😍"];

const faceVariants = {
  hover: { scale: 1.5, rotate: [0, -10, 10, 0], y: -5 },
  tap: { scale: 1.2, y: 0 },
};

// Tags are saved to Firestore in English; only the labels are translated
// (rating.tags.<tag> in the locale files).
const courierTags = [
  "Fast delivery",
  "Polite",
  "Careful with food",
  "Late",
  "Unprofessional",
];
const restaurantTags = [
  "Great taste",
  "Good packaging",
  "Large portions",
  "Cold food",
  "Poor quality",
];

export default function RatingModal({ order, onClose }) {
  const [step, setStep] = useState(1);

  const [courierRating, setCourierRating] = useState(0);
  const [courierComment, setCourierComment] = useState("");
  const [courierSelectedTags, setCourierSelectedTags] = useState([]);

  const [restaurantRating, setRestaurantRating] = useState(0);
  const [restaurantComment, setRestaurantComment] = useState("");
  const [restaurantSelectedTags, setRestaurantSelectedTags] = useState([]);

  const [tipAmount, setTipAmount] = useState(0);

  const { formatCurrency } = useCurrency();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const toggleTag = (tag, selectedTags, setSelectedTags) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((selected) => selected !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const submitCourierRating = async () => {
    const orderRef = doc(db, "orders", order.id);
    await updateDoc(orderRef, {
      courierRating: {
        stars: courierRating,
        comment: courierComment,
        tags: courierSelectedTags,
        tip: tipAmount,
      },
    });
    setStep(2);
  };

  const submitRestaurantRating = async () => {
    const restaurantRef = doc(db, "restaurants", order.restaurantId);

    // 1️⃣ New rating object (for reference, optional)
    const newRating = {
      orderId: order.id,
      stars: restaurantRating,
      comment: restaurantComment,
      tags: restaurantSelectedTags,
      date: new Date(),
    };

    // 2️⃣ Update sum and count atomically
    await updateDoc(restaurantRef, {
      ratingSum: increment(restaurantRating),
      ratingCount: increment(1),
      // Optional: store individual ratings if you want to show comments/tags later
      ratings: arrayUnion(newRating),
    });

    // 3️⃣ Recalculate the average
    const restaurantSnap = await getDoc(restaurantRef);
    if (restaurantSnap.exists()) {
      const data = restaurantSnap.data();
      const avg =
        data.ratingCount && data.ratingSum
          ? data.ratingSum / data.ratingCount
          : restaurantRating; // fallback for first rating

      await updateDoc(restaurantRef, {
        rating: parseFloat(avg.toFixed(2)), // round to 2 decimals
      });
    }

    onClose(); // close modal
  };

  const modalContent = (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2147483647] p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-md rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] bg-(--bg-main)
                     border border-white/20 dark:border-gray-700/40"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="courier"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-6"
              >
                <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-(--brand) to-(--brand-hover) bg-clip-text text-transparent">
                  {t("rating.rateCourier")}
                </h2>

                {/* Emoji rating */}
                <div className="flex justify-center gap-5">
                  {faces.map((face, idx) => {
                    const value = idx + 1;
                    return (
                      <motion.button
                        key={value}
                        onClick={() => setCourierRating(value)}
                        whileHover="hover"
                        whileTap="tap"
                        variants={faceVariants}
                        className={`text-5xl transition-transform drop-shadow-sm ${
                          courierRating >= value
                            ? "scale-110 text-(--brand)"
                            : "text-gray-400"
                        }`}
                      >
                        {face}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Quick reason tags */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {courierTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        toggleTag(
                          tag,
                          courierSelectedTags,
                          setCourierSelectedTags,
                        )
                      }
                      className={`px-3 py-1 rounded-full hover:border-(--brand) border text-sm transition-colors ${
                        courierSelectedTags.includes(tag)
                          ? "bg-(--brand) text-white border-(--brand)"
                          : "bg-white/70 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300"
                      }`}
                    >
                      {t(`rating.tags.${tag}`, { defaultValue: tag })}
                    </button>
                  ))}
                </div>

                {/* Comment */}
                <textarea
                  placeholder={t("rating.commentPh")}
                  value={courierComment}
                  onChange={(e) => setCourierComment(e.target.value)}
                  className="w-full rounded-2xl p-4 resize-none border border-gray-200 dark:border-gray-600 
                             focus:outline-none focus:ring-2 focus:ring-(--brand) 
                             bg-white/70 dark:bg-gray-800/70 shadow-inner transition-all"
                  rows={3}
                />

                {/* Tip prompt */}
                <div className="flex gap-3 justify-center">
                  {[0, 0.5, 1, 2, 5].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTipAmount(amount)}
                      className={`px-4 py-2 rounded-xl hover:border-(--brand) border font-medium whitespace-nowrap transition-colors ${
                        tipAmount === amount
                          ? "bg-(--brand) text-white border-(--brand)"
                          : "bg-white/70 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300"
                      }`}
                    >
                      {amount === 0 ? t("rating.noTip") : formatCurrency(amount)}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between w-full">
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-(--brand) transition-colors font-medium"
                  >
                    {t("rating.skip")}
                  </button>
                  <button
                    onClick={submitCourierRating}
                    disabled={courierRating === 0}
                    className="px-6 py-2 rounded-2xl font-semibold 
                               bg-gradient-to-r from-(--brand) to-(--brand-hover) text-white 
                               shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {t("rating.next")}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="restaurant"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-6"
              >
                <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-(--brand) to-(--brand-hover) bg-clip-text text-transparent">
                  {t("rating.rateRestaurant", { name: order.restaurantName })}
                </h2>

                {/* Emoji rating */}
                <div className="flex justify-center gap-5">
                  {faces.map((face, idx) => {
                    const value = idx + 1;
                    return (
                      <motion.button
                        key={value}
                        onClick={() => setRestaurantRating(value)}
                        whileHover="hover"
                        whileTap="tap"
                        variants={faceVariants}
                        className={`text-5xl transition-transform drop-shadow-sm ${
                          restaurantRating >= value
                            ? "scale-110 text-(--brand)"
                            : "text-gray-400"
                        }`}
                      >
                        {face}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Quick reason tags */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {restaurantTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        toggleTag(
                          tag,
                          restaurantSelectedTags,
                          setRestaurantSelectedTags,
                        )
                      }
                      className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                        restaurantSelectedTags.includes(tag)
                          ? "bg-(--brand) text-white border-(--brand)"
                          : "bg-white/70 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300"
                      }`}
                    >
                      {t(`rating.tags.${tag}`, { defaultValue: tag })}
                    </button>
                  ))}
                </div>

                {/* Comment */}
                <textarea
                  placeholder={t("rating.commentPh")}
                  value={restaurantComment}
                  onChange={(e) => setRestaurantComment(e.target.value)}
                  className="w-full rounded-2xl p-4 resize-none border border-gray-200 dark:border-gray-600 
                             focus:outline-none focus:ring-2 focus:ring-(--brand) 
                             bg-white/70 dark:bg-gray-800/70 shadow-inner transition-all"
                  rows={3}
                />

                <div className="flex justify-between w-full">
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-(--brand) transition-colors font-medium"
                  >
                    {t("rating.skip")}
                  </button>
                  <button
                    onClick={submitRestaurantRating}
                    disabled={restaurantRating === 0}
                    className="px-6 py-2 rounded-2xl font-semibold 
                               bg-gradient-to-r from-(--brand) to-(--brand-hover) text-white 
                               shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {t("rating.submit")}
                  </button>
                </div>

                {/* Follow-up CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 text-center"
                >
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {t("rating.thanks")}
                  </p>
                  <div className="flex justify-center gap-3 mt-2">
                    <button
                      onClick={() => {
                        // Example CTA: navigate to reorder flow
                        window.location.href = `/restaurants/${order.restaurantId}`;
                      }}
                      className="px-4 py-2 rounded-xl bg-(--brand) text-white font-medium hover:bg-(--brand-hover) transition-colors"
                    >
                      {t("rating.orderAgain")}
                    </button>
                    <button
                      onClick={() => {
                        // Example CTA: browse restaurants
                        // window.location.href = "/restaurants";
                        navigate("/explore");
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      {t("rating.browseMore")}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
