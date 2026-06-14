import React, { useState } from "react";
import { STATUS_OPTIONS } from "./usersConstants";

const ChangeStatusModal = ({ ctx }) => {
  const {
    showSuspendModal,
    setShowSuspendModal,
    handleStatusChange,
    selectedUser,
    actionLoading,
  } = ctx;

  const [status, setStatus] = useState("inactive");
  const [endDate, setEndDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });

  if (!showSuspendModal || !selectedUser) return null;

  const isSuspend = status === "suspended";

  const handleConfirm = () => {
    handleStatusChange(selectedUser.id, status, isSuspend ? endDate : null);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={() => setShowSuspendModal(false)}
    >
      <div
        style={{
          background: "#fff", borderRadius: "10px", width: "300px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.22)", overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: "#1e2a6e", padding: "14px 18px" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>Change Status</span>
        </div>

        {/* Body */}
        <div style={{ padding: "18px" }}>
          {/* Status Dropdown */}
          <div style={{ marginBottom: isSuspend ? "14px" : "20px", position: "relative" }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 32px 10px 12px",
                fontSize: "14px", fontWeight: 600,
                border: "1.5px solid #3b4cb8", borderRadius: "6px",
                appearance: "none", cursor: "pointer", outline: "none",
                background: "#fff", color: "#1e293b",
                boxShadow: "0 0 0 2px rgba(59,76,184,0.1)",
              }}
            >
              <option value="" disabled>Select Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#6b7280", fontSize: "12px" }}>▼</span>
          </div>

          {/* Date picker only for suspend */}
          {isSuspend && (
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6b7280", marginBottom: "6px" }}>
                Suspend until
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "9px 12px", fontSize: "14px", fontWeight: 500,
                  border: "1.5px solid #d1d5db", borderRadius: "6px",
                  outline: "none", background: "#f9fafb",
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowSuspendModal(false)}
              style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "none", background: "#3b4cb8", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
              disabled={actionLoading}
            >
              {actionLoading ? "Saving…" : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeStatusModal;
