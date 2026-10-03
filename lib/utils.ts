import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculateOposicionScore(correct: number, incorrect: number, total: number, penaltyFactor: number = 0.33): number {
  if (total === 0) return 0;
  // Standard Spanish oposiciones formula: Aciertos - (Errores * penalización)
  const netScore = Math.max(0, correct - (incorrect * penaltyFactor));
  const rawScoreOverTen = (netScore / total) * 10;
  return Number(Math.min(10, Math.max(0, rawScoreOverTen)).toFixed(2));
}
