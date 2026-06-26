import { useState } from 'react';
import { toast } from 'sonner';
import {
  Zap, Users, ChevronDown, ChevronUp, Calendar,
  ArrowRight, Star, BookOpen, RefreshCw, Target,
} from 'lucide-react';
import type { Language, Student } from '../data/mockData';
import { MOCK_STUDENTS, TIER_CONFIG } from '../data/mockData';
import { TierBadge } from '../components/TierBadge';

// ── Group card ─────────────────────────────────────────────────────────────────

const GROUP_ACTIVITIES: Record<string, { title: string; activities: string[] }> = {
  green: {
    title: 'Enrichment Activities',
    activities: [
      'Independent reading projects — choose a book of their level',
      'Extended vocabulary work — build a personal word journal',
      'Read-aloud buddy system — pair with a Red group student',
      'Above-grade reading challenges — try next grade passages',
    ],
  },
  'yellow-fluency': {
    title: 'Fluency Drills',
    activities: [
      'Repeated reading — same passage 3× for speed and smoothness',
      'Echo reading — teacher reads first, student repeats',
      'Timed reading — 1-minute passages with WCPM tracking',
      'Partner reading — pairs read aloud to each other',
    ],
  },
  'yellow-comprehension': {
    title: 'Comprehension Exercises',
    activities: [
      'Retelling circles — student retells story to a partner',
      'Think-aloud strategy — verbalize thoughts while reading',
      'Graphic organizers — story maps, sequence charts, Venn diagrams',
      'Vocabulary journals — find new words, write meaning in own words',
    ],
  },
  red: {
    title: 'Intensive Support',
    activities: [
      'Small-group or one-on-one phonics instruction',
      'Decodable readers matched to current phonics level',
      'Syllable sorting activities with hands-on cards',
      'Daily 15-minute reading practice at home (inform parent)',
    ],
  },
};

const DRILL_ACTIVITIES: Record<string, string[]> = {
  'Decoding / Phonics': [
    'Letter-sound mapping cards — practice CVC and CCVC patterns',
    'Decodable text reading — short passages with target phonics pattern',
    'Word-building games — build words with letter tiles',
  ],
  'Syllable Blending': [
    'Clap-the-syllables game for new vocabulary words',
    'Onset-rime sorting: "b-at, c-at, m-at" → blend to "bat, cat, mat"',
    'Syllable segmentation races — who can break the word fastest?',
  ],
  'Sight Words': [
    'Sight word flashcard race — 5 new words each week, review old ones',
    'Word wall read — point to random words on class word wall daily',
    '"I spy" sight word hunt in books or around the classroom',
  ],
  'Pacing & Accuracy': [
    'Repeated reading of same passage until target WCPM is reached',
    'Echo reading — model smooth pacing, student echoes back',
    '1-minute timed reading charts to visualize progress',
  ],
  'Literal Recall': [
    'After reading: "Can you tell me 3 things that happened?"',
    'Draw-what-happened — students sketch the main events',
    'True/False game about text details right after reading',
  ],
  'Vocabulary in Context': [
    'Context clues strategy — use surrounding words to guess meaning',
    'Semantic mapping — draw a web of related words and meanings',
    'Word-of-the-day jar — one new word per reading session',
  ],
  'Inference': [
    'Think-aloud: "What does the author mean here? What clue did you use?"',
    'Feeling-faces activity: "How do you think the character feels? Why?"',
    'Prediction stops: pause mid-passage and ask "What happens next?"',
  ],
  'Sequencing / Main Idea': [
    'Story map: Beginning → Middle → End with key events',
    'Cut-up comic: arrange story panels in order',
    '"In one sentence" challenge — summarize the main idea of a passage',
  ],
};

