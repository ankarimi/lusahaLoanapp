import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `flex-1 text-center py-2 text-sm ${
    isActive ? "text-accent font-semibold" : "text-muted"
  }`;

export default function AdminBottomNav() {
  return (
    <nav className="h-16 bg-primary flex items-center border-t border-slate-800">
      <NavLink to="/admin/dashboard" className={linkClass}>
        Dashboard
      </NavLink>

      <NavLink to="/admin/applications" className={linkClass}>
        Applications
      </NavLink>

      <NavLink to="/admin/customers" className={linkClass}>
        Customers
      </NavLink>

      <NavLink to="/admin/loans" className={linkClass}>
        Loans
      </NavLink>

      <NavLink to="/admin/settings" className={linkClass}>
        Settings
      </NavLink>
    </nav>
  );
}
