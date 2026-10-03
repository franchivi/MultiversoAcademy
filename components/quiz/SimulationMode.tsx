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
  Sparkles
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
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Score Card Header */}
        <div className={`p-8 rounded-2xl border text-center space-y-4 shadow-lg ${
          isPassed 
            ? "bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900 border-emerald-300 dark:border-emerald-800" 
            : "bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/40 dark:to-slate-900 border-rose-300 dark:border-rose-800"
        }`}>
          <div className="inline-flex p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-md">
            <Trophy className={`w-8 h-8 ${isPassed ? "text-emerald-500" : "text-amber-500"}`} />
          </div>

          <div>
            <Badge variant={isPassed ? "success" : "destructive"} className="text-sm px-3 py-1 mb-2">
              {isPassed ? "APTO EN SIMULACRO" : "NO APTO — REPASO RECOMENDADO"}
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {resultSummary.scoreOverTen.toFixed(2)}{" "}
              <span className="text-xl font-normal text-slate-500">/ 10</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Fórmula Oficial de Oposiciones: Aciertos - (Fallos &times; 0,33)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
              <span className="block font-bold text-emerald-600 text-lg">
                {resultSummary.correctAnswers}
              </span>
              <span className="text-xs text-slate-500">Aciertos</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
              <span className="block font-bold text-rose-600 text-lg">
                {resultSummary.incorrectAnswers}
              </span>
              <span className="text-xs text-slate-500">Fallos</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
              <span className="block font-bold text-slate-500 text-lg">
                {resultSummary.unanswered}
              </span>
              <span className="text-xs text-slate-500">En blanco</span>
            </div>
          </div>
        </div>

        {/* Breakdown by Topic */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            Desglose de Rendimiento por Temas
          </h3>
          <div className="space-y-3">
            {resultSummary.topicBreakdown.map((t) => (
              <div key={t.topicId} className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{t.topicTitle}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {t.correct}/{t.total} ({t.accuracyPercent}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${t.accuracyPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Solutions & Explanations Review */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
            Revisión Detallada de Preguntas con NotebookLM
          </h3>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const userPick = selectedAnswers[q.id] || null;
              const isRight = userPick === q.correctOptionId;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border ${
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
        <div className="flex items-center justify-between gap-4 pt-4">
          <Button variant="outline" onClick={handleRestart} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Repetir Simulacro</span>
          </Button>

          {onExit && (
            <Button variant="default" onClick={onExit} className="gap-2">
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
    <div className="space-y-6">
      
      {/* Top Banner: Timer and Quick Navigation Matrix */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="text-xs px-2.5 py-1">
              Modo Simulacro Oficial
            </Badge>
            <span className="text-xs text-slate-500">
              {answeredCount} de {total} respondidas
            </span>
          </div>

          {/* Countdown Clock */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold ${
            timeLeft < 120 
              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse" 
              : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Stepper Buttons for Quick Jumping */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          {questions.map((q, idx) => {
            const isChosen = Boolean(selectedAnswers[q.id]);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-lg font-bold text-xs transition-all ${
                  isCurrent
                    ? "ring-2 ring-indigo-500 bg-indigo-600 text-white"
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
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pregunta {currentIndex + 1}</span>
            {currentQuestion.articleReference && (
              <span className="flex items-center gap-1 text-slate-400">
                <Scale className="w-3 h-3" />
                {currentQuestion.articleReference}
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = currentSelection === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {option.id}
                  </div>
                  <div className="flex-1 text-sm sm:text-base leading-relaxed">
                    {option.text}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
              disabled={currentIndex === 0}
            >
              Anterior
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleSubmitExam}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Entregar Examen</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => setCurrentIndex((p) => Math.min(total - 1, p + 1))}
              disabled={currentIndex === total - 1}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
