"use client";

import { useState } from "react";
import Image from "next/image";
import { FileImage, X, Maximize2, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProtocolGuideModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2 text-xs border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20"
      >
        <FileImage className="w-4 h-4 text-amber-500" />
        <span>Infografía de Protocolos</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-slate-100">
                  Guía de Protocolos Esenciales para el Cuidador/a Sociosanitario/a
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Image Content Container */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/40">
              <div className="relative w-full h-[65vh]">
                <Image
                  src="/images/guia_protocolos_cuidador.png"
                  alt="Guía de Protocolos del Cuidador Sociosanitario - Diputación de Córdoba"
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
            </div>

            {/* Footer with actions */}
            <div className="p-3.5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
              <span className="mono">
                // Síntesis asistencial: SVB, OVACE, Disfagia, UPP y EPIs
              </span>
              <a
                href="/images/guia_protocolos_cuidador.png"
                download="Guia_Protocolos_Cuidador_Diputacion_Cordoba.png"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Infografía</span>
                </Button>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
