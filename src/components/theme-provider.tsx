"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// We don't need the specific type import. We can let TypeScript infer it.
// This is the most robust solution.
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}