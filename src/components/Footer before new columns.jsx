import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-amber-200 dark:bg-gray-900">
      <section className="max-w-[1500px] mx-auto min-h-[300px] px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Left Column: App Badges + Copyright */}
        <div className="flex flex-col justify-between gap-4 sm:gap-6">
          <Link to="/" className="text-2xl font-bold text-yellow-500">
            SkopjeEats
          </Link>
          <div className="flex lg:flex-col gap-4">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img
                src="../assets/GetItOnGooglePlay_Badge_Web_color_English.png"
                alt="Get it on Google Play"
                className="h-12"
              />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img
                src="../assets/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"
                alt="Download on the App Store"
                className="h-12"
              />
            </a>
          </div>

          {/* Copyright - shown inside column on desktop */}
          <div className="hidden sm:block text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Dimitar Stoilov. All rights
            reserved.
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4 text-gray-400 items-end text-2xl sm:col-span-1">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FontAwesomeIcon
              icon={faFacebookF}
              className="hover:text-yellow-500 transition"
            />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FontAwesomeIcon
              icon={faInstagram}
              className="hover:text-yellow-500 transition"
            />
          </a>
        </div>

        {/* Mobile-only Copyright at full width */}
        <div className="block sm:hidden col-span-full text-center text-sm text-gray-600 mt-6">
          &copy; {new Date().getFullYear()} Dimitar Stoilov. All rights
          reserved.
        </div>
      </section>
    </footer>
  );
}

export default Footer;
