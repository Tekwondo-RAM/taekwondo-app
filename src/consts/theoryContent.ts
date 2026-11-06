import { belts } from '@/consts/belts';
import { exams } from '@/consts/exams';

/** Filtros de la vista “Estudiar teoría” (agrupación por etapa del currículo) */
export type TheoryStudyFilterId = 'all' | 'early' | 'mid' | 'late' | 'dan';

export const theoryStudyFilters: {
  id: TheoryStudyFilterId;
  label: string;
  colors: string[];
}[] = [
  { id: 'all', label: 'Todos', colors: ['bg-gray-500'] },
  {
    id: 'early',
    label: '9º–7º GUP',
    colors: ['bg-gray-300', 'bg-yellow-400'],
  },
  {
    id: 'mid',
    label: '6º–4º GUP',
    colors: ['bg-green-500', 'bg-blue-500'],
  },
  {
    id: 'late',
    label: '3º–1º GUP',
    colors: ['bg-red-500', 'bg-gray-900'],
  },
  { id: 'dan', label: 'Dan', colors: ['bg-gray-900'] },
];

export type TheoryBlock = {
  id: string;
  title: string;
  subtitle: string;
  beltId: string;
  content: string;
};

export function theoryStudyFilterForExamId(
  examId: string
): TheoryStudyFilterId {
  if (examId.startsWith('dan')) return 'dan';
  const n = Number(examId.replace('gup-', ''));
  if (n >= 7) return 'early';
  if (n >= 4) return 'mid';
  return 'late';
}

/** Ids de examen que tienen bloque propio en la parrilla de teoría (cinturón + punta, o Dan). */
const THEORY_GRID_EXAM_IDS = [
  'gup-9',
  'gup-7',
  'gup-5',
  'gup-3',
  'gup-1',
  'dan-1',
  'dan-2',
  'dan-3',
] as const;

/** Fuentes de texto fusionadas en cada bloque (GUP “entero” + siguiente bloque con punta). */
const MERGE_CONTENT_IDS: Record<
  (typeof THEORY_GRID_EXAM_IDS)[number],
  string[]
> = {
  'gup-9': ['gup-9'],
  'gup-7': ['gup-8', 'gup-7'],
  'gup-5': ['gup-6', 'gup-5'],
  'gup-3': ['gup-4', 'gup-3'],
  'gup-1': ['gup-2', 'gup-1'],
  'dan-1': ['dan-1'],
  'dan-2': ['dan-2'],
  'dan-3': ['dan-3'],
};

/** Examen de detalle → id del bloque de teoría (1:1 con examId / API). */
export function theoryBlockIdForExam(examId: string): string {
  return examId;
}

export function getTheoryBlockForExam(examId: string): TheoryBlock | undefined {
  const blockId = theoryBlockIdForExam(examId);
  return theoryBlocks.find((b) => b.id === blockId);
}

const THEORY_TITLE: Record<string, string> = {
  'gup-9': 'Introducción a la teoría',
  'gup-8': 'Cortesía y primeros principios',
  'gup-7': 'Integridad y perseverancia',
  'gup-6': 'Posturas y equilibrio',
  'gup-5': 'Defensas fundamentales',
  'gup-4': 'Puños y patadas',
  'gup-3': 'Poomsae: forma y significado',
  'gup-2': 'Combate y táctica',
  'gup-1': 'Defensa personal',
  'dan-1': 'Teoría I Dan',
  'dan-2': 'Teoría II Dan',
  'dan-3': 'Teoría III Dan',
};

