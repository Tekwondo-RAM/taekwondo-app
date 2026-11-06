import { client } from './client';

export type LessonKind = 'level' | 'reference';

export type TheorySection = {
  id: string;
  title: string;
  body: string;
  kidsBody: string | null;
  order: number;
};

export type PublicLesson = {
  slug: string;
  kind: LessonKind;
  level: number;
  examId: string | null;
  beltId: string | null;
  title: string;
  subtitle: string;
  summary: string;
  sections: TheorySection[];
  published: boolean;
  order: number;
  updatedAt?: string | null;
};

export type LessonListItem = {
  slug: string;
  kind: LessonKind;
  level: number;
  examId: string | null;
  beltId: string | null;
  title: string;
  subtitle: string;
  published: boolean;
  order: number;
  sectionCount: number;
  updatedAt?: string;
};

export const listTheoryLessons = () => {
  return client.get<LessonListItem[]>({
    url: '/api/theory/lessons',
  });
};

export const getTheoryLesson = (slug: string) => {
  return client.get<PublicLesson>({
    url: `/api/theory/lessons/${slug}`,
  });
};

export const getTheoryLessonByExam = (examId: string) => {
  return client.get<PublicLesson>({
    url: `/api/theory/lessons/by-exam/${examId}`,
  });
};
