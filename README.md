# 🍽️ iCook — The Potluck Society
> **A Private Table · August 12, 2026**

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Twilio WhatsApp](https://img.shields.io/badge/Twilio-WhatsApp_API-red?logo=twilio&logoColor=white)](https://www.twilio.com/)
[![Netlify](https://img.shields.io/badge/Deployment-Netlify_Functions-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com/)

An extraordinarily elegant, fine-dining-inspired web experience created for **iCook: The Potluck Society** (taking place on **August 12, 2026**). Designed with Michelin-level culinary sophistication, high-fashion typography (`Cormorant Garamond`, `Bodoni Moda`, `Inter`), dark obsidian and aged parchment textures, dynamic editorial menu layouts, and a server-side WhatsApp reservation notification system.

---

## 📸 Visual Design Philosophy

- **Private Dining Club Aesthetic**: Curated color palette alternating between Obsidian (`#11100E`), Dark Espresso (`#211A16`), Deep Oxblood Velvet (`#401D20`), Aged Ivory Parchment (`#F3EBDD`), and Antique Brass Hairlines (`#AA8654`).
- **High-Fashion Editorial Typography**: Google Fonts `Cormorant Garamond` and `Bodoni Moda` for serif display headlines paired with `Inter` and `Manrope` for supporting text.
- **Illuminated iCook Crest**: The `iCook.png` brand crest features an illuminated golden contrast boost, framed in dual brass hairline borders.
- **Fluid Viewport Responsiveness**: The Hero section automatically scales across desktop, 13-inch laptops, tablets, and phones to ensure 100% of header elements and the `EXPLORE EXPERIENCE` indicator fit above the fold on Screen 1.

---

## 📑 Source of Truth Menu Data Matrix

All **14 team contributors** from the spreadsheet are included:

| Contributor | Course | Dish Name | Ingredients & Dietary Notes | Layout Architecture |
| :--- | :--- | :--- | :--- | :--- |
| **Romit** | Main | Chicken Butter Masala & Rice | Nuts, gluten, chicken *(Contains Nuts, Contains Gluten)* | **Type A**: 60/40 Split Card |
| **Josh S.** | Main | Hainan Chicken + Sauces / Chicken Rice | Chicken, garlic, ginger, green onion, rice *(Tentative Galbi Jjim option)* | **Type A**: 60/40 Split Card |
| **AK** | Main | Garlic Chilli Naan | Flour, garlic, chilli powder *(Vegetarian, Contains Gluten)* | **Type A**: 60/40 Split Card |
| **Joo Won** | Main | Pork Belly Kimchi Fried Rice | Pork belly, onion, garlic, aged kimchi *(Pork, Sesame)* | **Type A**: 60/40 Split Card |
| **Rus** | Main | Sumatran Beef Rendang | Beef tenderloin, coconut milk, lemongrass, native spices *(Gluten Free)* | **Type A**: 60/40 Split Card |
| **Steven** | Main | Selection Forthcoming | Details courtesy of Steven's kitchen *(Tentative)* | **Type B**: Tasting Menu Card |
| **Jen** | Side | Artisanal Chips & Guacamole | Hass avocados, olive oil, garlic, cilantro, lime, Siete GF chips *(GF, Vegan)* | **Type A**: 60/40 Split Card |
| **Celene** | Side | Pão de Queijo or Spanish Tortilla | Cheese, tapioca flour, milk, eggs *(Certified Gluten-Free)* | **Type A**: 60/40 Split Card |
| **Cindy** | Side | Stir-Fried Chinese Cabbage | Napa cabbage, ginger, garlic, chili flakes, sesame oil *(Vegetarian, GF)* | **Type A**: 60/40 Split Card |
| **Jake** | Dessert | Classic Arroz con Leche | Whole milk, arborio rice, golden raisins, Ceylon cinnamon *(GF, Vegetarian)* | **Type A**: 60/40 Split Card |
| **Wendy** | Dessert | Porto's Cheese Roll | Ingredient details forthcoming *(Contains Dairy, Gluten)* | **Type A**: 60/40 Split Card |
| **Brian** | Drinks | Craft Lemonade (Strawberry or Blueberry) | Fresh eureka lemons, pure cane sugar, soda water, fruit reduction *(GF, Vegan)* | **Type A**: 60/40 Split Card |
| **Kelsey** | TBD | Chef's Selection | Selection forthcoming *(Tentative)* | **Type B**: Tasting Menu Card |
| **Kaelan** | TBD | Chef's Selection | Selection forthcoming *(Tentative)* | **Type B**: Tasting Menu Card |

---

## 📱 Serverless WhatsApp Reservation System

Submitting a reservation calls `POST /api/reservations`, triggering a serverless backend function that sends a formatted WhatsApp message to `+1 346 566 8004`.

### Notification Format:
```text
🍽️ NEW POTLUCK RESERVATION

Guest: {name}
Party: {partySize}
Dietary note: {dietaryNote || "None"}
Message: {message || "None"}

Event: The Potluck Society
Date: August 12, 2026

Reservation received:
{timestamp formatted in America/Los_Angeles}
```

### Security & Anti-Bot Protection:
- **Zod Schema Validation**: Client and server-side validation enforcing character limits (`name`: 2–80 chars, `dietaryNote`: max 300, `message`: max 500).
- **Honeypot Anti-Bot Field**: Hidden `website_url` field silently rejects automated bot submissions.
- **Zero Client Credential Leakage**: Twilio API keys are isolated server-side inside environment variables.

---

## 🛠️ Installation & Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/ROMIT-2002/iCook.git
cd iCook
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=3001
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
RESERVATION_WHATSAPP_TO=whatsapp:+13465668004
# (Optional Production Content Template SID)
# TWILIO_CONTENT_SID=HXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Run Development Servers
Start Vite frontend + Express backend concurrently:
```bash
npm run dev:all
```
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

### 5. Build for Production
```bash
npm run build
```

---

## 🚀 Netlify Deployment Configuration

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Functions Directory**: `netlify/functions`

### Environment Variables on Netlify:
Configure under **Site Settings > Environment Variables**:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `RESERVATION_WHATSAPP_TO`
- `TWILIO_CONTENT_SID` *(Optional)*

---

## 📜 License & Copyright

© 2026 **iCook**. Prepared by the team. Served with unreasonable standards.
