"use client";
import { useAuth } from "@/providers/auth-provider";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export default function Home() {
  const { user, isUserLoading } = useAuth();
  const { data, isPending, error, isError } = useQuery({
    queryFn: async () => {
      return await http().get("/banners");
    },
    queryKey: ["banners"],
  });

  if (isPending) return "loading...";
  if (isError) return error?.message ?? "Something went wrong!";

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {isUserLoading ? (
        "User loading..."
      ) : (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      )}
    </div>
  );
}
