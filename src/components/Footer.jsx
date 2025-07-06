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
    <footer className="w-full bg-amber-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <section className="max-w-[1500px] mx-auto min-h-[300px] px-4 py-10 flex flex-wrap justify-between gap-10">
        {/* App Branding & Badges */}
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
          <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Dimitar Stoilov. All rights
            reserved.
          </div>
        </div>

        {/* Column: Company */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">
            Company
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="#" className="hover:text-yellow-500">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-yellow-500">
                Careers
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-yellow-500">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Column: Support */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">
            Support
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="#" className="hover:text-yellow-500">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-yellow-500">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-yellow-500">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Column: Legal */}
        <div>
          <h4 className="font-semibold mb-3 text-gray-800 dark:text-white">
            Legal
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="#" className="hover:text-yellow-500">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-yellow-500">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-yellow-500">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Social Icons Row */}
      <div className="flex justify-center gap-6 text-gray-500 dark:text-gray-400 text-xl pb-6">
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
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <FontAwesomeIcon
            icon={faTwitter}
            className="hover:text-yellow-500 transition"
          />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
          <FontAwesomeIcon
            icon={faLinkedin}
            className="hover:text-yellow-500 transition"
          />
        </a>
      </div>

      {/* Mobile-only copyright */}
      <div className="block sm:hidden text-center text-sm text-gray-600 dark:text-gray-400 pb-4">
        &copy; {new Date().getFullYear()} Dimitar Stoilov. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
