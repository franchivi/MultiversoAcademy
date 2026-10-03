"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLocalCourseProgress } from "@/lib/storage";
import { AudioOverviewPlayer } from "@/components/study/AudioOverviewPlayer";
import { ProtocolGuideModal } from "@/components/study/ProtocolGuideModal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course, PracticalScenarioItem, StudyPlanItem } from "@/types/course";
import { 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  Circle,
  ArrowRight, 
  ArrowLeft,
  BrainCircuit, 
  Clock, 
  AlertTriangle,
  Compass,
  FileCheck2,
  Users2,
  Stethoscope,
  Calendar,
  Download,
  Flame,
  Activity,
  Layers,
  GraduationCap,
  ShieldCheck,
  Zap,
  Lock
} from "lucide-react";

interface CourseHubViewProps {
  course: Course;
}

export function CourseHubView({ course }: CourseHubViewProps) {
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "comun" | "especifico">("all");

  useEffect(() => {
    if (course) {
      const progress = getLocalCourseProgress(course.id);
      setCompletedTopicIds(progress.completedTopicIds);
    }
  }, [course]);

  const isAvailable = course.status === "active";
  const totalTopics = course.totalTopics || 0;
  const progressPercent = totalTopics > 0 
    ? Math.round((completedTopicIds.length / totalTopics) * 100) 
    : 0;

  // Flatten all topics with module reference
  const allTopics = course.modules?.flatMap((mod) => 
    mod.topics.map((t) => ({ ...t, blockTitle: mod.title, isComun: mod.id === "mod-comun" }))
  ) || [];

  const filteredTopics = allTopics.filter((t) => {
    if (activeTab === "comun") return t.isComun;
    if (activeTab === "especifico") return !t.isComun;
    return true;
  });

  const studyPlan = (course.studyPlan || []) as StudyPlanItem[];
  const practicalScenarios = (course.practicalScenarios || []) as PracticalScenarioItem[];

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  if (!isAvailable) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-500 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Catálogo de Cursos</span>
        </Link>
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f111a] space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">{course.title}</h1>
          <p className="text-sm text-slate-500">{course.description}</p>
          <Badge variant="warning">Próximamente en Multiverso Academy</Badge>
          <div className="pt-4">
            <Link href="/">
              <Button variant="default">Explorar Cursos Disponibles</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/[0.06]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Volver al Índice General de Cursos</span>
        </Link>
        <span className="mono text-xs text-slate-500">
          Código de Curso: {course.id}
        </span>
      </div>

      {/* Course Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-white dark:via-[#090a0f] to-orange-500/10 p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="mono text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
              {course.category}
            </span>
            <span className="mono text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
              {course.bannerBadge || "Convocatoria 2026"}
            </span>
            <Badge variant="success" className="gap-1 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Curso Activo
            </Badge>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Quick Progress Indicator */}
          <div className="pt-2 max-w-md space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Progreso del temario: {completedTopicIds.length} de {totalTopics} temas</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 mono">{progressPercent}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>

          {/* Primary Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href={`/courses/${course.id}/study/tema-1`}>
              <Button className="gap-2 font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 border-0">
                <BookOpen className="w-4 h-4" />
                <span>Empezar a Estudiar (Tema 1)</span>
              </Button>
            </Link>

            <Link href={`/courses/${course.id}/quiz?mode=practice`}>
              <Button variant="outline" className="gap-2 font-semibold border-slate-300 dark:border-white/10 hover:border-amber-500">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Test Modo Práctica</span>
              </Button>
            </Link>

            <Link href={`/courses/${course.id}/quiz?mode=simulation`}>
              <Button variant="outline" className="gap-2 font-semibold border-slate-300 dark:border-white/10 hover:border-amber-500">
                <Clock className="w-4 h-4 text-violet-500" />
                <span>Simulacro Oficial (80 Preguntas)</span>
              </Button>
            </Link>

            <ProtocolGuideModal />

            <a
              href={`${basePath}/docs/manual_oficial_cuidador_diputacion_cordoba.pdf`}
              download="Manual_Oficial_Cuidador_Diputacion_Cordoba.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#0f111a] hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-500" />
              <span>Manual PDF Completo</span>
            </a>

            {course.notebooklmUrl && (
              <a
                href={course.notebooklmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-amber-500" />
                <span>Cuaderno NotebookLM</span>
                <span className="text-[10px]">↗</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Podcast Audio Player Banner directly from NotebookLM */}
      <AudioOverviewPlayer
        audioSrc={`${basePath}/audio/claves_cuidador.m4a`}
        title="Podcast Oficial NotebookLM: Claves del Temario de Cuidador/a (Diputación de Córdoba)"
      />

      {/* 4-WEEK STUDY PLAN (From Syllabus PDF Page 5) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                Plan de Estudio Oficial (4 Semanas)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hoja de ruta recomendada en la guía de preparación de la convocatoria 2026
              </p>
            </div>
          </div>
          <span className="mono text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Meta: 20 temas + Supuestos + Simulacros
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {studyPlan.map((plan) => (
            <div
              key={plan.week}
              className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f111a] p-5 shadow-xs hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="warning" className="mono text-[10px]">
                    Semana {plan.week}
                  </Badge>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 mono">
                    {plan.topics}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {plan.focus}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                <span>Objetivo semanal</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {plan.week === 4 ? "Simulacros" : plan.week === 1 ? "20 tests/día" : "Supuestos"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Daily & Weekly Habit Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/25 flex items-start gap-3">
            <Flame className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Método Diario de Estudio
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                Teoría → Esquema mental → Test de 20 preguntas → Corrección inmediata de errores.
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-transparent border border-violet-500/25 flex items-start gap-3">
            <Clock className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Entrenamiento Semanal
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                Un simulacro completo (80 preguntas en 130 min) y análisis exhaustivo de preguntas trampa.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 9 SUPUESTOS PRÁCTICOS A ENTRENAR (50% de la nota final: 40 preguntas) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Supuestos Prácticos a Entrenar</span>
                <Badge variant="indigo" className="mono text-[10px]">50% de la Nota</Badge>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Los 9 supuestos esenciales de la Diputación de Córdoba (40 preguntas del examen)
              </p>
            </div>
          </div>
          <Link href={`/courses/${course.id}/quiz?mode=practice`}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Entrenar Casos Clínicos</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {practicalScenarios.map((scen, idx) => (
            <div
              key={scen.id || idx}
              className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f111a] p-5 shadow-xs hover:border-emerald-500/60 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="mono text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Caso #{idx + 1}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {scen.tag || "Oficial"}
                  </Badge>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors">
                  {scen.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {scen.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate max-w-[170px]">
                  {scen.topicTitle}
                </span>
                <Link
                  href={`/courses/${course.id}/study/${scen.topicId}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Estudiar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FULL SYLLABUS: ALL 20 OFFICIAL TOPICS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-slate-100">
                Temario Oficial Completo (20 Temas)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Desglose íntegro según las bases de la convocatoria 2026 de la Excma. Diputación Provincial de Córdoba
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "all"
                  ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Todos ({allTopics.length})
            </button>
            <button
              onClick={() => setActiveTab("comun")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "comun"
                  ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Comunes (T1-T4)
            </button>
            <button
              onClick={() => setActiveTab("especifico")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "especifico"
                  ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Específicos (T5-T20)
            </button>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic) => {
            const isCompleted = completedTopicIds.includes(topic.id);

            return (
              <div
                key={topic.id}
                className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0f111a] p-5 shadow-xs hover:border-amber-500/60 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="mono text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                      {topic.isComun ? "Bloque Común" : "Bloque Específico"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {topic.estimatedMinutes} min
                      </span>
                      {isCompleted && (
                        <Badge variant="success" className="gap-1 text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Repasado
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-2">
                  <Link
                    href={`/courses/${course.id}/study/${topic.id}`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="w-full justify-between gap-1 text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                    >
                      <span>Estudiar Tema</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>

                  <Link href={`/courses/${course.id}/quiz?topicId=${topic.id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs border-slate-200 dark:border-white/10 hover:border-amber-500"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>Test</span>
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* EXAM ANATOMY & SIMULATION BANNER */}
      <section className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-white dark:via-[#0f111a] to-orange-500/10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" className="mono text-[10px]">
                Convocatoria 2026
              </Badge>
              <span className="mono text-xs text-amber-600 dark:text-amber-400 font-bold">
                Diputación Provincial de Córdoba · Subgrupo C2
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-slate-100">
              Anatomía Oficial del Examen (80 Preguntas · 130 Minutos)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Cada respuesta errónea penaliza 0.33 puntos. El ejercicio consta de 10 preguntas comunes, 30 específicas y 40 supuestos prácticos clínicos.
            </p>
          </div>

          <Link href={`/courses/${course.id}/quiz?mode=simulation`}>
            <Button className="shrink-0 gap-2 font-bold px-6 py-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 border-0">
              <Clock className="w-5 h-5" />
              <span>Lanzar Simulacro Oficial</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
            <span className="mono font-black text-xl text-slate-900 dark:text-slate-100">
              10 Preguntas
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block">
              Bloque I: Materias Comunes
            </span>
            <span className="text-[11px] text-slate-500 block leading-tight">
              Constitución Española, Cortes, Régimen Local y Ley de Igualdad (Temas 1 a 4).
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
            <span className="mono font-black text-xl text-slate-900 dark:text-slate-100">
              30 Preguntas
            </span>
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 block">
              Bloque II: Materias Específicas
            </span>
            <span className="text-[11px] text-slate-500 block leading-tight">
              Teoría técnica de cuidados, SAAD, ACP, comunicación, higiene e infecciones (Temas 5 a 20).
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] space-y-1">
            <span className="mono font-black text-xl text-slate-900 dark:text-slate-100">
              40 Preguntas (50%)
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
              Bloque III: Supuestos Prácticos
            </span>
            <span className="text-[11px] text-slate-500 block leading-tight">
              Resolución de casos clínicos reales: UPP, disfagia, movilización con grúa y SVB 30:2.
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}
