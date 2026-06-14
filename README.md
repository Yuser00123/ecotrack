# 🌿 Eco-Track: Carbon Footprint Awareness Platform

Eco-Track is a production-ready Carbon Footprint Awareness Platform designed to help users **Understand**, **Track**, and **Reduce** their environmental impact. Built with Next.js 15, TypeScript, and the Gemini API, it offers a premium, gamified experience for sustainability.

![Eco-Track Preview](public/preview.png) *(Note: Add a real preview image to public/ folder)*

---

## ✨ Features

### 1. 🧬 Understand: Carbon Footprint Calculator
- **Multi-step Wizard:** Interactive sliders and visual selectors for transport, energy, diet, and lifestyle.
- **Live Carbon Meter:** Real-time feedback as you input data, showing your estimated annual tons of CO₂.
- **O(n) Calculation Engine:** Precise emissions logic based on global sustainability data.

### 2. 📊 Track: Personal Dashboard
- **Glassmorphism Analytics:** Premium UI using frosted glass panels and smooth animations.
- **Dynamic Charts:** Carbon breakdown (Donut), National Comparison (Bar), and Reduction Path (Line) using Recharts.
- **Impact Summary:** Track your total CO₂ reduced, current streak, eco-rank (XP), and earned badges.

### 3. 🤖 Reduce: AI Sustainability Coach
- **Gemini 1.5 Pro Integration:** Personalized insights and motivational messages based on your specific footprint.
- **Weekly Challenges:** AI-generated tasks tailored to your weakest emission categories.
- **Action Center:** A curated list of eco-tasks (LED bulbs, carpooling, etc.) to earn XP and level up.

### 4. 🌙 Eco-Glassmorphism Design System
- **Premium Aesthetics:** Deep Forest Green and Soft Sage palette with glowing green accents.
- **Responsive & Dark Mode:** Fully compliant dark mode and mobile-first responsive layout.
- **Framer Motion:** Smooth page transitions, hover effects, and animated counters.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Framer Motion (Animations)
- **State Management:** Zustand (with Persistence)
- **Charts:** Recharts
- **AI:** Google Gemini API (@google/generative-ai)
- **Validation:** Zod, DOMPurify (Security)
- **Testing:** Jest, React Testing Library

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd eco-track
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Performance
- **API Security:** Gemini API calls are routed through server-side Next.js API routes.
- **Data Validation:** Zod schemas validate all incoming data.
- **Sanitization:** DOMPurify prevents XSS from AI-generated content.
- **Performance:** Optimized for a Lighthouse score > 90 with code splitting and lazy loading.

---

## 🧪 Testing
Run the test suite to verify calculation logic:
```bash
npm test
```

---

## 🌍 Problem Statement Alignment
This project directly addresses the challenge of helping individuals understand their impact through **personalized insights** and **simple actions**, providing a clear path from awareness to reduction.

---

Built with ❤️ for the Planet by Gemini CLI.
