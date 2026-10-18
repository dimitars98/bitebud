// src/pages/CheckoutPage.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  Pencil,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  runTransaction,
  query,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { geocodeAddressOSM } from "../services/geocode";
import { functions } from "../firebase/firebase";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useCurrency } from "../contexts/CurrencyContext";
import {
  DELIVERY_FEE,
  getCartTotals,
  getDeliveryFee,
} from "../helpers/cartTotals";
import { useRestaurantsQuery } from "../hooks/useRestaurantsQuery";
import { useTranslation } from "react-i18next";
import { docsWithId } from "../utils/firestore";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({
  cartItems,
  deliveryFee,
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  restaurantLocation,
  restaurant,
  clearCart,
  user,
}) {
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const db = getFirestore();

  const { restaurantId, partnerId } = useCart();

  const location = useLocation();

  const isDark = document.documentElement.classList.contains("dark");
  // Shared by the card number, expiry and CVC fields.
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: isDark ? "#ffffff" : "#1a1a1a",
        fontFamily: "Nunito, sans-serif", // same font as the rest of the app
        "::placeholder": { color: isDark ? "#9ca3af" : "#a0a0a0" },
      },
      invalid: { color: "#ef4444" },
    },
  };

  const { formatCurrency, currency } = useCurrency();
  const { t } = useTranslation();

  const { subtotal, total } = getCartTotals(cartItems, deliveryFee);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!cartItems || cartItems.length === 0) {
      setErrorMessage(t("cart.empty"));
      return;
    }
    setLoadingPayment(true);
    setErrorMessage("");

    try {
      const selectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId,
      );
      if (!selectedAddress) throw new Error(t("checkout.selectAddressError"));

      // Ensure only the needed fields are sent
      const sanitizedCartItems = cartItems.map(
        ({ id, name, price, quantity }) => ({
          id,
          name,
          price,
          quantity,
        }),
      );

      // Call Firebase function
      const createPaymentIntent = httpsCallable(
        functions,
        "createPaymentIntent",
      );
      const { data } = await createPaymentIntent({
        cartItems: sanitizedCartItems,
        deliveryFee,
        currency,
      });
      const clientSecret = data.clientSecret;

      const cardElement = elements.getElement(CardNumberElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: user.displayName || "Customer" },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
        setLoadingPayment(false);
        return;
      }

      // Payment succeeded → create order
      const fullAddress = `${selectedAddress.street}, Skopje`;
      const deliveryLocation = (await geocodeAddressOSM(fullAddress)) || {
        lat: 41.9981,
        lng: 21.4254,
      };

      const orderNumber = await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, "meta", "counters");
        const counterDoc = await transaction.get(counterRef);
        if (!counterDoc.exists()) throw "Counter document does not exist!";
        const newOrderNumber = counterDoc.data().lastOrderNumber + 1;
        transaction.update(counterRef, { lastOrderNumber: newOrderNumber });
        return newOrderNumber;
      });

      // const { restaurantId, partnerId } = location.state || {};
      if (!restaurantId || !partnerId) {
        setErrorMessage(t("checkout.missingInfo"));
        setLoadingPayment(false);
        return;
      }

      // Fetch restaurant document to get name & location
      const restaurantDoc = await getDoc(doc(db, "restaurants", restaurantId));
      const restaurantData = restaurantDoc.exists()
        ? restaurantDoc.data()
        : null;
      const restaurantName = restaurantData?.name || "Unknown Restaurant";

      // Build customer name from form inputs
      const customerName = `${e.target.firstName.value} ${e.target.lastName.value}`;

      const docRef = await addDoc(collection(db, "orders"), {
        orderId: null,
        orderNumber: orderNumber,
        userId: user.uid,
        partnerId,
        restaurantId,
        restaurantName: restaurantName,
        customerName: customerName,
        items: sanitizedCartItems,
        subtotal,
        deliveryFee,
        total,
        status: "awaitingCourier",
        courierId: null,
        createdAt: serverTimestamp(),
        deliveredAt: null, // update when courier marks delivered
        deliveryAddress: selectedAddress,
        deliveryLocation,
        restaurantLocation: restaurantLocation || {
          lat: 41.9981,
          lng: 21.4254,
        },
        courierLocation: null,
        paid: true,
      });

      // await setDoc(
      //   doc(db, "orders", docRef.id),
      //   { orderId: docRef.id },
      //   { merge: true } // merge with existing fields
      // );

      // After creating the order
      const restaurantRef = doc(db, "restaurants", restaurantId);
      await runTransaction(db, async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantRef);
        if (!restaurantDoc.exists()) throw "Restaurant does not exist!";
        const currentData = restaurantDoc.data();
        transaction.update(restaurantRef, {
          orderNum: (currentData.orderNum || 0) + 1,
          totalEarnings: (currentData.totalEarnings || 0) + total,
        });
      });

      // Optionally update partner totals
      const partnerRef = doc(db, "partners", partnerId);
      await runTransaction(db, async (transaction) => {
        const partnerDoc = await transaction.get(partnerRef);
        if (!partnerDoc.exists()) throw "Partner does not exist!";
        const currentData = partnerDoc.data();
        transaction.update(partnerRef, {
          totalEarnings: (currentData.totalEarnings || 0) + total,
        });
      });

      localStorage.setItem("ongoingOrderId", docRef.id);
      clearCart();
      navigate("/order-confirmation", { state: { orderId: docRef.id } });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || t("checkout.paymentFailed"));
      setLoadingPayment(false);
    }
  };

  const isTestMode = String(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "",
  ).startsWith("pk_test");

  const [firstName = "", ...rest] = (user.displayName ?? "").split(" ");
  const lastName = rest.join(" ");

  const payButton = (
    <button
      type="submit"
      form="checkout-form"
      disabled={loadingPayment || !stripe || addresses.length === 0}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--brand-primary) px-5 py-4 text-[17px] font-extrabold text-(--restaurant-card-bg) transition-colors hover:bg-(--brand) disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-primary)/40"
    >
      {loadingPayment ? (
        <>
          <Loader2 size={20} className="animate-spin" aria-hidden="true" />
          {t("checkout.processing")}
        </>
      ) : (
        <>
          <Lock size={18} aria-hidden="true" />
          {t("checkout.pay", { amount: formatCurrency(total) })}
        </>
      )}
    </button>
  );

  return (
    <div className="mx-auto max-w-[1500px] px-4 pb-32 pt-6 md:px-6 md:pt-10 lg:pb-16">
      {/* Header */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-(--text-muted) hover:text-(--brand)"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t("checkout.backToCart")}
      </Link>
      <h1 className="mt-2 mb-6 text-3xl font-extrabold text-(--text-primary) md:text-4xl">
        {t("checkout.title")}
      </h1>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
        {/* Left: the form, in three numbered steps */}
        <form
          id="checkout-form"
          onSubmit={handlePayment}
          className="flex flex-col gap-5"
        >
          {/* 1. Address */}
          <Step number={1} icon={MapPin} title={t("checkout.stepAddress")}>
            {addresses.length === 0 ? (
              <div className="flex flex-col items-start gap-3 rounded-xl border-2 border-dashed border-(--border-primary) dark:border-white/15 p-5">
                <p className="text-(--text-muted)">{t("checkout.noAddresses")}</p>
                <Link
                  to="/profile"
                  state={{ section: "addresses" }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-(--brand-primary) px-4 py-2.5 text-sm font-extrabold text-(--restaurant-card-bg) hover:bg-(--brand)"
                >
                  <Plus size={16} aria-hidden="true" />
                  {t("checkout.addAddress")}
                </Link>
              </div>
            ) : (
              <>
                <div
                  role="radiogroup"
                  aria-label={t("checkout.stepAddress")}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {addresses.map((address) => {
                    const selected = selectedAddressId === address.id;
                    return (
                      <label
                        key={address.id}
                        className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-4 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-(--brand-primary)/40 ${
                          selected
                            ? "border-(--brand-primary) bg-(--brand-primary)/10"
                            : "border-(--border-primary) dark:border-white/10 hover:border-(--brand-primary)/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryAddress"
                          value={address.id}
                          checked={selected}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="sr-only"
                        />
                        <span className="flex items-center gap-2">
                          <span className="rounded-full bg-(--restaurant-card-bg) px-2.5 py-0.5 text-xs font-extrabold text-(--brand-primary)">
                            {t(`address.labels.${address.label}`, {
                              defaultValue: address.label || t("address.labels.Home"),
                            })}
                          </span>
                          {address.default && (
                            <span className="text-xs font-semibold text-(--text-muted)">
                              {t("checkout.default")}
                            </span>
                          )}
                        </span>
                        <span className="mt-1 font-bold text-(--text-primary) dark:text-white">
                          {address.street}
                        </span>
                        <span className="text-sm text-(--text-muted)">
                          {[
                            address.entranceInfo,
                            address.floor &&
                              t("checkout.floor", { floor: address.floor }),
                            address.phone &&
                              t("checkout.phone", { phone: address.phone }),
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                        {selected && (
                          <span
                            className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-(--brand-primary) text-(--restaurant-card-bg)"
                            aria-hidden="true"
                          >
                            <Check size={14} strokeWidth={3} />
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                <Link
                  to="/profile"
                  state={{ section: "addresses" }}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-(--text-muted) hover:text-(--brand)"
                >
                  <Pencil size={14} aria-hidden="true" />
                  {t("checkout.manageAddresses")}
                </Link>
              </>
            )}
          </Step>

          {/* 2. Name */}
          <Step number={2} icon={UserRound} title={t("checkout.stepDetails")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("checkout.firstName")} htmlFor="firstName">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  defaultValue={firstName}
                  placeholder={t("checkout.firstNamePh")}
                  className={inputClass}
                />
              </Field>
              <Field label={t("checkout.lastName")} htmlFor="lastName">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  autoComplete="family-name"
                  defaultValue={lastName}
                  placeholder={t("checkout.lastNamePh")}
                  className={inputClass}
                />
              </Field>
            </div>
          </Step>

          {/* 3. Card */}
          <Step number={3} icon={CreditCard} title={t("checkout.stepPayment")}>
            <div className="flex flex-col gap-4">
              <Field label={t("checkout.cardNumber")}>
                <div className={stripeFieldClass}>
                  <CardNumberElement options={{ ...cardElementOptions, showIcon: true }} />
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t("checkout.expiry")}>
                  <div className={stripeFieldClass}>
                    <CardExpiryElement options={cardElementOptions} />
                  </div>
                </Field>
                <Field label={t("checkout.cvc")}>
                  <div className={stripeFieldClass}>
                    <CardCvcElement options={cardElementOptions} />
                  </div>
                </Field>
              </div>

              <p className="flex items-start gap-2 text-sm text-(--text-muted)">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
                {t("checkout.cardSafe")}
              </p>
              {isTestMode && (
                <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:bg-amber-400/10 dark:text-amber-300">
                  {t("checkout.testMode")}
                </p>
              )}
            </div>
          </Step>
        </form>

        {/* Right: order summary (sticky on desktop) */}
        <aside className="lg:sticky lg:top-[calc(var(--nav-height,80px)+1.5rem)] lg:self-start">
          <section
            aria-labelledby="checkout-summary"
            className="overflow-hidden rounded-2xl border border-(--border-primary) dark:border-white/10 bg-white shadow-sm dark:bg-(--brand-bg-secondary)"
          >
            {restaurant && (
              <div className="flex items-center gap-3 bg-(--restaurant-card-bg) px-5 py-4 text-white">
                {restaurant.logo && (
                  <img src={restaurant.logo} alt="" className="h-11 w-11 rounded-lg object-cover" />
                )}
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                    {t("cartPage.from")}
                  </p>
                  <p className="truncate font-extrabold">{restaurant.name}</p>
                </div>
              </div>
            )}

            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 id="checkout-summary" className="text-lg font-extrabold text-(--text-primary) dark:text-white">
                  {t("checkout.summary")}
                </h2>
                <Link to="/cart" className="text-sm font-bold text-(--text-muted) hover:text-(--brand)">
                  {t("checkout.editCart")}
                </Link>
              </div>

              <ul className="mt-4 space-y-3">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex gap-3 text-[15px]">
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-(--bg-secondary) px-1.5 text-xs font-extrabold text-(--text-primary) dark:bg-(--brand-bg-primary) dark:text-white">
                      {item.quantity}×
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-(--text-primary) dark:text-white">
                        {item.name}
                      </span>
                      {item.extras?.length > 0 && (
                        <span className="block truncate text-sm text-(--text-muted)">
                          + {item.extras.map((e) => e.name).join(", ")}
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-(--text-primary) dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-2.5 border-t border-(--border-primary) dark:border-white/10 pt-4 text-[15px]">
                <div className="flex justify-between text-(--text-muted)">
                  <dt>{t("checkout.subtotal")}</dt>
                  <dd>{formatCurrency(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-(--text-muted)">
                  <dt>{t("cart.deliveryFee")}</dt>
                  <dd>
                    {deliveryFee === 0 ? (
                      <span className="flex items-center gap-2">
                        <span className="text-gray-400 line-through">{formatCurrency(DELIVERY_FEE)}</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">{t("common.free")}</span>
                      </span>
                    ) : (
                      formatCurrency(deliveryFee)
                    )}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-dashed border-(--border-primary) dark:border-white/15 pt-3 text-lg font-extrabold text-(--text-primary) dark:text-white">
                  <dt>{t("checkout.totalDue")}</dt>
                  <dd>{formatCurrency(total)}</dd>
                </div>
              </dl>

              {errorMessage && (
                <p
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {errorMessage}
                </p>
              )}

              <div className="mt-5 hidden lg:block">{payButton}</div>
            </div>
          </section>
        </aside>
      </div>

      {/* Phones/tablets: pay button stays in reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-(--border-primary) bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur dark:bg-(--brand-bg-primary)/95 lg:hidden">
        {payButton}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-(--border-primary) dark:border-white/10 bg-white px-4 py-3 text-(--text-primary) placeholder:text-gray-400 transition-shadow focus:outline-none focus:border-(--brand-primary) focus:ring-4 focus:ring-(--brand-primary)/25 dark:bg-(--brand-bg-primary) dark:text-white";

// Stripe renders its fields in an iframe, so the focus ring goes on the wrapper.
const stripeFieldClass =
  "min-h-[50px] rounded-xl border border-(--border-primary) dark:border-white/10 bg-white px-4 py-3.5 transition-shadow focus-within:border-(--brand-primary) focus-within:ring-4 focus-within:ring-(--brand-primary)/25 dark:bg-(--brand-bg-primary)";

function Step({ number, icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-(--border-primary) dark:border-white/10 bg-white p-5 shadow-sm dark:bg-(--brand-bg-secondary) sm:p-6">
      <h2 className="mb-4 flex items-center gap-3 text-lg font-extrabold text-(--text-primary) dark:text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--restaurant-card-bg) text-sm font-black text-(--brand-primary)">
          {number}
        </span>
        <Icon size={20} className="text-(--text-muted)" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-bold text-(--text-primary) dark:text-slate-200">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CheckoutPage() {
  const location = useLocation();
  const { cartItems, clearCart, restaurantId: cartRestaurantId } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);

  const db = getFirestore();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t, i18n } = useTranslation();
  // From the cart drawer/page; falls back to the cart itself after a refresh.
  const restaurantId = location.state?.restaurantId ?? cartRestaurantId;
  const { data: restaurants = [] } = useRestaurantsQuery();
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const deliveryFee = getDeliveryFee(restaurant);

  useEffect(() => {
    if (!loading && !user) navigate("/");

    async function fetchAddresses() {
      if (!user) return;
      const addressesRef = collection(db, "users", user.uid, "addresses");
      const q = query(addressesRef);
      const snapshot = await getDocs(q);
      const fetchedAddresses = docsWithId(snapshot);
      setAddresses(fetchedAddresses);
      setSelectedAddressId(
        fetchedAddresses.find((addr) => addr.default)?.id ||
          fetchedAddresses[0]?.id ||
          null,
      );
    }
    fetchAddresses();
  }, [user, loading, db, navigate]);

  useEffect(() => {
    if (!user || !restaurantId) return;
    async function fetchRestaurantLocation() {
      const restaurantDoc = await getDoc(doc(db, "restaurants", restaurantId));
      if (restaurantDoc.exists())
        setRestaurantLocation(restaurantDoc.data().location);
    }
    fetchRestaurantLocation();
  }, [user, restaurantId, db]);

  if (!user || cartItems.length === 0)
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <p className="text-lg text-(--text-muted)">{t("checkout.notReady")}</p>
        <Link
          to="/explore"
          className="mt-6 rounded-xl bg-(--brand-primary) px-6 py-3 font-extrabold text-(--restaurant-card-bg) hover:bg-(--brand)"
        >
          {t("footer.browse")}
        </Link>
      </div>
    );

  return (
    <Elements
      stripe={stripePromise}
      // Stripe has no Macedonian; "auto" falls back to the browser's language
      options={{
        locale: i18n.resolvedLanguage === "mk" ? "auto" : i18n.resolvedLanguage,
        // let the card fields use the app's font
        fonts: [
          {
            cssSrc:
              "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap",
          },
        ],
      }}
      key={i18n.resolvedLanguage}
    >
      <CheckoutForm
        cartItems={cartItems}
        deliveryFee={deliveryFee}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        setSelectedAddressId={setSelectedAddressId}
        restaurantLocation={restaurantLocation}
        restaurant={restaurant}
        clearCart={clearCart}
        user={user}
      />
    </Elements>
  );
}
