import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username, password, rememberMe } = await request.json();

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
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    };

    // If rememberMe is checked, persist for 30 days; otherwise session cookie
    if (rememberMe) {
      cookieOptions.maxAge = 60 * 60 * 24 * 30; // 30 days
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
