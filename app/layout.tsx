
import { ThemeProvider } from "next-themes";
import Providers from "./providers";
import "./globals.css";
import AuthLayout from "./components/AuthLayout";
import { PriceProvider } from "../contexts/PriceContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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