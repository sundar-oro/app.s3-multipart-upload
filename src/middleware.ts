import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard","/myfiles","/categories"];

const unProtectedRoutes = ["/"];
function containsSubstring(inputString: string, substrings: Array<string>) {
  return substrings.some((substring) => inputString.includes(substring));
}

const isAuthenticated = (req: NextRequest) => {
  const loggedIn = req.cookies.get("token");
  if (loggedIn) return true;
  return false;
};

export default function middleware(req: NextRequest) {
  if (
    !isAuthenticated(req) &&
    containsSubstring(req.nextUrl.pathname, protectedRoutes)
  ) {
    const absoluteURL = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

}
