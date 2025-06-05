"use client";

import { useAuth } from "../../contexts/AuthContext";
import { HeaderWrapper } from "./ui/HeaderWrapper";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  
  // Set page context for header
  useEffect(() => {
    // Set a data attribute on the body element that the Header component can check
    if (pathname.startsWith('/dashboard') ||
        pathname.startsWith('/portfolio') ||
        pathname.startsWith('/market') ||
        pathname.startsWith('/news') ||
        pathname.startsWith('/profile')) {
      document.body.setAttribute('data-page-context', 'dashboard');
    } else if (pathname === '/' || pathname === '/landing' || pathname.startsWith('/auth/')) {
      document.body.setAttribute('data-page-context', 'landing');
    } else {
      document.body.setAttribute('data-page-context', 'other');
    }

    return () => {
      // Clean up when the component unmounts
      document.body.removeAttribute('data-page-context');
    };
  }, [pathname]);
  
  // Log authentication state for debugging
  useEffect(() => {
    console.log("AuthLayout - Auth state:", !!user);
    console.log("AuthLayout - Current path:", pathname);
  }, [user, pathname]);
  
  return (
    <>
      <HeaderWrapper />
      {children}
    </>
  );
}
