
import { ThemeProvider } from "next-themes";
import Providers from "./providers.js";
import { fontVariables } from "./lib/fonts.js";
import "./globals.css";
import AuthLayout from "./components/AuthLayout.js";
import { PriceProvider } from "../contexts/PriceContext.js";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body className="min-h-screen font-sans" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <PriceProvider>
              <AuthLayout>
                <main>
                  {children}
                </main>
              </AuthLayout>
            </PriceProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}