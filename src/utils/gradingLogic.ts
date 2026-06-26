import type { Tier, Language, GradeLevel, FluencySubskill, CompSubskill } from '../data/mockData';
import { DEMO_FLUENCY_RESULTS, WCPM_BENCHMARKS } from '../data/mockData';

// ── Reading Ladder Rule ──────────────────────────────────────────────────────
// Fluency parameters (fix in order):
//   1. Decoding / Phonics
//   2. Syllable Blending
//   3. Sight Words
//   4. Pacing & Accuracy (no longer a "parameter" per spec, but kept for ladder)
//
// Comprehension parameters (fix in order):
//   4. Literal Recall
//   5. Vocabulary in Context
//   6. Inference
//   7. Sequencing / Main Idea

export function computeTier(wcpm: number, compScore: number, language: Language, grade: GradeLevel = 4): Tier {
  const benchmark = WCPM_BENCHMARKS[grade][language];
  const fluencyOk = wcpm >= benchmark * 0.75;
  const compOk = compScore >= 75;

  if (!fluencyOk && !compOk) return 'red';
  if (!fluencyOk && compOk) return 'yellow-fluency';
  if (fluencyOk && !compOk) return 'yellow-comprehension';
  return 'green';
}

export function getLowestBrokenFluencyRung(subskills: FluencySubskill[]): string | null {
  const order = ['Decoding / Phonics', 'Syllable Blending', 'Sight Words', 'Pacing & Accuracy'];
  for (const name of order) {
    const sk = subskills.find((s) => s.name === name);
    if (sk && sk.status === 'Weak') return name;
  }
  return null;
}

export function getLowestBrokenCompRung(subskills: CompSubskill[]): string | null {
  const order = ['Literal Recall', 'Vocabulary in Context', 'Inference', 'Sequencing / Main Idea'];
  for (const name of order) {
    const sk = subskills.find((s) => s.name === name);
    if (sk && sk.status === 'Incorrect') return name;
  }
  return null;
}

export interface AssessmentResult {
  wcpm: number;
  accuracy: number;
  fluencySubskills: FluencySubskill[];
  compSubskills: CompSubskill[];
  compScore: number;
  tier: Tier;
  primaryGap: string;
  primaryDrill: string;
  lowestFluencyRung: string | null;
  lowestCompRung: string | null;
  downstreamFlags: string[];
}

const DRILLS: Record<string, string> = {
  'Decoding / Phonics': 'Phonics drills · letter-sound mapping · decodable readers',
  'Syllable Blending': 'Syllable blending drills · onset-rime activities',
  'Sight Words': 'Sight word flashcard drills · high-frequency word practice',
  'Pacing & Accuracy': 'Repeated reading · timed reading practice · echo reading',
  'Literal Recall': 'Recall drills · retelling activities',
  'Vocabulary in Context': 'Vocabulary-in-context exercises · semantic mapping',
  'Inference': 'Inference exercises · prediction activities · think-aloud strategy',
  'Sequencing / Main Idea': 'Sequencing drills · story mapping · main-idea identification',
  'None': 'Enrichment reading · independent reading log · above-grade texts',
};

export function buildAssessmentResult(
  language: Language,
  userAnswers: number[],
  correctAnswers: number[],
  grade: GradeLevel = 4,
): AssessmentResult {
  const fluency = DEMO_FLUENCY_RESULTS[language];

  // Map 8 answers to 4 comp subskills (2 questions per param → both must be correct for "Correct")
  const paramNames = ['Literal Recall', 'Vocabulary in Context', 'Inference', 'Sequencing / Main Idea'] as const;
  const paramNums = [4, 5, 6, 7] as const;

  const compSubskills: CompSubskill[] = paramNames.map((name, i) => {
    const q1 = userAnswers[i * 2] === correctAnswers[i * 2];
    const q2 = userAnswers[i * 2 + 1] === correctAnswers[i * 2 + 1];
    const correct = q1 && q2;
    return { name, parameter: paramNums[i], status: correct ? 'Correct' : 'Incorrect', isLowestBrokenRung: false };
  });

  const compCorrect = compSubskills.filter((s) => s.status === 'Correct').length;
  const compScore = Math.round((compCorrect / 4) * 100);

  const tier = computeTier(fluency.wcpm, compScore, language, grade);

  const lowestFluencyRung = getLowestBrokenFluencyRung(fluency.fluencySubskills);
  const lowestCompRung = getLowestBrokenCompRung(compSubskills);

  let primaryGap = 'None';
  if (tier === 'red' || tier === 'yellow-fluency') {
    primaryGap = lowestFluencyRung ?? 'Decoding / Phonics';
  } else if (tier === 'yellow-comprehension') {
    primaryGap = lowestCompRung ?? 'Inference';
  }

  // Downstream flags: all broken params above the primary
  const allBroken: string[] = [];
  for (const sk of fluency.fluencySubskills) {
    if (sk.status === 'Weak' && sk.name !== primaryGap) allBroken.push(sk.name);
  }
  for (const sk of compSubskills) {
    if (sk.status === 'Incorrect' && sk.name !== primaryGap) allBroken.push(sk.name);
  }

  const enrichedFluency = fluency.fluencySubskills.map((sk) => ({
    ...sk,
    isLowestBrokenRung: sk.name === lowestFluencyRung,
  }));

  const enrichedComp = compSubskills.map((sk) => ({
    ...sk,
    isLowestBrokenRung: sk.name === lowestCompRung,
  }));

  return {
    wcpm: fluency.wcpm,
    accuracy: fluency.accuracy,
    fluencySubskills: enrichedFluency,
    compSubskills: enrichedComp,
    compScore,
    tier,
    primaryGap,
    primaryDrill: DRILLS[primaryGap] ?? DRILLS['None'],
    lowestFluencyRung,
    lowestCompRung,
    downstreamFlags: allBroken,
  };
}

