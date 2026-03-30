import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../context/ToastContext";

export function ProfilePage() {
  const { api, user, updateProfile, changePassword } = useAppContext();
  const { addToast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    let cancelled = false;

    async function loadReservations() {
      if (!user || user.role === "admin") {
        setReservations([]);
        setLoadingReservations(false);
        return;
      }

      setLoadingReservations(true);
      try {
        const data = await api.listMyReservations();
        if (!cancelled) {
          setReservations(data);
        }
      } catch (error) {
        if (!cancelled) {
          addToast({ type: "error", message: error.message });
        }
      } finally {
        if (!cancelled) {
          setLoadingReservations(false);
        }
      }
    }

    loadReservations();

    return () => {
      cancelled = true;
    };
  }, [addToast, api, user]);

  async function submitProfile(event) {
    event.preventDefault();

    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      addToast({ type: "warning", message: "First name and last name are required" });
      return;
    }

    try {
      const data = await updateProfile({
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim()
      });
      addToast({ type: "success", message: data.message || "Profile updated" });
    } catch (error) {
      addToast({ type: "error", message: error.message });
    }
  }

  async function submitPassword(event) {
    event.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      addToast({ type: "warning", message: "Both password fields are required" });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      addToast({ type: "warning", message: "New password must be at least 8 characters" });
      return;
    }

    try {
      const data = await changePassword(passwordForm);
      addToast({ type: "success", message: data.message || "Password updated" });
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      addToast({ type: "error", message: error.message });
    }
  }

  async function cancelReservation(id) {
    try {
      await api.cancelReservation(id);
      setReservations((prev) => prev.filter((reservation) => reservation.id !== id && reservation._id !== id));
      addToast({ type: "warning", message: "Reservation cancelled" });
    } catch (error) {
      addToast({ type: "error", message: error.message });
    }
  }

  return (
    <section className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="font-heading text-4xl">My Profile</h1>
        <p className="text-slate-700">Manage your personal information and password.</p>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submitProfile}
          className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-glow space-y-3"
        >
          <h2 className="font-heading text-2xl">Personal info</h2>
          <input
            value={profileForm.firstName}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 p-3"
            placeholder="First name"
            required
          />
          <input
            value={profileForm.lastName}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 p-3"
            placeholder="Last name"
            required
          />
          <input
            value={user?.email || ""}
            className="w-full rounded-xl border border-slate-200 p-3 bg-slate-100"
            placeholder="Email"
            disabled
          />
          <button type="submit" className="rounded-xl bg-brand-700 px-4 py-3 font-semibold text-white">
            Save profile
          </button>
        </motion.form>

        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          onSubmit={submitPassword}
          className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-glow space-y-3"
        >
          <h2 className="font-heading text-2xl">Security</h2>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(event) =>
              setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-200 p-3"
            placeholder="Current password"
            required
          />
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 p-3"
            placeholder="New password"
            required
          />
          <button type="submit" className="rounded-xl bg-ink px-4 py-3 font-semibold text-white">
            Change password
          </button>
        </motion.form>
      </div>

      {user?.role !== "admin" && (
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 isolate rounded-2xl border border-white/60 bg-white/90 p-5 shadow-glow space-y-3"
        >
          <h2 className="font-heading text-2xl">My reservations</h2>

          {loadingReservations && <p className="text-slate-600">Loading reservations...</p>}

          {!loadingReservations && reservations.length === 0 && (
            <p className="text-slate-600">You do not have any reserved books yet.</p>
          )}

          {!loadingReservations && reservations.length > 0 && (
            <div className="space-y-3">
              {reservations.map((reservation) => {
                const book = reservation.book || {};
                const reservationId = reservation.id || reservation._id;

                return (
                  <article
                    key={reservationId}
                    className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-ink">{book.title}</p>
                      <p className="text-sm text-slate-600">
                        {book.author} • {book.publishedYear}
                      </p>
                      <p className="mt-1 inline-block rounded-lg bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700">
                        {book.genre?.name ?? "Unknown genre"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-800"
                      onClick={() => cancelReservation(reservationId)}
                    >
                      Cancel reservation
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </motion.section>
      )}
    </section>
  );
}
