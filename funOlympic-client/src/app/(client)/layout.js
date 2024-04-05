import "../globals.css";
import Footer from "@/components/footer";
import CenterNavbar from "@/components/centerNavbar";
import Providers from "@/lib/providers";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { NavbarKsav } from "@/components/navbar";

export const metadata = {
  title: "FunOlympic",
  description: "An app for fun Olympic games",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(options);
  return (
    <html lang="en" className="h-full">
      <body className={"h-full"}>
        <Providers authSession={session}>
          {/* <CenterNavbar /> */}
          <NavbarKsav />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
