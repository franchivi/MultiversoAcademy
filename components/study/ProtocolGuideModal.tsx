"use client";

import { useState } from "react";
import Image from "next/image";
import { FileImage, X, Maximize2, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAssetPath } from "@/lib/utils";

export function ProtocolGuideModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto gap-2 text-xs border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 py-2.5 sm:py-2"
      >
        <FileImage className="w-4 h-4 text-amber-500 shrink-0" />
        <span>Infografía de Protocolos</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-950 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                  Guía de Protocolos Esenciales del Cuidador/a
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full text-slate-400 hover:text-slate-100 shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Image Content Container */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center bg-slate-950/40">
              <div className="relative w-full h-[55vh] sm:h-[65vh]">
                <Image
                  src={getAssetPath("/images/guia_protocolos_cuidador.png")}
                  alt="Guía de Protocolos del Cuidador Sociosanitario - Diputación de Córdoba"
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
            </div>

            {/* Footer with actions */}
            <div className="p-3 sm:p-3.5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
              <span className="mono text-[11px]">
                // Síntesis asistencial: SVB, OVACE, Disfagia, UPP y EPIs
              </span>
              <a
                href={getAssetPath("/images/guia_protocolos_cuidador.png")}
                download="Guia_Protocolos_Cuidador_Diputacion_Cordoba.png"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="sm" variant="outline" className="w-full sm:w-auto gap-1.5 text-xs">
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
