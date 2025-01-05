import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Initialize Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Step 1: Refresh session (if necessary)
    const { data: user, error: userError } = await supabase.auth.getUser();

    // Step 2: Handle protected routes
    if (
      request.nextUrl.pathname.startsWith("/home") &&
      request.nextUrl.pathname !== "/home/profile"
    ) {
      // If there's a session error, redirect to sign-in
      if (userError || !user) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      // Check if the user has a profile
      const { data: profile, error: profileError } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", user.user.id)
        .single();

      if (profileError || !profile) {
        return NextResponse.redirect(new URL("/home/profile", request.url));
      }
    }

    // Step 3: Handle the root route (if logged in, redirect to /home)
    if (request.nextUrl.pathname === "/" && user) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    // Allow the request to proceed
    return response;
  } catch (error) {
    console.error("Middleware error:", error);

    // Fallback in case of an error
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

// Middleware matcher configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
