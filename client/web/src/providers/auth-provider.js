"use client";
import { createContext, useState, useLayoutEffect } from "react";
import http from "@/utils/http";
import { usePathname } from "next/navigation";
import { endpoints } from "@/utils/endpoints";
import axios from "axios";

export const MainContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [isUserLoading, setIsUserLoading] = useState(true);
  const pathname = usePathname();

  useLayoutEffect(() => {
    setIsUserLoading(true);
    async function fetchData() {
      await axios
        .get("/api/profile")
        .then((data) => {
          setUser(data);
          setIsUserLoading(false);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch((error) => {
          console.log({ error });
          setIsUserLoading(false);
        });
    }
    if (!["/login"].includes(pathname)) {
      fetchData();
    } else {
      setIsUserLoading(false);
    }
  }, [pathname]);

  return (
    <MainContext.Provider
      value={{
        user,
        setUser,
        isUserLoading,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export default AuthProvider;
