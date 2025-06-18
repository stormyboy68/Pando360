import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { VersionRoute } from "./bootstrap/const";

export function middleware(request: NextRequest) {
  const token = request.cookies.has("access_token");
  const protectedRoutes = [`${VersionRoute}/login`];

  if (token && protectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  const RoutesWTResult = RoutesWT(request, token);
  if (RoutesWTResult) {
    return RoutesWTResult;
  }
}

const RoutesWT = (request: NextRequest, token: boolean) => {
  const protectedRoutesWT = ['/','/admins'];
  if (!token && protectedRoutesWT.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL(`${VersionRoute}/login`, request.url));
  }
  return false;
};
