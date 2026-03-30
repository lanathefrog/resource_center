import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_MODE, getApi } from "../api/client";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [apiMode, setApiMode] = useState(() => localStorage.getItem("apiMode") || API_MODE.REST);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const api = useMemo(() => getApi(apiMode), [apiMode]);

  useEffect(() => {
    localStorage.setItem("apiMode", apiMode);
  }, [apiMode]);

  async function refreshMe() {
    setLoadingUser(true);
    try {
      const meData = await api.me();
      setUser(meData.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiMode]);

  async function login(payload) {
    const data = await api.login(payload);
    setUser(data.user);
    return data;
  }

  async function register(payload) {
    return api.register(payload);
  }

  async function logout() {
    await api.logout();
    setUser(null);
  }

  async function updateProfile(payload) {
    const data = await api.updateProfile(payload);
    if (data.user) {
      setUser(data.user);
    }
    return data;
  }

  async function changePassword(payload) {
    const data = await api.changePassword(payload);
    if (data.user) {
      setUser(data.user);
    }
    return data;
  }

  const value = {
    api,
    apiMode,
    setApiMode,
    user,
    loadingUser,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshMe
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
}
