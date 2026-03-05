"use client";
import { usePathname } from "next/navigation";
import NavbarV3 from "../home-v3/NavbarV3";
import FooterV3 from "../home-v3/FooterV3";

const BARE_ROUTES = ["/qr-card"];

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
        {children}
      </main>
      <FooterV3 />
    </>
  );
}
