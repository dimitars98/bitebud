import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";

import burgerImage from "../../public/assets/food-png-2953.png";
import pizzaImage from "../../public/assets/pizza-png-19321.png";
import sushiImage from "../../public/assets/sushi.png";
import {
  Headphones,
  Leaf,
  Smartphone,
  Truck,
  Twitter,
  Facebook,
  Instagram,
  CheckCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useRestaurantsQuery } from "../hooks/useRestaurantsQuery";
import RestaurantCard from "../components/RestaurantCard";
import TestimonialSlider from "../components/landing/TestimonialSlider";
import OnTheWay from "/assets/ontheway.svg";
import CategoriesCarousel from "../components/landing/CategoriesCarousel";
import DeparturesHero from "../components/landing/DeparturesHero";
import { useTranslation } from "react-i18next";

// Same order as landing.features in the locale files (name + description).
const FEATURE_ICONS = [Truck, Leaf, Smartphone, Headphones];

function LandingPage() {
  const { openAuth } = useOutletContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const features = t("landing.features", { returnObjects: true }).map(
    (feature, i) => ({ ...feature, icon: FEATURE_ICONS[i] }),
  );

  const {
    data: restaurants = [],
    isLoading: loading,
    isError,
    error,
  } = useRestaurantsQuery();

  const searchQuery = useSelector((state) => state.ui.searchQuery);
  const user = useSelector((state) => state.auth.user);

  const finalList = restaurants.filter((rest) =>
    rest?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // if (searchQuery) {
  //   return (
  //     <div className="bg-gradient-to-b from-(--bg-main) to-(--bg-primary) dark:from-(--brand-bg-primary) dark:to-(--brand-bg-secondary) text-(--text-secondary) dark:text-(--text-secondary) min-h-screen">
  //       {" "}
  //       {finalList.length > 0 ? (
  //         <section className="pt-40 pb-20 md:pt-20">
  //           {" "}
  //           <div className="max-w-7xl mx-auto px-6 space-y-12">
  //             {" "}
  //             <h2 className="text-4xl font-bold text-center">
  //               {" "}
  //               Search Results for "{searchQuery}"{" "}
  //             </h2>{" "}
  //             <div className="grid md:grid-cols-3 gap-8 mt-8">
  //               {" "}
  //               {finalList.map((rest) => (
  //                 <RestaurantCard key={rest.id} {...rest} />
  //               ))}{" "}
  //             </div>{" "}
  //           </div>{" "}
  //         </section>
  //       ) : (
  //         <section className="py-20">
  //           {" "}
  //           <div className="max-w-7xl mx-auto px-6 text-center">
  //             {" "}
  //             <h2 className="text-4xl font-bold">No Restaurants Found</h2>{" "}
  //             <p className="text-gray-500 dark:text-gray-300 mt-4">
  //               {" "}
  //               Try a different search or clear the search input to browse all
  //               restaurants.{" "}
  //             </p>{" "}
  //           </div>{" "}
  //         </section>
  //       )}{" "}
  //     </div>
  //   );
  // }
  return (
    <div className="bg-gradient-to-b from-(--bg-main) to-(--bg-primary) dark:from-(--brand-bg-primary) dark:to-(--brand-bg-secondary) text-(--text-secondary) dark:text-(--text-secondary)">
      <DeparturesHero restaurants={restaurants} loading={loading} />

      {/* Food Categories */}
      {/* <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-4xl font-bold">Explore Popular Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {[
              { img: burgerImage, title: "Burgers" },
              { img: pizzaImage, title: "Pizza" },
              { img: sushiImage, title: "Sushi" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08, rotate: 1 }}
                className="bg-amber-300/40 dark:bg-slate-700/70 rounded-2xl p-8 backdrop-blur-md hover:shadow-lg transition"
              >
                <motion.img
                  src={item.img}
                  alt={item.title}
                  className="w-36 h-36 mx-auto mb-6"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
                <h3 className="text-2xl font-semibold">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
      <CategoriesCarousel />
      {/* Features Section */}
      <section className="relative bg-(--bg-secondary) dark:bg-(--brand-bg-secondary) py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 text-center">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-(--bg-main) dark:bg-(--brand-bg-secondary-hover) rounded-xl"
            >
              <feature.icon className="w-12 h-12 mx-auto text-(--brand-primary) mb-4" />
              <h4 className="text-xl font-bold mb-2">{feature.name}</h4>
              <p className="text-gray-500 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Z-Pattern Showcase Section */}
      <section className="py-24 bg-(--bg-main) dark:bg-(--brand-bg-primary)">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {/* Block 1: Delivery Experience */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.img
              src="/assets/deliverybike.svg"
              alt={t("landing.showcase.delivery.alt")}
              className="w-full md:w-1/2 rounded-xl shadow-2xl"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            <motion.div
              className="md:w-1/2 space-y-6 text-center md:text-left"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                {t("landing.showcase.delivery.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {t("landing.showcase.delivery.body")}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start md:items-center gap-3 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="flex-none md:mt-0 mt-1 w-6 h-6 text-green-500" />
                  <span className="text-start">
                    {t("landing.showcase.delivery.points.0")}
                  </span>
                </li>
                <li className="flex items-start md:items-center gap-3 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="flex-none md:mt-0 mt-1 w-6 h-6 text-green-500" />
                  <span className="text-start">
                    {t("landing.showcase.delivery.points.1")}
                  </span>
                </li>
                <li className="flex items-start md:items-center gap-3 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="flex-none md:mt-0 mt-1 mt-1 w-6 h-6 text-green-500" />
                  <span className="text-start">
                    {t("landing.showcase.delivery.points.2")}
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Block 2: Mobile App Ordering */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <motion.img
              src="/assets/phoneorder.svg"
              alt={t("landing.showcase.ordering.alt")}
              className="w-full md:w-1/2 rounded-xl shadow-2xl"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            <motion.div
              className="md:w-1/2 space-y-6 text-center md:text-left"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                {t("landing.showcase.ordering.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {t("landing.showcase.ordering.body")}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start md:items-center gap-3 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="flex-none md:mt-0 mt-1 w-6 h-6 text-green-500" />
                  <span className="text-start">
                    {t("landing.showcase.ordering.points.0")}
                  </span>
                </li>
                <li className="flex items-start md:items-center gap-3 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="flex-none md:mt-0 mt-1 w-6 h-6 text-green-500" />
                  <span className="text-start">
                    {t("landing.showcase.ordering.points.1")}
                  </span>
                </li>
                <li className="flex items-start md:items-center gap-3 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="flex-none md:mt-0 mt-1 w-6 h-6 text-green-500" />
                  <span className="text-start">
                    {t("landing.showcase.ordering.points.2")}
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Block 3: Customer Satisfaction */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.img
              src="/assets/orderdelivered.svg"
              alt={t("landing.showcase.loved.alt")}
              className="w-full md:w-1/2 rounded-xl shadow-2xl"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            <motion.div
              className="md:w-1/2 space-y-6 text-center md:text-left"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                {t("landing.showcase.loved.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {t("landing.showcase.loved.body")}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start md:items-center gap-3 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="flex-none md:mt-0 mt-1 w-6 h-6 text-green-500" />
                  <span className="text-start">
                    {t("landing.showcase.loved.points.0")}
                  </span>
                </li>
                <li className="flex items-start md:items-center gap-3 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="flex-none md:mt-0 mt-1 w-6 h-6 text-green-500" />
                  <span className="text-start">
                    {t("landing.showcase.loved.points.1")}
                  </span>
                </li>
                <li className="flex items-start md:items-center gap-3 text-gray-600 dark:text-gray-300">
                  <CheckCircle className="flex-none md:mt-0 mt-1 w-6 h-6 text-green-500" />
                  <span className="text-start">
                    {t("landing.showcase.loved.points.2")}
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      <section
        className="relative py-24 text-white"
        style={{
          backgroundImage: "url('/assets/stacked-steps-haikei.svg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="relative max-w-7xl mx-auto px-6 text-center space-y-12">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-extrabold">
            {t("landing.join.title")}
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            {t("landing.join.body")}
          </p>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Courier */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center space-y-6 hover:scale-105 transform transition">
              <img
                src="/assets/courier.jpg"
                alt={t("landing.join.courier.alt")}
                className="w-full h-auto object-cover rounded-2xl"
                loading="lazy"
              />

              <h3 className="text-2xl font-bold">
                {t("landing.join.courier.title")}
              </h3>
              <p className="text-white/90 text-center">
                {t("landing.join.courier.body")}
              </p>
              <Link
                to="courier-form"
                className="bg-white text-orange-500 font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
              >
                {t("landing.join.courier.cta")}
              </Link>
            </div>

            {/* Partner */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center space-y-6 hover:scale-105 transform transition">
              <img
                src="/assets/handshake.jpg"
                alt={t("landing.join.partner.alt")}
                className="w-full h-auto object-cover rounded-2xl"
                loading="lazy"
              />
              <h3 className="text-2xl font-bold">
                {t("landing.join.partner.title")}
              </h3>
              <p className="text-white/90 text-center">
                {t("landing.join.partner.body")}
              </p>
              <Link
                to="partner-form"
                className="bg-white text-orange-500 font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
              >
                {t("landing.join.partner.cta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <TestimonialSlider />
      </section>
      {/* Call-to-action Banner */}
      <section className="bg-gradient-to-r from-yellow-500 to-red-500 py-20 text-center text-white">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl px-2 font-extrabold mb-6"
        >
          {t("landing.cta.title")}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Link
            to="explore"
            className="bg-(--bg-main) dark:bg-white text-(--brand-primary) font-semibold py-4 px-10 rounded-xl shadow-lg hover:bg-(--btn-bg-hover) transition transform hover:scale-105"
          >
            {t("landing.cta.button")}
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

export default LandingPage;
