import React from "react";
import { cn } from "@/lib/utils"; // Adjust this import based on your utils

export function List({
  children,
  className,
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("list-none p-0 m-0 space-y-2", className)}>{children}</ul>
  );
}

export function ListItem({
  children,
  className,
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn("flex items-center gap-3", className)}>{children}</li>
  );
}
