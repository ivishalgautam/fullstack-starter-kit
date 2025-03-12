"use client";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-client-provider";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();

  const getContent = () => {
    // Array of all the paths that don't need the layout
    if (["/login", "/signup", "/unauthorized"].includes(pathname)) {
      return children;
    }

    return (
      <AuthProvider>
        <QueryProvider>
          <div className="min-h-[calc(100vh-135px)]">{children}</div>
        </QueryProvider>
      </AuthProvider>
    );
  };

  return <div className="bg-gray-50 min-h-screen">{getContent()}</div>;
}
