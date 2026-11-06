import {
  MediaActionTypes,
  MediaProvider,
  useMediaDispatch,
  useMediaFullscreenRef,
  useMediaRef,
  useMediaSelector,
} from 'media-chrome/react/media-store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Loader2Icon,
  Minus,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RotateCw,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { Button } from './Button';
import { tuls, type Tul } from '@/consts/tuls';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '@/utils/cn';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from './Drawer';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { Label } from './Label';
import { Separator } from './Separator';
import { useSettingsStore } from '@/hooks/useSettingsStore';

const CONTROLS_VISIBLE_TIMEOUT_MS = 3000;
const LOADING_DELAY_MS = 500;
const SPEEDS = [0.5, 1, 1.5, 2];
const TIME_UPDATE_MS = 50;

const getMovementIndex = (timestamps: number[], currentTime: number) =>
  Math.max(
    0,
    timestamps.findIndex(
      (_, i) => currentTime < (timestamps[i + 1] ?? Number.POSITIVE_INFINITY)
    )
  );

interface PlayerProps {
  tul: Tul;
  controlsVisible?: boolean;
  currentVideoIndex?: number;
  onControlsVisibleChange?: React.Dispatch<React.SetStateAction<boolean>>;
  onCurrentVideoIndexChange?: React.Dispatch<React.SetStateAction<number>>;
}

const PlayerContext = createContext<PlayerProps | null>(null);

function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error(`\`usePlayer\` must be used within \`PlayerProvider\``);
  }
  return context;
}

function PlayerProvider(props: React.ProviderProps<PlayerProps | null>) {
  return (
    <MediaProvider>
      <PlayerContext {...props} />
    </MediaProvider>
  );
}

function PlayerLoading({
  delayMs = LOADING_DELAY_MS,
  className,
  children: _,
  ...props
}: React.ComponentProps<'div'> & {
  delayMs?: number;
  asChild?: boolean;
}) {
  const isLoading = useMediaSelector((state) => state.mediaLoading ?? false);
  const isPaused = useMediaSelector((state) => state.mediaPaused ?? true);
  const hasPlayed = useMediaSelector((state) => state.mediaHasPlayed ?? false);

  const shouldShowLoading = isLoading && !isPaused;
  const shouldUseDelay = hasPlayed && shouldShowLoading;
  const loadingDelayMs = shouldUseDelay ? delayMs : 0;

  const [shouldRender, setShouldRender] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (shouldShowLoading) {
      if (loadingDelayMs > 0) {
        timeoutRef.current = setTimeout(() => {
          setShouldRender(true);
          timeoutRef.current = null;
        }, loadingDelayMs);
      } else {
        setShouldRender(true);
      }
    } else {
      setShouldRender(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [shouldShowLoading, loadingDelayMs]);

  if (!shouldRender) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-slot="media-player-loading"
      {...props}
      className={cn(
        'pointer-events-none absolute inset-0 z-50 flex items-center justify-center',
        className
      )}
    >
      <Loader2Icon className="size-20 animate-spin stroke-[.0938rem] text-neutral-300" />
    </div>
  );
}

function Video(props: React.ComponentProps<'video'>) {
  const { tul, currentVideoIndex } = usePlayer();
  const mediaRef = useMediaRef();
  const { loopVideo, pauseBetweenMovements } = useSettingsStore();
  const src = useMemo(
    () => tul.video[currentVideoIndex ?? 0],
    [tul, currentVideoIndex]
  );
  const nextMovementTimestampRef = useRef<number | null>(null);
  const timeUpdateIntervalRef = useRef<number | null>(null);

  const updateNextMovementTimestamp = useCallback(
    (video: HTMLVideoElement) => {
      const { currentTime } = video;
      const currentMovementIndex = getMovementIndex(
        tul.movementTimestamps,
        currentTime + (TIME_UPDATE_MS * 2) / 1000
      );
      nextMovementTimestampRef.current =
        currentMovementIndex + 1 < tul.movementTimestamps.length
          ? tul.movementTimestamps[currentMovementIndex + 1]
          : null;
    },
    [tul.movementTimestamps]
  );

  const handleTimeUpdate = useCallback(
    (video: HTMLVideoElement) => {
      const { currentTime } = video;
      if (
        pauseBetweenMovements &&
        nextMovementTimestampRef.current &&
        currentTime + (TIME_UPDATE_MS * 2) / 1000 >
          nextMovementTimestampRef.current
      ) {
        video.pause();
      }
    },
    [pauseBetweenMovements]
  );

  const handlePlay = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (pauseBetweenMovements && !timeUpdateIntervalRef.current) {
        updateNextMovementTimestamp(e.target as HTMLVideoElement);
        timeUpdateIntervalRef.current = setInterval(() => {
          handleTimeUpdate(e.target as HTMLVideoElement);
        }, TIME_UPDATE_MS);
      }
      props.onPlay?.(e);
    },
    [
      props,
      handleTimeUpdate,
      pauseBetweenMovements,
      updateNextMovementTimestamp,
    ]
  );

  const handlePause = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }
      props.onPause?.(e);
    },
    [props]
  );

  const handleSeeking = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (pauseBetweenMovements) {
        updateNextMovementTimestamp(e.target as HTMLVideoElement);
      }
      props.onSeeking?.(e);
    },
    [props, updateNextMovementTimestamp, pauseBetweenMovements]
  );

  return (
    <video
      ref={mediaRef}
      src={src}
      autoPlay
      loop={loopVideo && !pauseBetweenMovements}
      preload="auto"
      slot="media"
      onPlay={handlePlay}
      onPause={handlePause}
      onSeeking={handleSeeking}
      {...props}
    />
  );
}

function formatPlaybackTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function PlayerTimeline(props: React.ComponentProps<'div'>) {
  const dispatch = useMediaDispatch();
  const currentTime = useMediaSelector((state) => state.mediaCurrentTime ?? 0);
  const mediaDuration = useMediaSelector((state) => {
    const duration = state.mediaDuration ?? 0;
    return Number.isFinite(duration) && duration > 0 ? duration : 0;
  });

  const timelineMax = mediaDuration > 0 ? mediaDuration : 0.1;
  const timelineValue =
    mediaDuration > 0 ? Math.min(currentTime, mediaDuration) : 0;

  const onTimelineChange = useCallback(
    (value: number | number[]) => {
      const nextTime = Array.isArray(value) ? value[0] : value;
      dispatch({
        type: MediaActionTypes.MEDIA_SEEK_REQUEST,
        detail: nextTime,
      });
    },
    [dispatch]
  );

  return (
    <div
      data-slot="player-timeline"
      className="absolute inset-x-3 bottom-3 z-40 rounded-md bg-black/45 px-2 py-1.5 backdrop-blur-xs landscape:inset-x-6 landscape:bottom-4"
      {...props}
    >
      <Slider
        aria-label="Linea de tiempo del video"
        className="w-full"
        min={0}
        max={timelineMax}
        step={0.1}
        value={timelineValue}
        onValueChange={onTimelineChange}
      />
      <div className="mt-1 flex items-center justify-between text-[11px] font-medium tabular-nums text-white/90">
        <span>{formatPlaybackTime(timelineValue)}</span>
        <span>{formatPlaybackTime(mediaDuration)}</span>
      </div>
    </div>
  );
}

function PlayButton({
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const dispatch = useMediaDispatch();
  const mediaPaused = useMediaSelector((state) => state.mediaPaused ?? true);

  const onPlayToggle = useCallback(() => {
    const type = mediaPaused
      ? MediaActionTypes.MEDIA_PLAY_REQUEST
      : MediaActionTypes.MEDIA_PAUSE_REQUEST;
    dispatch({ type });
  }, [dispatch, mediaPaused]);

  return (
    <Button
      type="button"
      aria-label={mediaPaused ? 'Reproducir' : 'Pausar'}
      aria-pressed={!mediaPaused}
      data-slot="play-button"
      {...props}
      onClick={onPlayToggle}
    >
      {children ?? (mediaPaused ? <Play /> : <Pause />)}
    </Button>
  );
}

function PlayerContainer(props: React.ComponentProps<'div'>) {
  const mediaFullscreenRef = useMediaFullscreenRef();
  const { onControlsVisibleChange: setControlsVisible } = usePlayer();
  const mediaPaused = useMediaSelector((state) => state.mediaPaused ?? true);
  const hideControlsTimeoutRef = useRef<number | null>(null);

  const onControlsShow = useCallback(() => {
    setControlsVisible?.(true);

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    if (!mediaPaused) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible?.(false);
      }, CONTROLS_VISIBLE_TIMEOUT_MS);
    }
  }, [mediaPaused, setControlsVisible]);

  useEffect(() => {
    onControlsShow();
    window.addEventListener('resize', onControlsShow);
    return () => {
      window.removeEventListener('resize', onControlsShow);
    };
  }, [mediaPaused, onControlsShow]);

  return (
    <div
      data-slot="player-container"
      ref={mediaFullscreenRef}
      onMouseMove={onControlsShow}
      {...props}
    />
  );
}

