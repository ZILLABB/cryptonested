"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "../contexts/AuthContext";
import { InactivityProvider } from "../contexts/InactivityContext";
import { CryptoPricesProvider } from "../contexts/CryptoPricesContext";
import { Toaster } from "./components/ui/toaster";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <InactivityProvider timeout={15 * 60 * 1000} warningTime={60 * 1000}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CryptoPricesProvider>
            {children}
            <Toaster />
          </CryptoPricesProvider>
        </ThemeProvider>
      </InactivityProvider>
    </AuthProvider>
  );
}