# CoachEnControl Design System

> **Note:** This design system is built on top of Tailwind CSS.

## 1. Colors

### Brand Accents
| Mode | Color Name | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Light** | **Emerald Green** | `#059669` | `text-emerald-600` / `bg-emerald-600` | Primary Buttons, Links, Highlights |
| **Dark** | **Neon Lime** | `#B2FF59` | `text-[#B2FF59]` / `bg-[#B2FF59]` | Primary Buttons, Highlights, Accents |

### Backgrounds
| Mode | Surface | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Light** | **Page Bg** | `#FFFFFF` | `bg-white` | Main Page Background |
| **Light** | **Card Bg** | `#FFFFFF` | `bg-white` | Cards (Combined with border/shadow) |
| **Dark** | **Page Bg** | `#101010` | `bg-[#101010]` | Main Page Background (Deep Matte Black) |
| **Dark** | **Card Bg** | `#151515` | `bg-[#151515]` | Feature Cards, Inputs, Modals |

### Text Colors
| Mode | Type | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Light** | **Primary** | `#18181b` | `text-zinc-900` | Headings, Strong Text |
| **Light** | **Secondary** | `#52525b` | `text-zinc-600` | Body Text, descriptions |
| **Dark** | **Primary** | `#FFFFFF` | `text-white` | Headings, Strong Text |
| **Dark** | **Secondary** | `#9ca3af` | `text-gray-400` | Body Text, descriptions |

---

## 2. Typography

**Font Family:** `Inter` (`font-sans`)

### Headings
-   **Style:** Bold, Uppercase (optional for Hero), Tight Tracking.
-   **Class:** `font-bold tracking-tight text-zinc-900 dark:text-white`
-   **Sizes:**
    -   H1 (Hero): `text-5xl md:text-8xl leading-[0.9]`
    -   H2 (Section): `text-3xl md:text-5xl`
    -   H3 (Card): `text-xl md:text-2xl`

### Body
-   **Style:** Clean, Readable.
-   **Class:** `text-base text-zinc-600 dark:text-gray-400 leading-relaxed`

---

## 3. Components

### Buttons (Primary)
-   **Light:** `bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg`
-   **Dark:** `bg-[#B2FF59] text-black hover:bg-[#9ee640] shadow-lg`
-   **Common:** `rounded-xl font-bold transition-all duration-300`

### Cards ("Premium" Look)
-   **Light Mode:**
    -   Background: `bg-white`
    -   Border: `border border-zinc-200`
    -   Shadow: `shadow-sm hover:shadow-md`
-   **Dark Mode:**
    -   Background: `bg-[#151515]` (or `bg-white/5` for glass)
    -   Border: `border border-white/10`
    -   Shadow: `shadow-none` (Optional hover glow)

### Inputs (Forms)
-   **Classes:** `w-full px-4 py-3 bg-white dark:bg-[#151515] border border-zinc-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#B2FF59] outline-none transition-all`

---

## 4. Spacing
-   **Section Padding:** `py-24`
-   **Container:** `container px-6 mx-auto`
-   **Gap:** Standard grid gaps `gap-8` or `gap-12`.
