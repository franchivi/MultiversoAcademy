"use client";

import { useState, useRef } from "react";
import { Headphones, Play, Pause, Volume2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AudioOverviewPlayerProps {
  audioSrc?: string;
  title?: string;
}

export function AudioOverviewPlayer({
  audioSrc = "/audio/claves_cuidador.m4a",
  title = "Podcast NotebookLM: Claves del Temario de Cuidador/a",
}: AudioOverviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const resolvedSrc = audioSrc.startsWith("http") || (basePath && audioSrc.startsWith(basePath))
    ? audioSrc
    : `${basePath}${audioSrc}`;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.warn);
      setIsPlaying(true);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-900/60 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
      <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-amber-500/20 mt-0.5 sm:mt-0">
          <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="mono text-[10px] font-bold uppercase tracking-wider text-amber-500">
              Audio Deep Dive · NotebookLM
            </span>
            <Badge variant="secondary" className="text-[10px] bg-white/10 text-slate-300">
              52 min
            </Badge>
          </div>
          <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 mt-0.5 leading-snug">
            {title}
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Escucha el análisis auditivo completo del temario oficial mientras repasas.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
        <audio
          ref={audioRef}
          src={resolvedSrc}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          preload="metadata"
        />

        <Button
          onClick={togglePlay}
          className="w-full sm:w-auto gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs py-2.5 px-4 shadow-md shadow-amber-500/25 border-0 rounded-xl justify-center"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 shrink-0" />
              <span>Pausar Audio</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white shrink-0" />
              <span>Reproducir Podcast</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
