export interface QuizOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  topicTitle?: string;
  questionNumber?: number;
  question: string;
  options: QuizOption[];
  correctOptionId: string; // e.g. 'A', 'B', 'C', or 'D'
  explanation: string; // Detailed NotebookLM extraction
  articleReference?: string; // e.g. "Art. 14 CE", "Art. 21 Ley 39/2015"
  examFrequency?: 'Muy Alta' | 'Alta' | 'Media' | 'Baja';
  trapInsight?: string; // Why options are deceptive
}

export interface QuizResultAnswer {
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  topicId: string;
}

export interface QuizSessionResult {
  courseId: string;
  mode: 'practice' | 'simulation';
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  scoreOverTen: number; // 0.0 to 10.0 scale for civil service exams
  timeSpentSeconds: number;
  date: string;
  answers: QuizResultAnswer[];
  topicBreakdown: {
    topicId: string;
    topicTitle: string;
    total: number;
    correct: number;
    accuracyPercent: number;
  }[];
}