function GoToMovementButton({
  children,
  direction,
  ...props
}: React.ComponentProps<typeof Button> & {
  direction: 'next' | 'prev';
}) {
  const { tul } = usePlayer();
  const dispatch = useMediaDispatch();
  const currentTime = useMediaSelector((state) => state.mediaCurrentTime ?? 0);

  const goToMovement = useCallback(() => {
    let newMovementIndex;
    const movements = tul.movementTimestamps.length;
    const currentMovementIndex = getMovementIndex(
      tul.movementTimestamps,
      currentTime
    );

    if (direction === 'next') {
      newMovementIndex = (currentMovementIndex + 1) % movements;
    } else {
      const currentMovementTime = tul.movementTimestamps[currentMovementIndex];
      const repeatMovement = currentTime - currentMovementTime >= 1;
      newMovementIndex = repeatMovement
        ? currentMovementIndex
        : (currentMovementIndex - 1 + movements) % movements;
    }

    const newTime = tul.movementTimestamps[newMovementIndex];

    dispatch({
      type: MediaActionTypes.MEDIA_SEEK_REQUEST,
      detail: newTime,
    });
    dispatch({
      type: MediaActionTypes.MEDIA_PLAY_REQUEST,
    });
  }, [direction, dispatch, currentTime, tul.movementTimestamps]);

  return (
    <Button
      aria-label={`${direction === 'next' ? 'Siguiente' : 'Anterior'} movimiento`}
      data-slot="go-to-movement-button"
      type="button"
      {...props}
      onClick={goToMovement}
    >
      {children ?? (direction === 'next' ? <ChevronRight /> : <ChevronLeft />)}
    </Button>
  );
}

function MovementDisplay(props: React.ComponentProps<'p'>) {
  const { tul } = usePlayer();
  const currentTime = useMediaSelector((state) => state.mediaCurrentTime ?? 0);
  const { showMovementName, showNameInKorean } = useSettingsStore();

  const currentMovement = useMemo(
    () => getMovementIndex(tul.movementTimestamps, currentTime),
    [tul.movementTimestamps, currentTime]
  );

  return (
    <p data-slot="movement-display" {...props}>
      {(showNameInKorean ? tul.korean_name : tul.name) +
        (showMovementName ? ` - Movimiento ${currentMovement + 1}` : '')}
    </p>
  );
}

function GoToTulButton({
  children,
  direction,
  ...props
}: React.ComponentProps<typeof Button> & {
  direction: 'next' | 'prev';
}) {
  const { tul } = usePlayer();
  const dispatch = useMediaDispatch();
  const navigate = useNavigate();

  const goToTul = useCallback(() => {
    let newTulIndex;
    if (direction === 'next') {
      newTulIndex = (tuls.findIndex((t) => t.id === tul.id) + 1) % tuls.length;
    } else {
      newTulIndex = (tuls.findIndex((t) => t.id === tul.id) - 1) % tuls.length;
    }
    dispatch({
      type: MediaActionTypes.MEDIA_SEEK_REQUEST,
      detail: 0,
    });
    navigate({
      to: '/tules/$tulId/video',
      params: { tulId: tuls[newTulIndex].id },
    });
  }, [direction, dispatch, navigate, tul.id]);

  return (
    <Button
      aria-label={`${direction === 'next' ? 'Siguiente' : 'Anterior'} forma`}
      data-slot="go-to-tul-button"
      type="button"
      {...props}
      onClick={goToTul}
    >
      {children ?? (direction === 'next' ? <SkipForward /> : <SkipBack />)}
    </Button>
  );
}

