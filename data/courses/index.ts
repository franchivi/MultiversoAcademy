import { Course, Topic } from "@/types/course";
import { QuizQuestion } from "@/types/quiz";
import curso1Data from "./curso-1.json";
import curso2Data from "./curso-2.json";
import curso3Data from "./curso-3.json";

// Cast imported JSON data to typed structures
const coursesDatabase: Record<string, Course & { questions?: QuizQuestion[] }> = {
  "curso-1": curso1Data as unknown as Course & { questions: QuizQuestion[] },
  "curso-2": curso2Data as unknown as Course & { questions: QuizQuestion[] },
  "curso-3": curso3Data as unknown as Course & { questions: QuizQuestion[] }
};

export function getAllCourses(): Course[] {
  return Object.values(coursesDatabase).map(({ questions, ...course }) => course);
}

export function getCourseById(idOrSlug: string): (Course & { questions?: QuizQuestion[] }) | null {
  return coursesDatabase[idOrSlug] || null;
}

export function getTopicById(courseId: string, topicId: string): { topic: Topic; moduleTitle: string; courseTitle: string } | null {
  const course = coursesDatabase[courseId];
  if (!course) return null;

  for (const mod of course.modules) {
    const topic = mod.topics.find(t => t.id === topicId);
    if (topic) {
      return {
        topic,
        moduleTitle: mod.title,
        courseTitle: course.title
      };
    }
  }

  return null;
}

export function getCourseQuestions(courseId: string): QuizQuestion[] {
  const course = coursesDatabase[courseId];
  return course?.questions || [];
}
