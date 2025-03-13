"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Home() {
  const { user, isUserLoading } = useAuth();
  const { data, isLoading, error, isError } = useQuery({
    queryFn: async () => http().get("/banners"),
    queryKey: ["banners"],
  });

  if (isLoading) return "loading...";
  if (isError) return error?.message ?? "Something went wrong!";

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {isUserLoading ? (
        "User loading..."
      ) : (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      )}
      <Link className={cn(buttonVariants({}))} href={"/products"}>
        Go to products
      </Link>
    </div>
  );
}
