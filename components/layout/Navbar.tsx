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
  BrainCircuit
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

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
      ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090a0f] border-b border-white/[0.08] text-white backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-16 h-16 shrink-0">
            {/* Larger visual footprint than its layout box: the logo overflows the bar without increasing its height */}
            <div className="absolute -inset-4 z-10">
              <Image
                src="/images/logo.png"
                alt="Multiverso Academy"
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_18px_rgba(217,119,6,0.4)]"
                sizes="96px"
                priority
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-display font-extrabold text-lg md:text-xl tracking-tight">
              <span>MULTIVERSO</span>
              <span className="text-amber-500">ACADEMY</span>
            </div>
            <p className="text-xs text-slate-400 mono flex items-center gap-1">
              <BrainCircuit className="w-3 h-3 text-amber-500" />
              <span>// Powered by NotebookLM</span>
            </p>
          </div>
        </Link>

        {/* Navigation Menu */}
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
                  <span className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            title={isDark ? "Modo Claro" : "Modo Oscuro"}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-300" />}
          </button>

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
        </div>

      </div>
    </header>
  );
}
