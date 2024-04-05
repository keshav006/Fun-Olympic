import Providers from "@/lib/providers";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import "../globals.css";
import SidebarWrapper from "@/components/Sidebar";

export const metadata = {
  title: "FunOlympic | Admin",
  description: "Dashboard for FunOlympic Admin",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(options);
  return (
    <html lang="en" className="h-full">
      <body className={"h-full"}>
        <Providers authSession={session}>
          <SidebarWrapper>{children}</SidebarWrapper>
        </Providers>
      </body>
    </html>
  );
}
