# 💰 PaisaTrack — Personal Finance Tracker

A clean, modern personal finance tracker built with React. Track your daily expenses, monitor budgets by category, and get real-time alerts before you overspend.

![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=flat&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 📸 Preview

> A dark-themed finance dashboard with radial budget rings, spending insights, and live budget impact previews.

---

## ✨ Features

- 📊 **Dashboard Overview** — Total budget, spent, and remaining at a glance
- 🍩 **Category Budget Rings** — Radial progress for Food, Transport, Shopping, Health, Entertainment & Utilities
- ➕ **Add Transactions** — Log expenses with description, amount, category, and date
- 👁️ **Live Budget Preview** — See the impact of a new expense before adding it
- 🔔 **Smart Alerts** — Auto warnings when a category hits 80%+ of budget
- ⚠️ **Overspend Alerts** — Red danger alert when budget is exceeded
- 📋 **Transaction History** — Full list with delete support, sorted by date
- 🇮🇳 **INR Formatting** — Amounts displayed in Indian Rupee format

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/paisa-track.git

# 2. Navigate into the project
cd paisa-track

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Project Setup (from scratch)

```bash
npm create vite@latest paisa-track -- --template react
cd paisa-track
npm install
```

Replace `src/App.jsx` with the contents of `finance-tracker.jsx`, then run:

```bash
npm run dev
```

---

## 📁 Project Structure

```
paisa-track/
├── public/
├── src/
│   ├── App.jsx          ← Main finance tracker component
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

---

## 🎨 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| CSS-in-JS | Styling (no external CSS library) |
| React Hooks | State management (`useState`, `useEffect`, `useRef`) |

No external UI libraries required. Zero extra dependencies beyond React.

---

## 📦 Budget Categories

| Category | Default Budget |
|----------|---------------|
| 🍜 Food | ₹8,000 |
| 🚌 Transport | ₹3,000 |
| 🛍️ Shopping | ₹5,000 |
| 💊 Health | ₹2,000 |
| 🎬 Entertainment | ₹2,000 |
| ⚡ Utilities | ₹4,000 |

> You can customize budgets by editing the `CATEGORIES` array in `App.jsx`.

---

## 🔧 Customization

### Change budgets
Edit the `CATEGORIES` array at the top of `App.jsx`:
```js
const CATEGORIES = [
  { name: "Food", icon: "🍜", color: "#FF6B6B", budget: 10000 }, // change budget here
  ...
];
```

### Change currency
Update the `formatINR` function:
```js
const formatINR = (v) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", ... }).format(v);
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m '✨ Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

Built with ❤️ using React + Vite. Designed for personal use to track daily spending in Indian Rupees.
