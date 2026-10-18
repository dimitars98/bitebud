import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { XLogoIcon } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";

// Labels are translation keys under "footer." (see src/i18n/locales).
const COLUMNS = [
  {
    title: "company",
    links: [
      { label: "about", to: "#" },
      { label: "careers", to: "#" },
      { label: "blog", to: "#" },
    ],
  },
  {
    title: "support",
    links: [
      { label: "help", to: "#" },
      { label: "contact", to: "#" },
      { label: "faq", to: "#" },
    ],
  },
  {
    title: "legal",
    links: [
      { label: "terms", to: "#" },
      { label: "privacy", to: "#" },
      { label: "cookies", to: "#" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: <FontAwesomeIcon icon={faFacebookF} />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <FontAwesomeIcon icon={faInstagram} />,
  },
  {
    label: "X",
    href: "https://x.com",
    icon: <XLogoIcon size={18} weight="bold" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: <FontAwesomeIcon icon={faLinkedinIn} />,
  },
];

const linkClass =
  "text-slate-300 hover:text-(--brand-primary) transition-colors focus-visible:outline-none focus-visible:text-(--brand-primary) focus-visible:underline";

function Footer() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goToDashboard = (role) => {
    if (!user) return navigate(`/${role}-login`);
    if (user.role === role) return navigate(`/${role}-dashboard`);
    toast(
      t("footer.wrongRole", {
        role: t(`roles.${user.role}`, { defaultValue: user.role }),
        login: t(`footer.${role}Login`),
      }),
    );
  };

  return (
    <footer className="relative w-full bg-(--restaurant-card-bg) text-slate-300">
      {/* platform edge: same stripe the hero stands on */}
      <div
        aria-hidden="true"
        className="h-2.5 bg-[repeating-linear-gradient(-45deg,var(--brand-primary)_0_14px,var(--restaurant-card-bg)_14px_28px)]"
      />

      <div className="max-w-[1500px] mx-auto px-5 md:px-6">
        {/* Top: statement + app badges */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 py-12 md:py-14 border-b border-slate-800">
          <div className="flex items-start gap-5">
            <Link
              to="/"
              aria-label={t("common.homeLabel")}
              className="shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand-primary)"
            >
              <Logo size={64} onDark />
            </Link>
            <div>
              <p className="m-0 text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {t("footer.statementLine1")}
                <br className="hidden sm:block" /> {t("footer.statementLine2")}
              </p>
              <Link
                to="/explore"
                className="group mt-4 inline-flex items-center gap-1.5 font-bold text-(--brand-primary) hover:text-(--brand) transition-colors"
              >
                {t("footer.browse")}
                <span
                  className="material-symbols-rounded text-xl! transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              aria-label={t("footer.googlePlay")}
              className="rounded-lg transition-transform hover:-translate-y-0.5"
            >
              <img src="/assets/GooglePlay.png" alt="" className="h-12" />
            </a>
            <a
              href="#"
              aria-label={t("footer.appStore")}
              className="rounded-lg transition-transform hover:-translate-y-0.5"
            >
              <img src="/assets/AppStore.svg" alt="" className="h-12" />
            </a>
          </div>
        </div>

        {/* Link columns */}
        <nav
          aria-label={t("footer.navLabel")}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 py-12"
        >
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-extrabold tracking-[0.16em] uppercase text-slate-500">
                {t(`footer.${col.title}`)}
              </h4>
              <ul className="space-y-3 text-[15px]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className={linkClass}>
                      {t(`footer.${l.label}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Join us: highlighted, it's the column that grows the business */}
          <div>
            <h4 className="mb-4 text-xs font-extrabold tracking-[0.16em] uppercase text-(--brand-primary)">
              {t("footer.joinUs")}
            </h4>
            <ul className="space-y-3 text-[15px]">
              <li>
                <Link to="/partner-form" className={linkClass}>
                  {t("footer.becomePartner")}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goToDashboard("partner")}
                  className={`${linkClass} cursor-pointer`}
                >
                  {t("footer.partnerLogin")}
                </button>
              </li>
              <li>
                <Link to="/courier-form" className={linkClass}>
                  {t("footer.becomeCourier")}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goToDashboard("courier")}
                  className={`${linkClass} cursor-pointer`}
                >
                  {t("footer.courierLogin")}
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-6 py-6 border-t border-slate-800 text-sm text-slate-500">
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-5 gap-y-1">
            <span>
              {t("footer.rights", { year: new Date().getFullYear() })}
            </span>
            <span>
              {t("footer.illustrationsBy")}{" "}
              <a
                href="https://storyset.com/food"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-(--brand-primary)"
              >
                Storyset
              </a>
              {" · "}
              {t("footer.photoBy")}{" "}
              <a
                href="https://www.freepik.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-(--brand-primary)"
              >
                Freepik
              </a>
            </span>
          </div>

          <ul className="flex gap-2">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-(--brand-bg-secondary,#1e293b) text-slate-300 text-[17px] hover:bg-(--brand-primary) hover:text-(--restaurant-card-bg) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-primary)"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
