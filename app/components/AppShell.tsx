"use client";

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ReserveName from "./Form";
import NavBar, { NavState } from "./NavBar";

const navItems = [
  { label: "Shop", href: "/shop" },
  { label: "Collection", href: "/collection" },
  { label: "Events", href: "/events" },
];

const NAV_ANIMATION_MS = 600;
const NAV_MOUNT_BUFFER_MS = 240;

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const initialNavState: NavState = pathname && pathname !== "/" ? "mounted" : "initial";
  const [navState, setNavState] = useState<NavState>(initialNavState);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isHome = pathname === "/";

  const ensureMounted = useCallback(() => {
    setNavState((prev) => (prev === "mounted" ? prev : "mounted"));
  }, []);

  const startPageTransition = useCallback((navigate?: () => void, duration = NAV_ANIMATION_MS) => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    setIsPageTransitioning(true);
    transitionTimerRef.current = setTimeout(() => {
      navigate?.();
      setIsPageTransitioning(false);
      transitionTimerRef.current = null;
    }, duration);
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const effectiveNavState: NavState = useMemo(() => {
    if (navState === "mounted") {
      return "mounted";
    }

    return pathname && pathname !== "/" ? "mounted" : "initial";
  }, [navState, pathname]);

  const handleNavLinkSelect = useCallback(
    (href: string) => {
      if (href === pathname) {
        return;
      }

      setIsNewsletterOpen(false);

      if (effectiveNavState === "initial") {
        ensureMounted();
        startPageTransition(
          () => {
            router.push(href);
          },
          NAV_ANIMATION_MS + NAV_MOUNT_BUFFER_MS
        );
        return;
      }

      startPageTransition(() => {
        router.push(href);
      });
    },
    [effectiveNavState, ensureMounted, pathname, router, startPageTransition]
  );

  const handleNewsletterToggle = useCallback(() => {
    ensureMounted();
    setIsNewsletterOpen((prev) => !prev);
  }, [ensureMounted]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black p-4 font-sans text-white">
      {/* <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/cart.mov"
        autoPlay
        muted
        loop
        playsInline
      /> */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" aria-hidden />

      <NavBar
        items={navItems}
        navState={effectiveNavState}
        onNavLinkSelect={handleNavLinkSelect}
        isNewsletterOpen={isNewsletterOpen}
        onNewsletterToggle={handleNewsletterToggle}
      />

      <main
        className={`relative z-10 flex min-h-[calc(100vh-2rem)] justify-center ${
          isHome ? "items-center" : "items-start pt-48"
        }`}
      >
        <div
          className={`w-full max-w-4xl transition-opacity duration-700 ${
            isPageTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {children}
        </div>
      </main>

      <div
        className={`fixed left-1/2 top-1/2 z-20 w-full max-w-3xl transition-[transform,opacity] duration-700 ease-out ${
          isNewsletterOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ transform: `translate(-50%, ${isNewsletterOpen ? "-50%" : "120%"})` }}
      >
        <ReserveName />
      </div>

      {/* Mobile overlay */}
      <div className="mobile-overlay">
        <div className="text-center text-lg">
          This site is only designed for desktop at the moment
        </div>
      </div>
    </div>
  );
}
