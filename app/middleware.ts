import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function middleware(req: NextRequest) {
  // Create the Supabase client (do not await)
  const supabase = await createClient();

  const url = req.nextUrl.clone();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser(); // Await here for the async function

  // If user is not authenticated, redirect to login
  if (!user) {
    url.pathname = "/sign-in"; // Redirect to login
    return NextResponse.redirect(url);
  }

  // Check if the profile exists
  const { data: profile } = await supabase
    .from("profile") // Replace 'profile' with your table name
    .select("*")
    .eq("user_id", user.id)
    .single();

  console.log(profile);

  // If the profile does not exist, redirect to profile creation page
  if (!profile) {
    url.pathname = "/home/profile"; // Redirect to the profile creation page
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // Allow access if authenticated and profile exists
}

export const config = {
  matcher: "/home/:path*", // Apply middleware only to `/home` and its subpaths
};
