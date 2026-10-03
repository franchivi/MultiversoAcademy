import { getAllCourses, getCourseById } from "@/data/courses";
import { notFound } from "next/navigation";
import { CourseHubView } from "@/components/course/CourseHubView";

interface CoursePageProps {
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

export default function CourseHubPage({ params }: CoursePageProps) {
  const course = getCourseById(params.courseId);

  if (!course) {
    notFound();
  }

  return <CourseHubView course={course} />;
}
