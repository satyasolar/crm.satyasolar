// ─────────────────────────────────────────────────────────────────────────────
// Users — Shared constants and helpers
// ─────────────────────────────────────────────────────────────────────────────

export const roleMeta = {
  admin:            { bg: "#eef2ff", text: "#4338ca", border: "#c7d2fe", label: "Admin" },
  sales:            { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0", label: "Sales" },
  registration:     { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff", label: "Registration" },
  finance:          { bg: "#fffbeb", text: "#92400e", border: "#fde68a", label: "Finance" },
  project:          { bg: "#f0f9ff", text: "#075985", border: "#bae6fd", label: "Project" },
  warehouse:        { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3", label: "Warehouse" },
  net_metering:     { bg: "#ecfeff", text: "#155e75", border: "#a5f3fc", label: "Net Metering" },
  quality:          { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca", label: "Quality" },
  subsidy:          { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa", label: "Subsidy" },
  customer_service: { bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe", label: "Customer Service" },
  // Legacy role support (display only — for existing users)
  banking:          { bg: "#fffbeb", text: "#92400e", border: "#fde68a", label: "Finance" },
  accounts:         { bg: "#fffbeb", text: "#92400e", border: "#fde68a", label: "Finance" },
  inventory:        { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3", label: "Warehouse" },
  field_installation: { bg: "#f0f9ff", text: "#075985", border: "#bae6fd", label: "Project" },
  field:            { bg: "#f0f9ff", text: "#075985", border: "#bae6fd", label: "Project" },
  electrical:       { bg: "#f0f9ff", text: "#075985", border: "#bae6fd", label: "Project" },
  technical:        { bg: "#f0f9ff", text: "#075985", border: "#bae6fd", label: "Project" },
  qa:               { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca", label: "Quality" },
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
  { value: "finance",          label: "Finance",          emoji: "🏦", color: "#92400e", bg: "#fffbeb", border: "#fde68a" },
  { value: "project",          label: "Project",          emoji: "🔧", color: "#075985", bg: "#f0f9ff", border: "#bae6fd" },
  { value: "warehouse",        label: "Warehouse",        emoji: "📦", color: "#9f1239", bg: "#fff1f2", border: "#fecdd3" },
  { value: "net_metering",     label: "Net Metering",     emoji: "⚡", color: "#155e75", bg: "#ecfeff", border: "#a5f3fc" },
  { value: "quality",          label: "Quality",          emoji: "🔬", color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
  { value: "subsidy",          label: "Subsidy",          emoji: "🌿", color: "#9a3412", bg: "#fff7ed", border: "#fed7aa" },
  { value: "customer_service", label: "Customer Service", emoji: "🎧", color: "#5b21b6", bg: "#f5f3ff", border: "#ddd6fe" },
  { value: "admin",            label: "Admin",             emoji: "👑", color: "#4338ca", bg: "#eef2ff", border: "#c7d2fe" },
];

export const DESIGNATION_OPTIONS = [
  "Solar Technical Head",
  "CEO",
  "IT Manager",
  "Area Sales Manager",
  "Account Manager",
  "Solar Project Supervisor",
  "Electric Support Manager",
  "Business Development Manager",
  "Sales Supervisor",
  "Web Application Developer",
  "Web Design Expert",
  "Business Development Executive (B2C)",
  "Relationship Executive",
  "Store Manager",
  "Installer",
  "Independent Partner",
  "Field Engineer",
  "Sales Executive",
  "Registration Officer",
  "Finance Officer",
  "Net Metering Officer",
  "Quality Inspector",
  "Subsidy Officer",
  "Customer Support Executive",
];

export const STATUS_OPTIONS = [
  { value: "active",    label: "Active",    color: "#15803d", bg: "#dcfce7", border: "#86efac" },
  { value: "inactive",  label: "Inactive",  color: "#b91c1c", bg: "#fee2e2", border: "#fca5a5" },
  { value: "suspended", label: "Suspend",   color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
  { value: "terminate", label: "Terminate", color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
  { value: "resigned",  label: "Resign",    color: "#475569", bg: "#f1f5f9", border: "#cbd5e1" },
];

export const getStatusMeta = (status) =>
  STATUS_OPTIONS.find((s) => s.value === status) ||
  { value: status, label: status, color: "#475569", bg: "#f1f5f9", border: "#cbd5e1" };
