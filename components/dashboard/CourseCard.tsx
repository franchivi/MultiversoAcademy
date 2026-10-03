"use client";

import Link from "next/link";
import { Course } from "@/types/course";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen, HelpCircle, Lock, CheckCircle2, Clock } from "lucide-react";

interface CourseCardProps {
  course: Course;
  completedTopicsCount: number;
}

export function CourseCard({ course, completedTopicsCount }: CourseCardProps) {
  const isAvailable = course.status === "active";
  const progressPercent = isAvailable && course.totalTopics > 0
    ? Math.round((completedTopicsCount / course.totalTopics) * 100)
    : 0;

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      isAvailable 
        ? "hover:border-amber-400/80 dark:hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/5 group bg-white dark:bg-[#0f111a] border-slate-200/80 dark:border-white/[0.08]" 
        : "opacity-85 bg-slate-50/50 dark:bg-[#0f111a]/50 border-dashed border-slate-300 dark:border-white/[0.06]"
    }`}>
      {/* Top Banner Stripe */}
      <div className={`h-1.5 w-full ${isAvailable ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" : "bg-slate-300 dark:bg-slate-800"}`} />

      <CardHeader className="p-6">
        <div className="flex items-start justify-between gap-4">
          <span className="mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
            {course.category}
          </span>
          {isAvailable ? (
            <Badge variant="success" className="gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3" />
              Disponible
            </Badge>
          ) : (
            <Badge variant="warning" className="gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800">
              <Clock className="w-3 h-3" />
              Próximamente
            </Badge>
          )}
        </div>

        <CardTitle className="text-xl font-bold font-display mt-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-slate-500 dark:text-slate-400">
          {course.subtitle}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6 space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
          {course.description}
        </p>

        {/* Course Stats Pills */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-white/[0.06] text-xs">
          <div className="text-center">
            <span className="block font-bold text-slate-900 dark:text-slate-100 text-sm mono">
              {course.totalTopics}
            </span>
            <span className="text-slate-500">Temas</span>
          </div>
          <div className="text-center border-x border-slate-100 dark:border-white/[0.06]">
            <span className="block font-bold text-slate-900 dark:text-slate-100 text-sm mono">
              {course.totalQuestions}+
            </span>
            <span className="text-slate-500">Preguntas</span>
          </div>
          <div className="text-center">
            <span className="block font-bold text-slate-900 dark:text-slate-100 text-sm mono">
              {course.estimatedHours}h
            </span>
            <span className="text-slate-500">Estimadas</span>
          </div>
        </div>

        {/* Progress Bar for Active Course */}
        {isAvailable && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Progreso de estudio</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400 mono">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-white/[0.08] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2.5">
        {isAvailable ? (
          <>
            <Link href={`/courses/${course.id}`} className="flex-1">
              <Button
                className="w-full gap-2 text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-sm shadow-amber-500/20 border-0"
              >
                <BookOpen className="w-4 h-4" />
                <span>Entrar al Curso</span>
              </Button>
            </Link>
            <Link href={`/courses/${course.id}/quiz?mode=practice`} className="shrink-0">
              <Button
                variant="outline"
                className="gap-2 text-xs sm:text-sm border-slate-200 dark:border-white/10 hover:border-amber-500/60"
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Tests</span>
              </Button>
            </Link>
          </>
        ) : (
          <Button variant="secondary" disabled className="w-full gap-2 cursor-not-allowed text-xs sm:text-sm bg-slate-100 dark:bg-white/5 text-slate-400">
            <Lock className="w-4 h-4" />
            <span>En desarrollo con NotebookLM</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
