import { ChevronRight, TrendingUp } from 'lucide-react';
import { Exam, exams } from '../consts/exams';
import { useProgress } from '../context/ProgressContext';

export const Exams = () => {
  const { currentBelt, getCompletedCount, getProgressPercentage } = useProgress();
  const currentExam = exams.find((e) => e.id === currentBelt);

  return (
    <section className="flex flex-col gap-4 pt-4">
      {/* Tarjeta de progreso */}
      <div className="p-4 text-white rounded-xl bg-gradient-to-br from-primary-500 to-red-700">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">Tu progreso</span>
        </div>
        <div className="flex items-center gap-4">
          {currentExam && (
            <img 
              src={currentExam.img} 
              alt={currentExam.range} 
              className="w-16 p-1 bg-white rounded-lg"
            />
          )}
          <div className="flex-1">
            <p className="text-sm opacity-90">Cinturón actual</p>
            <p className="font-semibold">{currentExam?.range || 'Sin seleccionar'}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 overflow-hidden rounded-full bg-white/30">
                <div 
                  className="h-full transition-all duration-500 bg-white rounded-full"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <span className="text-xs font-medium">{getCompletedCount()}/17</span>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-xl">Selecciona tu examen</h1>
      <div className="space-y-4">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </section>
  );
};

const ExamCard = ({ exam }: { exam: Exam }) => {
  return (
    <div className="flex items-center justify-between px-4 py-6 bg-white rounded-full shadow-xs">
      <div className="flex items-center gap-3">
        <img src={exam.img} alt={exam.range} width={80} />
        <h2 className="font-semibold text-gray-800">{exam.range}</h2>
      </div>
      <ChevronRight color="#191919" size={20} />
    </div>
  );
};
