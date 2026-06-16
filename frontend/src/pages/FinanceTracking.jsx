import React, { useState, useEffect } from "react";
import { edgeFetch, EDGE } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CheckCircle2, AlertTriangle, Landmark, RefreshCw } from "lucide-react";

import OverviewTab from "./FinanceSections/OverviewTab";
import TrackerTab from "./FinanceSections/TrackerTab";

const FinanceTracking = ({ onLogout }) => {
  const [allCases, setAllCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const activeFinanceType = "loan";

  const cases = allCases.filter(
    (c) => (c.payment_type || "").toLowerCase() === activeFinanceType
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await edgeFetch(EDGE.workflow, { action: "get_all" });
      setAllCases(data);
    } catch {
      toast.error("Failed to load finance cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalLoans = allCases.filter(
    (c) => (c.payment_type || "").toLowerCase() === "loan"
  ).length;
  const approvedLoans = allCases.filter(
    (c) =>
      (c.payment_type || "").toLowerCase() === "loan" &&
      c.finance_final_status === "Approved"
  ).length;
  const pendingVisits = allCases.filter(
    (c) =>
      (c.payment_type || "").toLowerCase() === "loan" &&
      !c.bank_visited_date &&
      c.finance_final_status !== "Approved"
  ).length;

  const cardData = [
    { label: "Total Loan Cases", value: totalLoans, color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", icon: Landmark },
    { label: "Approved Loans", value: approvedLoans, color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", icon: CheckCircle2 },
    { label: "Pending Bank Visit", value: pendingVisits, color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: AlertTriangle },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--page-bg)" }}>
      <Sidebar onLogout={onLogout} />

      <main style={{ flex: 1, marginLeft: "var(--main-offset)", padding: "28px 32px", maxWidth: "1400px", boxSizing: "border-box" }}>
        <Header
          title="Finance Command Center"
          subtitle="Manage loan approvals and case status"
          roleBadge="Banking"
          onLogout={onLogout}
        />

        {/* ── View Switcher ── */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap", marginTop: "10px" }}>
          {[
            { key: "overview", label: "📊 Overview" },
            { key: "tracker", label: "🏦 Loan Tracker" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              style={{
                padding: "8px 18px",
                borderRadius: "9999px",
                border: "1.5px solid",
                borderColor: activeView === key ? "var(--color-primary)" : "var(--color-border)",
                background: activeView === key ? "var(--color-primary)" : "transparent",
                color: activeView === key ? "#fff" : "var(--text-3)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
          <button onClick={loadData} className="btn btn-ghost btn-sm" style={{ marginLeft: "auto", gap: "6px" }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {activeView === "overview" && (
          <OverviewTab cardData={cardData} cases={cases} setActiveView={setActiveView} />
        )}

        {activeView === "tracker" && (
          <TrackerTab cases={cases} loading={loading} loadData={loadData} />
        )}

        <Footer />
      </main>
    </div>
  );
};

export default FinanceTracking;
