import { useState } from 'react';
import { Button } from '../common/Button';
import { tuls } from '../consts/tuls';
import { TulVideo } from '../components/TulVideo';
import { useProgress, TulStatus } from '../context/ProgressContext';
import { Check, Clock, Circle } from 'lucide-react';

const statusOptions: { value: TulStatus; label: string; icon: typeof Check; activeClass: string }[] = [
  { value: 'not_started', label: 'Sin empezar', icon: Circle, activeClass: 'bg-gray-500 text-white border-gray-500' },
  { value: 'in_progress', label: 'En progreso', icon: Clock, activeClass: 'bg-amber-500 text-white border-amber-500' },
  { value: 'completed', label: 'Completado', icon: Check, activeClass: 'bg-green-500 text-white border-green-500' },
];

export const TulManagement = () => {
  const [watchingTul, setWatchingTul] = useState<boolean>(false);
  const { getTulStatus, setTulStatus } = useProgress();

  const currentUrl = window.location.href;

  const selectedTul = tuls.find(
    (tul) => tul.id === currentUrl.split('/').at(-1)
  );

  if (!selectedTul) {
    return <div>Tul no encontrado</div>;
  }

  const currentStatus = getTulStatus(selectedTul.id);

  if (watchingTul) {
    return <TulVideo selectedTul={selectedTul} />;
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium">{selectedTul.name}</h1>
          <p className="text-xl">{selectedTul.korean_name}</p>
        </div>
        <p className="text-lg">{selectedTul.moves} movimientos</p>
      </div>

      {/* Selector de estado */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-600">Tu progreso</p>
        <div className="flex gap-2">
          {statusOptions.map(({ value, label, icon: Icon, activeClass }) => (
            <button
              key={value}
              onClick={() => setTulStatus(selectedTul.id, value)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-full transition-all ${
                currentStatus === value
                  ? activeClass
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold">Diagrama</p>
        <img src={selectedTul.diagram} alt="Diagrama del tul" />
      </div>
      <Button
        handleClick={() => {
          setWatchingTul(true);
        }}
      >
        Ver forma
      </Button>
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold">Significado</p>
        <p>{selectedTul.meaning}</p>
      </div>
    </section>
  );
};