function SwitchVideoButton(props: React.ComponentProps<typeof Button>) {
  const {
    onCurrentVideoIndexChange: setCurrentVideoIndex,
    currentVideoIndex,
    tul,
  } = usePlayer();
  const dispatch = useMediaDispatch();
  const mediaRef = useMediaRef();
  const prevTimeRef = useRef<number>(0);
  const prevVideoIndexRef = useRef<number>(currentVideoIndex ?? 0);
  const prevMediaPausedRef = useRef<boolean>(true);
  const currentTime = useMediaSelector((state) => state.mediaCurrentTime ?? 0);
  const mediaPaused = useMediaSelector((state) => state.mediaPaused ?? true);

  const restorePlaybackState = useCallback(
    (time: number, paused: boolean) => {
      dispatch({
        type: MediaActionTypes.MEDIA_SEEK_REQUEST,
        detail: time,
      });
      dispatch({
        type: paused
          ? MediaActionTypes.MEDIA_PAUSE_REQUEST
          : MediaActionTypes.MEDIA_PLAY_REQUEST,
      });
    },
    [dispatch]
  );

  const switchVideo = useCallback(() => {
    const liveCurrentTime = mediaRef.current?.currentTime;
    prevTimeRef.current =
      typeof liveCurrentTime === 'number' && Number.isFinite(liveCurrentTime)
        ? liveCurrentTime
        : currentTime;
    prevMediaPausedRef.current = mediaPaused;
    setCurrentVideoIndex?.((prevIndex) => (prevIndex + 1) % tul.video.length);
  }, [currentTime, mediaPaused, mediaRef, setCurrentVideoIndex, tul.video.length]);

  useEffect(() => {
    if (currentVideoIndex !== prevVideoIndexRef.current) {
      const videoElement = mediaRef.current;
      const targetTime = prevTimeRef.current;
      const wasPaused = prevMediaPausedRef.current;
      const restoreCurrentTimeline = () =>
        restorePlaybackState(targetTime, wasPaused);

      videoElement?.addEventListener('loadedmetadata', restoreCurrentTimeline, {
        once: true,
      });
      restoreCurrentTimeline();
      prevVideoIndexRef.current = currentVideoIndex ?? 0;

      return () => {
        videoElement?.removeEventListener(
          'loadedmetadata',
          restoreCurrentTimeline
        );
      };
    }
  }, [currentVideoIndex, mediaRef, restorePlaybackState]);

  return (
    <Button
      aria-label="Cambiar de ángulo"
      data-slot="switch-video-button"
      type="button"
      {...props}
      onClick={switchVideo}
    >
      <RotateCw />
    </Button>
  );
}

function MoreButton(props: React.ComponentProps<typeof Button>) {
  const {
    setSettings,
    showMovementName,
    showNameInKorean,
    pauseBetweenMovements,
    loopVideo,
  } = useSettingsStore();

  return (
    <Drawer>
      <DrawerTrigger
        render={
          <Button
            aria-label="Más opciones"
            data-slot="more-button"
            type="button"
            {...props}
          >
            <MoreHorizontal />
          </Button>
        }
      />
      <DrawerPopup className="landscape:mx-auto landscape:max-w-sm">
        <DrawerContent className="flex flex-col gap-4">
          <div className="sr-only">
            <DrawerTitle>Opciones</DrawerTitle>
            <DrawerDescription>
              Configura la reproducción del video
            </DrawerDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-movement-name"
              checked={showMovementName}
              onCheckedChange={(checked) =>
                setSettings({ showMovementName: checked })
              }
            />
            <Label htmlFor="show-movement-name">Mostrar movimientos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-name-in-korean"
              checked={showNameInKorean}
              onCheckedChange={(checked) =>
                setSettings({ showNameInKorean: checked })
              }
            />
            <Label htmlFor="show-name-in-korean">
              Mostrar la forma en coreano
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="pause-between-movements"
              checked={pauseBetweenMovements}
              onCheckedChange={(checked) =>
                setSettings({ pauseBetweenMovements: checked })
              }
            />
            <Label htmlFor="pause-between-movements">
              Pausar entre movimientos
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="loop-video"
              checked={loopVideo}
              disabled={pauseBetweenMovements}
              onCheckedChange={(checked) => setSettings({ loopVideo: checked })}
            />
            <Label htmlFor="loop-video">Reproducir en bucle</Label>
          </div>
          <Separator />
          <PlayerPlaybackSpeed />
        </DrawerContent>
      </DrawerPopup>
    </Drawer>
  );
}

