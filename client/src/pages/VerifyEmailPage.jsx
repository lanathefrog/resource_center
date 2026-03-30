import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../context/ToastContext";

export function VerifyEmailPage() {
  const { api } = useAppContext();
  const { addToast } = useToast();
  const [params] = useSearchParams();
  const hasRequestedRef = useRef(false);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Email verification in progress...");

  useEffect(() => {
    if (hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;

    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing");
      addToast({ type: "warning", message: "Verification token is missing" });
      return;
    }

    api
      .verifyEmail(token)
      .then(() => {
        setStatus("success");
        setMessage("Email verified successfully. You can now sign in.");
        addToast({ type: "success", message: "Email verified successfully" });
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message);
        addToast({ type: "error", message: err.message });
      });
  }, [addToast, api, params]);

  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg rounded-2xl border border-white/60 bg-white/90 p-6 shadow-glow text-center">
      <h1 className="font-heading text-3xl">Email Verification</h1>
      <p className={`mt-4 text-lg ${status === "error" ? "text-rose-600" : "text-slate-700"}`}>{message}</p>
    </motion.section>
  );
}
