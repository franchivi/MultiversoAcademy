import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAllCourses, getCourseById } from "@/data/courses";
import { QuizView } from "@/components/quiz/QuizView";

interface QuizPageProps {
  params: {
    courseId: string;
  };
}

export function generateStaticParams() {
  const courses = getAllCourses();
  return courses.map((course) => ({
    courseId: course.id,
  }));
}

export default function CourseQuizPage({ params }: QuizPageProps) {
  const course = getCourseById(params.courseId);

  if (!course) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-sm text-slate-500">
          Cargando banco de preguntas...
        </div>
      }
    >
      <QuizView courseId={params.courseId} />
    </Suspense>
  );
}
