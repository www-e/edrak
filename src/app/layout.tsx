import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // Swapped fonts to Cairo
import { ThemeProvider } from "@/components/theme-provider"; // Import our new provider
import { SnackbarProvider } from "@/components/shared/snackbar-context";
import "./globals.css";

// Configure the Cairo font for our application
const cairoFont = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo", // We can use this in CSS if needed
});

export const metadata: Metadata = {
  // Updated metadata to be more relevant
  title: "Edrak Inspired Landing Page",
  description: "Aspire. Learn. Advance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cairoFont.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SnackbarProvider>
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}