# CoachEnControl

**The retention system that salvages bad weeks before they become dropouts.**

CoachEnControl is a purpose-built platform for online fitness coaches to solve the #1 reason clients quit: **not the plan failing, but shame after setbacks.** When clients eat off-plan or miss a workout, our AI intervenes with salvage plans instead of guilt—turning mistakes into course corrections before ghosting happens.

---

## 🎯 The Problem We Solve

Your clients don't fail because your programming is bad. They fail because:
- They eat out → feel shame → avoid checking in → ghost
- They miss a workout → spiral → "start Monday" → quit
- Life happens → week derails → no plan B → dropout

**Result:** 40-60% of clients quit within 3 months, costing coaches $200-400/month per churned client.

---

## 💡 Our Solution

CoachEnControl acts as a **digital accountability coach**, not just a tracker:

1. **Off-Plan Meal → Instant Salvage Plan** (not shame)
   - Client logs pizza night → AI calculates exact weekly adjustments
   - Shows "Week still 85% on track" instead of guilt

2. **Missed Workout → Context Understanding**
   - "You hit 3/5 workouts during a crazy week. That's consistency."
   - No red "failed" indicators

3. **Coach Approval Flow**
   - AI drafts responses → Coach approves/edits → Sends
   - Customizable tone (Firm/Supportive/Casual)

4. **Risk Score Dashboard**
   - 🟢 Engaged | 🟡 Slipping | 🔴 At Risk
   - One-click reach-out with AI-suggested messages

---

## 🎨 Design Philosophy

Built for **light and dark mode** with premium aesthetics:

- **Light Mode:** Clean emerald accents (`#059669`) on white
- **Dark Mode:** Neon lime highlights (`#B2FF59`) on matte black (`#101010`)
- **Typography:** Bold, tight tracking with Inter font
- **Animations:** Framer Motion for smooth, professional transitions

See our complete [Design System](./docs/style_guide.md).

---

## 🌍 Internationalization (i18n)

Full bilingual support:
- **English** and **Español (MX)**
- Language selector in navbar
- Persistent user preference
- All landing page components localized

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS 3.4, Framer Motion |
| **Backend** | Convex (real-time database) |
| **Auth** | Convex Auth |
| **UI Components** | Radix UI primitives |
| **Integration** | WhatsApp Business API (planned) |
| **Deployment** | Vercel (recommended) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Min11Benja/gym-training-diet-tracker.git
   cd gym-training-diet-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Convex deployment URL and other required keys.

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── actions.ts         # Server actions (form submission, email)
│   ├── auth/              # Authentication pages
│   ├── coach/             # Coach dashboard
│   ├── dashboard/         # Client dashboard
│   └── page.tsx           # Landing page
├── components/
│   ├── landing/           # Landing page sections
│   ├── ui/                # Reusable UI components (buttons, inputs)
│   ├── language-provider.tsx
│   └── theme-provider.tsx
├── convex/                # Backend (Convex functions)
├── docs/                  # Product documentation
│   ├── buyer_persona.md
│   ├── feature_audit.md
│   └── style_guide.md
├── lib/
│   ├── translations.ts    # i18n content dictionary
│   └── utils.ts           # Helper functions
└── public/                # Static assets
```

---

## 📚 Documentation

- **[Buyer Persona](./docs/buyer_persona.md)**: Target audience (online coaches, 15-150 clients, $50-200/month pricing)
- **[Feature Audit](./docs/feature_audit.md)**: Strategic feature roadmap based on coach interviews
- **[Style Guide](./docs/style_guide.md)**: Design system and component standards

---

## 🎯 Core AI Modules

1. **Module A: Nutrition Setback Mitigation Engine**
   - Normalizes mistakes, quantifies impact, proposes corrective actions
   - Coach-approved tone customization

2. **Module B: Workout Effort Interpretation**
   - Context-aware feedback ("hard" during travel = WIN)
   - Focuses on consistency, not perfection

3. **Module C: Progress Reinforcement Engine**
   - Shows trends over time, not daily pass/fail
   - Highlights "challenges overcome this week"

---

## 🗓️ Roadmap

### ✅ Completed
- Landing page with retention-focused positioning
- Bilingual support (EN/ES-MX)
- Light/dark mode theming
- Coach and client dashboards (MVP)
- Authentication flow
- Basic workout and nutrition tracking

### 🚧 In Progress
- AI setback mitigation engine
- WhatsApp integration
- Coach approval dashboard

### 📋 Planned
- Risk score client tracking
- Retention metrics dashboard
- Voice note transcription
- Team features for assistant coaches

---

## 💰 Pricing Strategy

**Starter:** $500 MXN/month (~$29 USD) - Up to 20 clients  
**Pro:** $1500 MXN/month (~$79 USD) - Up to 50 clients

**Value Proposition:** If this saves you **1 client per month**, it pays for itself in 2-4 months.

---

## 🤝 Contributing

This is currently a private MVP for beta testing. If you're an online fitness coach interested in joining our beta program, reach out via [GitHub Issues](https://github.com/Min11Benja/gym-training-diet-tracker/issues).

---

## 📄 License

Proprietary - All rights reserved.

---

## 🙏 Acknowledgments

- Built with insights from 15+ coach interviews
- Positioning inspired by retention psychology research
- Design influenced by Vercel, Linear, and modern SaaS aesthetics

---

**Last Updated:** January 2026  
**Status:** Beta Development  
**Target Launch:** Q1 2026
