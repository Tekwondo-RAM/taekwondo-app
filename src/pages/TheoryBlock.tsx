import { Spinner } from '@/common/Spinner';
import { belts } from '@/consts/belts';
import { exams } from '@/consts/exams';
import { Route } from '@/routes/_auth/theory/block.$id';
import { useTheoryLessonByExam } from '@/services/theory';
import type { PublicLesson, TheorySection } from '@/api/theory';

const renderContent = (content: string) => {
  return content.split('\n').map((paragraph, idx) => {
    const trimmed = paragraph.trim();

    if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      const text = trimmed.slice(2, -2);
      return (
        <h3 key={idx} className="mt-4 mb-2 font-semibold text-gray-800">
          {text}
        </h3>
      );
    }

    if (/^#{1,3}\s+/.test(trimmed)) {
      const text = trimmed.replace(/^#{1,3}\s+/, '');
      return (
        <h3 key={idx} className="mt-4 mb-2 font-semibold text-gray-800">
          {text}
        </h3>
      );
    }

    if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      return (
        <li key={idx} className="ml-4 mb-1 text-gray-700">
          {trimmed.slice(2)}
        </li>
      );
    }

    if (trimmed === '') {
      return null;
    }

    return (
      <p key={idx} className="mb-5 text-gray-700 leading-relaxed">
        {trimmed}
      </p>
    );
  });
};

const renderSection = (section: TheorySection) => (
  <section key={section.id} className="mb-6 last:mb-0">
    {section.title ? (
      <h3 className="mt-2 mb-3 font-semibold text-gray-800">{section.title}</h3>
    ) : null}
    {renderContent(section.body)}
    {section.kidsBody ? (
      <div className="mt-3 rounded-lg bg-amber-50 p-3 text-amber-950">
        <p className="mb-2 text-sm font-medium">Para los más peques</p>
        {renderContent(section.kidsBody)}
      </div>
    ) : null}
  </section>
);

const LessonArticle = ({
  lesson,
  examLabel,
  beltLabel,
}: {
  lesson: PublicLesson;
  examLabel: string;
  beltLabel?: string;
}) => (
  <article className="p-5 bg-white rounded-xl text-pretty">
    <h2 className="text-lg font-medium text-gray-900 mb-2 text-balance">
      {examLabel}
    </h2>
    {beltLabel ? (
      <p className="mb-5 text-sm text-gray-500">{beltLabel}</p>
    ) : null}
    {lesson.summary ? (
      <div className="mb-6">{renderContent(lesson.summary)}</div>
    ) : null}
    {[...lesson.sections].sort((a, b) => a.order - b.order).map(renderSection)}
  </article>
);

export const TheoryBlock = () => {
  const { id: examId } = Route.useParams();
  const {
    data: lesson,
    isPending,
    isError,
    error,
  } = useTheoryLessonByExam(examId);

  if (isPending) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">
          {error?.message || 'Bloque no encontrado.'}
        </p>
      </div>
    );
  }

  const exam = exams.find((item) => item.id === examId);
  const belt = lesson.beltId
    ? belts.find((item) => item.id === lesson.beltId)
    : exam
      ? belts.find((item) => item.id === exam.belt)
      : undefined;

  return (
    <LessonArticle
      lesson={lesson}
      examLabel={exam?.range ?? lesson.examId ?? lesson.title}
      beltLabel={belt?.alt}
    />
  );
};
