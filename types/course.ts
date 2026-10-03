export interface StudyCallout {
  id: string;
  type: 'key_point' | 'exam_faq' | 'trap_warning' | 'notebooklm_insight';
  title: string;
  content: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  relevance?: string;
  articleRef?: string;
}

export interface TopicSection {
  id: string;
  title: string;
  content: string; // Markdown or rich formatted text
  callouts?: StudyCallout[];
}

export interface Topic {
  id: string;
  title: string;
  order: number;
  description: string;
  estimatedMinutes: number;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  legalReferences?: string[];
  summaryPoints: string[];
  sections: TopicSection[];
  glossary: GlossaryTerm[];
  mindsets: string[]; // "Mentalidad de opositor" / Puntos críticos de memorización
}

export interface CourseModule {
  id: string;
  title: string;
  order: number;
  description: string;
  topics: Topic[];
}

export interface StudyPlanItem {
  week: number;
  topics: string;
  focus: string;
}

export interface PracticalScenarioItem {
  id: string;
  title: string;
  topicId: string;
  topicTitle: string;
  description: string;
  tag?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  status: 'active' | 'coming_soon';
  bannerBadge?: string;
  iconName: string;
  totalTopics: number;
  totalQuestions: number;
  estimatedHours: number;
  targetExam: string;
  notebooklmUrl?: string;
  audioOverviewUrl?: string;
  infographicUrl?: string;
  examStructure?: {
    totalQuestions: number;
    timeMinutes: number;
    block1CommonTheory: number;
    block2SpecificTheory: number;
    block3PracticalCases: number;
    totalPlaces: number;
    generalQuota: number;
    disabilityQuota: number;
  };
  studyPlan?: StudyPlanItem[];
  practicalScenarios?: (string | PracticalScenarioItem)[];
  modules: CourseModule[];
}

export interface CourseProgress {
  courseId: string;
  completedTopicIds: string[];
  lastVisitedTopicId?: string;
  quizAttempts: {
    quizId: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
    date: string;
    mode: 'practice' | 'simulation';
  }[];
}
