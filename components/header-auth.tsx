import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import AvatarDropdown from "./avatar-dropdown";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // get the profile
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  console.log(error);

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              ISSUE WITH ENVIRONMENT VARIABLES! maybe update .env.local file
              with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-6">
      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {[
          { href: "/group", label: "My Group" },
          { href: "/upload", label: "Upload Receipt" },
          { href: "/requests", label: "Grocery Requests" },
        ].map(({ href, label }) => (
          <Button key={href} asChild size="sm" variant="ghost">
            <Link href={"/home" + href}>{label}</Link>
          </Button>
        ))}
      </div>
      {/* Avatar form with the signout later */}
      <AvatarDropdown profile={profile} />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
