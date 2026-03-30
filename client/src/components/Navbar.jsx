import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { API_MODE } from "../api/client";
import { useAppContext } from "../context/AppContext";

function navClass({ isActive }) {
  return `px-3 py-2 rounded-lg text-sm font-semibold transition ${
    isActive ? "bg-brand-600 text-white" : "text-ink hover:bg-brand-50"
  }`;
}

export function Navbar() {
  const { apiMode, setApiMode, user, logout } = useAppContext();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 border-b border-white/40 backdrop-blur-md bg-sand/85"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="font-heading text-xl text-ink tracking-tight">
          Library Resource Center
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              apiMode === API_MODE.REST ? "bg-ink text-white" : "bg-white text-ink"
            }`}
            onClick={() => setApiMode(API_MODE.REST)}
          >
            REST
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              apiMode === API_MODE.GRAPHQL ? "bg-ink text-white" : "bg-white text-ink"
            }`}
            onClick={() => setApiMode(API_MODE.GRAPHQL)}
          >
            GraphQL
          </button>
        </div>

        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navClass}>
            Catalog
          </NavLink>
          {user ? (
            <>
             
              {user.role === "admin" && (
                <NavLink to="/admin" className={navClass}>
                  Admin Panel
                </NavLink>
              )}
               <NavLink to="/profile" className={navClass}>
                {user.firstName} {user.lastName}
              </NavLink>
              <button
                type="button"
                className="px-3 py-2 rounded-lg text-sm font-semibold bg-white text-ink hover:bg-brand-50"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navClass}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
