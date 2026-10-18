import { useCallback, useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Lucide icons
import {
  Bike,
  Phone,
  Mail,
  DollarSign,
  Timer,
  Package,
  MapPin,
} from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useCurrency } from "../contexts/CurrencyContext";
import OrderHistoryTable from "../components/order/OrderHistoryTable";
import formatTime from "../lib/formatTime";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import StatCard from "../ui/dashboard/StatCard";
import SectionCard from "../ui/dashboard/SectionCard";
import { docsWithId } from "../utils/firestore";
import { isSameDay, isSameMonth, minutesBetween } from "../helpers/dates";

export default function CourierDashboard() {
  const [courier, setCourier] = useState(null);
  const [courierOrders, setCourierOrders] = useState([]);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    deliveredOrders: 0,
    todaysEarnings: 0,
    avgDeliveryTime: 0,
  });
  const [period, setPeriod] = useState("today"); // "today" | "month" | "total"
  const [earnings, setEarnings] = useState({
    today: 0,
    month: 0,
    total: 0,
  });

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();

  // Fetch courier profile
  // useEffect(() => {
  //   const fetchCourier = async () => {
  //     const user = auth.currentUser;
  //     if (!user) return navigate("/courier-login");

  //     const docRef = doc(db, "couriers", user.uid);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       setCourier({ uid: user.uid, ...docSnap.data() });
  //     } else {
  //       toast.error("Courier profile not found.");
  //       navigate("/courier-login");
  //     }
  //   };

  //   fetchCourier();
  // }, [navigate]);

  const fetchCourierOrders = useCallback(async () => {
    if (!courier) return;

    const q = query(
      collection(db, "orders"),
      where("courierId", "==", courier.uid)
    );

    const snap = await getDocs(q);

    const data = docsWithId(snap);

    // Sort newest first
    data.sort((a, b) => {
      const aTime = a.completedAt?.seconds || a.assignedAt?.seconds || 0;
      const bTime = b.completedAt?.seconds || b.assignedAt?.seconds || 0;
      return bTime - aTime;
    });

    setCourierOrders(data);
  }, [courier]);

  useEffect(() => {
    fetchCourierOrders();
  }, [fetchCourierOrders]);

  // Load this courier's profile once Redux knows who is signed in
  // (AuthListener is the only Firebase Auth listener).
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/courier-login");
      return;
    }

    let cancelled = false;
    getDoc(doc(db, "couriers", user.uid)).then((docSnap) => {
      if (cancelled) return;
      if (docSnap.exists()) {
        setCourier({ uid: user.uid, ...docSnap.data() });
      } else {
        toast.error(t("courierDash.notFound"));
        navigate("/courier-login");
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, authLoading, navigate]);

  function capitalizeFirstLetter(word) {
    if (!word) return "";
    const firstLetter = word.at(0).toUpperCase();
    const remaindingPart = word.slice(1);
    return firstLetter + remaindingPart;
  }

  async function completeDelivery(orderId, total) {
    if (!courier) return;

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: "completed",
        completedAt: serverTimestamp(),
        courierEarning: total * 0.8, // example: 80% of total goes to courier
      });
      toast.success(t("courierDash.completed"));

      // Refresh lists & stats AND history table
      await fetchActiveOrders();
      await fetchStats();
      await fetchCourierOrders(); // <-- add this
    } catch (err) {
      console.error(err);
      toast.error(t("courierDash.completeFailed"));
    }
  }

  // Fetch available orders
  async function fetchAvailableOrders() {
    const q = query(
      collection(db, "orders"),
      where("status", "==", "awaitingCourier")
    );
    const snap = await getDocs(q);
    return docsWithId(snap);
  }

  // Fetch active deliveries
  const fetchActiveOrders = useCallback(async () => {
    if (!courier) return;
    const q = query(
      collection(db, "orders"),
      where("courierId", "==", courier.uid),
      where("status", "==", "delivering")
    );
    const snap = await getDocs(q);
    setActiveOrders(docsWithId(snap));
  }, [courier]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!courier) return;
    const ordersSnap = await getDocs(collection(db, "orders"));

    let active = 0;
    let todayEarnings = 0;
    let monthEarnings = 0;
    let totalEarnings = 0;
    let totalTime = 0;
    let completedCount = 0;
    let deliveredToday = 0;
    let deliveredMonth = 0;
    let deliveredTotal = 0;

    ordersSnap.forEach((doc) => {
      const o = doc.data();
      if (o.courierId !== courier.uid) return;

      if (o.status === "delivering") active++;

      if (o.status === "completed") {
        deliveredTotal++;

        if (isSameDay(o.completedAt)) deliveredToday++;
        if (isSameMonth(o.completedAt)) deliveredMonth++;
      }

      if (o.status === "completed" && o.courierEarning) {
        totalEarnings += o.courierEarning;

        if (isSameDay(o.completedAt)) todayEarnings += o.courierEarning;
        if (isSameMonth(o.completedAt)) monthEarnings += o.courierEarning;

        const minutes = minutesBetween(o.assignedAt, o.completedAt);
        if (minutes != null) {
          totalTime += minutes;
          completedCount += 1;
        }
      }
    });

    // const avgTime =
    //   completedCount > 0 ? Math.round(totalTime / completedCount / 60000) : 0;

    setStats({
      activeDeliveries: active,
      deliveredOrdersToday: deliveredToday,
      deliveredOrdersMonth: deliveredMonth,
      deliveredOrdersTotal: deliveredTotal,
      avgDeliveryTime:
        completedCount > 0 ? Math.round(totalTime / completedCount) : 0,
    });

    setEarnings({
      today: todayEarnings.toFixed(2),
      month: monthEarnings.toFixed(2),
      total: totalEarnings.toFixed(2),
    });

    // // <-- Save avgDeliveryTime to Firestore
    // try {
    //   const courierRef = doc(db, "couriers", courier.uid);
    //   await updateDoc(courierRef, { avgDeliveryTime: avgTime });
    //   console.log("Avg delivery time saved to Firestore:", avgTime);
    // } catch (err) {
    //   console.error("Failed to update avgDeliveryTime:", err);
    // }
  }, [courier]);

  // Accept order
  // Accept order
  async function acceptOrder(orderId) {
    if (!courier) return;

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: "delivering",
        courierId: courier.uid,
        assignedAt: serverTimestamp(),
      });
      toast.success(t("courierDash.accepted"));

      // Remove from availableOrders list immediately
      setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));

      // Refresh active orders, stats and the history table
      await fetchActiveOrders();
      await fetchStats();
      await fetchCourierOrders(); // <-- add this
    } catch (err) {
      console.error(err);
      toast.error(t("courierDash.acceptFailed"));
    }
  }

  // Load available & active orders on mount
  useEffect(() => {
    if (!courier) return;

    const loadOrders = async () => {
      const available = await fetchAvailableOrders();
      setAvailableOrders(available);

      await fetchActiveOrders();
      await fetchStats();
    };

    loadOrders();

    // Auto-refresh available orders every 15s
    const interval = setInterval(async () => {
      const available = await fetchAvailableOrders();
      setAvailableOrders(available);
    }, 15000);

    return () => clearInterval(interval);
  }, [courier, fetchActiveOrders, fetchStats]);

  useEffect(() => {
    if (courier) {
      fetchStats();
    }
  }, [courier, fetchStats]);

  if (!courier) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-4xl font-bold text-center dark:text-(--text-primary)">
        {t("courierDash.welcome", { name: courier.firstName })}
      </h1>

      <div className="flex justify-center gap-4 mb-4">
        {["today", "month", "total"].map((p) => (
          <button
            key={p}
            className={`px-4 py-2 rounded-lg font-medium ${
              period === p
                ? "bg-(--brand-primary) text-white"
                : "bg-white dark:hover:bg-(--brand-bg-secondary-hover) dark:bg-(--brand-bg-secondary) text-gray-700 dark:text-gray-300"
            }`}
            onClick={() => setPeriod(p)}
          >
            {t(`courierDash.${p}`)}
          </button>
        ))}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* <StatCard
          icon={<Package className="w-6 h-6 text-(--brand-primary)" />}
          title="Active Deliveries"
          value={stats.activeDeliveries}
        /> */}
        <StatCard
          icon={<Package className="w-6 h-6 text-(--brand-primary)" />}
          title={t("courierDash.delivered")}
          value={
            period === "today"
              ? stats.deliveredOrdersToday
              : period === "month"
              ? stats.deliveredOrdersMonth
              : stats.deliveredOrdersTotal
          }
        />

        <StatCard
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          title={t("courierDash.earnings")}
          value={formatCurrency(earnings[period])}
        />
        <StatCard
          icon={<Timer className="w-6 h-6 text-[var(--brand-primary)]" />}
          title={t("courierDash.avgDelivery")}
          value={formatTime(stats?.avgDeliveryTime ?? 0)}
          // value={formatTime(courier?.avgDeliveryTime ?? 0)} // <-- use Firestore value
        />
        <StatCard
          icon={<MapPin className="w-5 h-5 text-red-600" />}
          title={t("courierDash.zone")}
          value={
            courier.zone
              ? t(`courier.zones.${courier.zone}`, {
                  defaultValue: capitalizeFirstLetter(courier.zone),
                })
              : t("courierDash.notAssigned")
          }
        />
        {/* Current Location */}
        {/* <SectionCard
          title="Current Zone"
          icon={<MapPin className="w-5 h-5 text-red-600" />}
        >
          <p className="text-(--text-primary) dark:text-(--text-primary)">
            {courier.zone || "Not assigned"}
          </p>
        </SectionCard> */}
      </div>
      <div className="md:flex gap-6">
        {/* Available Orders */}
        <div className="flex-1">
          <SectionCard
            title={t("courierDash.available")}
            icon={<Package className="w-5 h-5 text-(--brand-primary)" />}
          >
            {availableOrders.length === 0 ? (
              <p className="text-gray-500">{t("courierDash.noneAvailable")}</p>
            ) : (
              <ul className="space-y-4">
                {availableOrders.map((order) => (
                  <li
                    key={order.id}
                    className="bg-white dark:bg-(--brand-bg-secondary) p-4 rounded-xl shadow hover:shadow-lg transition-shadow duration-200 flex justify-between items-center"
                  >
                    <div className="dark:text-(--text-primary) grid grid-cols-1 md:grid-cols-2 gap-2">
                      <p>
                        <strong>{t("courierDash.restaurant")}</strong> {order.restaurantName}
                      </p>
                      <p>
                        <strong>{t("courierDash.customer")}</strong> {order.customerName}
                      </p>
                      <p>
                        <strong>{t("courierDash.address")}</strong>{" "}
                        {order.deliveryAddress.street}
                      </p>
                      <p>
                        <strong>{t("courierDash.totalLabel")}</strong>{" "}
                        <span className="text-green-600 font-medium">
                          {formatCurrency(order.total.toFixed(2))}
                        </span>
                      </p>
                      <p>
                        <strong>{t("courierDash.zoneLabel")}</strong>{" "}
                        {t(`courier.zones.${order.zone}`, { defaultValue: order.zone ?? "" })}
                      </p>
                    </div>
                    <button
                      className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                      onClick={() => acceptOrder(order.id)}
                    >
                      {t("courierDash.accept")}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
        <div className="flex-1">
          {/* Active Deliveries */}
          <SectionCard
            title={t("courierDash.active")}
            icon={<Package className="w-5 h-5 text-yellow-600" />}
          >
            {activeOrders.length === 0 ? (
              <p className="text-gray-500">{t("courierDash.noneActive")}</p>
            ) : (
              <ul className="space-y-4">
                {activeOrders.map((order) => (
                  <li
                    key={order.id}
                    className="p-4 bg-(--bg-primary) rounded-lg flex flex-col md:flex-row justify-between items-center gap-4"
                  >
                    <div className="dark:text-(--text-primary)">
                      <p>
                        <strong>{t("courierDash.restaurant")}</strong> {order.restaurantName}
                      </p>
                      <p>
                        <strong>{t("courierDash.customer")}</strong> {order.customerName}
                      </p>
                      {order.deliveryAddress && (
                        <p>
                          <strong>{t("courierDash.address")}</strong>{" "}
                          {order.deliveryAddress.street}
                        </p>
                      )}
                      <p>
                        <strong>{t("courierDash.totalLabel")}</strong>{" "}
                        {formatCurrency(order.total.toFixed(2))}
                      </p>
                      <p>
                        <strong>{t("courierDash.zoneLabel")}</strong>{" "}
                        {t(`courier.zones.${order.zone}`, { defaultValue: order.zone ?? "" })}
                      </p>
                      <p>
                        <strong>{t("courierDash.statusLabel")}</strong>{" "}
                        <span className="text-(--brand-primary) font-medium">
                          {t(`orders.status.${order.status}`, {
                            defaultValue: order.status,
                          })}
                        </span>
                      </p>
                    </div>
                    <button
                      className="bg-(--brand-primary) text-white px-4 py-2 rounded-lg hover:(--brand-hover)"
                      onClick={() => completeDelivery(order.id, order.total)}
                    >
                      {t("courierDash.complete")}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
      <OrderHistoryTable orders={courierOrders} />
      <div className="flex md:flex-row flex-col gap-6">
        <div className="flex-1">
          {/* Courier Info */}
          <SectionCard
            title={t("courierDash.info")}
            icon={<Bike className="w-5 h-5 text-indigo-600" />}
          >
            <p className="text-(--text-primary) dark:text-(--text-primary)">
              <strong>{t("courierDash.vehicle")}</strong>{" "}
              {t(`courier.vehicles.${courier.vehicleType}`, {
                defaultValue: capitalizeFirstLetter(courier.vehicleType),
              })}
            </p>
            {courier.vehicleRegNumber && (
              <p className="text-(--text-primary) dark:text-(--text-primary)">
                <strong>{t("courierDash.regNumber")}</strong> {courier.vehicleRegNumber}
              </p>
            )}
            <p className="text-(--text-primary) dark:text-(--text-primary)">
              <strong>{t("courierDash.availability")}</strong> {courier.availability}
            </p>
            <p className="text-(--text-primary) dark:text-(--text-primary)">
              <strong>{t("courierDash.statusLabel")}</strong>{" "}
              <span className="font-medium text-(--brand-primary)">
                {t(`courier.statuses.${courier.status}`, {
                  defaultValue: courier.status,
                })}
              </span>
            </p>
          </SectionCard>
        </div>

        {/* Contact Info */}
        <div className="flex-1">
          <SectionCard
            title={t("courierDash.contact")}
            icon={<Phone className="w-5 h-5 text-purple-600" />}
          >
            <p className="text-(--text-primary) dark:text-(--text-primary)">
              <strong>{t("courierDash.name")}</strong> {courier.firstName} {courier.lastName}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" />
              <span className="text-(--text-primary) dark:text-(--text-primary)">
                {courier.phone}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-500" />{" "}
              <span className="text-(--text-primary) dark:text-(--text-primary)">
                {courier.email}
              </span>
            </p>
          </SectionCard>
        </div>
      </div>

      {/* Profile Photo */}
      {courier.photo && (
        <div className="flex justify-center items-center">
          <img
            alt={t("courierDash.photoAlt")}
            className="w-32 h-32 object-cover rounded-full shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
