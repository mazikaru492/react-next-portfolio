"use client";

import { useState, useEffect, ReactNode } from "react";

interface DesktopOnlyProps {
  children: ReactNode;
}

export default function DesktopOnly({ children }: DesktopOnlyProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // 768px以上をPCとして扱う
      setIsDesktop(window.innerWidth > 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (!isDesktop) {
    return null;
  }

  return <>{children}</>;
}
