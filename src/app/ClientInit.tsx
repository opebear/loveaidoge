"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initApp, cleanupApp } from "./main";

export default function ClientInit() {
  const pathname = usePathname();

  useEffect(() => {
    initApp();
    return () => {
      cleanupApp();
    };
  }, [pathname]);

  return null;
}
