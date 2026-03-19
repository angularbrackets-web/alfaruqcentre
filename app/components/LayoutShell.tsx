"use client";
import { usePathname } from "next/navigation";
import NavbarV3 from "../home-v3/NavbarV3";
import FooterV3 from "../home-v3/FooterV3";
import { useNavHeight } from "../hooks/useNavHeight";

function NavbarSpacer() {
  const navHeight = useNavHeight();
  return <div style={{ height: navHeight }} />;
}

const BARE_ROUTES = ["/qr-card", "/admin"];

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
  bodyClassName?: string;
}) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));

  if (bare) {
    return <>{children}</>;
  }

  return (
    <>
      <NavbarV3 />
      <main className="flex-1 flex flex-col min-h-0">
        <NavbarSpacer />
        {children}
      </main>
      <FooterV3 />
    </>
  );
}
