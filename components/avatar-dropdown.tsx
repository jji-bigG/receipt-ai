/**
 * v0 by Vercel.
 * @see https://v0.dev/t/FsAPpcfMOBx
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/app/actions";
import Link from "next/link";

export default async function AvatarDropdown() {
  // get the user from supabase
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9" style={{ cursor: "pointer" }}>
          <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
          <AvatarFallback>JP</AvatarFallback>
          <span className="sr-only">Toggle user menu</span>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href="/home/profile">
          <DropdownMenuItem>My Account</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem>
            <button type="submit">Sign out</button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
