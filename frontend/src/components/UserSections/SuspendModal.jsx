import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

const SuspendModal = ({ ctx }) => {
  const {
    showSuspendModal,
    setShowSuspendModal,
    handleStatusChange,
    selectedUser,
    actionLoading,
  } = ctx;

  // Default to tomorrow
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  if (!showSuspendModal || !selectedUser) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: "360px" }}>
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <AlertTriangle style={{ width: "20px", height: "20px", color: "#d97706" }} />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-1)", margin: 0 }}>
                Suspend Member
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-4)", margin: "4px 0 0" }}>
                Temporarily block login access.
              </p>
            </div>
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-2)", marginBottom: "8px" }}>
              Suspend {selectedUser.name} until which date?
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
            <button
              onClick={() => setShowSuspendModal(false)}
              className="btn btn-ghost"
              style={{ flex: 1, padding: "10px", borderRadius: "8px" }}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleStatusChange(selectedUser.id, "suspended", endDate);
              }}
              className="btn"
              style={{ flex: 1, padding: "10px", borderRadius: "8px", background: "#d97706", color: "#fff", border: "none", fontWeight: 600 }}
              disabled={actionLoading}
            >
              {actionLoading ? "Suspending..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuspendModal;
