import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, MapPin } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { APP_CONFIG } from "../config";

/* ── Icon map — Tabler Icons class names ─────────────────────────────────── */
const ICONS = {
  Dashboard: "ti ti-layout-dashboard",
  Finance: "ti ti-report-money",
  "All Customers": "ti ti-users",
  "Quotation List": "ti ti-file-invoice",
  Team: "ti ti-users-group",
  "Create Case": "ti ti-circle-plus",
  Customers: "ti ti-users",
  "Quotation Form": "ti ti-file-plus",
  "Approved Customer": "ti ti-user-check",
  "Final Leads": "ti ti-rocket",
  Departments: "ti ti-building",
  Reports: "ti ti-chart-bar",
  Tracking: "ti ti-map-pin",
  "ERP Tasks": "ti ti-checklist",
  Inventory: "ti ti-package",
  Procurement: "ti ti-building-warehouse",
  Dispatch: "ti ti-truck-delivery",
  "Capacity Mapping": "ti ti-bolt",
  "Technical QA": "ti ti-microscope",
  Accounts: "ti ti-calculator",
  "CRM Tasks": "ti ti-heart-handshake",
  "Audit Log": "ti ti-shield-lock",
  Support: "ti ti-headset",
};

/* ── Mobile bottom nav — role-specific 4 tabs ───────────────────────────── */
// Home and Account are always tab[0] and tab[3].
// Middle two tabs are role-tailored.
const getMobileNav = (role, dashPath) => {
  const home = { name: "Home", path: dashPath, icon: "ti ti-layout-dashboard" };
  const clients = { name: "Clients", path: "/cases", icon: "ti ti-users" };
  const team = { name: "Team", path: "/users", icon: "ti ti-users-group" };
  const finance = {
    name: "Finance",
    path: "/finance-tracking",
    icon: "ti ti-report-money",
  };
  const quote = {
    name: "Quote",
    path: "/quotation-form",
    icon: "ti ti-file-plus",
  };
  const quotes = {
    name: "Quotes",
    path: "/quotations",
    icon: "ti ti-file-invoice",
  };
  const newCase = {
    name: "New Case",
    path: "/create-case",
    icon: "ti ti-circle-plus",
  };
  const dispatch = {
    name: "Dispatch",
    path: "/b2c-dispatch",
    icon: "ti ti-truck-delivery",
  };
  const procure = {
    name: "Procure",
    path: "/procurement-portal",
    icon: "ti ti-building-warehouse",
  };
  const support = { name: "Support", path: "/support", icon: "ti ti-headset" };
  const track = {
    name: "Track",
    path: "/track",
    external: true,
    icon: "ti ti-map-pin",
  };
  const audit = {
    name: "Audit",
    path: "/audit-log",
    icon: "ti ti-shield-lock",
  };

  const maps = {
    admin: [home, team, clients, audit],
    sales: [home, newCase, clients, track],
    registration: [home, newCase, clients, support],
    banking: [home, finance, clients, support],
    inventory: [home, dispatch, procure, clients],
    field_installation: [home, clients, track, support],
    electrical: [home, clients, support, support],
    subsidy: [home, clients, support, support],
    technical: [home, clients, support, support],
    accounts: [home, finance, clients, support],
    customer_service: [home, clients, support, support],
  };
  // Remove duplicates for roles with only 2 middle tabs
  const tabs = maps[role] || [home, clients, support, support];
  // Deduplicate (in case same tab appears twice for simple roles)
  const seen = new Set();
  return tabs.filter((t) => {
    if (seen.has(t.path)) return false;
    seen.add(t.path);
    return true;
  });
};

/* ── Admin navigation structure ─────────────────────────────────────────── */
const NAV = {
  admin: [
    {
      group: "Overview",
      items: [
        { name: "Dashboard", path: "/admin-dashboard" },
        { name: "Finance", path: "/finance-tracking" },
      ],
    },
    {
      group: "Management",
      items: [
        { name: "All Customers", path: "/cases" },
        { name: "Quotation List", path: "/quotations" },
        { name: "Team", path: "/users" },
      ],
    },
    {
      group: "ERP",
      items: [
        { name: "Procurement", path: "/procurement-portal" },
        { name: "Dispatch", path: "/b2c-dispatch" },
        { name: "Audit Log", path: "/audit-log" },
      ],
    },
    {
      group: "Apps",
      items: [
        { name: "Departments", path: "/department-portal" },
        { name: "Tracking", path: "/track", external: true },
      ],
    },
  ],
};

