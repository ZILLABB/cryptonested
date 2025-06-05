"use client";

import { forwardRef } from 'react';

// Simple wrapper for Next.js Link
export const Link = forwardRef<HTMLAnchorElement, any>(({ children, ...props }, ref) => {
  const NextLink = require('next/link').default;
  return (
    <NextLink ref={ref} {...props}>
      {children}
    </NextLink>
  );
});
Link.displayName = 'Link';

// Simple wrapper for Next.js Image
export const Image = forwardRef<HTMLImageElement, any>(({ alt = '', ...props }, ref) => {
  const NextImage = require('next/image').default;
  return <NextImage ref={ref} alt={alt} {...props} />;
});
Image.displayName = 'Image';
