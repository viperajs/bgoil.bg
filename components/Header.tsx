"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const navItems = [
    { name: "Начало", link: "/" },
    { name: "За нас", link: "/about" },
    { name: "Горива", link: "/products" },
    { name: "Магазин", link: "/shop" },
    { name: "Хотел", link: "/hotel" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <Link href="/" className="relative z-20 mr-4 flex items-center gap-2">
            <img
              src="/bg-oil-logo.webp"
              alt="BG OIL"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton href="/contact" variant="primary">
              Контакти
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <Link
              href="/"
              className="relative z-20 flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <img
                src="/bg-oil-logo.webp"
                alt="BG OIL"
                className="h-7 w-auto object-contain"
              />
            </Link>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative w-full py-2.5 transition-colors ${
                  pathname === item.link
                    ? "text-brand-500"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="block text-base font-medium">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-3 mt-3 pt-3 border-t border-border">
              <NavbarButton
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Контакти
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
