"use client";

import Image from "next/image";
import { MouseEvent, useMemo, useState, useEffect, useRef } from "react";

export type NavState = "initial" | "mounted";

interface NavItem {
  label: string;
  href: string;
}

interface NavBarProps {
  items: NavItem[];
  navState: NavState;
  onNavLinkSelect: (href: string) => void;
  isNewsletterOpen: boolean;
  onNewsletterToggle: () => void;
}

export default function NavBar({
  items,
  navState,
  onNavLinkSelect,
  isNewsletterOpen,
  onNewsletterToggle,
}: NavBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const newsletterButtonRef = useRef<HTMLButtonElement>(null);
  const [newsletterButtonWidth, setNewsletterButtonWidth] = useState<number | null>(null);
  
  const navMaskStyle = useMemo(
    () => ({
      WebkitMaskImage: "url('/nav-mask.svg')",
      maskImage: "url('/nav-mask.svg')",
      WebkitMaskSize: "100% 100%",
      maskSize: "100% 100%",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
    }),
    []
  );

  // Measure newsletter button width on mount
  useEffect(() => {
    if (newsletterButtonRef.current && newsletterButtonWidth === null) {
      const width = newsletterButtonRef.current.offsetWidth;
      setNewsletterButtonWidth(width);
    }
  }, [newsletterButtonWidth]);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    setIsDrawerOpen(false);
    onNavLinkSelect(href);
  };

  const isMountedState = navState === "mounted";

  const containerWidth = isMountedState ? "max-w-[360px]" : "max-w-6xl";
  const chromeStyles = isMountedState
    ? "border border-white/25 bg-black/60 shadow-[0_30px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
    : "border border-transparent bg-transparent shadow-none backdrop-blur-none";
  const drawerVisible = isMountedState && isDrawerOpen;
  const containerHeight = drawerVisible ? "h-[520px]" : "h-[80px]";

  useEffect(() => {
    if (!drawerVisible) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [drawerVisible]);

  return (
    <div
      className={`fixed left-1/2 top-0 z-30 w-full ${containerWidth} ${containerHeight} rounded-[32px] px-6 py-4 ${chromeStyles}`}
      style={{
        transform: isMountedState 
          ? 'translate(-50%, 1rem)' 
          : 'translate(-50%, calc(50vh - 50%))',
        transition: drawerVisible
          ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.48s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.48s ease-out 0.24s, background-color 0.48s ease-out 0.24s, box-shadow 0.48s ease-out 0.24s, backdrop-filter 0.48s ease-out 0.24s'
          : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.48s cubic-bezier(0.4, 0, 0.2, 1) 0.3s, border-color 0.48s ease-out 0.24s, background-color 0.48s ease-out 0.24s, box-shadow 0.48s ease-out 0.24s, backdrop-filter 0.48s ease-out 0.24s',
      }}
    >
      <div className="relative h-full w-full">
        <div className="relative z-10 flex w-full items-center gap-4 text-sm uppercase tracking-[0.2em] text-white/80">
          <div
            className="flex flex-shrink-0 items-center"
            style={{ 
              transform: `scale(${isMountedState ? 0.66 : 1})`, 
              transformOrigin: "left center",
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <Image src="/logo.png" alt="Cart logo" height={42} width={170} priority className="invert" />
          </div>

          <div
            className={`relative ml-6 flex min-w-0 items-center justify-start ${
              isMountedState ? "pointer-events-none opacity-0 flex-[0_0_0%]" : "flex-1 opacity-100"
            }`}
            style={{
              transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.42s ease-out'
            }}
          >
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
              <div className="h-24 w-full bg-black/30" style={navMaskStyle} />
            </div>
            <nav aria-label="Primary" className="relative z-10 w-full">
              <NavList orientation="horizontal" items={items} onNavClick={handleNavClick} />
            </nav>
          </div>

          <div className="ml-auto flex flex-shrink-0 items-center justify-end gap-3">
            <button
              ref={newsletterButtonRef}
              type="button"
              onClick={onNewsletterToggle}
              aria-pressed={isNewsletterOpen}
              aria-haspopup="dialog"
              aria-expanded={isNewsletterOpen}
              className={`group relative flex items-center justify-center gap-2 rounded-full border border-white/40 bg-black/60 text-xs font-semibold tracking-[0.25em] text-white/80 transition hover:border-white hover:text-white ${
                isMountedState ? "pointer-events-none" : ""
              }`}
              style={{
                paddingLeft: isMountedState ? "0" : "1.5rem",
                paddingRight: isMountedState ? "0" : "1.5rem",
                paddingTop: isMountedState ? "0" : "0.75rem",
                paddingBottom: isMountedState ? "0" : "0.75rem",
                width: isMountedState ? "0px" : newsletterButtonWidth !== null ? `${newsletterButtonWidth}px` : "auto",
                opacity: isMountedState ? 0 : 1,
                overflow: "hidden",
                transition: newsletterButtonWidth !== null 
                  ? "width 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.42s ease-out, padding 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                  : "none",
              }}
            >
              <span className="absolute inset-0 rounded-full shadow-[0_0_25px_rgba(0,0,0,0.45)]" aria-hidden />
              <span className="relative flex items-center gap-3 whitespace-nowrap">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-base font-medium text-white">
                  +
                </span>
                Stay Up To Date
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              aria-label="Toggle navigation drawer"
              aria-expanded={drawerVisible}
              className={`relative flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white ${
                isMountedState ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{
                transition: 'opacity 0.42s ease-out 0.3s'
              }}
            >
              <span className="sr-only">Toggle navigation</span>
              <span
                className={`absolute h-0.5 w-6 bg-current transition-transform duration-300 ${
                  drawerVisible ? "rotate-45" : "-translate-y-1"
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-current transition-transform duration-300 ${
                  drawerVisible ? "-rotate-45" : "translate-y-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div
          className={`absolute inset-0 z-0 flex w-full flex-col items-center pt-16 text-center text-white ${
            isMountedState && isDrawerOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          style={{
            transition: isDrawerOpen
              ? 'opacity 0.3s ease-out 0.48s'
              : 'opacity 0.3s ease-out'
          }}
        >
          <div className="flex w-full flex-grow items-center justify-center">
            <nav aria-label="Primary">
              <NavList orientation="vertical" items={items} onNavClick={handleNavClick} />
            </nav>
          </div>

          <div className="mb-6 flex flex-col items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/70">
            <div className="flex gap-6">
              {[
                { label: "Privacy", href: "/privacy" },
                { label: "Imprint", href: "/imprint" },
                { label: "ToS", href: "/terms" },
              ].map((link) => (
                <a key={link.label} href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="text-[11px] text-white/60">© Cart Dept 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NavListProps {
  orientation: "horizontal" | "vertical";
  items: NavItem[];
  onNavClick: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
}

function NavList({ orientation, items, onNavClick }: NavListProps) {
  return (
    <ul
      className={`flex items-center justify-center gap-4 text-xl font-medium uppercase tracking-[0.35em] ${
        orientation === "horizontal" ? "flex-row px-10" : "flex-col"
      }`}
    >
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            onClick={(event) => onNavClick(event, item.href)}
            className="text-white/80 transition hover:text-white"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
