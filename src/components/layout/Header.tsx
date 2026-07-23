"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Início", href: "/" },
  { name: "Sobre", href: "/#sobre" },
  { name: "Modelos", href: "/modelos" },
  { name: "Simulador", href: "/simulador" },
  { name: "Portfólio", href: "/portfolio" },
  { name: "Como Funciona", href: "/#como-funciona" },
  { name: "Diário de Obras", href: "/diario-de-obras" },
  { name: "FAQ", href: "/#faq" },
  { name: "Contato", href: "/#contato" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const headerActive = isScrolled || !isHomePage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        headerActive ? "glass py-2 shadow-wood" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Wood Bahia Logo"
            width={200}
            height={56}
            className="h-10 md:h-12 w-auto"
            priority
          />
          <span
            className={`text-xl md:text-2xl font-serif font-bold transition-colors duration-300 ${
              headerActive ? "text-primary" : "text-white"
            }`}
          >
            Wood Bahia
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`${
                headerActive ? "text-foreground/80" : "text-white"
              } group relative font-medium transition-colors duration-200 hover:text-primary`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="https://wa.me/5571992936290"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta text-sm"
          >
            <Phone className="w-4 h-4" />
            Fale Conosco
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 ${headerActive ? "text-primary" : "text-white"}`}
          aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-border/30"
          >
            <nav className="container mx-auto flex flex-col gap-4 px-4 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="py-2 font-medium text-foreground/80 transition-colors hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="https://wa.me/5571992936290"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cta mt-4 text-center"
              >
                <Phone className="w-4 h-4" />
                Fale Conosco
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
