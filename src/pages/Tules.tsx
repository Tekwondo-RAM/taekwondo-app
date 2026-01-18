import { Link } from 'react-router-dom';
import { tuls, Tul } from '../consts/tuls';
import { useProgress, TulStatus } from '../context/ProgressContext';
import { Check, Clock, Circle } from 'lucide-react';

export const Tules = () => {
  const { getCompletedCount, getProgressPercentage } = useProgress();
  
  return (
    <section className="flex flex-col gap-4 pt-4">
      {/* Barra de progreso */}
      <div className="p-4 bg-white rounded-lg shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso total</span>
          <span className="text-sm font-bold text-primary-500">{getCompletedCount()}/17 tules</span>
        </div>
        <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full">
          <div 
            className="h-full transition-all duration-500 rounded-full bg-gradient-to-r from-primary-500 to-red-400"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      <h1 className="text-xl">Selecciona tu tul</h1>
      <article className="grid grid-cols-2 gap-3">
        {tuls.map((tul) => (
          <TulCard key={tul.id} tul={tul} />
        ))}
      </article>
    </section>
  );
};

const StatusBadge = ({ status }: { status: TulStatus }) => {
  const config = {
    completed: {
      icon: Check,
      bg: 'bg-green-500',
      text: 'Completado',
    },
    in_progress: {
      icon: Clock,
      bg: 'bg-amber-500',
      text: 'En progreso',
    },
    not_started: {
      icon: Circle,
      bg: 'bg-gray-300',
      text: 'Sin empezar',
    },
  };

  const { icon: Icon, bg } = config[status];

  return (
    <div className={`absolute top-2 right-2 p-1.5 rounded-full ${bg} shadow-md`}>
      <Icon className="w-3.5 h-3.5 text-white" strokeWidth={3} />
    </div>
  );
};

const TulCard = ({ tul }: { tul: Tul }) => {
  const { getTulStatus } = useProgress();
  const status = getTulStatus(tul.id);

  return (
    <Link
      to={`/tul/${tul.id}`}
      className="relative flex flex-col gap-4 pb-4 overflow-hidden bg-white rounded-md shadow-xs"
    >
      <div className="relative">
        <img src="/imgs/Rectangle.png" alt="Tul" className="w-full" />
        <StatusBadge status={status} />
      </div>
      <div className="flex flex-col px-4">
        <h2 className="text-lg font-medium">{tul.name}</h2>
        <p className="text-sm text-gray-500">{tul.moves} movimientos</p>
      </div>
    </Link>
  );
};
