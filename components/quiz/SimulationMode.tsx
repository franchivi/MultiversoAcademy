"use client";

import { useState, useEffect } from "react";
import { QuizQuestion, QuizSessionResult } from "@/types/quiz";
import { calculateOposicionScore, formatTime } from "@/lib/utils";
import { saveQuizResult } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Trophy, 
  RotateCcw, 
  HelpCircle,
  Scale,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Grid,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface SimulationModeProps {
  courseId: string;
  questions: QuizQuestion[];
  initialMinutes?: number;
  onExit?: () => void;
}

export function SimulationMode({
  courseId,
  questions,
  initialMinutes = 10,
  onExit,
}: SimulationModeProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [resultSummary, setResultSummary] = useState<QuizSessionResult | null>(null);
  const [showFullMatrix, setShowFullMatrix] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const currentSelection = selectedAnswers[currentQuestion?.id] || null;

  const handleSelectOption = (optionId: string) => {
    if (isFinished) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const topicStats: Record<string, { title: string; total: number; correct: number }> = {};

    const answersReport = questions.map((q) => {
      const selected = selectedAnswers[q.id] || null;
      const isCorrect = selected === q.correctOptionId;

      if (!selected) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      const tId = q.topicId;
      if (!topicStats[tId]) {
        topicStats[tId] = {
          title: q.topicTitle || tId,
          total: 0,
          correct: 0,
        };
      }
      topicStats[tId].total++;
      if (isCorrect) topicStats[tId].correct++;

      return {
        questionId: q.id,
        selectedOptionId: selected,
        correctOptionId: q.correctOptionId,
        isCorrect,
        topicId: q.topicId,
      };
    });

    const scoreOverTen = calculateOposicionScore(correctCount, incorrectCount, total, 0.33);

    const breakdown = Object.entries(topicStats).map(([topicId, val]) => ({
      topicId,
      topicTitle: val.title,
      total: val.total,
      correct: val.correct,
      accuracyPercent: Math.round((val.correct / val.total) * 100),
    }));

    const result: QuizSessionResult = {
      courseId,
      mode: "simulation",
      totalQuestions: total,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unanswered: unansweredCount,
      scoreOverTen,
      timeSpentSeconds: initialMinutes * 60 - timeLeft,
      date: new Date().toISOString(),
      answers: answersReport,
      topicBreakdown: breakdown,
    };

    saveQuizResult(result);
    setResultSummary(result);
    setIsFinished(true);
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setTimeLeft(initialMinutes * 60);
    setIsFinished(false);
    setResultSummary(null);
    setCurrentIndex(0);
  };

  // If exam is finished, show full simulation results report
  if (isFinished && resultSummary) {
    const isPassed = resultSummary.scoreOverTen >= 5.0;

    return (
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        
        {/* Score Card Header */}
        <div className={`p-6 sm:p-8 rounded-2xl border text-center space-y-4 shadow-lg ${
          isPassed 
            ? "bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900 border-emerald-300 dark:border-emerald-800" 
            : "bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/40 dark:to-slate-900 border-rose-300 dark:border-rose-800"
        }`}>
          <div className="inline-flex p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-md">
            <Trophy className={`w-8 h-8 ${isPassed ? "text-emerald-500" : "text-amber-500"}`} />
          </div>

          <div>
            <span className="mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Calificación Obtenida (Fórmula Oficial Tribunal)
            </span>
            <div className="text-4xl sm:text-5xl font-black font-display mt-1 text-slate-900 dark:text-slate-100">
              {resultSummary.scoreOverTen.toFixed(2)} <span className="text-xl sm:text-2xl text-slate-400 font-normal">/ 10</span>
            </div>
            <p className={`text-sm font-semibold mt-1 ${isPassed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {isPassed 
                ? "¡APROBADO! Superas el umbral de corte del ejercicio oficial" 
                : "NO APTO. Necesitas un mínimo de 5.00 neto para superar el examen"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-left">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block">Aciertos (+1.00)</span>
              <span className="mono font-bold text-lg text-emerald-800 dark:text-emerald-200">
                {resultSummary.correctAnswers}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
              <span className="text-[11px] text-rose-700 dark:text-rose-300 block">Fallos (-0.33)</span>
              <span className="mono font-bold text-lg text-rose-800 dark:text-rose-200">
                {resultSummary.incorrectAnswers}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">En Blanco</span>
              <span className="mono font-bold text-lg text-slate-800 dark:text-slate-200">
                {resultSummary.unanswered}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
              <span className="text-[11px] text-indigo-700 dark:text-indigo-300 block">Tiempo Empleado</span>
              <span className="mono font-bold text-lg text-indigo-800 dark:text-indigo-200">
                {formatTime(resultSummary.timeSpentSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Review of All Questions */}
        <div className="space-y-4">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
            Revisión Detallada &amp; Justificaciones Jurídicas
          </h3>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userPick = selectedAnswers[q.id];
              const isRight = userPick === q.correctOptionId;

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border ${
                    isRight
                      ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20"
                      : "border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20"
                  } space-y-3`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      Pregunta {idx + 1}
                    </span>
                    <Badge variant={isRight ? "success" : "destructive"}>
                      {isRight ? "Acertada" : userPick ? "Fallada" : "En Blanco"}
                    </Badge>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {q.question}
                  </p>

                  <div className="text-xs space-y-1.5 pt-1">
                    <p className="text-slate-600 dark:text-slate-400">
                      <strong>Tu respuesta:</strong> {userPick ? `Opción ${userPick}` : "No contestada"}
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                      <strong>Respuesta Correcta:</strong> Opción {q.correctOptionId}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong className="block text-slate-800 dark:text-slate-200 mb-1">
                      Justificación Jurídica ({q.articleReference}):
                    </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
          <Button variant="outline" onClick={handleRestart} className="w-full sm:w-auto gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Repetir Simulacro</span>
          </Button>

          {onExit && (
            <Button variant="default" onClick={onExit} className="w-full sm:w-auto gap-2">
              <span>Volver al Temario</span>
            </Button>
          )}
        </div>

      </div>
    );
  }

  // Active Simulation View
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-5 sm:space-y-6">
      
      {/* Top Banner: Timer and Quick Navigation Matrix */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="text-xs px-2.5 py-1">
              Simulacro Oficial
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              {answeredCount}/{total} respondidas
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Countdown Clock */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold ${
              timeLeft < 120 
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse" 
                : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
            }`}>
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Matrix Accordion Toggle on Mobile */}
            <button
              onClick={() => setShowFullMatrix(!showFullMatrix)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Ver selector de preguntas"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{showFullMatrix ? "Ocultar" : "Matriz"}</span>
              {showFullMatrix ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Stepper Buttons for Quick Jumping (Horizontal on Mobile, Grid on Desktop or when expanded) */}
        <div className={`pt-2 border-t border-slate-100 dark:border-slate-800 ${
          showFullMatrix 
            ? "flex flex-wrap gap-1.5 max-h-56 overflow-y-auto" 
            : "hidden sm:flex sm:flex-wrap sm:gap-1.5 max-h-36 overflow-y-auto"
        }`}>
          {questions.map((q, idx) => {
            const isChosen = Boolean(selectedAnswers[q.id]);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                  isCurrent
                    ? "ring-2 ring-indigo-500 bg-indigo-600 text-white shadow-xs"
                    : isChosen
                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Mobile Horizontal Quick Navigation Strip when matrix is collapsed */}
        {!showFullMatrix && (
          <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {questions.map((q, idx) => {
              const isChosen = Boolean(selectedAnswers[q.id]);
              const isCurrent = idx === currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 shrink-0 rounded-md font-bold text-xs transition-all ${
                    isCurrent
                      ? "ring-2 ring-indigo-500 bg-indigo-600 text-white"
                      : isChosen
                      ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="p-4 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold mono">Pregunta {currentIndex + 1} de {total}</span>
            {currentQuestion.articleReference && (
              <span className="flex items-center gap-1 text-slate-400 text-[11px] truncate max-w-[200px]">
                <Scale className="w-3 h-3 shrink-0" />
                <span className="truncate">{currentQuestion.articleReference}</span>
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-2.5 sm:space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = currentSelection === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {option.id}
                  </div>
                  <div className="flex-1 text-xs sm:text-base leading-relaxed">
                    {option.text}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
              disabled={currentIndex === 0}
              className="gap-1 text-xs px-2.5 sm:px-3"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleSubmitExam}
              className="gap-1.5 text-xs font-semibold px-3 sm:px-4"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Entregar Examen</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setCurrentIndex((p) => Math.min(total - 1, p + 1))}
              disabled={currentIndex === total - 1}
              className="gap-1 text-xs px-2.5 sm:px-3"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
