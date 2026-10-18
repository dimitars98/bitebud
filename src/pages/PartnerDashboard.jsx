import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";
import {
  ClipboardList,
  DollarSign,
  Timer,
  Utensils,
  PlusCircle,
  MapPin,
  ChefHat,
  TimerIcon,
} from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";
import formatTime from "../lib/formatTime";
import { useCurrency } from "../contexts/CurrencyContext";
import slugify from "slugify";
import { useTranslation } from "react-i18next";
import StatCard from "../ui/dashboard/StatCard";
import SectionCard from "../ui/dashboard/SectionCard";
import { useAuth } from "../hooks/useAuth";
import i18n from "../i18n";
import { docsWithId } from "../utils/firestore";
import { isSameDay, minutesBetween } from "../helpers/dates";

const db = getFirestore();

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`
          w-full rounded-xl border border-gray-300 dark:border-gray-700 
          bg-gray-50 dark:bg-gray-900 
          px-4 py-2.5 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:ring-2 focus:ring-(--brand-primary) focus:border-(--brand-primary) outline-none
          transition
        `}
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          w-full rounded-xl border border-gray-300 dark:border-gray-700 
          bg-gray-50 dark:bg-gray-900 
          px-4 py-2.5 text-gray-900 dark:text-white
          focus:ring-2 focus:ring-(--brand-primary) focus:border-(--brand-primary) outline-none
        `}
      >
        {children}
      </select>
    </div>
  );
}

function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="
        w-full rounded-xl bg-(--brand-primary) hover:bg-(--brand-hover) 
        text-white font-medium py-2.5 
        transition shadow-sm
      "
    >
      {children}
    </button>
  );
}

export default function PartnerDashboard() {
  const [partner, setPartner] = useState(null);
  const [stats, setStats] = useState({
    activeOrders: 0,
    todayEarnings: 0,
    avgDeliveryTime: 0,
  });
  const [restaurants, setRestaurants] = useState([]);
  const [incomingOrders, setIncomingOrders] = useState([]);

  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();
  const { user } = useAuth();

  const navigate = useNavigate();

  // Fetch orders belonging to this partner
  async function fetchIncomingOrders(partnerId) {
    const q = query(
      collection(db, "orders"),
      where("partnerId", "==", partnerId),
      where("status", "==", "Placed") // Only new orders
    );

    const snap = await getDocs(q);
    return docsWithId(snap);
  }

  // Accept order
  async function acceptOrder(orderId) {
    await setDoc(
      doc(db, "orders", orderId),
      {
        status: "AwaitingCourier",
        partnerAcceptedAt: new Date(),
      },
      { merge: true }
    );

    toast.success(i18n.t("partnerDash.accepted"));
  }

  async function fetchPartnerRestaurants(partnerId) {
    const q = query(
      collection(db, "restaurants"),
      where("partnerId", "==", partnerId)
    );
    const snapshot = await getDocs(q);
    return docsWithId(snapshot);
  }

  // useEffect(() => {
  //   const fetchPartner = async () => {
  //     const user = auth.currentUser;
  //     if (!user) return navigate("/partner-login");

  //     const docRef = doc(db, "partners", user.uid);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       const partnerData = docSnap.data();
  //       setPartner(partnerData);
  //       await fetchPartnerStats(partnerData.uid);
  //       await fetchPartnerRestaurants(partnerData.uid);
  //     } else {
  //       toast.error("Partner profile not found.");
  //       navigate("/partner-login");
  //     }
  //   };

  async function fetchPartnerStats(partnerId) {
    const ordersRef = collection(db, "orders");

    // Active orders
    const activeQ = query(
      ordersRef,
      where("partnerId", "==", partnerId),
      where("status", "!=", "Delivered")
    );
    const activeSnap = await getDocs(activeQ);
    const activeOrders = activeSnap.size;

    // Today's earnings
    const todayQ = query(ordersRef, where("partnerId", "==", partnerId));
    const todaySnap = await getDocs(todayQ);
    const todayEarnings = todaySnap.docs
      .filter((doc) => isSameDay(doc.data().createdAt))
      .reduce((sum, doc) => sum + doc.data().total, 0);

    // Average delivery time
    const deliveredQ = query(
      ordersRef,
      where("partnerId", "==", partnerId),
      where("status", "==", "Delivered")
    );
    const deliveredSnap = await getDocs(deliveredQ);

    const avgDeliveryTime =
      deliveredSnap.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (minutesBetween(data.createdAt, data.deliveredAt) ?? 0);
      }, 0) / (deliveredSnap.size || 1);

    return { activeOrders, todayEarnings, avgDeliveryTime };
  }

  // Add Restaurant
  // Add Restaurant
  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const slug = slugify(name, { lower: true });
    const city = formData.get("city");
    const address = formData.get("address");
    const cuisine = formData.get("cuisine");
    const categories = formData.get("categories");
    const deliveryTime = Number(formData.get("deliveryTime"));

    // 1. Create the restaurant with Firestore auto-generated ID
    const docRef = await addDoc(collection(db, "restaurants"), {
      name,
      slug,
      city,
      address,
      cuisine,
      categories,
      partnerId: partner.uid,
      rating: 0,
      orderNum: 0,
      hours: { open: 9, close: 22 },
      tags: ["Free delivery"],
      deliveryTime,
      bannerImage: "",
      logo: "",
      menu: {},
      location: { lat: 41.9983, lng: 21.425 },
      createdAt: serverTimestamp(),
      status: "open",
    });

    // 2. Optionally store the doc.id inside the document for convenience
    await setDoc(docRef, { restaurantId: docRef.id }, { merge: true });

    // 3. Refresh partner restaurants
    const updatedRestaurants = await fetchPartnerRestaurants(partner.uid);
    setRestaurants(updatedRestaurants);

    const orders = await fetchIncomingOrders(partner.uid);
    setIncomingOrders(orders);

    toast.success(t("partnerDash.restaurantCreated"));
    e.target.reset();
  };

  // Add Menu Item
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const restaurantId = formData.get("restaurantId");
    const category = formData.get("category");
    const name = formData.get("name");
    const description = formData.get("description");
    const price = Number(formData.get("price"));
    const image = formData.get("image");

    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);
    const restaurantData = restaurantSnap.data();

    const updatedMenu = { ...restaurantData.menu };
    if (!updatedMenu[category]) updatedMenu[category] = [];
    updatedMenu[category].push({
      id: Date.now(),
      name,
      description,
      price,
      image,
    });

    await setDoc(restaurantRef, { ...restaurantData, menu: updatedMenu });
    toast.success(t("partnerDash.itemAdded"));
    e.target.reset();
  };

  useEffect(() => {
    const fetchPartner = async () => {
      if (!user) return navigate("/partner-login");

      const docRef = doc(db, "partners", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const partnerData = docSnap.data();
        setPartner(partnerData);

        // ✅ fetch restaurants here
        const partnerRestaurants = await fetchPartnerRestaurants(
          partnerData.uid
        );
        setRestaurants(partnerRestaurants);
      }
    };

    fetchPartner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, navigate]);

  if (!partner) return <LoadingSpinner />;

  return (
    <div className="max-w-[1500px] mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("partnerDash.title")}
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<ClipboardList className="w-6 h-6 text-blue-600" />}
          title={t("partnerDash.activeOrders")}
          value={stats.activeOrders}
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          title={t("partnerDash.todayEarnings")}
          value={formatCurrency(stats.todayEarnings.toFixed(2))}
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          title={t("partnerDash.totalEarnings")}
          value={formatCurrency(partner?.totalEarnings.toFixed(2))}
        />
        <StatCard
          icon={<Timer className="w-6 h-6 text-amber-600" />}
          title={t("partnerDash.avgDelivery")}
          value={formatTime(stats.avgDeliveryTime)}
        />
      </div>

      <div className="flex gap-6">
        {/* Add Restaurant */}
        <SectionCard
          title={t("partnerDash.addRestaurant")}
          icon={<Utensils className="w-5 h-5 text-indigo-600" />}
        >
          <form
            onSubmit={handleAddRestaurant}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input
              label={t("partnerDash.restaurantName")}
              name="name"
              placeholder={t("partnerDash.restaurantNamePh")}
            />
            <Input
              label={t("partnerDash.city")}
              name="city"
              placeholder={t("partnerDash.cityPh")}
            />
            <Input
              label={t("partnerDash.address")}
              name="address"
              placeholder={t("partnerDash.addressPh")}
            />
            <Input
              label={t("partnerDash.cuisine")}
              name="cuisine"
              placeholder={t("partnerDash.cuisinePh")}
            />

            <Input
              label={t("partnerDash.categories")}
              name="categories"
              placeholder={t("partnerDash.categoriesPh")}
            />

            <Input
              label={t("partnerDash.deliveryTime")}
              name="deliveryTime"
              type="number"
              placeholder="30"
            />

            <div className="md:col-span-2">
              <PrimaryButton type="submit">
                {t("partnerDash.addRestaurant")}
              </PrimaryButton>
            </div>
          </form>
        </SectionCard>

        {/* Add Menu Item */}
        <SectionCard
          title={t("partnerDash.addMenuItem")}
          icon={<PlusCircle className="w-5 h-5 text-pink-600" />}
        >
          <form
            onSubmit={handleAddMenuItem}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Select label={t("partnerDash.restaurant")} name="restaurantId">
              <option value="">{t("partnerDash.selectRestaurant")}</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>

            <Input
              label={t("partnerDash.category")}
              name="category"
              placeholder={t("partnerDash.categoryPh")}
            />
            <Input
              label={t("partnerDash.itemName")}
              name="name"
              placeholder={t("partnerDash.itemNamePh")}
            />
            <Input
              label={t("partnerDash.description")}
              name="description"
              placeholder={t("partnerDash.descriptionPh")}
            />
            <Input
              label={t("partnerDash.price")}
              name="price"
              type="number"
              placeholder="9.99"
            />
            <Input
              label={t("partnerDash.imageUrl")}
              name="image"
              placeholder="https://..."
            />

            <div className="md:col-span-2">
              <PrimaryButton type="submit">{t("partnerDash.addItem")}</PrimaryButton>
            </div>
          </form>
        </SectionCard>
      </div>
      {/* Incoming Orders */}
      <SectionCard
        title={t("partnerDash.incoming")}
        icon={<ClipboardList className="w-5 h-5 text-blue-600" />}
      >
        {incomingOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">{t("partnerDash.noIncoming")}</p>
        ) : (
          <div className="space-y-4">
            {incomingOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {t("orders.number", { number: order.id.slice(-5) })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("partnerDash.restaurantLine", { name: order.restaurantName })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("partnerDash.customerLine", { name: order.customerName })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("partnerDash.totalLine", {
                        amount: formatCurrency(order.total),
                      })}
                    </p>
                  </div>

                  <button
                    onClick={() => acceptOrder(order.id)}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                  >
                    {t("partnerDash.accept")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
      {/* List Restaurants */}
      <SectionCard
        title={t("partnerDash.myRestaurants")}
        icon={<Utensils className="w-5 h-5 text-indigo-600" />}
      >
        {restaurants.length === 0 ? (
          <p className="text-gray-500 text-sm">
            {t("partnerDash.noRestaurants")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurants.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md 
                     transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {r.name}
                  </h3>

                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      r.status === "open"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {r.status === "open" ? t("partnerDash.open") : t("common.closed")}
                  </span>
                </div>

                {/* Info */}
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      <MapPin /> {r.address}, {r.city}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      <ChefHat /> {t("partnerDash.cuisineLine")}{" "}
                      <span className="font-medium">{r.cuisine}</span>
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      <TimerIcon /> {t("partnerDash.deliveryLine")}{" "}
                      <span className="font-medium">
                        {t("partnerDash.mins", { count: r.deliveryTime })}
                      </span>
                    </span>
                  </p>
                </div>

                {/* Tags */}
                {r.tags && r.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 
                             text-indigo-700 dark:text-indigo-300 
                             text-xs rounded-full"
                      >
                        {t(`tags.${tag}`, { defaultValue: tag })}
                      </span>
                    ))}
                  </div>
                )}

                {/* Menu Preview */}
                {r.menu && Object.keys(r.menu).length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {t("partnerDash.menuOverview")}
                    </p>

                    <div className="mt-2 space-y-3">
                      {Object.entries(r.menu).map(([category, items]) => (
                        <div key={category}>
                          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                            {category}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {items.slice(0, 4).map((item) => (
                              <span
                                key={item.id}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 
                                     rounded-lg text-xs text-gray-700 dark:text-gray-200"
                              >
                                {item.name} – {formatCurrency(item.price)}
                              </span>
                            ))}

                            {items.length > 4 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {t("partnerDash.more", { count: items.length - 4 })}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
