import React from "react";
import { Key, Trash2, ChevronRight } from "lucide-react";
import { getRoleMeta } from "./usersConstants";

const UserTable = ({ ctx }) => {
  const {
    filtered, users, search,
    profileUser, setProfileUser,
    loggedInRole,
    setSelectedUser, setShowResetModal, setShowDeleteModal,
  } = ctx;

  return (
    <>
      {/* ── Desktop Table ─────────────────────────────────────────────── */}
      <div className="table-wrap hide-on-mobile">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Employee ID</th>
              <th>Role</th>
              <th>Status</th>
              {loggedInRole === "admin" && (
                <th style={{ textAlign: "right" }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => {
              const rm = getRoleMeta(user.role);
              const isActive = profileUser?.id === user.id;
              return (
                <tr
                  key={user.id}
                  onClick={() => setProfileUser(isActive ? null : user)}
                  style={{ cursor: "pointer", background: isActive ? "#f0fdf4" : "" }}
                >
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0, background: "linear-gradient(135deg, #2563EB, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#fff" }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-1)" }}>{user.name}</p>
                        <p style={{ fontSize: "12px", color: "var(--text-4)" }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-2)" }}>
                      {user.employeeId || "N/A"}
                    </span>
                  </td>
                  <td>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 600, background: rm.bg, color: rm.text, border: `1px solid ${rm.border}`, textTransform: "capitalize" }}>
                      {rm.label}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div className="status-dot online" />
                      <span style={{ fontSize: "12.5px", color: "#15803d", fontWeight: 500 }}>Active</span>
                    </div>
                  </td>
                  {loggedInRole === "admin" && (
                    <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        <button title="Reset password" onClick={() => { setSelectedUser(user); setShowResetModal(true); }} className="btn btn-ghost btn-sm" style={{ padding: "6px 8px" }}>
                          <Key style={{ width: "13px", height: "13px" }} />
                        </button>
                        <button title="Remove user" onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }} className="btn btn-sm" style={{ padding: "6px 8px", background: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3" }}>
                          <Trash2 style={{ width: "13px", height: "13px" }} />
                        </button>
                        <button title="View profile" onClick={() => setProfileUser(isActive ? null : user)} className="btn btn-ghost btn-sm" style={{ padding: "6px 8px" }}>
                          <ChevronRight style={{ width: "13px", height: "13px", transform: isActive ? "rotate(90deg)" : "none", transition: "0.2s" }} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "48px", color: "var(--text-4)", fontSize: "13px" }}>
                  {search ? `No members match "${search}"` : "No team members yet"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="table-foot">
          {users.length} member{users.length !== 1 ? "s" : ""} total
        </div>
      </div>

      {/* ── Mobile Cards ──────────────────────────────────────────────── */}
      <div className="mobile-only" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px", color: "var(--text-4)", fontSize: "13px", background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
            {search ? `No members match "${search}"` : "No team members yet"}
          </div>
        )}
        {filtered.map((user) => {
          const rm = getRoleMeta(user.role);
          const isActive = profileUser?.id === user.id;
          return (
            <div
              key={user.id}
              onClick={() => setProfileUser(isActive ? null : user)}
              style={{ background: isActive ? "#f0fdf4" : "var(--surface)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "var(--shadow-sm)", cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0, background: "linear-gradient(135deg, #2563EB, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-1)" }}>{user.name}</p>
                    <p style={{ fontSize: "13px", color: "var(--text-4)" }}>{user.email}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div className="status-dot online" />
                  <span style={{ fontSize: "12px", color: "#15803d", fontWeight: 600 }}>Active</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", background: "var(--surface-2)", padding: "12px", borderRadius: "8px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-4)", textTransform: "uppercase", fontWeight: 600 }}>Employee ID</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-2)", marginTop: "4px" }}>{user.employeeId || "N/A"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--text-4)", textTransform: "uppercase", fontWeight: 600 }}>Role</div>
                  <div style={{ marginTop: "4px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 600, background: rm.bg, color: rm.text, border: `1px solid ${rm.border}`, textTransform: "capitalize", display: "inline-block" }}>
                      {rm.label}
                    </span>
                  </div>
                </div>
              </div>
              {loggedInRole === "admin" && (
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }} onClick={(e) => e.stopPropagation()}>
                  <button title="Reset password" onClick={() => { setSelectedUser(user); setShowResetModal(true); }} className="btn btn-secondary btn-sm" style={{ padding: "6px 12px" }}>
                    <Key style={{ width: "13px", height: "13px" }} />
                  </button>
                  <button title="Remove user" onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }} className="btn btn-sm" style={{ padding: "6px 12px", background: "#fff1f2", color: "#be123c", border: "1px solid #fecdd3" }}>
                    <Trash2 style={{ width: "13px", height: "13px" }} />
                  </button>
                  <button title="View profile" onClick={() => setProfileUser(isActive ? null : user)} className="btn btn-primary btn-sm" style={{ padding: "6px 12px" }}>
                    <ChevronRight style={{ width: "14px", height: "14px", transform: isActive ? "rotate(90deg)" : "none", transition: "0.2s" }} />
                    View Profile
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UserTable;
