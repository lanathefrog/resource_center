import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#bbf7d0_0%,#f6f3ea_35%,#cffafe_100%)] font-body text-ink">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
