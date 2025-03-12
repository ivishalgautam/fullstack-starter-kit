import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const PRIVATE_ROUTES = ["/dashboard", "/admin", "/"];

export default async function middleware(req) {
  //   const token = req.cookies.get("refresh_token")?.value;
  //   const url = req.nextUrl.clone();
  //   const pathname = url.pathname;

  //   if (token && AUTH_ROUTES.some((path) => pathname.startsWith(path))) {
  //     url.pathname = "/";
  //     return NextResponse.redirect(url);
  //   }

  //   if (!token && PRIVATE_ROUTES.some((path) => pathname.startsWith(path))) {
  //     url.pathname = "/login";
  //     return NextResponse.redirect(url);
  //   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
