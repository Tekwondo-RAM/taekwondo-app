import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Play } from 'lucide-react';
import {
  vocabulary,
  categoryLabels,
  type VocabularyCategory,
} from '@/consts/vocabulary';
import { Quiz } from '@/components/Quiz';
import KoreanBlock from '@/assets/korean-block.svg?react';
import { belts } from '@/consts/belts';
import { exams } from '@/consts/exams';
import { TheoryBeltStripes } from '@/components/TheoryBeltStripes';
import { Spinner } from '@/common/Spinner';
import { useTheoryLessons } from '@/services/theory';

type ViewMode = 'categories' | 'study' | 'quiz';

const categories = Array.from(
  new Set(vocabulary.map((v) => v.category))
) as VocabularyCategory[];

export const Theory = () => {
  const { data: lessons, isPending, isError, error } = useTheoryLessons();

  const examLessons = (lessons ?? []).filter(
    (lesson) => lesson.kind === 'level' && lesson.examId
  );

  return (
    <section className="flex flex-col gap-6">
      {isPending ? (
        <div className="flex justify-center py-12">
          <Spinner className="size-8" />
        </div>
      ) : null}

      {isError ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">
            {error.message || 'No se pudieron cargar las lecciones.'}
          </p>
        </div>
      ) : null}

      {!isPending && !isError ? (
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {examLessons.map((lesson) => {
            const examId = lesson.examId!;
            const exam = exams.find((e) => e.id === examId);
            const belt = lesson.beltId
              ? belts.find((b) => b.id === lesson.beltId)
              : exam
                ? belts.find((b) => b.id === exam.belt)
                : undefined;

            return (
              <Link
                key={lesson.slug}
                to="/theory/block/$id"
                params={{ id: examId }}
                className="relative overflow-hidden flex flex-col justify-end gap-2 p-4 bg-white rounded-lg shadow-[0_4px_0_#cdc9c9] min-h-48"
              >
                {belt ? <TheoryBeltStripes belt={belt} /> : null}
                {belt ? (
                  <span className="text-xs text-balance text-gray-600">
                    {belt.alt}
                  </span>
                ) : null}
                <span className="font-semibold text-xl text-balance">
                  {exam?.range ?? examId}
                </span>
                <span className="flex items-center justify-between text-sm">
                  Lectura
                  <ArrowRight size={20} />
                </span>
              </Link>
            );
          })}

          <Link
            to="/theory/learn-korean"
            className="relative overflow-hidden flex flex-col p-4 bg-primary-500 text-white rounded-lg shadow-[0_4px_0_#000] min-h-48"
          >
            <span className="absolute right-0 inset-y-0 flex items-center">
              <KoreanBlock />
            </span>
            <span className="flex-1 flex flex-col justify-end gap-2">
              <span className="flex-1 text-sm">Aprendizaje Libre</span>
              <span className="text-sm">Coreano</span>
              <span className="font-semibold text-2xl">Idioma</span>
            </span>
            <span className="flex justify-end">
              <ArrowRight size={20} />
            </span>
          </Link>
        </div>
      ) : null}
    </section>
  );
};

export const TheoryLearnKorean = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [selectedCategory, setSelectedCategory] =
    useState<VocabularyCategory | null>(null);

  const handleCategorySelect = (category: VocabularyCategory) => {
    setSelectedCategory(category);
    setViewMode('study');
  };

  const handleStartQuiz = () => {
    setViewMode('quiz');
  };

  if (viewMode === 'quiz') {
    return (
      <Quiz
        items={
          selectedCategory
            ? vocabulary.filter((v) => v.category === selectedCategory)
            : vocabulary
        }
        onBack={() => setViewMode('categories')}
      />
    );
  }

  if (viewMode === 'study' && selectedCategory) {
    const categoryItems = vocabulary.filter(
      (v) => v.category === selectedCategory
    );

    return (
      <section className="flex flex-col gap-4 pt-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMode('categories')}
            className="text-primary-500 hover:underline"
          >
            ← Volver a categorías
          </button>
          <button
            type="button"
            onClick={handleStartQuiz}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-primary-500 hover:bg-phover-500"
          >
            <Play className="size-4" />
            Hacer quiz
          </button>
        </div>

        <h1 className="text-2xl font-bold">
          {categoryLabels[selectedCategory]}
        </h1>

        <div className="grid gap-3 sm:grid-cols-2">
          {categoryItems.map((item, index) => (
            <VocabularyCard key={index} item={item} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Aprende coreano</h2>
      <p className="text-gray-600">Haz concursos para aprender coreano</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const categoryItems = vocabulary.filter(
            (v) => v.category === category
          );
          return (
            <button
              type="button"
              key={category}
              onClick={() => handleCategorySelect(category)}
              className="flex items-center gap-3 p-4 text-left transition-all bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-[0_4px_0_#cdc9c9]"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{categoryLabels[category]}</h3>
                <p className="text-sm text-gray-500">
                  {categoryItems.length} palabras
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

const VocabularyCard = ({ item }: { item: (typeof vocabulary)[0] }) => {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-lg font-bold text-gray-800">{item.korean}</p>
          <p className="text-sm italic text-gray-500">{item.pronunciation}</p>
          <p className="mt-1 font-medium text-primary-500">{item.spanish}</p>
        </div>
      </div>
    </div>
  );
};
