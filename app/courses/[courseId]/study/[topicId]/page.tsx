import { notFound } from "next/navigation";
import { getAllCourses, getCourseById, getTopicById } from "@/data/courses";
import { StudySidebar } from "@/components/study/StudySidebar";
import { StudyReader } from "@/components/study/StudyReader";

interface PageProps {
  params: {
    courseId: string;
    topicId: string;
  };
}

export function generateStaticParams() {
  const courses = getAllCourses();
  const paramsList: { courseId: string; topicId: string }[] = [];

  courses.forEach((c) => {
    c.modules.forEach((mod) => {
      mod.topics.forEach((t) => {
        paramsList.push({
          courseId: c.id,
          topicId: t.id,
        });
      });
    });
  });

  return paramsList;
}

export default function StudyTopicPage({ params }: PageProps) {
  const { courseId, topicId } = params;
  const course = getCourseById(courseId);

  if (!course) {
    notFound();
  }

  const topicData = getTopicById(courseId, topicId);
  if (!topicData) {
    notFound();
  }

  // Calculate flat list of topic IDs for next/previous navigation
  const allTopicIds: string[] = [];
  course.modules.forEach((mod) => {
    mod.topics.forEach((t) => allTopicIds.push(t.id));
  });

  const currentIndex = allTopicIds.indexOf(topicId);
  const prevTopicId = currentIndex > 0 ? allTopicIds[currentIndex - 1] : null;
  const nextTopicId =
    currentIndex >= 0 && currentIndex < allTopicIds.length - 1
      ? allTopicIds[currentIndex + 1]
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Topic Index Sidebar */}
        <StudySidebar
          courseId={courseId}
          modules={course.modules}
          currentTopicId={topicId}
          completedTopicIds={[]}
        />

        {/* Study Reader Core */}
        <StudyReader
          courseId={courseId}
          topic={topicData.topic}
          moduleTitle={topicData.moduleTitle}
          isCompletedInitially={false}
          prevTopicId={prevTopicId}
          nextTopicId={nextTopicId}
        />
      </div>
    </div>
  );
}
