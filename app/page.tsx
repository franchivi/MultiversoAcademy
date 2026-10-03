"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCourses } from "@/data/courses";
import { getGlobalStats, getLocalCourseProgress } from "@/lib/storage";
import { CourseCard } from "@/components/dashboard/CourseCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";
import { 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BrainCircuit, 
  Clock, 
  Search,
  PlusCircle,
  GraduationCap,
  ShieldCheck,
  Zap,
  Flame,
  Stethoscope,
  Building2,
  FileCheck2,
  Layers,
  Compass
} from "lucide-react";

export default function CourseIndexDashboard() {
  const allCourses = getAllCourses();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [curso1Progress, setCurso1Progress] = useState<{ completedCount: number; percent: number }>({
    completedCount: 0,
    percent: 0,
  });

  useEffect(() => {
    const p = getLocalCourseProgress("curso-1");
    const count = p.completedTopicIds.length;
    const total = 20;
    setCurso1Progress({
      completedCount: count,
      percent: Math.round((count / total) * 100),
    });
  }, []);

  const categories = [
    { id: "all", label: "Todos los Cursos" },
    { id: "sociosanitario", label: "Sociosanitario & Sanidad" },
    { id: "administracion", label: "Administración Local & AGE" },
    { id: "activos", label: "Disponibles Ahora" },
  ];

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === "sociosanitario") {
      return course.category.toLowerCase().includes("diputación") || course.category.toLowerCase().includes("salud") || course.category.toLowerCase().includes("sanidad");
    }
    if (selectedCategory === "administracion") {
      return course.category.toLowerCase().includes("administración");
    }
    if (selectedCategory === "activos") {
      return course.status === "active";
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Academy Hero Header */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-[#090a0f] to-orange-500/5 p-8 sm:p-12 text-slate-100 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Multiverso Academy · Convocatorias 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
            Índice de Cursos &amp; Oposiciones
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Preparación intensiva de plazas públicas con temarios oficiales desglosados, baterías de preguntas tipo test explicadas, simulacros con penalización real y cuadernos asistidos por Inteligencia Artificial y NotebookLM.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar oposición por título, categoría o palabra clave..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.07] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Decorative Background Glows */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Global Academy Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f111a] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs text-slate-500">Cursos en Catálogo</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <span className="mono text-2xl font-black text-slate-900 dark:text-slate-100">
            {allCourses.length} Oposiciones
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
            1 curso activo · 2 en preparación
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f111a] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs text-slate-500">Temas Desarrollados</span>
            <BookOpen className="w-4 h-4 text-violet-500" />
          </div>
          <span className="mono text-2xl font-black text-slate-900 dark:text-slate-100">
            20 Temas
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            Desarrollo íntegro BOP/BOE
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f111a] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs text-slate-500">Supuestos Prácticos</span>
            <Stethoscope className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="mono text-2xl font-black text-slate-900 dark:text-slate-100">
            9 Casos
          </span>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block mt-1">
            50% de la nota final
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f111a] p-5 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs text-slate-500">Formato de Examen</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <span className="mono text-2xl font-black text-slate-900 dark:text-slate-100">
            80 Preguntas
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">
            130 min · Penalización -0.33
          </span>
        </div>
      </section>

      {/* Active Course Quick-Resume (if user has progress) */}
      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="mono text-[10px]">Curso Activo</Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400">Tu progreso de preparación</span>
          </div>
          <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
            Cuidador/a — Excma. Diputación Provincial de Córdoba
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Has completado {curso1Progress.completedCount} de 20 temas oficiales ({curso1Progress.percent}% del temario).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/courses/curso-1">
            <Button className="gap-2 font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 border-0 shadow-sm">
              <span>Ver Panel del Curso</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/courses/curso-1/study/tema-1">
            <Button variant="outline" className="border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10">
              Continuar Temario
            </Button>
          </Link>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200 dark:border-white/[0.08]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === cat.id
                ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Course Catalog Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Cursos Disponibles ({filteredCourses.length})</span>
          </h2>
          <span className="text-xs text-slate-500">Selecciona un curso para ver su índice y comenzar</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              completedTopicsCount={
                course.id === "curso-1" ? curso1Progress.completedCount : 0
              }
            />
          ))}

          {/* Add New Course Custom Card */}
          <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-6 flex flex-col justify-between hover:border-amber-500/50 transition-colors group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors">
                ¿Preparando otra Oposición?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Multiverso Academy está diseñado con arquitectura modular desacoplada. Puedes añadir nuevos cursos en cualquier momento vinculando su temario de NotebookLM y estructura JSON en <code className="mono text-[11px] px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10">data/courses/</code>.
              </p>
            </div>

            <div className="pt-6">
              <span className="mono text-[11px] text-amber-600 dark:text-amber-400 block font-semibold">
                Soporte multi-curso listo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f111a] p-8 sm:p-10 space-y-6">
        <div className="max-w-2xl space-y-2">
          <Badge variant="indigo" className="mono text-[10px]">Metodología EdTech</Badge>
          <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">
            Cómo Funciona Multiverso Academy
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Cada curso cuenta con su propio centro de estudio integral adaptado al boletín oficial correspondiente:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold mono">
              01
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Temarios Oficiales</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Desglose artículo por artículo con notas de examen, leyes vigentes y alertas de preguntas trampa.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center font-bold mono">
              02
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Audio Deep-Dives</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Podcasts de estudio de alta duración para consolidar conceptos mientras caminas, viajas o descansas.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold mono">
              03
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Supuestos Prácticos</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Entrenamiento intensivo en los casos clínicos y asistenciales que ponderan el 50% de la calificación final.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold mono">
              04
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Simulación Oficial</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Exámenes cronometrados con el mismo número de preguntas y la penalización exacta (-0.33) del tribunal.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
