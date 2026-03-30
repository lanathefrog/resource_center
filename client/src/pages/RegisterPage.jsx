import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../context/ToastContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterPage() {
  const { register } = useAppContext();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  function changeField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      addToast({ type: "warning", message: "First name and last name are required" });
      return;
    }

    if (!emailRegex.test(form.email.trim())) {
      addToast({ type: "warning", message: "Enter a valid email address" });
      return;
    }

    if (form.password.length < 8) {
      addToast({ type: "warning", message: "Password must be at least 8 characters" });
      return;
    }

    try {
      await register(form);
      addToast({
        type: "success",
        message: "Registration successful. Check your email and verify your account.",
        duration: 6000
      });
    } catch (err) {
      addToast({ type: "error", message: err.message });
    }
  }

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md rounded-2xl border border-white/60 bg-white/90 p-6 shadow-glow">
      <h1 className="font-heading text-3xl">Register</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input name="firstName" value={form.firstName} onChange={changeField} placeholder="First name" className="w-full rounded-xl border border-slate-200 p-3" required />
        <input name="lastName" value={form.lastName} onChange={changeField} placeholder="Last name" className="w-full rounded-xl border border-slate-200 p-3" required />
        <input type="email" name="email" value={form.email} onChange={changeField} placeholder="Email" className="w-full rounded-xl border border-slate-200 p-3" required />
        <input type="password" name="password" value={form.password} onChange={changeField} placeholder="Password" className="w-full rounded-xl border border-slate-200 p-3" required />

        <button type="submit" className="w-full rounded-xl bg-brand-700 p-3 font-semibold text-white">
          Create account
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link to="/login" className="font-semibold text-brand-700">Sign in</Link>
      </p>
    </motion.section>
  );
}
