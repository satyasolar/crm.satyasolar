import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { edgeFetch, EDGE } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Search, UserPlus } from "lucide-react";

import UserTable from "./UserSections/UserTable";
import UserProfilePanel from "./UserSections/UserProfilePanel";
import AddMemberModal from "./UserSections/AddMemberModal";
import DeleteModal from "./UserSections/DeleteModal";
import ResetPasswordModal from "./UserSections/ResetPasswordModal";
import SuspendModal from "./UserSections/SuspendModal";

const Users = ({ onLogout }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(searchParams.get("action") === "add");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null); // admin panel side drawer
  const [newPassword, setNewPassword] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    role: "sales",
    isHead: false,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loggedInRole = localStorage.getItem("role");

  const fetchUsers = async () => {
    try {
      const data = await edgeFetch(EDGE.admin, { action: "list_users" });
      setUsers(data);
    } catch {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const open = showAddModal || showDeleteModal || showResetModal;
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAddModal, showDeleteModal, showResetModal]);

  // Sync modal with URL params
  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setShowAddModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!showAddModal && searchParams.get("action") === "add") {
      searchParams.delete("action");
      setSearchParams(searchParams, { replace: true });
    }
  }, [showAddModal, searchParams, setSearchParams]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await edgeFetch(EDGE.admin, { action: "create_user", ...formData });
      toast.success(`${formData.name} added successfully`);
      setShowAddModal(false);
      setFormData({ name: "", email: "", phone: "", dob: "", role: "sales", isHead: false });
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to add user");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await edgeFetch(EDGE.admin, {
        action: "delete_user",
        userId: selectedUser.id,
      });
      toast.success("User removed successfully");
      setShowDeleteModal(false);
      if (profileUser?.id === selectedUser.id) setProfileUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Could not delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await edgeFetch(EDGE.admin, {
        action: "reset_password",
        userId: selectedUser.id,
        newPassword,
      });
      toast.success("Password updated successfully");
      setShowResetModal(false);
      setNewPassword("");
    } catch (err) {
      toast.error(err.message || "Password reset failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus, suspendEndDate = null) => {
    setActionLoading(true);
    try {
      await edgeFetch(EDGE.admin, {
        action: "update_user_status",
        userId,
        status: newStatus,
        suspendEndDate,
      });
      toast.success("User status updated");
      setShowSuspendModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter
  const q = search.toLowerCase();
  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
  );

  const ctx = {
    filtered, users, search, setSearch,
    profileUser, setProfileUser,
    loggedInRole,
    selectedUser, setSelectedUser,
    showAddModal, setShowAddModal,
    showDeleteModal, setShowDeleteModal,
    showResetModal, setShowResetModal,
    showSuspendModal, setShowSuspendModal,
    newPassword, setNewPassword,
    formData, setFormData,
    addLoading, actionLoading,
    handleAddSubmit, handleDeleteUser, handleResetPassword, handleStatusChange,
  };

  if (loading)
    return (
      <div className="main-loading">
        <div style={{ textAlign: "center" }}>
          <div
            className="animate-spin"
            style={{ width: "32px", height: "32px", border: "2px solid var(--border)", borderTopColor: "var(--brand)", borderRadius: "50%", margin: "0 auto 12px" }}
          />
          <p style={{ fontSize: "13px", color: "var(--text-4)" }}>Loading team…</p>
        </div>
      </div>
    );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--page-bg)" }}>
      <Sidebar onLogout={onLogout} />

      <main style={{ flex: 1, marginLeft: "var(--main-offset)", padding: "28px 32px" }}>
        <Header title="Employee" subtitle="Manage user accounts and access permissions" onLogout={onLogout} />

        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", gap: "12px" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "360px" }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "var(--text-4)", pointerEvents: "none" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, role…"
              className="input"
              style={{ paddingLeft: "36px" }}
            />
          </div>
          {(loggedInRole === "admin" || localStorage.getItem("is_head") === "true") && (
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm" style={{ whiteSpace: "nowrap" }}>
              <UserPlus style={{ width: "14px", height: "14px" }} />
              Add member
            </button>
          )}
        </div>

        {/* Table + Profile panel side by side */}
        <div
          className="grid-stack-mobile"
          style={{ display: "grid", gridTemplateColumns: profileUser ? "1fr 300px" : "1fr", gap: "16px", alignItems: "start" }}
        >
          <UserTable ctx={ctx} />
          <UserProfilePanel ctx={ctx} />
        </div>

        <Footer />
      </main>

      <AddMemberModal ctx={ctx} />
      <DeleteModal ctx={ctx} />
      <ResetPasswordModal ctx={ctx} />
      <SuspendModal ctx={ctx} />
    </div>
  );
};

export default Users;
