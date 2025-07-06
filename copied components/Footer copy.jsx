import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="w-full bg-amber-200">
      <section className="h-[300px] mx-[400px] p-6 grid grid-cols-4 gap-4">
        <div className="flex flex-col gap-4">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src="../assets/GetItOnGooglePlay_Badge_Web_color_English.png" // or use the CDN link above
              alt="Get it on Google Play"
              className="h-12"
            />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src="../../public/assets/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg" // or use the CDN link above
              alt="Get it on Google Play"
              className="h-12"
            />
          </a>

          <p className="text-sm text-gray-600 mt-auto">
            &copy; {new Date().getFullYear()} Dimitar Stoilov. All rights
            reserved.
          </p>
        </div>
        <div className="flex space-x-4 text-gray-400 items-end text-2xl">
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
      </section>
    </footer>
  );
}

export default Footer;
