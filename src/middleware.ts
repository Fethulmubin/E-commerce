import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./lib/isValidPassword";

export async function middleware(req: NextRequest) {
  if ((await isAuthenticated(req)) == false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }
}

export async function isAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get("Authorization") || req.headers.get("authorization");
  if (authHeader == null) return false;
  const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

    // isValidPassword(password, 'Fethulmubin@123')
    

return username === process.env.ADMIN_USERNAME && (await isValidPassword(password, process.env.HASHED_PASSWORD as string));

}
export const config = {
  matcher: ["/admin/:path*"],
};
