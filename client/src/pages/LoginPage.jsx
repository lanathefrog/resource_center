import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../context/ToastContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const { login } = useAppContext();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();

    if (!emailRegex.test(email.trim())) {
      addToast({ type: "warning", message: "Enter a valid email address" });
      return;
    }

    if (!password) {
      addToast({ type: "warning", message: "Password is required" });
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      addToast({ type: "success", message: "Logged in successfully" });
      navigate("/");
    } catch (err) {
      addToast({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md rounded-2xl border border-white/60 bg-white/90 p-6 shadow-glow">
      <h1 className="font-heading text-3xl">Login</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-200 p-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-200 p-3"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-ink p-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        No account yet? <Link to="/register" className="font-semibold text-brand-700">Create one</Link>
      </p>
    </motion.section>
  );
}
