🍔 Food Delivery App (v1)
A modern, feature-rich food delivery platform built with React, TailwindCSS, and Firebase. 
This app provides a complete ecosystem for customers, partners, and couriers, including dashboards, authentication, payments, and real-time order tracking.

🚀 Features

Authentication:
- Google, Facebook, and Email/Password login
- Role-based access:
  - Customer: Profile with delivered/ongoing orders, addresses, logout
  - Partner: Dashboard to manage restaurants and menus
  - Courier: Dashboard to accept orders, mark completion, view earnings

Navigation & UI:
- Logo, search bar, dark mode toggle, currency selector
- Shopping bag and avatar menu for logged-in customers
- Categories, restaurant cards, menu pages, cart drawer
- Landing page with illustrations, photos, CTAs

Payments:
- Stripe integration for secure transactions
- Server-side payment processing via Firebase Functions
- Test mode enabled by default

Order Tracking:
- Animated step tracker
- Real-time courier map movement
- Order info card

Partner & Courier Tools:
- Partner: Add/manage restaurants and menu items in Firestore
- Courier: View, accept, and complete orders; track earnings

📦 Requirements

- Node.js v16+
- Firebase project (Firestore, Authentication, Hosting, Functions)
- Stripe account for payments
- Modern browser (Chrome, Firefox, Safari, Edge)

THEME CUSTOMIZATION (COLORS & APPEARANCE)

This template uses CSS variables to control all colors and visual styles.
To customize the theme, you only need to edit a single CSS file.

FILE LOCATION
Open the theme file located at:

src/styles/theme.css

All colors for both light mode and dark mode are defined in this file.

LIGHT THEME

The light theme is defined inside the :root selector.

Example:

:root {
--bg-main: #f8f9fa;
--brand: #f59e0b;
--text-primary: #111827;
}

To customize the light theme, you can change:

-Background colors (variables starting with --bg-)

-Brand and accent colors (--brand, --brand-primary, --brand-hover, --brand-soft)

-Text colors (--text-primary, --text-secondary, --text-muted)

-Border and UI colors (--border-primary, --badge-bg, --icon-muted)

If you want to apply a new brand color, in most cases you only need to update:
--brand
--brand-primary
--brand-hover
--brand-soft

DARK THEME

The dark theme is defined inside the .dark class.

Example:

.dark {
--bg-main: #0a0a0a;
--brand: #f59e0b;
--text-primary: #f9fafb;
}

To customize dark mode:

-Adjust background and card colors (--bg-main, --brand-bg-primary, --brand-bg-secondary)

-Update brand colors (same variables as light mode)

-Modify text and border colors to maintain good contrast

IMPORTANT
Do not rename or remove the .dark class.
It is required for the theme toggle to work correctly.

NOTES

-No JavaScript changes are required to customize colors.

-All components automatically inherit the updated variables.

-Changes are applied globally across the entire application.

⚙️ Installation & Setup

1️⃣ Clone & Install Dependencies
- Download & extract the CodeCanyon package
- Open terminal in the project root:
  npm install

2️⃣ Firebase Setup

The app is already configured to work with Firebase. You do not need to edit any code in firebase.js (or firebaseConfig.js). All values are loaded from .env.

To set up your Firebase project:

1. Go to https://console.firebase.google.com/ and click "Add project"
2. Name your project (e.g., FoodDeliveryApp)
3. Enable Google Analytics (optional) and create the project
4. In Project Settings → General → Your apps → Add Web App
   - Register app (e.g., food-delivery-web)
   - Copy Firebase SDK config (API key, Auth domain, project ID, storage bucket, messaging sender ID, app ID)
   - The firebase config file is prewritten in src/firebase/firebase.js, no need to copy the one that firebase will give you during this process as you will only need the keys/values to store them in .env
5. Enable Authentication:
   - Authentication → Sign-in method
   - Enable Google, Facebook, and Email/Password
6. Enable Firestore:
   - Firestore Database → Create database
   - Choose production or test mode
   - Select location
