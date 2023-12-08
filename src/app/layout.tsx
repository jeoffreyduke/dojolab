import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "./components/Layout/LayoutWrapper";

export const metadata: Metadata = {
  title: "DojoLab",
  description: "Your business companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper children={children} />
      </body>
    </html>
  );
}
