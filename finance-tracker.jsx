import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { name: "Food", icon: "🍜", color: "#FF6B6B", budget: 8000 },
  { name: "Transport", icon: "🚌", color: "#FFD93D", budget: 3000 },
  { name: "Shopping", icon: "🛍️", color: "#6BCB77", budget: 5000 },
  { name: "Health", icon: "💊", color: "#4D96FF", budget: 2000 },
  { name: "Entertainment", icon: "🎬", color: "#C77DFF", budget: 2000 },
  { name: "Utilities", icon: "⚡", color: "#FF9A3C", budget: 4000 },
];

const INITIAL_TRANSACTIONS = [
  { id: 1, desc: "Zomato Order", amount: 450, category: "Food", date: "2026-04-16" },
  { id: 2, desc: "Uber Ride", amount: 220, category: "Transport", date: "2026-04-16" },
  { id: 3, desc: "Amazon Purchase", amount: 1800, category: "Shopping", date: "2026-04-15" },
  { id: 4, desc: "Pharmacy", amount: 340, category: "Health", date: "2026-04-15" },
  { id: 5, desc: "Netflix", amount: 649, category: "Entertainment", date: "2026-04-14" },
  { id: 6, desc: "Electricity Bill", amount: 1200, category: "Utilities", date: "2026-04-13" },
  { id: 7, desc: "Grocery Store", amount: 1650, category: "Food", date: "2026-04-12" },
  { id: 8, desc: "Bus Pass", amount: 500, category: "Transport", date: "2026-04-11" },
  { id: 9, desc: "Myntra", amount: 2200, category: "Shopping", date: "2026-04-10" },
  { id: 10, desc: "Gym Membership", amount: 1500, category: "Health", date: "2026-04-09" },
];

const formatINR = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