function StudentCard({ student, language }: { student: Student; language: Language }) {
  const [open, setOpen] = useState(false);
  const result = language === 'Filipino' ? student.filipino : student.english;
  const cfg = TIER_CONFIG[result.tier];
  const drillActivities = DRILL_ACTIVITIES[result.primaryGap] ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
          {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900">{student.name}</p>
          <p className="text-[10px] text-gray-400">Grade {student.grade} · {student.section}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {result.primaryGap !== 'None' && (
            <span className="text-[10px] text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full">
              {result.primaryGap.split(' ')[0]}
            </span>
          )}
          <span className="text-xs text-gray-400">{result.wcpm} wcpm</span>
          {open ? <ChevronUp size={13} className="text-gray-400" /> : <ChevronDown size={13} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className={`px-4 pb-4 pt-2 border-t ${cfg.borderClass} ${cfg.lightBg}`}>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'WCPM', value: String(result.wcpm) },
              { label: 'Accuracy', value: `${result.accuracy}%` },
              { label: 'Comp.', value: '' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-2 text-center border border-white">
                <p className="text-[9px] text-slate-400 font-bold">{item.label}</p>
                <p className="text-sm font-black font-mono text-blue-900">{item.value || '—'}</p>
              </div>
            ))}
          </div>

          {result.primaryGap !== 'None' && (
            <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3 border border-amber-100 mb-3">
              <Zap size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-black text-amber-700 uppercase tracking-wider">Primary Drill</p>
                <p className="text-xs font-bold text-amber-900 mt-0.5">{result.primaryDrill}</p>
              </div>
            </div>
          )}

          {drillActivities.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Suggested Activities</p>
              <div className="flex flex-col gap-1.5">
                {drillActivities.map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ArrowRight size={10} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-600 font-semibold">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
              <Calendar size={10} />
              <span>Last: {result.lastAssessed}</span>
            </div>
            {result.flaggedForRecheck && (
              <span className="text-[9px] font-black bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">
                ⚠ Re-check due
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GroupSection({
  tier, students, language, count,
}: {
  tier: string;
  students: Student[];
  language: Language;
  count: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const cfg = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];
  const groupAct = GROUP_ACTIVITIES[tier];

  if (count === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      {/* Group header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
      >
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0
          ${tier === 'green' ? 'bg-emerald-500' : tier === 'red' ? 'bg-red-500' : 'bg-amber-400'}`} />
        <div className="flex-1 text-left">
          <p className="font-semibold text-sm text-gray-900">{cfg.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{count} students · {groupAct.title}</p>
        </div>
        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-xs flex-shrink-0">
          {count}
        </div>
        {collapsed ? <ChevronDown size={15} className="text-gray-400" /> : <ChevronUp size={15} className="text-gray-400" />}
      </button>

      {!collapsed && (
        <div className="p-5 bg-white">
          {/* Group activities */}
          <div className="rounded-lg bg-gray-50 border border-gray-100 p-4 mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2.5">{groupAct.title}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {groupAct.activities.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-1.5" />
                  <p className="text-[11px] text-gray-500">{a}</p>
                </div>
              ))}
            </div>
            {tier === 'red' && (
              <div className="mt-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <p className="text-[11px] text-red-600">
                  Priority attention needed — consider small-group or one-on-one sessions.
                </p>
              </div>
            )}
          </div>

          {/* Student cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {students.map((s) => (
              <StudentCard key={s.id} student={s} language={language} />
            ))}
          </div>

          {/* Re-assessment button */}
          <button
            onClick={() => toast.success(`Re-assessment scheduled for ${count} ${cfg.label} students in 4-6 weeks`)}
            className="mt-4 w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium
              flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={13} /> Schedule Re-assessment in 4–6 weeks
          </button>
        </div>
      )}
    </div>
  );
}

// ── Class Grouping Main ────────────────────────────────────────────────────────

export function ClassGrouping() {
  const [language, setLanguage] = useState<Language>('Filipino');

  const lang = language === 'Filipino' ? 'filipino' : 'english';

  const groups = {
    green:                 MOCK_STUDENTS.filter((s) => s[lang].tier === 'green'),
    'yellow-fluency':      MOCK_STUDENTS.filter((s) => s[lang].tier === 'yellow-fluency'),
    'yellow-comprehension': MOCK_STUDENTS.filter((s) => s[lang].tier === 'yellow-comprehension'),
    red:                   MOCK_STUDENTS.filter((s) => s[lang].tier === 'red'),
  };

  const total = MOCK_STUDENTS.length;

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Intervention Groups</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Grade 4 — Section Rizal · Mabini Elementary School · {total} students
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Language:</span>
          {(['Filipino', 'English'] as Language[]).map((l) => (
            <button key={l} onClick={() => setLanguage(l)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all
                ${language === l
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Overview chips */}
      <div className="grid grid-cols-4 gap-3">
        {([
          { key: 'green', label: 'On Track', dot: 'bg-emerald-500' },
          { key: 'yellow-fluency', label: 'Fluency', dot: 'bg-amber-400' },
          { key: 'yellow-comprehension', label: 'Comprehension', dot: 'bg-amber-400' },
          { key: 'red', label: 'Needs Support', dot: 'bg-red-500' },
        ] as const).map((item) => {
          const count = groups[item.key as keyof typeof groups].length;
          return (
            <div key={item.key} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${item.dot}`} />
              </div>
              <p className="text-xl font-bold text-gray-900 tabular-nums">{count}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{item.label}</p>
              <p className="text-[10px] text-gray-300">{Math.round((count / total) * 100)}%</p>
            </div>
          );
        })}
      </div>

      {/* Groups */}
      <GroupSection tier="green"                  students={groups.green}                  language={language} count={groups.green.length} />
      <GroupSection tier="yellow-fluency"         students={groups['yellow-fluency']}       language={language} count={groups['yellow-fluency'].length} />
      <GroupSection tier="yellow-comprehension"   students={groups['yellow-comprehension']} language={language} count={groups['yellow-comprehension'].length} />
      <GroupSection tier="red"                    students={groups.red}                    language={language} count={groups.red.length} />

      {/* Legend */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3">
        <Target size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Students are grouped by reading tier. Each student's primary drill is shown individually — two students in the same group may need different drills. Re-assess after <strong>4–6 weeks</strong> of intervention.
        </p>
      </div>
    </div>
  );
}
