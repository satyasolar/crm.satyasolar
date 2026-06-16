import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import EmployeeDetailsPanel from "./UserSections/EmployeeDetailsPanel";

const Profile = ({ onLogout }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5" }}>
      <Sidebar onLogout={onLogout} />

      <main style={{ flex: 1, marginLeft: "var(--main-offset)", padding: "28px 32px" }}>
        <Header
          title="My Profile"
          subtitle="View and manage your account details"
          onLogout={onLogout}
        />

        <EmployeeDetailsPanel
          isOwnProfile={true}
          isAdmin={false}
          embedded={true}
        />

        <Footer />
      </main>
    </div>
  );
};

export default Profile;
