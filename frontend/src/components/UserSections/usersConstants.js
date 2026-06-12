// ─────────────────────────────────────────────────────────────────────────────
// Users — Shared constants and helpers
// ─────────────────────────────────────────────────────────────────────────────

export const roleMeta = {
  admin:            { bg: "#eef2ff", text: "#4338ca", border: "#c7d2fe", label: "Admin" },
  sales:            { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0", label: "Sales" },
  registration:     { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff", label: "Registration" },
  banking:          { bg: "#fffbeb", text: "#92400e", border: "#fde68a", label: "Banking & Finance" },
  inventory:        { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3", label: "Inventory" },
  installation:     { bg: "#f0f9ff", text: "#075985", border: "#bae6fd", label: "Installation" },
  electrical:       { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca", label: "Electrical" },
  subsidy:          { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa", label: "Subsidy" },
  technical:        { bg: "#ecfeff", text: "#155e75", border: "#a5f3fc", label: "Technical QA" },
  accounts:         { bg: "#f7fee7", text: "#3f6212", border: "#bef264", label: "Accounts" },
  customer_service: { bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe", label: "Customer Service" },
};

export const getRoleMeta = (role) =>
  roleMeta[role] || { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0", label: role };

export const fieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 14px 11px 40px",
  fontSize: "14px",
  fontWeight: 500,
  color: "#0f172a",
  background: "#f8fafc",
  border: "1.5px solid #e2e8f0",
  borderRadius: "10px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
};

export const fieldFocusStyle = {
  ...fieldStyle,
  background: "#ffffff",
  border: "1.5px solid #2563EB",
  boxShadow: "0 0 0 3px rgba(37,99,235,0.12)",
};

export const ROLE_OPTIONS = [
  { value: "sales",            label: "Sales",            emoji: "📊", color: "#065f46", bg: "#ecfdf5", border: "#a7f3d0" },
  { value: "registration",     label: "Registration",     emoji: "📋", color: "#7e22ce", bg: "#fdf4ff", border: "#e9d5ff" },
  { value: "banking",          label: "Banking & Finance", emoji: "🏦", color: "#92400e", bg: "#fffbeb", border: "#fde68a" },
  { value: "inventory",        label: "Inventory",        emoji: "📦", color: "#9f1239", bg: "#fff1f2", border: "#fecdd3" },
  { value: "field_installation", label: "Installation",  emoji: "⚡", color: "#075985", bg: "#f0f9ff", border: "#bae6fd" },
  { value: "electrical",       label: "Electrical",       emoji: "⚡", color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
  { value: "subsidy",          label: "Subsidy",          emoji: "🌿", color: "#9a3412", bg: "#fff7ed", border: "#fed7aa" },
  { value: "technical",        label: "Technical QA",     emoji: "🔬", color: "#155e75", bg: "#ecfeff", border: "#a5f3fc" },
  { value: "accounts",         label: "Accounts",         emoji: "💰", color: "#3f6212", bg: "#f7fee7", border: "#bef264" },
  { value: "customer_service", label: "Customer Service", emoji: "🎧", color: "#5b21b6", bg: "#f5f3ff", border: "#ddd6fe" },
  { value: "admin",            label: "Admin",             emoji: "👑", color: "#4338ca", bg: "#eef2ff", border: "#c7d2fe" },
];
