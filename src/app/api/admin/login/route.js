import { NextResponse } from "next/server";

export async function GET(request) {
  const session = request.cookies.get("admin_session");
  const stay = request.cookies.get("admin_stay_logged_in");
  if ((session && session.value === "authenticated_funmi") || (stay && stay.value === "true")) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { username, password, rememberMe, autoResume } = body;

    // Auto-resume session if stay_logged_in is active
    if (autoResume) {
      const stayCookie = request.cookies.get("admin_stay_logged_in");
      if (stayCookie?.value === "true") {
        const response = NextResponse.json({ success: true, autoResumed: true });
        const forwardedProto = request.headers.get("x-forwarded-proto");
        const isHttps = forwardedProto === "https" || request.url.startsWith("https://");
        const maxAgeSeconds = 60 * 60 * 24 * 365;
        const expiresDate = new Date(Date.now() + maxAgeSeconds * 1000);
        const cookieOpts = {
          secure: isHttps,
          sameSite: "lax",
          path: "/",
          maxAge: maxAgeSeconds,
          expires: expiresDate,
        };
        response.cookies.set("admin_session", "authenticated_funmi", { ...cookieOpts, httpOnly: true });
        response.cookies.set("admin_stay_logged_in", "true", { ...cookieOpts, httpOnly: false });
        return response;
      }
    }

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

    // Set auth cookie safely: only use secure if actually running over HTTPS
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const isHttps = forwardedProto === "https" || request.url.startsWith("https://");

    // 1-Year (365 days) for stay logged in, otherwise 30 days
    const maxAgeSeconds = rememberMe ? 60 * 60 * 24 * 365 : 60 * 60 * 24 * 30;
    const expiresDate = new Date(Date.now() + maxAgeSeconds * 1000);

    const cookieOptions = {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
      expires: expiresDate,
    };

    response.cookies.set("admin_session", "authenticated_funmi", cookieOptions);
    
    // Also set a readable stay-logged-in indicator cookie for client-side state
    response.cookies.set("admin_stay_logged_in", rememberMe ? "true" : "false", {
      httpOnly: false,
      secure: isHttps,
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
      expires: expiresDate,
    });

    return response;
  } catch (err) {
    console.error("Admin Login Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
