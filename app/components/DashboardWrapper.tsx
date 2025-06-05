"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

// This component will be used to wrap dashboard pages and set the header context
export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const pathname = usePathname();

  // Update the header context based on the current path
  useEffect(() => {
    // Set a data attribute on the body element that the Header component can check
    if (pathname.startsWith('/dashboard') ||
        pathname.startsWith('/portfolio') ||
        pathname.startsWith('/market') ||
        pathname.startsWith('/news')) {
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

  return (
    <div className="px-6 py-8 md:px-8 lg:px-10 max-w-7xl mx-auto">
      {children}
    </div>
  );
}
