"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "../contexts/AuthContext.js";
import { InactivityProvider } from "../contexts/InactivityContext.js";
import { CryptoPricesProvider } from "../contexts/CryptoPricesContext.js";
import { Toaster } from "./components/ui/toaster.js";

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