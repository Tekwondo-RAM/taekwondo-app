import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { exams } from '@/consts/exams';
import { tuls } from '@/consts/tuls';
import { useProgress } from '@/context/ProgressContext';
import { BeltIcon } from '@/components/BeltIcon';
import { belts } from '@/consts/belts';
import { Route } from '@/routes/_auth/exams/$examId';
import { TheoryBeltStripes } from '@/components/TheoryBeltStripes';
import { Spinner } from '@/common/Spinner';
import { cn } from '@/utils/cn';
import { useTheoryLessonByExam } from '@/services/theory';

// Mapeo de qué tules corresponden a cada examen
const examTuls: Record<string, string[]> = {
  'gup-9': ['saju-jirugi', 'saju-makgi'],
  'gup-8': ['chon-ji'],
  'gup-7': ['dan-gun'],
  'gup-6': ['do-san'],
  'gup-5': ['won-hyo'],
  'gup-4': ['yul-gok'],
  'gup-3': ['joong-gun'],
  'gup-2': ['toi-gye'],
  'gup-1': ['hwa-rang'],
  'dan-1': ['choong-moo'],
  'dan-2': ['kwang-gae', 'po-eun', 'ge-baek'],
  'dan-3': ['eui-am', 'choong-jang', 'juche'],
};

export const ExamDetail = () => {
  const { examId } = Route.useParams();
  const { getTulStatus } = useProgress();
  const {
    data: theoryLesson,
    isPending: isTheoryPending,
    isError: isTheoryError,
  } = useTheoryLessonByExam(examId);

  const exam = exams.find((e) => e.id === examId);
  const belt = belts.find((b) => b.id === exam?.belt);

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-gray-500">Examen no encontrado</p>
        <Link to="/" className="underline text-primary-500">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const theoryBelt = theoryLesson?.beltId
    ? belts.find((b) => b.id === theoryLesson.beltId)
    : belt;

  const requiredTuls = (examTuls[exam.id] || [])
    .map((tulId) => tuls.find((t) => t.id === tulId))
    .filter(Boolean);

  return (
    <section className="flex flex-col gap-6 pt-4">
      <div className="flex items-center gap-4">
        {belt && <BeltIcon belt={belt} className="w-16 h-auto" />}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Nivel {exam.range}
          </h1>
          <p className="text-gray-500">{belt?.alt}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Tules</h2>
        {requiredTuls.length > 0 ? (
          <div className="flex flex-col gap-3">
            {requiredTuls.map((tul) => {
              if (!tul) return null;
              const status = getTulStatus(tul.id);
              return (
                <Link
                  key={tul.id}
                  to="/tules/$tulId"
                  params={{ tulId: tul.id }}
                  aria-label={`Ir a la forma ${tul.name}`}
                  className={cn(
                    'flex items-center gap-3 bg-white rounded-lg shadow-[0_4px_0_#cdc9c9] p-4',
                    'transition-colors active:bg-slate-50'
                  )}
                >
                  <div className="shrink-0 size-16 rounded-lg overflow-hidden border-2 border-primary-500 bg-white">
                    <img
                      src={tul.diagram}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black font-manrope text-gray-900">
                        {tul.name}
                      </span>
                      {tul.isPreTul && (
                        <span className="px-1.5 py-0.5 text-xs font-medium text-white rounded bg-amber-500">
                          Pre-Tul
                        </span>
                      )}
                      <span
                        className={cn(
                          'size-2.5 rounded-full shrink-0',
                          status === 'completed' && 'bg-green-500',
                          status === 'in_progress' && 'bg-amber-500',
                          status !== 'completed' &&
                            status !== 'in_progress' &&
                            'bg-gray-300'
                        )}
                        aria-hidden
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      {tul.moves} movimientos
                    </span>
                  </div>
                  <ChevronRight
                    aria-hidden
                    className="shrink-0 text-[#191919]"
                    size={28}
                  />
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No hay tules específicos para este nivel.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Teoría</h2>
        {isTheoryPending ? (
          <div className="flex justify-center py-8">
            <Spinner className="size-6" />
          </div>
        ) : null}
        {!isTheoryPending && theoryLesson && theoryBelt ? (
          <Link
            to="/theory/block/$id"
            params={{ id: exam.id }}
            className="relative overflow-hidden flex flex-col justify-end gap-2 p-4 bg-white rounded-lg shadow-[0_4px_0_#cdc9c9] min-h-44 text-left transition-colors active:bg-slate-50"
          >
            <TheoryBeltStripes belt={theoryBelt} />
            <span className="text-xs text-balance text-gray-600">
              {theoryBelt.alt}
            </span>
            <span className="font-semibold text-xl text-balance text-gray-900">
              {exam.range}
            </span>
            <span className="flex items-center justify-between text-sm text-gray-800 pt-1">
              Lectura
              <ChevronRight aria-hidden size={20} />
            </span>
          </Link>
        ) : null}
        {!isTheoryPending && (isTheoryError || !theoryLesson) ? (
          <p className="text-sm text-gray-400">
            No hay teoría publicada para este examen.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Posiciones</h2>
        <p className="text-sm text-gray-400">
          Contenido pendiente; lo indicarás después.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Roturas</h2>
        <div className="flex items-center gap-3 bg-white rounded-lg shadow-[0_4px_0_#cdc9c9] p-4 text-gray-800">
          <p className="text-sm leading-snug flex-1">{exam.breaking}</p>
        </div>
      </div>
    </section>
  );
};