export function getWCPMLabel(wcpm: number, grade: GradeLevel, language: Language): string {
  const benchmark = WCPM_BENCHMARKS[grade][language];
  if (wcpm >= benchmark) return 'At or above grade norm';
  if (wcpm >= benchmark * 0.75) return 'Approaching grade norm';
  return 'Below grade norm';
}

export function tierShortLabel(tier: Tier): string {
  switch (tier) {
    case 'green': return 'On Track';
    case 'yellow-fluency': return 'Yellow · Fluency';
    case 'yellow-comprehension': return 'Yellow · Comprehension';
    case 'red': return 'Needs Support';
  }
}

export function countTiers(students: Array<{ filipino: { tier: Tier }; english: { tier: Tier } }>) {
  const count = { green: 0, yellow: 0, red: 0 };
  for (const s of students) {
    for (const result of [s.filipino, s.english]) {
      if (result.tier === 'green') count.green++;
      else if (result.tier.startsWith('yellow')) count.yellow++;
      else count.red++;
    }
  }
  return count;
}

// Plain-language parent descriptions per parameter
export const PARENT_PARAM_DESCRIPTIONS: Record<string, { title: string; explanation: string; activities: string[] }> = {
  'Decoding / Phonics': {
    title: 'Sounding Out Words (Decoding)',
    explanation: 'Your child is still learning how to sound out words from their letters. This is the foundation of reading — once this improves, other reading skills follow naturally.',
    activities: [
      'Practice letter sounds together for 5 minutes each evening. Point to a letter and ask your child to say its sound.',
      'Use simple flashcards with 3-syllable Filipino words — ba-ta, pu-sa, a-so. Ask your child to sound them out slowly before blending.',
      'When reading a storybook together, pause at an unfamiliar word and ask your child to try sounding it out before you help.',
    ],
  },
  'Syllable Blending': {
    title: 'Blending Syllables',
    explanation: 'Your child can recognize letters and sounds but is still practicing how to blend them together smoothly into full words. This is a normal step in learning to read.',
    activities: [
      'Clap out syllables in words together — "a-so" is 2 claps, "ma-hi-lig" is 3 claps. Make it a game!',
      'Say a word slowly in parts (e.g. "ba... ta") and ask your child to guess the whole word.',
      'Read short easy books together. When your child pauses on a word, encourage them to break it into syllables first.',
    ],
  },
  'Sight Words': {
    title: 'Recognizing Common Words',
    explanation: 'Your child is still learning to quickly recognize the short, common words that appear very often in reading — words like "ang," "ng," "sa," "the," and "is." Knowing these by sight makes reading smoother.',
    activities: [
      'Write 5 common words on separate index cards. Hold them up one at a time and see how fast your child can read them.',
      'Play a "word hunt" in a storybook — find all the "ang" words on the page together.',
      'Make it fun: tape sight word cards around the house and ask your child to read them whenever they pass by.',
    ],
  },
  'Literal Recall': {
    title: 'Remembering What Was Read',
    explanation: 'Your child can read the words but is still practicing remembering the key facts and details from what they read. This is the first step in understanding a story.',
    activities: [
      'After reading a short story together, ask simple "who, what, where" questions: "Who was the story about? Where did it happen?"',
      'Ask your child to retell the story in their own words after finishing it — even just 2-3 sentences is great practice.',
      'Point to a picture in the book and ask: "What is happening in this picture? Who do you see?"',
    ],
  },
  'Vocabulary in Context': {
    title: 'Understanding Word Meanings',
    explanation: 'Your child reads the words but sometimes does not understand what they mean, especially new or unfamiliar words. Building vocabulary helps everything else in reading improve.',
    activities: [
      'When you encounter a new word while reading together, ask: "What do you think this word means?" Then look it up together.',
      'Play "word detective" — after reading, pick 2-3 new words and figure out their meaning from the sentences around them.',
      'Talk about new words you encounter in daily life — on signs, on TV, in conversations. Every new word helps!',
    ],
  },
  'Inference': {
    title: 'Reading Between the Lines',
    explanation: 'Your child can read the words and remember what happened, but is still learning to figure out things the story does not say directly — like why a character felt a certain way or what might happen next.',
    activities: [
      'After reading a short story together, ask: "Why do you think the character did that?" There is no wrong answer — you are practicing thinking about feelings and reasons.',
      'While watching a cartoon or movie together, pause and ask: "What do you think will happen next and why?"',
      'Talk about your own day using reasons — "I brought an umbrella because the sky looked dark." This models inference thinking in everyday life.',
    ],
  },
  'Sequencing / Main Idea': {
    title: 'Order and Main Ideas',
    explanation: 'Your child can understand the parts of a story but is still learning to organize them in the right order and identify the most important idea. These skills help with understanding longer texts.',
    activities: [
      'After reading a story, ask your child to tell you what happened first, second, and last. You can draw simple boxes and fill them in together.',
      'Ask: "What was the most important thing that happened in the story?" Practice picking the biggest idea, not just a detail.',
      'Cut a short comic strip into panels and ask your child to put them back in order — a fun way to practice sequencing.',
    ],
  },
};
