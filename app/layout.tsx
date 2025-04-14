import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import { Special_Elite } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const specialElite = Special_Elite({
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang="en">
        <head />
        <body
          className={clsx(
            "min-h-screen bg-background font-sans antialiased",
            specialElite.className
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <>
              <Navbar />
              <main className="flex">{children}</main>
            </>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
