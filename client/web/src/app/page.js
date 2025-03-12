"use client";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function Home() {
  const { data, isPending, error, isError } = useQuery({
    queryFn: async () => {
      return await http().get("/banners");
    },
    queryKey: ["banners"],
  });

  if (isPending) return "loading...";
  if (isError) return error?.message ?? "Something went wrong!";

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
