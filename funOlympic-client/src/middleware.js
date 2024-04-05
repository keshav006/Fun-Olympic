import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Add whatever paths you want to PROTECT here
const authRoutes = ["/dashboard/*"];
const adminRoutes = ["/admin/*", "/dashboard/*"];

// Function to match the * wildcard character
function matchesWildcard(path, pattern) {
  if (pattern.endsWith("/*")) {
    const basePattern = pattern.slice(0, -2);
    return path.startsWith(basePattern);
  }
  return path === pattern;
}

export async function middleware(request) {
  // Shortcut for our login path redirect
  // Note: you must use absolute URLs for middleware redirects

  const LOGIN = `${process.env.NEXT_PUBLIC_BASE_URL}/login?redirect=${
    request.nextUrl.pathname + request.nextUrl.search
  }`;

  console.log("url", request.nextUrl.pathname);
  if (request.nextUrl.pathname === "/dashboard") {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/users`
    );
  }

  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (
    authRoutes.some((pattern) =>
      matchesWildcard(request.nextUrl.pathname, pattern)
    )
  ) {
    if (!session) {
      return NextResponse.redirect(LOGIN);
    }

    const { user, tokens } = session;

    const token = tokens.accessToken;

    // If no token exists, redirect to login
    if (!token) {
      console.log("Token not found so redirect to login page");
      return NextResponse.redirect(LOGIN);
    }

    if (
      adminRoutes.some((pattern) =>
        matchesWildcard(request.nextUrl.pathname, pattern)
      )
    ) {
      const role = user.role.toLowerCase();
      if (role !== "admin") {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_BASE_URL}/access-denied`
        );
      }
    }
  }

  let redirectToApp = false;
  // Redirect login to app if already logged in
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register"
  ) {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (session) {
      redirectToApp = true;
    } else {
      redirectToApp = false;
    }
  }

  if (redirectToApp) {
    // Redirect to app dashboard
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
  } else {
    // Return the original response unaltered
    return NextResponse.next();
  }
}