function RadialProgress({ pct, color, size = 56 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(pct / 100, 1) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e2235" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={pct > 90 ? "#FF6B6B" : color}
        strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}

export default function FinanceTracker() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [view, setView] = useState("dashboard");
  const [form, setForm] = useState({ desc: "", amount: "", category: "Food", date: new Date().toISOString().slice(0, 10) });
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [animIn, setAnimIn] = useState(false);
  const nextId = useRef(100);

  const totalBudget = CATEGORIES.reduce((s, c) => s + c.budget, 0);
  const totalSpent = transactions.reduce((s, t) => s + t.amount, 0);
  const remaining = totalBudget - totalSpent;
  const overallPct = Math.round((totalSpent / totalBudget) * 100);

  const spentByCategory = CATEGORIES.map((cat) => {
    const spent = transactions.filter((t) => t.category === cat.name).reduce((s, t) => s + t.amount, 0);
    const pct = Math.round((spent / cat.budget) * 100);
    return { ...cat, spent, pct };
  });

  // Generate alerts
  useEffect(() => {
    const newAlerts = spentByCategory
      .filter((c) => c.pct >= 80 && !dismissed.includes(c.name))
      .map((c) => ({
        id: c.name,
        type: c.pct >= 100 ? "danger" : "warning",
        msg: c.pct >= 100
          ? `⚠️ ${c.name} budget exceeded by ${formatINR(c.spent - c.budget)}!`
          : `🔔 ${c.name} at ${c.pct}% of budget (${formatINR(c.budget - c.spent)} left)`,
      }));
    setAlerts(newAlerts);
  }, [transactions, dismissed]);

  useEffect(() => {
    setAnimIn(false);
    setTimeout(() => setAnimIn(true), 50);
  }, [view]);

  const addTransaction = () => {
    if (!form.desc || !form.amount) return;
    setTransactions((prev) => [
      { id: nextId.current++, ...form, amount: Number(form.amount) },
      ...prev,
    ]);
    setForm({ desc: "", amount: "", category: "Food", date: new Date().toISOString().slice(0, 10) });
  };

  const deleteTransaction = (id) => setTransactions((prev) => prev.filter((t) => t.id !== id));

  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  const topCategory = spentByCategory.sort((a, b) => b.spent - a.spent)[0];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0b0e1a",
      color: "#e8eaf0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "0",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0b0e1a; } ::-webkit-scrollbar-thumb { background: #2a2f4a; border-radius: 4px; }
        .card { background: #121628; border: 1px solid #1e2440; border-radius: 16px; }
        .nav-btn { background: none; border: none; color: #6b7280; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 500; padding: 8px 18px; border-radius: 24px; transition: all 0.2s; }
        .nav-btn.active { background: #1e2440; color: #e8eaf0; }
        .nav-btn:hover { color: #e8eaf0; }
        .add-btn { background: linear-gradient(135deg, #4D96FF, #6BCB77); border: none; color: #fff; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; padding: 12px 28px; border-radius: 12px; cursor: pointer; letter-spacing: 0.5px; transition: opacity 0.2s, transform 0.1s; }
        .add-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .add-btn:active { transform: translateY(0); }
        .inp { background: #1a1f35; border: 1px solid #2a2f4a; border-radius: 10px; color: #e8eaf0; font-family: inherit; font-size: 14px; padding: 11px 14px; outline: none; transition: border-color 0.2s; width: 100%; }
        .inp:focus { border-color: #4D96FF; }
        .fade-in { animation: fadeSlide 0.35s ease forwards; }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .alert-bar { border-radius: 10px; padding: 10px 16px; font-size: 13px; display: flex; justify-content: space-between; align-items: center; }
        .alert-close { background: none; border: none; color: inherit; cursor: pointer; font-size: 16px; opacity: 0.6; }
        .alert-close:hover { opacity: 1; }
        .tx-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #1a1f35; }
        .tx-row:last-child { border-bottom: none; }
        .del-btn { background: none; border: none; color: #6b7280; cursor: pointer; font-size: 16px; transition: color 0.2s; margin-left: auto; }
        .del-btn:hover { color: #FF6B6B; }
        select.inp { appearance: none; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
              <span style={{ color: "#4D96FF" }}>₹</span> PaisaTrack
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>April 2026</div>
          </div>
          <div style={{ display: "flex", gap: 4, background: "#121628", border: "1px solid #1e2440", borderRadius: 28, padding: 4 }}>
            {["dashboard", "add", "history"].map((v) => (
              <button key={v} className={`nav-btn${view === v ? " active" : ""}`} onClick={() => setView(v)}>
                {v === "dashboard" ? "📊 Overview" : v === "add" ? "➕ Add" : "📋 History"}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {alerts.map((a) => (
              <div key={a.id} className="alert-bar" style={{ background: a.type === "danger" ? "#2d0f0f" : "#1f1a00", border: `1px solid ${a.type === "danger" ? "#ff4444" : "#FFD93D"}`, color: a.type === "danger" ? "#ff9090" : "#FFD93D" }}>
                <span>{a.msg}</span>
                <button className="alert-close" onClick={() => setDismissed((d) => [...d, a.id])}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={animIn ? "fade-in" : ""} style={{ padding: "0 24px 32px" }}>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div>
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Total Budget", value: formatINR(totalBudget), accent: "#4D96FF" },
                { label: "Spent", value: formatINR(totalSpent), accent: "#FF6B6B" },
                { label: "Remaining", value: formatINR(remaining), accent: remaining < 0 ? "#FF6B6B" : "#6BCB77" },
              ].map((s) => (
                <div key={s.label} className="card" style={{ padding: "16px 14px" }}>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: s.accent }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Overall Progress */}
            <div className="card" style={{ padding: "18px 20px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>Overall Budget Used</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: overallPct > 90 ? "#FF6B6B" : "#4D96FF" }}>{overallPct}%</span>
              </div>
              <div style={{ background: "#1e2440", borderRadius: 8, height: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(overallPct, 100)}%`, background: overallPct > 90 ? "linear-gradient(90deg, #FF6B6B, #ff4444)" : "linear-gradient(90deg, #4D96FF, #6BCB77)", borderRadius: 8, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                Top spend: <span style={{ color: topCategory?.color }}>{topCategory?.icon} {topCategory?.name}</span> — {formatINR(topCategory?.spent || 0)}
              </div>
            </div>

            {/* Category Cards */}
            <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>By Category</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {spentByCategory.map((cat) => (
                <div key={cat.name} className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <RadialProgress pct={cat.pct} color={cat.color} />
                    <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 18 }}>{cat.icon}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{cat.name}</div>
                    <div style={{ fontSize: 12, color: cat.pct > 90 ? "#FF6B6B" : "#6b7280" }}>{formatINR(cat.spent)} / {formatINR(cat.budget)}</div>
                    <div style={{ fontSize: 11, color: cat.pct >= 100 ? "#FF6B6B" : "#6BCB77", marginTop: 2 }}>
                      {cat.pct >= 100 ? `Over by ${formatINR(cat.spent - cat.budget)}` : `${formatINR(cat.budget - cat.spent)} left`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD TRANSACTION */}
        {view === "add" && (
          <div className="card" style={{ padding: 24, maxWidth: 480, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Add Expense</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Description</div>
                <input className="inp" placeholder="e.g. Zomato Order" value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Amount (₹)</div>
                <input className="inp" type="number" placeholder="0" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Category</div>
                <select className="inp" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map((c) => <option key={c.name}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Date</div>
                <input className="inp" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              </div>
              <button className="add-btn" style={{ marginTop: 4 }} onClick={addTransaction}>Add Transaction</button>
            </div>

            {/* Preview of budget impact */}
            {form.category && form.amount && (
              <div style={{ marginTop: 20, background: "#1a1f35", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>Budget Impact Preview</div>
                {(() => {
                  const cat = spentByCategory.find((c) => c.name === form.category);
                  if (!cat) return null;
                  const newSpent = cat.spent + Number(form.amount || 0);
                  const newPct = Math.round((newSpent / cat.budget) * 100);
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 22 }}>{cat.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                          <span>{cat.name}</span>
                          <span style={{ color: newPct > 100 ? "#FF6B6B" : "#6BCB77" }}>{newPct}%</span>
                        </div>
                        <div style={{ background: "#0b0e1a", borderRadius: 6, height: 8, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(cat.pct, 100)}%`, background: cat.color, borderRadius: 6, opacity: 0.4 }} />
                          <div style={{ height: "100%", marginTop: -8, width: `${Math.min(newPct, 100)}%`, background: newPct > 100 ? "#FF6B6B" : cat.color, borderRadius: 6, transition: "width 0.4s" }} />
                        </div>
                        {newPct > 100 && <div style={{ fontSize: 11, color: "#FF6B6B", marginTop: 4 }}>⚠️ This will exceed budget!</div>}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* HISTORY */}
        {view === "history" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800 }}>All Transactions</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{transactions.length} entries</div>
            </div>
            <div className="card" style={{ padding: "4px 20px" }}>
              {[...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).map((t) => {
                const cat = CATEGORIES.find((c) => c.name === t.category);
                return (
                  <div key={t.id} className="tx-row">
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: cat?.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {cat?.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.desc}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{t.category} · {t.date}</div>
                    </div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: "#FF6B6B", flexShrink: 0 }}>
                      -{formatINR(t.amount)}
                    </div>
                    <button className="del-btn" onClick={() => deleteTransaction(t.id)}>🗑</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