/* ── Role-based navigation builder ──────────────────────────────────────── */
const getRoleGroups = (role) => {
  const dashMap = {
    sales: "/sales-dashboard",
    registration: "/registration-dashboard",
    banking: "/banking-dashboard",
    inventory: "/inventory-dashboard",
    field_installation: "/installation-dashboard",
    electrical: "/electrical-dashboard",
    subsidy: "/subsidy-dashboard",
    technical: "/technical-dashboard",
    accounts: "/accounts-dashboard",
    customer_service: "/customer-service-dashboard",
  };

  if (role === "sales") {
    return [
      {
        group: "Workspace",
        items: [
          { name: "Dashboard", path: "/sales-dashboard" },
          { name: "Create Case", path: "/create-case" },
          { name: "Customers", path: "/cases" },
          { name: "Tracking", path: "/track", external: true },
        ],
      },
    ];
  }

  if (role === "technical") {
    return [
      {
        group: "Workspace",
        items: [
          { name: "Dashboard", path: "/technical-dashboard" },
          { name: "Customers", path: "/cases" },
        ],
      },
    ];
  }

  if (role === "accounts") {
    return [
      {
        group: "Workspace",
        items: [
          { name: "Dashboard", path: "/accounts-dashboard" },
          { name: "Customers", path: "/cases" },
          { name: "Finance", path: "/finance-tracking" },
        ],
      },
    ];
  }

  if (role === "customer_service") {
    return [
      {
        group: "Workspace",
        items: [
          { name: "Dashboard", path: "/customer-service-dashboard" },
          { name: "Customers", path: "/cases" },
        ],
      },
    ];
  }

  if (role === "inventory") {
    return [
      {
        group: "Workspace",
        items: [
          { name: "Dashboard", path: dashMap[role] || "/admin-dashboard" },
          { name: "Customers", path: "/cases" },
          { name: "Dispatch", path: "/b2c-dispatch" },
          { name: "Procurement", path: "/procurement-portal" },
        ],
      },
    ];
  }

  // All other operational roles: Dashboard + Customers (+ extras per role)
  const items = [
    { name: "Dashboard", path: dashMap[role] || "/admin-dashboard" },
    { name: "Customers", path: "/cases" },
  ];
  if (role === "registration") {
    items.splice(1, 0, { name: "Create Case", path: "/create-case" });
  }
  if (role === "banking") {
    items.push({ name: "Finance", path: "/finance-tracking" });
  }
  // All roles get Customers access
  return [
    {
      group: "Workspace",
      items: [
        ...items
      ]
    }
  ];
};

