import type { Metadata } from "next";
import "../globals.css";
import Dashboard from "@/components/Dashboard";
import { ReactQueryProvider } from "@/lib/react-query";
export const metadata: Metadata = {
  title: "Attendace | Admin",
  description: "Attendances and leave management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider pageProps={{}}>
          <Dashboard>{children}</Dashboard>
    </ReactQueryProvider>
  );
}
