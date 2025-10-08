"use client";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-client-provider";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { SiteHeader } from "../site-header";
import RoleContext from "@/providers/role-context";

export default function Layout({ children }) {
  const pathname = usePathname();
  const getContent = () => {
    if (["/", "/signup", "/unauthorized"].includes(pathname)) {
      return children;
    }

    return (
      <AuthProvider>
        <RoleContext>
        <div className="[--header-height:calc(--spacing(14))]">
          <SidebarProvider className="flex flex-col">
            <SiteHeader />
            <div className="flex flex-1">
              <AppSidebar />
              <SidebarInset>
                <div className="p-4">{children}</div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
        </RoleContext>
      </AuthProvider>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <QueryProvider>{getContent()}</QueryProvider>
    </div>
  );
}
