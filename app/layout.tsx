import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATP Task 1",
  description: "NextJS Task 1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
