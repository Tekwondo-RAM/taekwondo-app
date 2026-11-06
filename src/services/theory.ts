import { useQuery } from '@tanstack/react-query';
import {
  getTheoryLesson,
  getTheoryLessonByExam,
  listTheoryLessons,
  type LessonListItem,
  type PublicLesson,
} from '@/api/theory';

export const theoryKeys = {
  base: ['theory'] as const,
  lessons: () => [...theoryKeys.base, 'lessons'] as const,
  lesson: (slug: string) => [...theoryKeys.base, 'lesson', slug] as const,
  lessonByExam: (examId: string) =>
    [...theoryKeys.base, 'lessonByExam', examId] as const,
};

export const useTheoryLessons = () => {
  return useQuery<LessonListItem[]>({
    queryKey: theoryKeys.lessons(),
    queryFn: () => listTheoryLessons(),
  });
};

export const useTheoryLesson = (slug: string) => {
  return useQuery<PublicLesson>({
    queryKey: theoryKeys.lesson(slug),
    queryFn: () => getTheoryLesson(slug),
    enabled: !!slug,
  });
};

export const useTheoryLessonByExam = (examId: string) => {
  return useQuery<PublicLesson>({
    queryKey: theoryKeys.lessonByExam(examId),
    queryFn: () => getTheoryLessonByExam(examId),
    enabled: !!examId,
  });
};
