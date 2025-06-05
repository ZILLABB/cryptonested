"use client";

import { useAuth } from "../../../contexts/AuthContext";
import { Header } from "./Header";

export function HeaderWrapper() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  // Log authentication state for debugging
  console.log("HeaderWrapper - Auth state:", isAuthenticated);
  console.log("HeaderWrapper - User:", user?.email);
  
  return <Header isAuthenticated={isAuthenticated} />;
}