/* ── Role display label ──────────────────────────────────────────────────── */
const getRoleLabel = (role) => {
  if (role === "field_installation") return "Installation";
  if (role === "admin") return "Admin";
  if (role === "sales") return "Sales";
  if (role === "technical") return "Technical QA";
  if (role === "accounts") return "Accounts";
  if (role === "customer_service") return "Customer Service";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

/* ── Role accent color ───────────────────────────────────────────────────── */
const ROLE_COLORS = {
  admin: "#2563EB",
  sales: "#7C3AED",
  registration: "#0EA5E9",
  banking: "#F59E0B",
  inventory: "#10B981",
  field_installation: "#F97316",
  electrical: "#EF4444",
  subsidy: "#EC4899",
  technical: "#06B6D4",
  accounts: "#84CC16",
  customer_service: "#A78BFA",
};

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState(
    localStorage.getItem("name") || "User",
  );
  const [userRole, setUserRole] = useState(
    (localStorage.getItem("role") || "user").toLowerCase(),
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const groups = userRole === "admin" ? NAV.admin : getRoleGroups(userRole);
  const roleColor = ROLE_COLORS[userRole] || "#2563EB";
  const roleLabel = getRoleLabel(userRole);

  const dashPath = groups[0]?.items[0]?.path || "/admin-dashboard";
  const mobileTabs = getMobileNav(userRole, dashPath);
  const bottomNavPaths = new Set(mobileTabs.map((t) => t.path));

  // Touch tracking for swipe down to close
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);

  const handleCloseMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setMobileOpen(false);
      setIsClosing(false);
      setDragY(0);
    }, 250);
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    setIsDragging(true);
  };
  const handleTouchMove = (e) => {
    touchCurrentY.current = e.touches[0].clientY;
    const deltaY = touchCurrentY.current - touchStartY.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
    const deltaY = touchCurrentY.current - touchStartY.current;
    if (deltaY > 80) {
      handleCloseMenu();
    } else {
      setDragY(0); // snap back
    }
  };

  // Nav item click handler for bottom sheet to close smoothly
  const handleNavClick = (item) => {
    if (item.external) {
      window.open(item.path, "_blank", "noopener,noreferrer");
    } else {
      navigate(item.path);
    }
    handleCloseMenu();
  };

  /* ── Sync profile from DB on mount ──────────────────────────────────── */
  useEffect(() => {
    const isSimulating = localStorage.getItem("simulating") === "true";
    if (isSimulating) {
      setUserRole((localStorage.getItem("role") || "user").toLowerCase());
      setUserName(localStorage.getItem("name") || "User");
      return;
    }

    const syncProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, role")
          .eq("id", user.id)
          .single();
        if (profile) {
          if (profile.name) {
            localStorage.setItem("name", profile.name);
            setUserName(profile.name);
          }
          if (profile.role) {
            localStorage.setItem("role", profile.role);
            setUserRole(profile.role.toLowerCase());
          }
        }
      } catch {
        /* silent fail */
      }
    };
    syncProfile();
  }, []);

  /* ── Close mobile sidebar on route change ──────────────────────────── */
  useEffect(() => {
    setMobileOpen(false);
    setIsClosing(false);
    setDragY(0);
  }, [location.pathname]);

  /* ── Listen for custom event from Header to open menu ──────────────── */
  useEffect(() => {
    const handleOpen = () => setMobileOpen(true);
    window.addEventListener("openMobileMenu", handleOpen);
    return () => window.removeEventListener("openMobileMenu", handleOpen);
  }, []);

  /* ── Nav item click handler ─────────────────────────────────────────── */
  const handleNav = (item) => {
    if (item.external) {
      window.open(item.path, "_blank", "noopener,noreferrer");
    } else {
      navigate(item.path);
    }
    setMobileOpen(false);
  };

  /* ── Sidebar inner content (shared between desktop & mobile) ─────────── */
  const SidebarContent = () => (
    <>
      {/* Logo / Brand */}
      <div
        style={{
          padding: "16px 16px 12px",
          borderBottom: `1px solid var(--color-border)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            marginBottom: "12px",
          }}
          onClick={() => navigate("/")}
          title="Go to dashboard"
        >
          <img
            src={APP_CONFIG.logoPath}
            alt={APP_CONFIG.companyName}
            style={{ height: "30px", width: "auto", objectFit: "contain" }}
          />
        </div>

        {/* Role badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "var(--radius-pill)",
            background: `${roleColor}15`,
            border: `1px solid ${roleColor}30`,
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: roleColor,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "11px", fontWeight: 600, color: roleColor }}>
            {roleLabel} Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "8px 6px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {groups.map(({ group, items }, gi) => (
          <div key={group}>
            {gi > 0 && (
              <div
                style={{
                  height: "1px",
                  background: "var(--color-border)",
                  margin: "6px 10px",
                }}
              />
            )}
            <p className="nav-section-label">{group}</p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {items.map((item) => {
                const isActive =
                  !item.external && location.pathname === item.path;
                const iconCls = ICONS[item.name] || "ti ti-point";
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNav(item)}
                    className={`nav-item${isActive ? " active" : ""}`}
                    title={item.name}
                  >
                    {item.name === "Tracking" ? (
                      <MapPin
                        style={{
                          width: "15px",
                          height: "15px",
                          flexShrink: 0,
                          opacity: 0.85,
                        }}
                      />
                    ) : (
                      <i
                        className={iconCls}
                        style={{
                          fontSize: "15px",
                          width: "18px",
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span style={{ flex: 1 }}>{item.name}</span>
                    {item.external && (
                      <i
                        className="ti ti-external-link"
                        style={{
                          fontSize: "11px",
                          opacity: 0.45,
                          flexShrink: 0,
                          transition: "opacity 0.15s",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: Support + Profile */}
      <div
        style={{
          padding: "8px 6px 12px",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <button
          onClick={() => {
            navigate("/support");
            setMobileOpen(false);
          }}
          className={`nav-item${location.pathname === "/support" ? " active" : ""}`}
          style={{ marginBottom: "6px" }}
          title="Support"
        >
          <i
            className="ti ti-headset"
            style={{ fontSize: "15px", width: "18px", textAlign: "center" }}
          />
          <span>Support</span>
        </button>

        {/* User Profile card */}
        <div
          onClick={() => {
            navigate("/profile");
            setMobileOpen(false);
          }}
          title="View profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            background: "var(--surface-2)",
            cursor: "pointer",
            transition: "background 0.15s ease",
            marginTop: "2px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--surface-3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--surface-2)";
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "var(--radius-sm)",
              flexShrink: 0,
              background: roleColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.5px",
            }}
          >
            {initials}
          </div>

          {/* Name + role */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text-1)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}
            >
              {userName}
            </p>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 500,
                color: "var(--text-4)",
                textTransform: "capitalize",
              }}
            >
              {roleLabel}
            </span>
          </div>

          {/* Logout button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
            }}
            title="Sign out"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-4)",
              padding: "5px",
              borderRadius: "var(--radius-xs)",
              transition: "all 0.15s ease",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-danger)";
              e.currentTarget.style.background = "var(--color-danger-muted)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-4)";
              e.currentTarget.style.background = "none";
            }}
          >
            <LogOut style={{ width: "14px", height: "14px" }} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <aside
        className="sidebar-desktop"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile: Slide-in sidebar drawer ─────────────────────────────── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={handleCloseMenu}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 150,
              background: "hsla(222,47%,5%,0.55)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              animation: isClosing
                ? "fadeOut 0.25s ease both"
                : "fadeIn 0.25s ease both",
            }}
          />

          {/* Bottom Sheet Drawer panel */}
          <aside
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 160,
              background: "var(--sidebar-bg)",
              borderTop: "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
              boxShadow: "var(--shadow-xl)",
              display: "flex",
              flexDirection: "column",
              maxHeight: "90vh",
              transform: `translateY(${isClosing ? "100%" : dragY + "px"})`,
              transition: isDragging
                ? "none"
                : "transform 0.25s cubic-bezier(0.16,1,0.3,1)",
              animation:
                !isDragging && dragY === 0 && !isClosing
                  ? "slideInUp 0.35s cubic-bezier(0.16,1,0.3,1) both"
                  : "none",
            }}
          >
            {/* Draggable Header Area */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: "none" }}
            >
              {/* Grab Handle Area (Expanded touch target) */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  padding: "16px 0 8px 0",
                  cursor: "grab",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "4px",
                    borderRadius: "2px",
                    background: "var(--text-4)",
                  }}
                />
              </div>

              {/* Profile Info Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "0 20px 16px 20px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: roleColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {initials}
                </div>
                <div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--text-1)",
                    }}
                  >
                    {userName}
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-3)",
                      textTransform: "capitalize",
                    }}
                  >
                    {roleLabel}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                height: "1px",
                background: "var(--color-border)",
                margin: "0 20px",
              }}
            />

            {/* Scrollable Menu Area */}
            <div
              style={{
                padding: "16px 14px",
                overflowY: "auto",
                overscrollBehavior: "contain",
              }}
            >
              <p
                className="nav-section-label"
                style={{
                  paddingLeft: "8px",
                  marginBottom: "8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                MENU
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                {groups.map(({ items }, gi) => {
                  const filteredItems = items.filter(
                    (item) => !bottomNavPaths.has(item.path),
                  );
                  if (filteredItems.length === 0) return null;
                  return (
                    <React.Fragment key={gi}>
                      {filteredItems.map((item) => {
                        const isActive =
                          !item.external && location.pathname === item.path;
                        const iconCls = ICONS[item.name] || "ti ti-point";
                        return (
                          <button
                            key={item.name}
                            onClick={() => handleNavClick(item)}
                            className={`nav-item${isActive ? " active" : ""}`}
                            style={{ padding: "12px 14px" }}
                          >
                            {item.name === "Tracking" ? (
                              <MapPin
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  flexShrink: 0,
                                  opacity: 0.85,
                                }}
                              />
                            ) : (
                              <i
                                className={iconCls}
                                style={{
                                  fontSize: "20px",
                                  width: "24px",
                                  textAlign: "center",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <span style={{ flex: 1, fontSize: "15px" }}>
                              {item.name}
                            </span>
                            {item.external && (
                              <i
                                className="ti ti-external-link"
                                style={{
                                  fontSize: "14px",
                                  opacity: 0.45,
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>

              <div
                style={{
                  height: "1px",
                  background: "var(--color-border)",
                  margin: "20px 8px",
                }}
              />

              <div
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                <button
                  onClick={() => handleNavClick({ path: "/profile" })}
                  className={`nav-item${location.pathname === "/profile" ? " active" : ""}`}
                  style={{ padding: "12px 14px" }}
                >
                  <i
                    className="ti ti-user-circle"
                    style={{
                      fontSize: "20px",
                      width: "24px",
                      textAlign: "center",
                    }}
                  />
                  <span style={{ fontSize: "15px" }}>Profile</span>
                </button>

                <button
                  onClick={() => {
                    const html = document.documentElement;
                    const isDark = html.getAttribute("data-theme") === "dark";
                    html.setAttribute("data-theme", isDark ? "light" : "dark");
                    localStorage.setItem("theme", isDark ? "light" : "dark");
                  }}
                  className="nav-item"
                  style={{ padding: "12px 14px" }}
                >
                  <i
                    className="ti ti-moon"
                    style={{
                      fontSize: "20px",
                      width: "24px",
                      textAlign: "center",
                    }}
                  />
                  <span style={{ fontSize: "15px" }}>Toggle Theme</span>
                </button>

                <button
                  onClick={() => handleNavClick({ path: "/support" })}
                  className={`nav-item${location.pathname === "/support" ? " active" : ""}`}
                  style={{ padding: "12px 14px" }}
                >
                  <i
                    className="ti ti-headset"
                    style={{
                      fontSize: "20px",
                      width: "24px",
                      textAlign: "center",
                    }}
                  />
                  <span style={{ fontSize: "15px" }}>Support</span>
                </button>

                <button
                  onClick={onLogout}
                  className="nav-item"
                  style={{ padding: "12px 14px", color: "var(--color-danger)" }}
                >
                  <LogOut
                    style={{
                      width: "20px",
                      height: "20px",
                      flexShrink: 0,
                      opacity: 0.85,
                    }}
                  />
                  <span style={{ fontSize: "15px", fontWeight: 600 }}>
                    Sign Out
                  </span>
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* ── Mobile Bottom Navigation — Role-specific 4 tabs ──────────────── */}
      <nav
        className="mobile-bottom-nav"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {(() => {
          return mobileTabs.map((tab, idx) => {
            const isLast = idx === mobileTabs.length - 1;
            // Last tab is always Account (Profile)
            if (isLast) {
              const isActive = location.pathname === "/profile";
              return (
                <button
                  key="account"
                  onClick={() => setMobileOpen(true)}
                  className={`mobile-nav-btn ${isActive ? "active" : ""}`}
                  aria-label="Account"
                  aria-current={isActive ? "page" : undefined}
                >
                  <div
                    className="mobile-nav-icon-wrap"
                    style={{
                      background: isActive ? roleColor : "transparent",
                      borderRadius: "var(--radius-md)",
                      width: "36px",
                      height: "28px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 800,
                        color: isActive ? "#fff" : "currentColor",
                      }}
                    >
                      {initials}
                    </span>
                  </div>
                  <span className="mobile-nav-label">Account</span>
                </button>
              );
            }

            const isActive = tab.external
              ? false
              : location.pathname === tab.path;

            return (
              <button
                key={tab.path + idx}
                onClick={() => {
                  if (tab.external) {
                    window.open(tab.path, "_blank", "noopener,noreferrer");
                  } else {
                    navigate(tab.path);
                  }
                }}
                className={`mobile-nav-btn ${isActive ? "active" : ""}`}
                aria-label={tab.name}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="mobile-nav-icon-wrap">
                  <i className={tab.icon} style={{ fontSize: "19px" }} />
                </div>
                <span className="mobile-nav-label">{tab.name}</span>
              </button>
            );
          });
        })()}
      </nav>
    </>
  );
};

export default Sidebar;
