"use client";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-client-provider";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";

export default function Layout({ children }) {
  const pathname = usePathname();
  const getContent = () => {
    // Array of all the paths that don't need the layout
    if (["/", "/signup", "/unauthorized"].includes(pathname)) {
      return children;
    }

    return (
      <AuthProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full bg-gray-100">
            <SidebarTrigger />
            <div className="min-h-[calc(100vh-135px)]">{children}</div>
          </main>
        </SidebarProvider>
      </AuthProvider>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <QueryProvider>{getContent()}</QueryProvider>
    </div>
  );
}
