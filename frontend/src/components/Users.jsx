import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { edgeFetch, EDGE } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Search } from "lucide-react";

import UserTable from "./UserSections/UserTable";
import DeleteModal from "./UserSections/DeleteModal";
import ResetPasswordModal from "./UserSections/ResetPasswordModal";
import ChangeStatusModal from "./UserSections/SuspendModal";
import EditDesignationModal from "./UserSections/EditDesignationModal";

const Users = ({ onLogout }) => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDesignationModal, setShowDesignationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loggedInRole = localStorage.getItem("role");

  const fetchUsers = async () => {
    try {
      const data = await edgeFetch(EDGE.admin, { action: "list_users" });
      setUsers(data);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await edgeFetch(EDGE.admin, { action: "delete_user", userId: selectedUser.id });
      toast.success("Employee removed");
      setShowDeleteModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Could not delete employee");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await edgeFetch(EDGE.admin, { action: "reset_password", userId: selectedUser.id, newPassword });
      toast.success("Password updated");
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
      await edgeFetch(EDGE.admin, { action: "update_user_status", userId, status: newStatus, suspendEndDate });
      toast.success("Status updated");
      setShowSuspendModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDesignationChange = async (userId, designation) => {
    setActionLoading(true);
    try {
      await edgeFetch(EDGE.admin, { action: "update_user", userId, designation });
      toast.success("Designation updated");
      setShowDesignationModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to update designation");
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
      u.role?.toLowerCase().includes(q) ||
      u.designation?.toLowerCase().includes(q) ||
      u.employeeId?.toLowerCase().includes(q)
  );

  const ctx = {
    filtered, users, search, setSearch,
    loggedInRole,
    selectedUser, setSelectedUser,
    showDeleteModal, setShowDeleteModal,
    showResetModal, setShowResetModal,
    showSuspendModal, setShowSuspendModal,
    showDesignationModal, setShowDesignationModal,
    newPassword, setNewPassword,
    actionLoading,
    handleDeleteUser, handleResetPassword, handleStatusChange, handleDesignationChange,
  };

  if (loading)
    return (
      <div className="main-loading">
        <div style={{ textAlign: "center" }}>
          <div className="animate-spin" style={{ width: "32px", height: "32px", border: "2px solid var(--border)", borderTopColor: "#3b4cb8", borderRadius: "50%", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "13px", color: "var(--text-4)" }}>Loading employees…</p>
        </div>
      </div>
    );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5" }}>
      <Sidebar onLogout={onLogout} />

      <main style={{ flex: 1, marginLeft: "var(--main-offset)", padding: "28px 32px" }}>
        <Header title="Employee" subtitle="Manage employee accounts and access" onLogout={onLogout} />

        {/* Search bar */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", gap: "10px" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: "360px" }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "#9ca3af", pointerEvents: "none" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, designation…"
              className="input"
              style={{ paddingLeft: "36px", borderRadius: "6px" }}
            />
          </div>
        </div>

        <UserTable ctx={ctx} />

        <Footer />
      </main>

      <DeleteModal ctx={ctx} />
      <ResetPasswordModal ctx={ctx} />
      <ChangeStatusModal ctx={ctx} />
      <EditDesignationModal ctx={ctx} />
    </div>
  );
};

export default Users;
