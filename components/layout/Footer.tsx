import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShieldCheck, Heart, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/[0.08] bg-[#090a0f] text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-auto text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Multiverso Academy"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1 font-display font-bold text-white text-base">
              <span>MULTIVERSO</span>
              <span className="text-amber-500">ACADEMY</span>
            </div>
            <p className="text-xs text-slate-500 mono">
              // Preparación inteligente con tecnología NotebookLM
            </p>
          </div>
        </div>

        {/* Info & Legal */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            Temario Oficial & Curación Jurídica
          </span>
          <span className="text-slate-500">&copy; {new Date().getFullYear()} Multiverso IA</span>
          <a
            href="https://www.multiversoia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>multiversoia.com</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </footer>
  );
}
