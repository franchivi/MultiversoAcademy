"use client";

import { useState } from "react";
import { QuizQuestion } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  AlertOctagon, 
  Scale, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw
} from "lucide-react";

interface PracticeModeProps {
  questions: QuizQuestion[];
  onFinish?: () => void;
}

export function PracticeMode({ questions, onFinish }: PracticeModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<string, boolean>>({});

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const isLast = currentIndex === total - 1;

  const currentSelection = selectedAnswers[currentQuestion.id] || null;
  const isRevealed = Boolean(revealedQuestions[currentQuestion.id]);

  const handleSelectOption = (optionId: string) => {
    if (isRevealed) return; // Prevent changing after checking
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleCheckAnswer = () => {
    if (!currentSelection) return;
    setRevealedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (onFinish) {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setRevealedQuestions({});
    setCurrentIndex(0);
  };

  const isCorrect = currentSelection === currentQuestion.correctOptionId;

  return (
    <div className="space-y-6">
      
      {/* Question Header & Stepper */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <Badge variant="indigo" className="text-xs px-2.5 py-1">
            Modo Práctica
          </Badge>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Pregunta {currentIndex + 1} de {total}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentQuestion.topicTitle && (
            <Badge variant="secondary" className="text-xs max-w-xs truncate hidden sm:inline-flex">
              {currentQuestion.topicTitle}
            </Badge>
          )}
          {currentQuestion.articleReference && (
            <Badge variant="outline" className="gap-1 text-xs">
              <Scale className="w-3 h-3 text-slate-400" />
              {currentQuestion.articleReference}
            </Badge>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
          {currentQuestion.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isChosen = currentSelection === option.id;
            const isTheCorrectOne = option.id === currentQuestion.correctOptionId;

            let optionStyle =
              "border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-slate-900";

            if (isChosen && !isRevealed) {
              optionStyle =
                "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20";
            }

            if (isRevealed) {
              if (isTheCorrectOne) {
                optionStyle =
                  "border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30";
              } else if (isChosen && !isTheCorrectOne) {
                optionStyle =
                  "border-rose-500 bg-rose-50/90 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/30";
              } else {
                optionStyle = "opacity-50 border-slate-200 dark:border-slate-800";
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={isRevealed}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 ${optionStyle}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isRevealed && isTheCorrectOne
                      ? "bg-emerald-600 text-white"
                      : isRevealed && isChosen && !isTheCorrectOne
                      ? "bg-rose-600 text-white"
                      : isChosen
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {option.id}
                </div>
                <div className="flex-1 text-sm sm:text-base leading-relaxed">
                  {option.text}
                </div>
                {isRevealed && isTheCorrectOne && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isRevealed && isChosen && !isTheCorrectOne && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button: Check Answer */}
        {!isRevealed && (
          <div className="pt-2 flex justify-end">
            <Button
              variant="glow"
              disabled={!currentSelection}
              onClick={handleCheckAnswer}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Comprobar Respuesta</span>
            </Button>
          </div>
        )}

        {/* Feedback Section (Shown immediately after checking) */}
        {isRevealed && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                isCorrect
                  ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                  : "bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-sm">
                  {isCorrect ? "¡Excelente! Respuesta Correcta" : `Incorrecto. La opción correcta es la ${currentQuestion.correctOptionId}`}
                </p>
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>

            {/* Trap Warning Insight */}
            {currentQuestion.trapInsight && (
              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <AlertOctagon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-950 dark:text-amber-100">
                    Análisis de Trampa (NotebookLM):
                  </span>
                  {currentQuestion.trapInsight}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Stepper Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs text-slate-500 gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar Test</span>
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={handleNext}
          className="gap-1.5"
        >
          <span>{isLast ? "Finalizar Repaso" : "Siguiente"}</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
}