function PlayerPlaybackSpeed({
  speeds = SPEEDS,
  ...props
}: React.ComponentProps<'div'> & {
  speeds?: number[];
}) {
  const dispatch = useMediaDispatch();
  const mediaPlaybackRate = useMediaSelector(
    (state) => state.mediaPlaybackRate ?? 1
  );

  const onPlaybackRateChange = useCallback(
    (rate: number) => {
      dispatch({
        type: MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST,
        detail: rate,
      });
    },
    [dispatch]
  );

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">Cambiar velocidad</div>
        <div className="font-bold tabular-nums">
          {mediaPlaybackRate.toFixed(2)}x
        </div>
      </div>
      <div className="flex items-center justify-stretch gap-4 w-full">
        <Button
          aria-label="Disminuir velocidad"
          variant="outline"
          size="icon-sm"
          className="shrink-0"
          onClick={() => onPlaybackRateChange(mediaPlaybackRate - 0.05)}
          disabled={mediaPlaybackRate <= 0.5}
        >
          <Minus />
        </Button>
        <Slider
          className="flex-1"
          value={mediaPlaybackRate}
          onValueChange={(value) =>
            onPlaybackRateChange(Array.isArray(value) ? value[0] : value)
          }
          min={0.5}
          max={2}
          step={0.05}
        />
        <Button
          aria-label="Aumentar velocidad"
          variant="outline"
          size="icon-sm"
          className="shrink-0"
          onClick={() => onPlaybackRateChange(mediaPlaybackRate + 0.05)}
          disabled={mediaPlaybackRate >= 2}
        >
          <Plus />
        </Button>
      </div>
      <div className="flex gap-2" {...props}>
        {speeds.map((speed) => (
          <Button
            aria-label={`Cambiar velocidad a ${speed}x`}
            aria-pressed={mediaPlaybackRate === speed}
            key={speed}
            variant={mediaPlaybackRate === speed ? 'primary' : 'outline'}
            size="sm"
            className="flex-1 h-9 px-4"
            onClick={() => onPlaybackRateChange(speed)}
          >
            {speed}x
          </Button>
        ))}
      </div>
    </div>
  );
}

const LANDSCAPE_BUTTON_CLASSNAME =
  'landscape:bg-black/40 landscape:active:bg-neutral-800/40 landscape:text-white landscape:border-0';

export function Player(props: PlayerProps) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoFrameClassName =
    currentVideoIndex === 1 ? 'object-[50%_center]' : 'object-[50%_center]';

  return (
    <PlayerProvider
      value={{
        ...props,
        controlsVisible,
        onControlsVisibleChange: setControlsVisible,
        currentVideoIndex,
        onCurrentVideoIndexChange: setCurrentVideoIndex,
      }}
    >
      <PlayerContainer className="flex flex-col gap-4 h-full portrait:-mx-4 landscape:absolute landscape:inset-0 landscape:bg-black landscape:z-50">
        <div className="bg-black flex-1 h-full relative overflow-hidden">
          <Video
            className={cn('size-full object-cover', videoFrameClassName)}
          />
          <PlayerTimeline />
          <PlayerLoading />
        </div>
        <div
          data-slot="controls"
          data-visible={controlsVisible ? '' : undefined}
          className="flex flex-col gap-2 px-4 transition-opacity duration-300 landscape:absolute landscape:bottom-0 landscape:inset-x-0 landscape:p-6 landscape:bg-linear-to-t landscape:from-black/80 landscape:to-transparent landscape:opacity-0 landscape:pointer-events-none landscape:data-visible:opacity-100 landscape:data-visible:pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-4">
            <GoToMovementButton
              direction="prev"
              size="icon-sm"
              variant="outline"
              className={LANDSCAPE_BUTTON_CLASSNAME}
            />
            <MovementDisplay className="font-medium text-pretty text-center landscape:bg-black/40 landscape:text-white landscape:rounded-full landscape:px-3 landscape:py-1" />
            <GoToMovementButton
              direction="next"
              size="icon-sm"
              variant="outline"
              className={LANDSCAPE_BUTTON_CLASSNAME}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <SwitchVideoButton
              size="icon-md"
              variant="outline"
              className={LANDSCAPE_BUTTON_CLASSNAME}
            />
            <div className="flex items-center justify-center gap-4">
              <GoToTulButton
                direction="prev"
                size="icon-md"
                variant="outline"
                className={LANDSCAPE_BUTTON_CLASSNAME}
              />
              <PlayButton
                size="icon-lg"
                className={LANDSCAPE_BUTTON_CLASSNAME}
              />
              <GoToTulButton
                direction="next"
                size="icon-md"
                variant="outline"
                className={LANDSCAPE_BUTTON_CLASSNAME}
              />
            </div>
            <MoreButton
              size="icon-md"
              variant="outline"
              className={LANDSCAPE_BUTTON_CLASSNAME}
            />
          </div>
        </div>
      </PlayerContainer>
    </PlayerProvider>
  );
}
