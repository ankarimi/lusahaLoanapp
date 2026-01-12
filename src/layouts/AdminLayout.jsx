import { Routes, Route } from "react-router-dom";
import AdminBottomNav from "../components/AdminBottomNav";
import Dashboard from "../pages/admin/Dashboard";
import Applications from "../pages/admin/Applications";
import Customers from "../pages/admin/Customers";
import Loans from "../pages/admin/Loans";
import Settings from "../pages/admin/Settings";
import AuditLogs from "../pages/admin/AuditLogs";

export default function AdminLayout() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="customers" element={<Customers />} />
          <Route path="loans" element={<Loans />} />
          <Route path="settings" element={<Settings />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Routes>
      </div>
      <AdminBottomNav />
    </div>
  );
}
