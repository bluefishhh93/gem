"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PHProvider } from "./posthog-provider";
export function Providers({ children }: { children: ReactNode }) {
  return (
    <PHProvider>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ThemeProvider>
    </PHProvider>
  );
}
