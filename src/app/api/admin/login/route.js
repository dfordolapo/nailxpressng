import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { username, password, rememberMe } = body;

    // Verify credentials (case-insensitive for username)
    const isValidUser = username?.trim().toLowerCase() === "funmi";
    const isValidPass = password === "nailexpress.ng";

    if (!isValidUser || !isValidPass) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    // Set auth cookie
    const isProduction = process.env.NODE_ENV === "production";
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const isHttps = forwardedProto ? forwardedProto === "https" : isProduction;

    const cookieOptions = {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      path: "/",
    };

    // If rememberMe is checked, persist for 60 days; otherwise 1 day
    if (rememberMe) {
      const maxAge = 60 * 60 * 24 * 60; // 60 days
      cookieOptions.maxAge = maxAge;
      cookieOptions.expires = new Date(Date.now() + maxAge * 1000);
    } else {
      const maxAge = 60 * 60 * 24 * 1; // 1 day
      cookieOptions.maxAge = maxAge;
      cookieOptions.expires = new Date(Date.now() + maxAge * 1000);
    }

    response.cookies.set("admin_session", "authenticated_funmi", cookieOptions);

    return response;
  } catch (err) {
    console.error("Admin Login Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
