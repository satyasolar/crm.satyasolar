import React from "react";
import {
  Edit3,
  Phone,
  CheckCircle2,
  FolderOpen,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { getNormalizedDept, calculateProgress, getNextDept } from "../lib/workflowConfig";

// ── Escalation level config ───────────────────────────────────────────────────
// Maps escalation_level 0-3 → display. 0 = no badge shown.
const ESCALATION_CONFIG = {
  3: { label: "Critical", bg: "#fff1f2", color: "#be123c", border: "#fecdd3" },
  2: { label: "Urgent", bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
  1: { label: "Watch", bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
};

const EscalationBadge = ({ c }) => {
  const level = c.escalation_level;
  if (!level) return null;
  const cfg = ESCALATION_CONFIG[level];
  if (!cfg) return null;

  const role = (localStorage.getItem("role") || "").toLowerCase();
  const userName = (localStorage.getItem("name") || "").toLowerCase();

  const currentStage = c.current_stage || c.currentStage;
  // Fallback map in case stageToRole is not yet evaluated
  const deptMap = {
    "Case Confirmed": "sales",
    "Registration Pending": "registration",
    "Registration Approved": "registration",
    "Survey Completed": "project",
    "Design & BOM Approved": "project",
    "Material Reserved": "warehouse",
    "Structure Installed": "project",
    "Full Installation Completed": "project",
    "Net Metering Completed": "electrical",
    "Payment Cleared": "accounts",
    "Subsidy Closed": "subsidy",
    "Project Completed": "admin",
  };
  const deptInCharge = deptMap[currentStage];

  const isDeptInCharge = deptInCharge === role;
  const caseSalesPerson = (c.salesPerson || c.sales_person || "").toLowerCase();
  const isSalesPerson = Boolean(
    userName && caseSalesPerson && caseSalesPerson === userName,
  );
  const isAdmin = role === "admin";

  if (!isDeptInCharge && !isSalesPerson && !isAdmin) return null;

  const deptName = deptInCharge
    ? deptInCharge.charAt(0).toUpperCase() +
      deptInCharge.slice(1).replace("_", " ")
    : "Unknown Dept";
  const assignedSales =
    c.salesPerson || c.sales_person || "Unknown Sales Person";
  const delayReason =
    c.delayReason || c.delay_reason || "No specific reason provided";
  const delayBy = c.markedDelayedBy || c.marked_delayed_by || "";

  const tooltipText = `Pending at: ${deptName}\nEmployee: ${assignedSales}\n${delayBy ? `Marked by: ${delayBy}\n` : ""}Reason: ${delayReason}`;

  return (
    <span
      title={tooltipText}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        fontSize: "10px",
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: "20px",
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        whiteSpace: "nowrap",
        flexShrink: 0,
        cursor: "help",
      }}
    >
      <AlertTriangle style={{ width: "9px", height: "9px" }} />
      {cfg.label}
    </span>
  );
};

// Full pipeline order
const STAGES = [
  "Sales",
  "Registration",
  "Banking & Finance",
  "Project Phase 1",
  "Warehouse",
  "Project Phase 2",
  "Electrical",
  "Project Phase 3",
  "Quality Assurance",
  "Accounts",
  "Subsidy",
  "Customer Service / AMC",
  "Project Closed",
];

// Which role owns write access at each stage
const stageToRole = {
  "Sales": "sales",
  "Registration": "registration",
  "Banking & Finance": "banking",
  "Project Phase 1": "project",
  "Warehouse": "warehouse",
  "Project Phase 2": "project",
  "Electrical": "electrical",
  "Project Phase 3": "project",
  "Quality Assurance": "quality",
  "Accounts": "accounts",
  "Subsidy": "subsidy",
  "Customer Service / AMC": "customer_service",
  "Project Closed": "admin",
};

// The last stage each role is responsible for
const roleLastStage = {
  sales: "Sales",
  registration: "Registration",
  banking: "Banking & Finance",
  project: "Project Phase 3",
  warehouse: "Warehouse",
  electrical: "Electrical",
  quality: "Quality Assurance",
  accounts: "Accounts",
  subsidy: "Subsidy",
  customer_service: "Customer Service / AMC",
};

// Human-readable department label for each stage
const stageToDeptLabel = {
  "Sales": "Sales Dept",
  "Registration": "Registration Dept",
  "Banking & Finance": "Banking Dept",
  "Project Phase 1": "Project Dept P1",
  "Warehouse": "Warehouse Dept",
  "Project Phase 2": "Project Dept P2",
  "Electrical": "Electrical Dept",
  "Project Phase 3": "Project Dept P3",
  "Quality Assurance": "Quality Assurance Dept",
  "Accounts": "Accounts Dept",
  "Subsidy": "Subsidy Dept",
  "Customer Service / AMC": "Customer Service / AMC",
  "Project Closed": "Completed",
};

const canUpdateCase = (c) => {
  const role = (localStorage.getItem("role") || "").toLowerCase();
  if (role === "admin") return true;
  const stage = getNormalizedDept(c.current_stage || c.currentStage);
  return stageToRole[stage] === role;
};

// Returns department-relative status from THIS user's perspective
// For admin: returns global status + current department/stage context
const getDeptStatus = (c) => {
  const role = (localStorage.getItem("role") || "").toLowerCase();
  const rawStage = c.current_stage || c.currentStage;
  const currentStage = getNormalizedDept(rawStage);
  const deptLabel = stageToDeptLabel[currentStage] || currentStage || "Unknown";

  // ── Admin: show global status with department context ──
  if (role === "admin") {
    const isCompleted =
      currentStage === "Completed" || c.status === "Completed";
    if (isCompleted) {
      return {
        label: "Completed",
        color: "#15803d",
        bg: "#ecfdf5",
        border: "#bbf7d0",
        icon: "check",
        dept: "Completed",
        stage: "Completed",
      };
    }
    if (c.status === "Delayed") {
      return {
        label: "Delayed",
        color: "#be123c",
        bg: "#fff1f2",
        border: "#fecdd3",
        icon: "alert",
        dept: deptLabel,
        stage: currentStage,
      };
    }
    return {
      label: "In Progress",
      color: "#1d4ed8",
      bg: "#eff6ff",
      border: "#bfdbfe",
      icon: "clock",
      dept: deptLabel,
      stage: currentStage,
    };
  }

  const currentIdx = STAGES.indexOf(currentStage);
  const myLastStage = roleLastStage[role];
  const myLastIdx = myLastStage ? STAGES.indexOf(myLastStage) : -1;

  // Case is at one of my stages — "In Progress" (I need to act)
  if (stageToRole[currentStage] === role) {
    if (c.status === "Delayed") {
      return {
        label: "Delayed",
        color: "#be123c",
        bg: "#fff1f2",
        border: "#fecdd3",
        icon: "alert",
        dept: deptLabel,
        stage: currentStage,
      };
    }
    return {
      label: "In Progress",
      color: "#1d4ed8",
      bg: "#eff6ff",
      border: "#bfdbfe",
      icon: "clock",
      dept: deptLabel,
      stage: currentStage,
    };
  }

  // Case has moved PAST my last stage — my job is done
  if (myLastIdx >= 0 && currentIdx > myLastIdx) {
    if (role === "sales") {
      return {
        label: "Done",
        color: "#15803d",
        bg: "#ecfdf5",
        border: "#bbf7d0",
        icon: "check",
        dept: "Completed",
        stage: "Done",
      };
    }
    return {
      label: "Completed",
      color: "#15803d",
      bg: "#ecfdf5",
      border: "#bbf7d0",
      icon: "check",
      dept: deptLabel,
      stage: currentStage,
    };
  }

  // Case is before my stage (shouldn't normally happen but handle gracefully)
  return {
    label: "Pending",
    color: "#92400e",
    bg: "#fffbeb",
    border: "#fde68a",
    icon: "clock",
    dept: deptLabel,
    stage: currentStage,
  };
};


const CaseTable = ({ cases, onUpdateClick, onRefresh }) => {
  if (cases.length === 0) {
    return (
      <div className="table-wrap">
        <div
          style={{
            padding: "80px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "var(--radius-lg)",
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <FolderOpen
              style={{ width: "24px", height: "24px", color: "var(--text-5)" }}
            />
          </div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-1)",
              marginBottom: "6px",
            }}
          >
            No customers found
          </p>
          <p style={{ fontSize: "13px", color: "var(--text-4)" }}>
            No records match your current filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── DESKTOP TABLE ── */}
      <div className="table-wrap hide-on-mobile">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "var(--surface-2)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {[
                  "Project ID",
                  "Customer Name",
                  "Current Department",
                  "Progress",
                  "Status",
                  "Next Department",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--text-3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      textAlign: h === "Action" ? "right" : "left",
                      whiteSpace: "nowrap",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map((c, i) => {
                const customerId = c.customer_id || c.customerId || "—";
                const trackingId = c.tracking_id || c.trackingId || "—";
                const canUpdate = canUpdateCase(c);
                const isCompleted =
                  getNormalizedDept(c.current_stage || c.currentStage) === "Project Closed";

                return (
                  <tr
                    key={c._id || i}
                    style={{
                      borderTop: i > 0 ? "1px solid var(--border-2)" : "none",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--surface-2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "")
                    }
                  >
                    {/* Project ID / Tracking ID */}
                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "var(--color-primary)",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {trackingId}
                        </span>
                        {customerId && customerId !== "—" && (
                          <span style={{ fontSize: "10px", color: "var(--text-4)", fontFamily: "monospace" }}>
                            Cust ID: {customerId}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer Name + Phone + Escalation */}
                    <td style={{ padding: "10px 12px", minWidth: "160px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <p
                          style={{
                            fontSize: "13.5px",
                            fontWeight: 600,
                            color: "var(--text-1)",
                            margin: 0,
                          }}
                        >
                          {c.customerName}
                        </p>
                        <EscalationBadge c={c} />
                      </div>
                      {c.phone && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            marginTop: "3px",
                          }}
                        >
                          <Phone
                            style={{
                              width: "10px",
                              height: "10px",
                              color: "var(--text-4)",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: "11px",
                              color: "var(--text-3)",
                            }}
                          >
                            {c.phone}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Current Department */}
                    <td style={{ padding: "10px 12px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "20px",
                          background: isCompleted ? "#d1fae5" : "#e0f2fe",
                          color: isCompleted ? "#065f46" : "#0369a1",
                          border: `1px solid ${isCompleted ? "#a7f3d0" : "#bae6fd"}`,
                        }}
                      >
                        {getNormalizedDept(c.current_stage || c.currentStage)}
                      </span>
                    </td>

                    {/* Progress Percentage */}
                    <td style={{ padding: "10px 12px", minWidth: "110px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, height: "6px", backgroundColor: "#e2e8f0", borderRadius: "3px", overflow: "hidden", position: "relative" }}>
                          <div style={{ width: `${calculateProgress(c)}%`, height: "100%", backgroundColor: isCompleted ? "#10b981" : "#3b82f6", borderRadius: "3px" }} />
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#374151" }}>
                          {calculateProgress(c)}%
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "10px 12px" }}>
                      {(() => {
                        const deptSt = getDeptStatus(c);
                        const icon =
                          deptSt?.icon === "check" ? (
                            <CheckCircle2
                              style={{ width: "11px", height: "11px" }}
                            />
                          ) : deptSt?.icon === "alert" ? (
                            <span style={{ fontSize: "11px" }}>⚠</span>
                          ) : (
                            <Clock style={{ width: "11px", height: "11px" }} />
                          );
                        const label = deptSt?.label || c.status;
                        const bg =
                          deptSt?.bg ||
                          (isCompleted
                            ? "#ecfdf5"
                            : c.status === "Delayed"
                              ? "#fff1f2"
                              : "#eff6ff");
                        const color =
                          deptSt?.color ||
                          (isCompleted
                            ? "#15803d"
                            : c.status === "Delayed"
                              ? "#be123c"
                              : "#1d4ed8");
                        const border =
                          deptSt?.border ||
                          (isCompleted
                            ? "#bbf7d0"
                            : c.status === "Delayed"
                              ? "#fecdd3"
                              : "#bfdbfe");
                        return (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              fontSize: "11.5px",
                              fontWeight: 600,
                              padding: "4px 10px",
                              borderRadius: "20px",
                              background: bg,
                              color,
                              border: `1px solid ${border}`,
                              width: "fit-content",
                            }}
                          >
                            {icon}
                            {label}
                          </span>
                        );
                      })()}
                    </td>

                    {/* Next Department */}
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>
                        {getNextDept(c) || "— (Closed)"}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ padding: "10px 12px", textAlign: "right" }}>
                      {canUpdate && !isCompleted ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateClick(c);
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "7px 14px",
                            borderRadius: "var(--radius-sm)",
                            border: "none",
                            background: "var(--color-primary)",
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            boxShadow: "var(--shadow-brand)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "var(--color-primary-hover)";
                            e.currentTarget.style.transform =
                              "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                              "var(--color-primary)";
                            e.currentTarget.style.transform = "";
                          }}
                        >
                          <Edit3 style={{ width: "13px", height: "13px" }} />
                          Update
                        </button>
                      ) : (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            color: "var(--color-accent)",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          <CheckCircle2
                            style={{ width: "14px", height: "14px" }}
                          />
                          Done
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          style={{
            padding: "10px 20px",
            background: "var(--surface-2)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <p style={{ fontSize: "11.5px", color: "var(--text-4)" }}>
            Showing {cases.length} customer{cases.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* ── MOBILE CARDS (hidden on desktop via .mobile-only CSS) ── */}
      <div
        className="mobile-only"
        style={{ flexDirection: "column", gap: "12px" }}
      >
        {cases.map((c, i) => {
          const customerId = c.customer_id || c.customerId || "—";
          const trackingId = c.tracking_id || c.trackingId || "—";
          const canUpdate = canUpdateCase(c);
          const isCompleted =
            getNormalizedDept(c.current_stage || c.currentStage) === "Project Closed";

          return (
            <div
              key={`mob-${c._id || i}`}
              onClick={() => (canUpdate && !isCompleted ? onUpdateClick(c) : undefined)}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                cursor: (canUpdate && !isCompleted) ? "pointer" : "default",
                transition: "box-shadow 0.2s ease, transform 0.15s ease",
              }}
            >
              {/* Header: Customer Name + Status */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-1)" }}>
                    {c.customerName}
                  </span>
                  <EscalationBadge c={c} />
                </div>
                {/* Status badge */}
                {(() => {
                  const deptSt = getDeptStatus(c);
                  const label = deptSt?.label || c.status;
                  const bg =
                    deptSt?.bg ||
                    (isCompleted
                      ? "#ecfdf5"
                      : c.status === "Delayed"
                        ? "#fff1f2"
                        : "#eff6ff");
                  const color =
                    deptSt?.color ||
                    (isCompleted
                      ? "#15803d"
                      : c.status === "Delayed"
                        ? "#be123c"
                        : "#1d4ed8");
                  const border =
                    deptSt?.border ||
                    (isCompleted
                      ? "#bbf7d0"
                      : c.status === "Delayed"
                        ? "#fecdd3"
                        : "#bfdbfe");
                  return (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 9px",
                        borderRadius: "20px",
                        background: bg,
                        color,
                        border: `1px solid ${border}`,
                      }}
                    >
                      {label}
                    </span>
                  );
                })()}
              </div>

              {/* ID row */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-3)" }}>
                <div>
                  <span style={{ fontWeight: 600 }}>Project ID:</span>{" "}
                  <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{trackingId}</span>
                </div>
                {customerId && customerId !== "—" && (
                  <div>
                    <span style={{ color: "var(--text-4)" }}>Cust ID: {customerId}</span>
                  </div>
                )}
              </div>

              {/* Department Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-2)", paddingTop: "8px" }}>
                <div>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-4)", fontWeight: 700, display: "block", marginBottom: "2px" }}>
                    Current Dept
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "6px",
                      background: isCompleted ? "#d1fae5" : "#e0f2fe",
                      color: isCompleted ? "#065f46" : "#0369a1",
                      border: `1px solid ${isCompleted ? "#a7f3d0" : "#bae6fd"}`,
                    }}
                  >
                    {getNormalizedDept(c.current_stage || c.currentStage)}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-4)", fontWeight: 700, display: "block", marginBottom: "2px" }}>
                    Next Dept
                  </span>
                  <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#64748b" }}>
                    {getNextDept(c) || "— (Closed)"}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "var(--text-3)" }}>
                  <span>Progression</span>
                  <span>{calculateProgress(c)}%</span>
                </div>
                <div style={{ width: "100%", height: "6px", backgroundColor: "#e2e8f0", borderRadius: "3px", overflow: "hidden", position: "relative" }}>
                  <div style={{ width: `${calculateProgress(c)}%`, height: "100%", backgroundColor: isCompleted ? "#10b981" : "#3b82f6", borderRadius: "3px" }} />
                </div>
              </div>

              {/* Footer row: Phone / Action */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-2)", paddingTop: "8px" }}>
                <div>
                  {c.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-3)" }}>
                      <Phone size={12} />
                      <span style={{ fontSize: "12px" }}>{c.phone}</span>
                    </div>
                  )}
                </div>
                <div>
                  {canUpdate && !isCompleted ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateClick(c);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        background: "var(--color-primary)",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      <Edit3 style={{ width: "12px", height: "12px" }} />
                      Update
                    </button>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-accent)", fontSize: "12px", fontWeight: 600 }}>
                      <CheckCircle2 size={13} />
                      Done
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {cases.length > 0 && (
          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#94a3b8",
              padding: "8px 0",
            }}
          >
            {cases.length} customer{cases.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </>
  );
};

export default CaseTable;
