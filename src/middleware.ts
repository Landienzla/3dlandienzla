import { NextRequest, NextResponse } from "next/server";

// Define supported locales
const locales = ["en", "tr"];

// Get the preferred locale based on Accept-Language header
function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("Accept-Language") || "";
  const preferredLocale = acceptLanguage.split(",")[0]; // Get the first language in the list
  // Check if the preferred locale is supported; otherwise default to "en-US"
  return locales.includes(preferredLocale) ? preferredLocale : "tr";
}

// Middleware to handle locale redirection
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Check if the pathname already includes a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  return NextResponse.next();
  // If locale is already present, no redirection is needed
  if (pathnameHasLocale) return;

  // Get the preferred locale based on the request
  const locale = getLocale(request);

  // Redirect to the locale-specific path
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

// Configuration to apply middleware to all paths except internal (_next) paths
export const config = {
  matcher: [
    // Apply to all paths except those starting with _next (internal Next.js paths)
    "/((?!_next).*)",
  ],
};
