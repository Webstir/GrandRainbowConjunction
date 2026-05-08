"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faBookOpen,
  faCircleQuestion,
  faDollarSign,
  faEnvelope,
  faImage,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { GOFUNDME_SAVE_RICO_URL } from "@/lib/support";

config.autoAddCss = false;

type NavItem = {
  href: string;
  label: string;
  icon: IconDefinition;
  external?: boolean;
};

const navItems: readonly NavItem[] = [
  { href: "/rainbow-gallery", label: "Rainbow wall", icon: faImage },
  { href: GOFUNDME_SAVE_RICO_URL, label: "Tip", icon: faDollarSign, external: true },
  { href: "/subscribe", label: "Subscribe", icon: faEnvelope },
  { href: "/faqs", label: "FAQs", icon: faCircleQuestion },
  { href: "/daily-logs", label: "Daily logs", icon: faBookOpen },
];

export function MobileUtilityNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const nextY = window.scrollY;

      if (nextY <= 4) {
        setIsVisible(true);
      } else if (nextY > lastY.current + 8) {
        setIsVisible(false);
      } else if (nextY < lastY.current - 8) {
        setIsVisible(true);
      }

      lastY.current = nextY;
    };

    lastY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-4 z-50 transition-all duration-300 lg:hidden ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      } ${isCollapsed ? "left-2.5" : "left-2.5 right-2.5"}`}
      aria-hidden={!isVisible}
    >
      {isCollapsed ? (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 rounded-full border border-(--chapter-muted) bg-(--chapter-card)/95 px-2 py-1.5 text-sm text-(--chapter-muted-fg) shadow-lg backdrop-blur-sm"
          aria-label="Expand menu"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-(--chapter-muted) text-(--chapter-accent)">
            <FontAwesomeIcon icon={faBars} />
          </span>
          <span className="pr-2 font-medium">Menu</span>
        </button>
      ) : (
        <div className="relative rounded-full border border-(--chapter-muted) bg-(--chapter-card)/95 p-1.5 shadow-xl backdrop-blur-sm">
          <nav className="grid grid-cols-5 gap-1" aria-label="Mobile chapter utilities">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex min-w-0 flex-col items-center gap-1 rounded-full border border-(--chapter-muted) px-1 py-2 text-center text-[10px] leading-tight text-(--chapter-muted-fg) hover:text-(--chapter-accent)"
              >
                <FontAwesomeIcon icon={item.icon} className="text-sm text-(--chapter-accent)" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="absolute right-[-15px] top-1/2 flex h-10 w-8 -translate-y-1/2 items-center justify-center rounded-r-full border border-l-0 border-(--chapter-muted) bg-(--chapter-card) text-(--chapter-muted-fg) shadow-md hover:text-(--chapter-accent)"
            aria-label="Minimize menu"
          >
            <FontAwesomeIcon icon={faMinus} className="text-sm text-(--chapter-accent)" />
          </button>
        </div>
      )}
    </div>
  );
}
