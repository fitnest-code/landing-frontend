"use client";

import { useEffect, useRef, useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import Logo from "./Logo";
import NavbarRight from "./NavbarRight";
import Navication from "./Navication";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const node = navRef.current;
    if (!node) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--fn-navbar-height",
        `${node.offsetHeight}px`,
      );
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={navRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-border-muted bg-surface transition-[box-shadow,background-color] duration-300",
        isScrolled && "bg-surface/90 shadow-sm backdrop-blur-md",
      )}
    >
      <header className="mx-auto grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 overflow-visible px-5 py-5 md:px-10 md:py-6 xl:px-20">
        <div className="justify-self-start overflow-visible">
          <Logo />
        </div>
        <Navication />
        <div className="flex items-center justify-end gap-3 md:gap-5">
          <NavbarRight />
          <HamburgerMenu />
        </div>
      </header>
    </div>
  );
};

export default Navbar;
