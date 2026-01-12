import { Routes, Route } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Home from "../pages/customer/Home";
import Loans from "../pages/customer/Loans";
import Apply from "../pages/customer/Apply";
import Support from "../pages/customer/Support";
import Profile from "../pages/customer/Profile";

export default function CustomerLayout() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="loans" element={<Loans />} />
          <Route path="apply" element={<Apply />} />
          <Route path="support" element={<Support />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}
