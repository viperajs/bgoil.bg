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

export default function Header() {
  const navItems = [
    {
      name: "Начало",
      link: "/",
    },
    {
      name: "За нас",
      link: "/about",
    },
    {
      name: "Горива",
      link: "/products",
    },
    {
      name: "Магазин",
      link: "/shop",
    },
    {
      name: "Хотел",
      link: "/hotel",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <Link href="/" className="relative z-20 mr-4 flex items-center">
            <img
              src="/bg-oil-logo.webp"
              alt="BG OIL"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton href="/contact" variant="gradient" className="!bg-gradient-to-r !from-red-500 !to-red-600 !text-white hover:!from-red-400 hover:!to-red-500">
              Контакти
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <Link href="/" className="relative z-20 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
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
                className="relative text-white/80 hover:text-white transition-colors w-full py-2"
              >
                <span className="block text-base font-medium">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-3 mt-3 pt-3 border-t border-white/10">
              <NavbarButton
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="gradient"
                className="w-full !bg-gradient-to-r !from-red-500 !to-red-600 !text-white"
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
