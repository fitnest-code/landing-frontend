"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { addLocaleToPathname, stripLocaleFromPathname } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const Navication = () => {
  const pathname = usePathname();
  const normalizedPathname = stripLocaleFromPathname(pathname || "/");
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hallsPath = addLocaleToPathname("/fitness-centers", locale);
  const fitStorePath = addLocaleToPathname("/fit-market", locale);
  const plansPath = addLocaleToPathname("/offers", locale);
  const bmiPath = addLocaleToPathname("/bmi", locale);
  const partnerPath = addLocaleToPathname("/partner", locale);

  const isRouteActive = (href: string) => {
    const path = stripLocaleFromPathname(href).split("#")[0] || "/";
    if (path === "/") return false;
    return (
      normalizedPathname === path || normalizedPathname.startsWith(`${path}/`)
    );
  };

  const isHallsMenu =
    isRouteActive(hallsPath) || isRouteActive(fitStorePath);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const linkClass = (active: boolean) =>
    cn(
      "relative whitespace-nowrap text-base font-medium leading-7 text-ink transition-colors hover:text-turquoise 2xl:text-lg",
      "after:absolute after:-bottom-1 after:left-1/2 after:h-0.5 after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-turquoise after:transition-all after:duration-300",
      active
        ? "text-turquoise after:w-5 after:opacity-100"
        : "after:w-0 after:opacity-0 hover:after:w-5 hover:after:opacity-100",
    );

  return (
    <nav className="hidden min-w-0 w-full items-center justify-center gap-5 xl:flex 2xl:gap-8">
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="menu"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5",
            linkClass(isHallsMenu),
          )}
        >
          {t.nav.halls}
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
        {open ? (
          <div
            role="menu"
            className="absolute top-full left-1/2 z-20 mt-3 min-w-[200px] -translate-x-1/2 rounded-xl border border-border-muted bg-surface p-2 shadow-lg"
          >
            <Link
              href={hallsPath}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-page hover:text-turquoise",
                isRouteActive(hallsPath) ? "text-turquoise" : "text-ink",
              )}
            >
              {t.nav.halls}
            </Link>
            <Link
              href={fitStorePath}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-page hover:text-turquoise",
                isRouteActive(fitStorePath) ? "text-turquoise" : "text-ink",
              )}
            >
              {t.footer.fitStore}
            </Link>
          </div>
        ) : null}
      </div>

      <Link href={plansPath} className={linkClass(isRouteActive(plansPath))}>
        {t.nav.plans}
      </Link>
      <Link href={bmiPath} className={linkClass(isRouteActive(bmiPath))}>
        {t.nav.bmi}
      </Link>
      <Link
        href={partnerPath}
        className={linkClass(isRouteActive(partnerPath))}
      >
        {t.nav.becomePartner}
      </Link>
    </nav>
  );
};

export default Navication;
