import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin")
      return NextResponse.rewrite(
        new URL("/auth/signin?message=Nemate dozvolu za pristup admin stranici!", req.url)
      );
    if (req.nextUrl.pathname.startsWith("/user") && req.nextauth.token?.role !== "user")
      return NextResponse.rewrite(
        new URL("/auth/signin?message=Nemate dozvolu za pristup user stranici!", req.url)
      );
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};