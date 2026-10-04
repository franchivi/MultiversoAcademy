"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  LayoutDashboard, 
  Layers,
  Moon, 
  Sun,
  ChevronRight,
  BrainCircuit,
  Menu,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkActive = document.documentElement.classList.contains("dark") || 
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(isDarkActive);
      if (isDarkActive) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Detect if user is inside a specific course
  const isCourseContext = pathname.startsWith("/courses/");
  const pathParts = pathname.split("/");
  const currentCourseId = isCourseContext && pathParts[2] ? pathParts[2] : "curso-1";

  // Context-aware navigation links
  const navLinks = isCourseContext
    ? [
        { href: "/", label: "Catálogo", icon: Layers },
        { href: `/courses/${currentCourseId}`, label: "Panel del Curso", icon: LayoutDashboard },
        { href: `/courses/${currentCourseId}/study/tema-1`, label: "Apuntes & Temario", icon: BookOpen },
        { href: `/courses/${currentCourseId}/quiz`, label: "Módulo Test", icon: HelpCircle },
      ]
    : [
        { href: "/", label: "Catálogo de Cursos", icon: Layers },
        { href: "/courses/curso-1", label: "Curso Cuidador/a 2026", icon: BookOpen },
      ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090a0f]/95 border-b border-white/[0.08] text-white backdrop-blur-md shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="relative w-10 h-10 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Multiverso Academy"
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(217,119,6,0.35)]"
              sizes="(max-width: 640px) 40px, 56px"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1 font-display font-extrabold text-base sm:text-lg md:text-xl tracking-tight leading-tight">
              <span>MULTIVERSO</span>
              <span className="text-amber-500">ACADEMY</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mono hidden xs:flex items-center gap-1">
              <BrainCircuit className="w-3 h-3 text-amber-500 shrink-0" />
              <span>Powered by NotebookLM</span>
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-sm">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" 
              ? pathname === "/" 
              : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href.split("?")[0]));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 flex items-center gap-2 transition-colors ${
                  isActive
                    ? "text-amber-400 font-semibold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 text-amber-500/80" />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_8px_rgba(217,119,6,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDark ? "Modo Claro" : "Modo Oscuro"}
            aria-label="Cambiar tema"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />}
          </button>

          {/* Desktop Call to Action */}
          {isCourseContext ? (
            <Link href={`/courses/${currentCourseId}/study/tema-1`} className="hidden sm:inline-flex">
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md shadow-amber-500/20 border-0 gap-1.5"
              >
                <span>Continuar Estudio</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/courses/curso-1" className="hidden sm:inline-flex">
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md shadow-amber-500/20 border-0 gap-1.5"
              >
                <span>Ir al Curso Activo</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-amber-400" />
            ) : (
              <Menu className="w-5 h-5 text-slate-200" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#090a0f]/98 backdrop-blur-xl animate-in slide-in-from-top-3 duration-200 shadow-2xl">
          <div className="px-4 pt-3 pb-6 space-y-3">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === "/" 
                  ? pathname === "/" 
                  : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href.split("?")[0]));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-amber-500/70"}`} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(217,119,6,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile CTA */}
            <div className="pt-2 border-t border-white/[0.06]">
              {isCourseContext ? (
                <Link
                  href={`/courses/${currentCourseId}/study/tema-1`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button
                    variant="default"
                    className="w-full justify-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md shadow-amber-500/20 border-0 gap-2 text-sm py-2.5"
                  >
                    <span>Continuar Estudio del Curso</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Link
                  href="/courses/curso-1"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button
                    variant="default"
                    className="w-full justify-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md shadow-amber-500/20 border-0 gap-2 text-sm py-2.5"
                  >
                    <span>Entrar a Cuidador/a 2026</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
