import { useParams, Link } from 'react-router-dom';
import { BookOpen, Dumbbell } from 'lucide-react';
import { exams } from '../consts/exams';
import { tuls } from '../consts/tuls';
import { useProgress } from '../context/ProgressContext';

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
  'gup-1': ['hwa-rang', 'choong-moo'],
  'dan-1': ['kwang-gae', 'po-eun', 'ge-baek'],
  'dan-2': ['eui-am', 'choong-jang', 'juche'],
  'dan-3': [],
};

export const ExamDetail = () => {
  const { examId } = useParams<{ examId: string }>();
  const { getTulStatus } = useProgress();

  const exam = exams.find((e) => e.id === examId);

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-gray-500">Examen no encontrado</p>
        <Link to="/" className="text-primary-500 underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const requiredTuls = (examTuls[exam.id] || [])
    .map((tulId) => tuls.find((t) => t.id === tulId))
    .filter(Boolean);

  const completedTuls = requiredTuls.filter(
    (tul) => tul && getTulStatus(tul.id) === 'completed'
  ).length;

  return (
    <section className="flex flex-col gap-6 pt-4">
      {/* Header con imagen */}
      <div className="flex items-center gap-4">
        <img
          src={exam.img}
          alt={exam.range}
          className="w-24"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{exam.range}</h1>
          <p className="text-gray-500">{exam.color}</p>
        </div>
      </div>

      {/* Progreso del examen */}
      {requiredTuls.length > 0 && (
        <div className="p-4 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Progreso de tules
            </span>
            <span className="text-sm font-bold text-primary-500">
              {completedTuls}/{requiredTuls.length}
            </span>
          </div>
          <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
            <div
              className="h-full transition-all duration-500 rounded-full bg-primary-500"
              style={{
                width: `${(completedTuls / requiredTuls.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Tules requeridos */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold">Tules requeridos</h2>
        </div>
        {requiredTuls.length > 0 ? (
          <div className="space-y-2">
            {requiredTuls.map((tul) => {
              if (!tul) return null;
              const status = getTulStatus(tul.id);
              return (
                <Link
                  key={tul.id}
                  to={`/tul/${tul.id}`}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        status === 'completed'
                          ? 'bg-green-500'
                          : status === 'in_progress'
                          ? 'bg-amber-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    <div>
                      <p className="font-medium">{tul.name}</p>
                      <p className="text-xs text-gray-500">
                        {tul.moves} movimientos
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{tul.korean_name}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No hay tules específicos para este nivel.
          </p>
        )}
      </div>

      {/* Teoría requerida (placeholder) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-semibold">Teoría requerida</h2>
        </div>
        <div className="p-4 text-center border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-400 text-sm">Próximamente...</p>
        </div>
      </div>
    </section>
  );
};