7. Enable Storage (for images)
8. Enable Functions (for Stripe payments and distance calculations)

Paste all Firebase values into your .env file:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

Do not hardcode Firebase keys in source code. Keep them in .env.

3️⃣ Stripe Setup

Frontend (Publishable Key)
- Create a Stripe account: https://dashboard.stripe.com/register
- Copy the Publishable Key (pk_test_...)
- Add it to .env:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXX

Backend (Secret Key)
--Open a new terminal and run the following commands:
cd functions
npm install
firebase functions:secrets:set STRIPE_SECRET_KEY="sk_test_XXXXXXXXXXXX"
firebase deploy --only functions
-Replace this part "sk_test_XXXXXXXXXXXX" with your stripe secret key
- Do NOT add the secret key to .env or frontend

Test Mode
- Payments run in Stripe test mode by default
- Use the Stripe test card:
  Card Number: 4242 4242 4242 4242
  Expiry Date: Any future date
  CVC: Any 3 digits
  ZIP: Any
- No real money is charged

Switching to Live Mode
- Replace publishable key in .env with live key
- Update secret key in Functions:
firebase functions:secrets:set STRIPE_SECRET_KEY="sk_live_XXXXXXXXXXXX"
firebase deploy --only functions

4️⃣ ORS API Key (Optional for distance calculations)
- Get free API key from https://openrouteservice.org/
- Add as Firebase Function secret:
firebase functions:secrets:set ORS_API_KEY="your_ors_api_key"
firebase deploy --only functions

5️⃣ Frontend .env File

Create .env in project root:
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXX

Do NOT put the Stripe secret here. It stays in Firebase Functions.

6️ Seeding Restaurants into Firestore

This project includes a script (`uploadRestaurants.js`) to populate your Firestore database with sample restaurants and menus.  

#### How it works
- The script contains a predefined array of restaurants with their menu items, locations, and other details.
- When you run the script, it automatically adds all restaurants to your Firestore `restaurants` collection.
- Each menu item gets a slug automatically for URL-friendly referencing.

#### When to use
- Run this script **once** when setting up the app for the first time by writing 'node uploadRestaurants' in the terminal (without the quotes)
- You can also re-run it whenever you want to add new restaurants or reset sample data.

❗Important notes
- The script is only for **seeding purposes**. In your app, all restaurant data should be fetched **from Firestore** — do **not** import the array directly into your main code.
- Make sure your `.env` file has all the correct Firebase config values before running the script.
- If you want to add new restaurants, you can either:
  1. Add them to the array in the script and run it again, or  
  2. Add them directly in the Firebase Console under the `restaurants` collection.



7️⃣ Run Locally
npm run dev


8️⃣ Build for Production
npm run build
- Deploy to Firebase Hosting or any static host

👥 Usage

Customer:
- Browse restaurants via search/categories
- Add items to cart, checkout with Stripe
- Track orders with step tracker and courier map
- Manage profile: delivered/ongoing orders, addresses, logout

Courier:
- View available orders
- Accept/complete orders
- Track earnings (daily, monthly, total)

Partner:
- Add/manage restaurants and menu items
- Real-time Firestore sync
- Restaurants and menus appear instantly

🔧 Configuration

- Firebase: Authentication, Firestore, Storage, Hosting, Functions
- Stripe: Publishable key in .env, secret key in Functions
- ORS API: Secret key in Functions (optional)
- Branding: Update logos, colors, landing page illustrations in /src/assets

🛠 Support

- Contact via CodeCanyon support
- Future updates will include bug fixes, new features, and performance improvements

📜 License & Credits

- Licensed under CodeCanyon standard terms
- Built with React, TailwindCSS, Firebase, Stripe
- Illustrations and photos credited to creators

✨ Notes for Buyers

- Firebase Functions are preconfigured. Deploy them to enable Stripe payments and distance calculations.
- Test mode enabled by default. Use the provided test card numbers to simulate payments.
- Ensure all .env values and Firebase project settings are correctly configured.
- No source code changes are required; all configuration is done via .env and Firebase project setup.
