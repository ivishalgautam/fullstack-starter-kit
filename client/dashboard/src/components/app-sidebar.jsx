"use client";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { sidebarData } from "@/data/routes";
import { useAuth } from "@/providers/auth-provider";
import { useMemo } from "react";
import { SidebarUser } from "./sidebar-user";
import { Skeleton } from "./ui/skeleton";

export function AppSidebar({ ...props }) {
  const { user, isUserLoading } = useAuth();
  const filteredRoutes = useMemo(() => {
    return sidebarData
      .filter((route) => route.roles.includes(user?.role))
      .map((item) => {
        return {
          ...item,
          items: item.items.filter(
            (item) => item.roles.includes(user?.role) && item.isVisible,
          ),
        };
      });
  }, [user]);

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      {...props}
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <SidebarContent>
        <NavMain items={filteredRoutes} />
      </SidebarContent>
      {/* <SidebarFooter>
        {isUserLoading ? (
          <Skeleton className={"h-12 bg-white/5"} />
        ) : (
          <SidebarUser user={user} />
        )}
      </SidebarFooter> */}
    </Sidebar>
  );
}