const THEORY_BODY: Record<string, string> = {
  'gup-9': `El Taekwondo es un arte marcial y deporte de combate moderno, originario de Corea, conocido mundialmente por su espectacular variedad de técnicas de pierna (patadas). La teoría del Taekwondo es el conjunto de principios, filosofía, fundamentos técnicos y conocimientos que transforman la práctica en un camino de desarrollo personal y disciplina marcial.

Comprenderla es esencial desde el primer nivel: proporciona el "por qué" y el "cómo" detrás de cada movimiento.

Podemos dividir la teoría del Taekwondo en cuatro pilares fundamentales:
• Filosofía y Principios (El Espíritu)
• Fundamentos Técnicos (El "Cómo" del Movimiento)
• Formas o Poomsae (El Baile Marcial)
• Combate y Defensa Personal`,
  'gup-8': `El Taekwondo busca la formación integral del individuo: cuerpo, mente y espíritu. Esta base filosófica se resume en sus Cinco Principios del Taekwondo, que guían la conducta dentro y fuera del dojang.

**Cortesía (Ye Ui)**
Ser educado, respetuoso con los demás (compañeros, instructores) y mostrar humildad. Se manifiesta en el saludo al entrar y salir, al interactuar con los compañeros, etc.

**Integridad (Yom Chi)**
Ser honesto consigo mismo y con los demás. Reconocer las propias limitaciones, saber lo que está bien y mal, y actuar en consecuencia.`,
  'gup-7': `**Perseverancia (In Nae)**
No rendirse ante las dificultades. La constancia en el entrenamiento, la paciencia para superar un obstáculo técnico y la determinación para alcanzar una meta.

**Autocontrol (Guk Gi)**
Tener dominio sobre el propio cuerpo y emociones. Saber cuándo detener un golpe en el combate para no lastimar al oponente, y controlar la ira o el miedo en situaciones difíciles.

**Espíritu Indomable (Baekjul Boolgool)**
Afrontar la adversidad con valentía y convicción. Defender lo que es justo, incluso frente a una oposición abrumadora.`,
  'gup-6': `Los fundamentos técnicos se basan en principios biomecánicos: rotación de cadera, equilibrio y respiración.

**Posturas (Seogi)**
La base de todo movimiento. Una postura correcta proporciona equilibrio, estabilidad y potencia. Ejemplos: postura de atención (Charyeot Seogi), de preparación (Junbi Seogi), de jinete (Juchum Seogi), hacia adelante (Ap Seogi), hacia atrás (Dwit Seogi), etc.`,
  'gup-5': `**Técnicas de defensa (Makgi)**
Movimientos diseñados para bloquear o desviar un ataque. Ejemplos: bloqueo inferior (Arae Makgi), bloqueo medio (Momtong Makgi), bloqueo superior (Eolgul Makgi), bloqueo con cuchillo de mano (Sonkal Makgi), etc.`,
  'gup-4': `**Técnicas de puño (Jireugi)**
Golpes lineales con la mano cerrada. El más básico es el golpe de puño hacia adelante (Ap Jireugi).

**Técnicas de mano abierta (Son Taegi, Chigi)**
Golpes con diferentes partes de la mano abierta, como el cuchillo de mano (Sonkal), el dorso de la mano (Deung Joomuk), etc.

**Técnicas de pie (Chagi)**
Patada frontal (Ap Chagi), patada circular (Dollyo Chagi), patada lateral (Yop Chagi), patada hacia atrás (Dwit Chagi), patada en gancho (Huryeo Chagi), etc.`,
  'gup-3': `Un Poomsae es un conjunto de movimientos de ataque y defensa en secuencia contra uno o más oponentes imaginarios.

La teoría del Poomsae implica entender:

**La línea de despliegue**
Cada forma se realiza sobre un diagrama geométrico específico.

**La secuencia de movimientos**
Cada movimiento tiene una razón de ser y una aplicación marcial (hoshinsul).

**El significado**
Cada Poomsae tiene un nombre y un propósito de aprendizaje; a medida que avanzas de cinturón, los Poomsae ganan complejidad.`,
  'gup-2': `**Combate (Kyorugi)**
Puede ser de varios tipos (por puntos, olímpico, etc.). La teoría cubre la distancia, el tiempo, la estrategia, las reglas y cómo conectar las técnicas con eficacia y control.`,
  'gup-1': `**Defensa Personal (Hosinsul)**
Aplica los principios del Taekwondo en situaciones de defensa real contra agarres, empujones o amenazas. Aquí se prioriza la efectividad y la disuasión sobre la estética deportiva.

En resumen, la teoría del Taekwondo es el mapa que guía al practicante: no se limita a aprender patadas, sino a entender por qué y cuándo actuar, y cómo el entrenamiento forja carácter.`,
  'dan-1': `En el I Dan, la teoría integra todo lo aprendido en el camino a cinturón negro: los cinco principios se viven en la enseñanza y el ejemplo. Se profundiza en la precisión del Poomsae, el control en Kyorugi y la responsabilidad de representar el arte.

El cinturón negro es un nuevo comienzo: más exigencia técnica y más compromiso con la disciplina personal.`,
  'dan-2': `En el II Dan se enfatiza la refinación de detalles, la lectura del combate y la transmisión del conocimiento a compañeros de menor grado. La teoría se aplica a la planificación del entrenamiento y a la ética del practicante avanzado.`,
  'dan-3': `En el III Dan la teoría abarca una visión global del Taekwondo como sistema: historia, evolución deportiva, aplicación marcial y papel del practicante en el dojang y la comunidad. Prepara para asumir roles de mayor responsabilidad técnica y pedagógica.`,
};

function buildMergedContent(
  anchorId: (typeof THEORY_GRID_EXAM_IDS)[number]
): string {
  return MERGE_CONTENT_IDS[anchorId].map((id) => THEORY_BODY[id]).join('\n\n');
}

export const theoryBlocks: TheoryBlock[] = THEORY_GRID_EXAM_IDS.map((id) => {
  const exam = exams.find((e) => e.id === id);
  const belt = exam ? belts.find((b) => b.id === exam.belt) : undefined;
  return {
    id,
    title: THEORY_TITLE[id],
    subtitle: belt?.alt ?? exam?.range ?? id,
    beltId: exam?.belt ?? id,
    content: buildMergedContent(id),
  };
});
