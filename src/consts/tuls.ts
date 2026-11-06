export type Tul = {
  id: string;
  name: string;
  korean_name: string;
  moves: number;
  meaning: string;
  diagram: string;
  video: string[];
  movementTimestamps: number[];
  isPreTul?: boolean;
};

const TEST_VIDEO_PATHS: [string, string] = [
  '/videos/test.mp4',
  '/videos/test back.mp4',
];

export const tuls: Tul[] = [
  {
    id: 'saju-jirugi',
    name: 'Saju Jirugi',
    korean_name: '사주 지르기',
    moves: 14,
    meaning:
      'Ejercicio básico de cuatro direcciones para aprender el golpe de puño.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
    isPreTul: true,
  },
  {
    id: 'saju-makgi',
    name: 'Saju Makgi',
    korean_name: '사주 막기',
    moves: 14,
    meaning:
      'Ejercicio básico de cuatro direcciones para aprender las defensas.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
    isPreTul: true,
  },
  {
    id: 'chon-ji',
    name: 'Chon-Ji',
    korean_name: '천지',
    moves: 19,
    meaning:
      'Significa Cielo y Tierra, representando el origen del mundo y la vida humana.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'dan-gun',
    name: 'Dan-Gun',
    korean_name: '단군',
    moves: 21,
    meaning: 'Nombrado por el legendario fundador de Corea en el año 2333 a.C.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'do-san',
    name: 'Do-San',
    korean_name: '도산',
    moves: 24,
    meaning:
      'Seudónimo del patriota Ahn Chang Ho, dedicado a la educación y la independencia de Corea.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'won-hyo',
    name: 'Won-Hyo',
    korean_name: '원효',
    moves: 28,
    meaning:
      'Nombrado por el monje que introdujo el budismo en la dinastía Silla.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'yul-gok',
    name: 'Yul-Gok',
    korean_name: '율곡',
    moves: 38,
    meaning: 'Seudónimo del filósofo Yi I, llamado el Confucio de Corea.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'joong-gun',
    name: 'Joong-Gun',
    korean_name: '중근',
    moves: 32,
    meaning:
      'Nombrado por el patriota Ahn Joong Gun, símbolo de sacrificio y justicia.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'toi-gye',
    name: 'Toi-Gye',
    korean_name: '퇴계',
    moves: 37,
    meaning: 'Seudónimo del erudito Yi Hwang, autoridad del neoconfucianismo.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'hwa-rang',
    name: 'Hwa-Rang',
    korean_name: '화랑',
    moves: 29,
    meaning:
      'Nombrado por el grupo juvenil Hwa-Rang que fortaleció el reino de Silla.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'choong-moo',
    name: 'Choong-Moo',
    korean_name: '충무',
    moves: 30,
    meaning:
      'Título póstumo del almirante Yi Sun Sin, creador del barco tortuga.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'kwang-gae',
    name: 'Kwang-Gae',
    korean_name: '광개',
    moves: 39,
    meaning:
      'Nombrado por el rey Kwang Gae Toh Wang, gran expansor del territorio coreano.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'po-eun',
    name: 'Po-Eun',
    korean_name: '포은',
    moves: 36,
    meaning: 'Seudónimo del poeta Chong Mong Chu, símbolo de lealtad.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'ge-baek',
    name: 'Ge-Baek',
    korean_name: '계백',
    moves: 44,
    meaning:
      'Nombrado por el general del reino Baek Je conocido por su disciplina.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'eui-am',
    name: 'Eui-Am',
    korean_name: '의암',
    moves: 45,
    meaning:
      'Seudónimo de Son Byong Hi, líder del movimiento de independencia coreano.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'choong-jang',
    name: 'Choong-Jang',
    korean_name: '충장',
    moves: 52,
    meaning: 'Título otorgado al general Kim Duk Ryang por su lealtad.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
  {
    id: 'juche',
    name: 'Juche',
    korean_name: '주체',
    moves: 45,
    meaning: 'Filosofía que enfatiza la autosuficiencia y el espíritu humano.',
    diagram: '/imgs/diagram.webp',
    video: ['/videos/won-hyo.mp4', '/videos/won-hyo-2.mp4'],
    movementTimestamps: [0, 4.5, 30, 45.5],
  },
].map((tul) => ({
  ...tul,
  video: [...TEST_VIDEO_PATHS],
}));
