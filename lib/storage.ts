import { CourseProgress } from "@/types/course";
import { QuizSessionResult } from "@/types/quiz";

const PROGRESS_STORAGE_KEY = "multiverso_academy_progress";
const QUIZ_HISTORY_KEY = "multiverso_academy_quiz_history";

export function getLocalCourseProgress(courseId: string): CourseProgress {
  if (typeof window === "undefined") {
    return {
      courseId,
      completedTopicIds: [],
      quizAttempts: []
    };
  }

  try {
    const raw = localStorage.getItem(`${PROGRESS_STORAGE_KEY}_${courseId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Error reading progress from localStorage", err);
  }

  return {
    courseId,
    completedTopicIds: [],
    quizAttempts: []
  };
}

export function saveTopicCompletion(courseId: string, topicId: string, completed: boolean): CourseProgress {
  const current = getLocalCourseProgress(courseId);
  const set = new Set(current.completedTopicIds);

  if (completed) {
    set.add(topicId);
  } else {
    set.delete(topicId);
  }

  const updated: CourseProgress = {
    ...current,
    completedTopicIds: Array.from(set),
    lastVisitedTopicId: topicId,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(`${PROGRESS_STORAGE_KEY}_${courseId}`, JSON.stringify(updated));
    } catch (err) {
      console.warn("Error saving topic completion", err);
    }
  }

  return updated;
}

export function saveQuizResult(result: QuizSessionResult): void {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
    const history: QuizSessionResult[] = raw ? JSON.parse(raw) : [];
    history.unshift(result);
    // Keep last 50 attempts
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history.slice(0, 50)));

    // Also update CourseProgress
    const courseProgress = getLocalCourseProgress(result.courseId);
    courseProgress.quizAttempts.unshift({
      quizId: `${result.mode}-${Date.now()}`,
      score: result.scoreOverTen,
      totalQuestions: result.totalQuestions,
      passed: result.scoreOverTen >= 5.0,
      date: result.date,
      mode: result.mode
    });
    localStorage.setItem(`${PROGRESS_STORAGE_KEY}_${result.courseId}`, JSON.stringify(courseProgress));
  } catch (err) {
    console.warn("Error saving quiz result", err);
  }
}

export function getQuizHistory(courseId?: string): QuizSessionResult[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
    if (!raw) return [];
    const all: QuizSessionResult[] = JSON.parse(raw);
    if (courseId) {
      return all.filter(item => item.courseId === courseId);
    }
    return all;
  } catch (err) {
    console.warn("Error getting quiz history", err);
    return [];
  }
}

export function getGlobalStats() {
  if (typeof window === "undefined") {
    return { completedTopicsCount: 0, quizzesTakenCount: 0, averageScore: 0 };
  }

  const history = getQuizHistory();
  const progress1 = getLocalCourseProgress("curso-1");

  const completedTopicsCount = progress1.completedTopicIds.length;
  const quizzesTakenCount = history.length;
  const averageScore = history.length > 0 
    ? Number((history.reduce((acc, h) => acc + h.scoreOverTen, 0) / history.length).toFixed(1))
    : 0;

  return {
    completedTopicsCount,
    quizzesTakenCount,
    averageScore
  };
}
