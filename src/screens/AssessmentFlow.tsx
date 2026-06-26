import { useState, useEffect, useRef } from 'react';
import {
  Mic, CheckCircle2, ChevronRight, Play, Square,
  AlertTriangle, Zap, Mail, RotateCcw, User,
  BookOpen, Clock, Check, X, ShieldCheck, Search,
  Star, Send,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Language, GradeLevel, Student } from '../data/mockData';
import { PASSAGES, COMP_QUESTIONS, TIER_CONFIG, DEMO_FLUENCY_RESULTS, MOCK_STUDENTS, WCPM_BENCHMARKS } from '../data/mockData';
import { buildAssessmentResult, type AssessmentResult, getWCPMLabel } from '../utils/gradingLogic';
import { TierBadge } from '../components/TierBadge';

// ── Step labels ────────────────────────────────────────────────────────────────

const STEP_LABELS = [
  'Select Student', 'Passage', 'Fluency', 'Comprehension',
  'Results', 'Report', 'Send Report',
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="px-6 py-3.5 bg-white border-b border-gray-200">
      <div className="flex items-center gap-1 max-w-3xl mx-auto">
        {STEP_LABELS.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          return (
            <div key={step} className="flex items-center gap-1 flex-1">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all
                    ${done ? 'bg-blue-600 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {done ? <Check size={11} strokeWidth={2.5} /> : step}
                </div>
                <span className={`text-[9px] whitespace-nowrap hidden md:block
                  ${active ? 'text-blue-600 font-medium' : done ? 'text-gray-400' : 'text-gray-300'}`}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-px mb-3 transition-all ${done ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 1: Select Student ─────────────────────────────────────────────────────

function Step1SelectStudent({ onNext }: { onNext: (student: Student, language: Language) => void }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Student | null>(null);
  const [language, setLanguage] = useState<Language>('Filipino');

  const filtered = MOCK_STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const canProceed = selected && selected.consentStatus === 'confirmed';

  return (
    <div className="max-w-xl mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Start Assessment</h2>
        <p className="text-gray-500 mt-1 text-sm">Select the student and language for this session.</p>
      </div>

      {/* Language selector */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
          Language of Assessment
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['Filipino', 'English'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`py-3 px-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all
                ${language === lang
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'border-slate-200 text-slate-600 hover:border-blue-200 bg-white'}`}
            >
              <span>{lang === 'Filipino' ? '🇵🇭' : '🇺🇸'}</span>
              {lang}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-blue-500 font-semibold mt-2 bg-blue-50 rounded-lg px-3 py-2">
          Filipino and English are assessed independently. Never mix in one session.
        </p>
      </div>

      {/* Student search */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
          Select Student
        </label>
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold
              focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
          {filtered.map((s) => {
            const isSelected = selected?.id === s.id;
            const noConsent = s.consentStatus !== 'confirmed';
            return (
              <button
                key={s.id}
                onClick={() => !noConsent && setSelected(s)}
                disabled={noConsent}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-left transition-all w-full
                  ${isSelected ? 'border-blue-500 bg-blue-50' : noConsent ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed' : 'border-slate-200 hover:border-blue-200 bg-white'}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0
                  ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-800 truncate">{s.name}</p>
                  <p className="text-[10px] text-slate-400">Grade {s.grade} · {s.section}</p>
                </div>
                {noConsent ? (
                  <span className="text-[9px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full flex-shrink-0">
                    No Consent
                  </span>
                ) : (
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex-shrink-0">
                    <ShieldCheck size={9} className="inline mr-0.5" />Consented
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Consent warning */}
      {selected && selected.consentStatus !== 'confirmed' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-rose-700 text-sm">Consent Required</p>
            <p className="text-rose-600 text-xs mt-1">
              Parental consent must be confirmed before assessment. Please record consent in the class roster first.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => canProceed && selected && onNext(selected, language)}
        disabled={!canProceed}
        className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all
          ${canProceed
            ? 'bg-blue-600 text-white hover:bg-blue-700  active:scale-[0.98]'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
      >
        Start Assessment <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ── Step 2: Reading Passage ────────────────────────────────────────────────────

function Step2Passage({ student, language, onRecordingComplete }: {
  student: Student;
  language: Language;
  onRecordingComplete: () => void;
}) {
  const grade = student.grade as GradeLevel;
  const passage = PASSAGES[language][grade];
  const [phase, setPhase] = useState<'ready' | 'recording' | 'done'>('ready');
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const MAX_SECS = 90;

  const startRecording = () => {
    setPhase('recording');
    setElapsed(0);
    intervalRef.current = setInterval(() => {
      setElapsed((s) => {
        if (s + 1 >= MAX_SECS) {
          clearInterval(intervalRef.current!);
          setPhase('done');
          setTimeout(onRecordingComplete, 600);
          return MAX_SECS;
        }
        return s + 1;
      });
    }, 1000);
  };

  const stopEarly = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase('done');
    setTimeout(onRecordingComplete, 400);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const progress = (elapsed / MAX_SECS) * 100;
  const remaining = MAX_SECS - elapsed;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Reading Passage</h2>
          <p className="text-gray-500 text-sm mt-1">{student.name} · Grade {grade} · {language}</p>
        </div>
        {phase === 'recording' && (
          <span className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Recording {elapsed}s
          </span>
        )}
      </div>

      {/* Passage card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-[11px] font-black px-2.5 py-1 rounded-full
            ${language === 'Filipino' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
            {language === 'Filipino' ? '🇵🇭' : '🇺🇸'} {language.toUpperCase()} · Grade {grade}
          </span>
          <span className="text-xs text-slate-400">{passage.wordCount} words</span>
          <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full
            ${passage.conceptLoad === 'simple' ? 'bg-emerald-100 text-emerald-700' : passage.conceptLoad === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
            {passage.conceptLoad}
          </span>
        </div>
        <h3 className="text-lg font-black text-blue-900 mb-4">{passage.title}</h3>
        <p className="text-[22px] leading-[1.9] text-slate-800 font-medium tracking-wide">
          {passage.text}
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 font-semibold border-t border-blue-50 pt-3">
          <span className="flex items-center gap-1"><BookOpen size={12} /> {passage.wordCount} words</span>
          <span className="flex items-center gap-1"><Clock size={12} /> Max 90 seconds</span>
        </div>
      </div>

      {/* Recording UI */}
      {phase === 'recording' && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-40" />
              <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center relative z-10">
                <Mic size={20} className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-rose-700 font-black text-sm">Student is reading aloud…</p>
              <p className="text-rose-400 text-xs mt-0.5">{remaining}s remaining · max 90s</p>
            </div>
            <div className="text-2xl font-black font-mono text-rose-700">{elapsed}s</div>
          </div>
          <div className="h-3 bg-rose-100 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle2 size={22} className="text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-emerald-700 font-black text-sm">Recording complete!</p>
            <p className="text-emerald-500 text-xs">Uploading to AI scoring pipeline…</p>
          </div>
        </div>
      )}

      {/* Controls */}
      {phase === 'ready' && (
        <button onClick={startRecording}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-base
            flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all
            ">
          <Play size={18} fill="white" /> Start Recording
        </button>
      )}
      {phase === 'recording' && (
        <button onClick={stopEarly}
          className="w-full bg-rose-500 text-white py-4 rounded-2xl font-black text-base
            flex items-center justify-center gap-2 hover:bg-rose-600 active:scale-[0.98] transition-all">
          <Square size={18} fill="white" /> Stop Recording
        </button>
      )}
    </div>
  );
}

// ── Processing Screen ──────────────────────────────────────────────────────────

function ProcessingScreen({ onDone }: { onDone: () => void }) {
  const steps = [
    { label: 'Running safety check on audio (Granite Guardian)…', icon: '🛡️' },
    { label: 'Transcribing audio with Granite Speech…',           icon: '🎤' },
    { label: 'Aligning transcript to passage word by word…',      icon: '📝' },
    { label: 'Scoring fluency — WCPM, accuracy, miscues…',        icon: '📊' },
    { label: 'Tagging each miscue to fluency parameter…',         icon: '🏷️' },
    { label: 'Running output safety check (Granite Guardian)…',   icon: '✅' },
  ];
  const [doneIdx, setDoneIdx] = useState<number[]>([]);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    if (cur >= steps.length) { setTimeout(onDone, 500); return; }
    const t = setTimeout(() => { setDoneIdx((d) => [...d, cur]); setCur((c) => c + 1); }, 650);
    return () => clearTimeout(t);
  }, [cur, onDone]);

  return (
    <div className="max-w-md mx-auto px-6 py-12 flex flex-col items-center gap-8">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">Analyzing Reading</h2>
        <p className="text-gray-500 text-sm mt-1">IBM Granite Speech pipeline processing…</p>
      </div>
      <div className="w-full flex flex-col gap-2.5">
        {steps.map((step, i) => {
          const done = doneIdx.includes(i);
          const active = cur === i;
          return (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all border
                ${done ? 'bg-emerald-50 border-emerald-100' : active ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm
                ${done ? 'bg-emerald-500' : active ? 'bg-blue-600' : 'bg-slate-200'}`}>
                {done
                  ? <Check size={14} strokeWidth={3} className="text-white" />
                  : active
                    ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <span className="text-[10px] font-black text-slate-400">{i + 1}</span>}
              </div>
              <p className={`text-xs font-bold
                ${done ? 'text-emerald-700' : active ? 'text-blue-700' : 'text-slate-400'}`}>
                {step.icon} {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 3: Fluency Results ────────────────────────────────────────────────────

function Step3FluencyResults({ student, language, onNext }: {
  student: Student;
  language: Language;
  onNext: () => void;
}) {
  const fluency = DEMO_FLUENCY_RESULTS[language];
  const grade = student.grade as GradeLevel;
  const benchmark = WCPM_BENCHMARKS[grade][language];
  const wcpmPct = Math.min(Math.round((fluency.wcpm / benchmark) * 100), 100);
  const wcpmLabel = getWCPMLabel(fluency.wcpm, grade, language);

  return (
    <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Fluency Results</h2>
        <p className="text-gray-500 text-sm mt-1">AI-scored · {language} · {student.name}</p>
      </div>

      {/* WCPM + Accuracy */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'WCPM', value: String(fluency.wcpm), sub: wcpmLabel, pct: wcpmPct, note: `Benchmark: ${benchmark} WCPM` },
          { label: 'Accuracy', value: `${fluency.accuracy}%`, sub: 'Oral reading accuracy', pct: fluency.accuracy },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-3xl font-black font-mono text-blue-900">{item.value}</p>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold">{item.sub}</p>
            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.pct >= 75 ? 'bg-emerald-400' : item.pct >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
            {'note' in item && <p className="text-[10px] text-slate-400 mt-1">{item.note}</p>}
          </div>
        ))}
      </div>

      {/* Fluency Ladder */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Fluency Parameter Ladder
          </p>
          <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-auto">
            Fix lowest broken first
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {fluency.fluencySubskills.map((sk, i) => (
            <div key={sk.name}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all
                ${sk.isLowestBrokenRung
                  ? 'border-rose-300 bg-rose-50'
                  : sk.status === 'Weak'
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-emerald-100 bg-emerald-50'}`}>
              <span className="text-xs font-black text-slate-400 w-5 text-center">{i + 1}</span>
              <div className="flex-1">
                <p className={`text-sm font-bold
                  ${sk.isLowestBrokenRung ? 'text-rose-700' : sk.status === 'Weak' ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {sk.name}
                </p>
                {sk.isLowestBrokenRung && (
                  <p className="text-[10px] text-rose-500 font-bold mt-0.5">⬅ Lowest broken rung — address this first</p>
                )}
              </div>
              <span className={`text-xs font-black px-2.5 py-1 rounded-full
                ${sk.status === 'Strong' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {sk.status === 'Strong' ? '✓ Strong' : '✗ Weak'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onNext}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-base
          flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all
          ">
        Continue to Comprehension <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ── Step 4: Comprehension Questions (8 questions) ─────────────────────────────

function Step4CompQuestions({ student, language, onSubmit }: {
  student: Student;
  language: Language;
  onSubmit: (answers: number[]) => void;
}) {
  const grade = student.grade as GradeLevel;
  const questions = COMP_QUESTIONS[language][grade];
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(8).fill(null));
  const q = questions[idx];
  const selected = answers[idx];
  const isLast = idx === questions.length - 1;

  const pick = (opt: number) => {
    setAnswers((prev) => { const n = [...prev]; n[idx] = opt; return n; });
  };

  const next = () => {
    if (isLast) onSubmit(answers as number[]);
    else setIdx((i) => i + 1);
  };

  const skillColors: Record<string, string> = {
    'Literal Recall': 'bg-blue-100 text-blue-700',
    'Vocabulary in Context': 'bg-purple-100 text-purple-700',
    'Inference': 'bg-orange-100 text-orange-700',
    'Sequencing / Main Idea': 'bg-teal-100 text-teal-700',
  };

  const paramLabel: Record<number, string> = { 4: 'P4', 5: 'P5', 6: 'P6', 7: 'P7' };

  return (
    <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Comprehension Check</h2>
        <p className="text-gray-500 text-sm mt-1">{student.name} · {language} · Passage is hidden</p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5 flex-1">
          {questions.map((_, i) => (
            <div key={i}
              className={`h-2 rounded-full transition-all
                ${i < idx ? 'bg-blue-600 flex-1' : i === idx ? 'bg-yellow-400 flex-1' : 'bg-slate-200 flex-1'}`}
            />
          ))}
        </div>
        <span className="text-xs font-black text-slate-500 flex-shrink-0">{idx + 1} / {questions.length}</span>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${skillColors[q.skill] ?? 'bg-slate-100 text-slate-600'}`}>
            {q.skill}
          </span>
          <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            {paramLabel[q.parameter]}
          </span>
        </div>
        <p className="text-base font-bold text-slate-800 leading-relaxed">{q.question}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {q.options.map((opt, i) => {
          const isSel = selected === i;
          return (
            <button key={i} onClick={() => pick(i)}
              className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 font-semibold text-sm
                flex items-center gap-3 transition-all active:scale-[0.98]
                ${isSel
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-slate-200 text-slate-700 hover:border-blue-200 bg-white'}`}>
              <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black border-2
                ${isSel ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-500'}`}>
                {isSel ? <Check size={12} strokeWidth={3} /> : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      <button onClick={next} disabled={selected === null}
        className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all
          ${selected !== null
            ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] '
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
        {isLast ? <><Check size={18} /> Submit All Answers</> : <>Next Question <ChevronRight size={18} /></>}
      </button>
    </div>
  );
}

// ── Step 5: Comprehension Results ─────────────────────────────────────────────

function Step5CompResults({ result, onNext }: { result: AssessmentResult; onNext: () => void }) {
  const paramColors: Record<string, string> = {
    'Literal Recall': 'bg-blue-100 text-blue-700 border-blue-200',
    'Vocabulary in Context': 'bg-purple-100 text-purple-700 border-purple-200',
    'Inference': 'bg-orange-100 text-orange-700 border-orange-200',
    'Sequencing / Main Idea': 'bg-teal-100 text-teal-700 border-teal-200',
  };

  const correctCount = result.compSubskills.filter((s) => s.status === 'Correct').length;

  return (
    <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Comprehension Results</h2>
        <p className="text-slate-500 text-sm mt-1">
          {correctCount} of 4 parameters correct · {result.compScore}%
        </p>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0
            ${result.compScore >= 75 ? 'bg-emerald-500' : result.compScore >= 50 ? 'bg-amber-400' : 'bg-rose-500'}`}>
            {result.compScore}%
          </div>
          <div>
            <p className="font-black text-blue-900 text-lg">
              {result.compScore >= 75 ? '✨ Strong Comprehension' : result.compScore >= 50 ? '⚡ Developing' : '🎯 Needs Support'}
            </p>
            <p className="text-sm text-slate-500">
              {correctCount} of 4 parameters at mastery
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {result.compSubskills.map((sk, i) => (
            <div key={sk.name}
              className={`flex items-center gap-3 p-3.5 rounded-xl border-2
                ${sk.isLowestBrokenRung
                  ? 'border-rose-300 bg-rose-50'
                  : sk.status === 'Correct'
                    ? 'border-emerald-100 bg-emerald-50'
                    : 'border-amber-200 bg-amber-50'}`}>
              <span className="text-xs font-black text-slate-400 w-5 text-center">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold
                    ${sk.isLowestBrokenRung ? 'text-rose-700' : sk.status === 'Correct' ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {sk.name}
                  </p>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${paramColors[sk.name] ?? ''}`}>
                    P{sk.parameter}
                  </span>
                </div>
                {sk.isLowestBrokenRung && (
                  <p className="text-[10px] text-rose-500 font-bold mt-0.5">⬅ Primary drill target</p>
                )}
              </div>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${sk.status === 'Correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {sk.status === 'Correct' ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onNext}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-base
          flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all
          ">
        View Full Report <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ── Step 6: Per-Child Report ───────────────────────────────────────────────────

export function ReportCard({
  studentName, grade, section, language, result, assessedDate, compact = false,
}: {
  studentName: string;
  grade: GradeLevel | string | number;
  section?: string;
  language: Language;
  result: AssessmentResult;
  assessedDate?: string;
  compact?: boolean;
}) {
  const cfg = TIER_CONFIG[result.tier];
  const gradeNum = typeof grade === 'number' ? grade as GradeLevel : 4 as GradeLevel;
  const benchmark = WCPM_BENCHMARKS[gradeNum]?.[language] ?? 95;

  return (
    <div className={`bg-white rounded-2xl border border-blue-100 shadow-sm ${compact ? 'p-4' : 'p-6'}`}>
      {!compact && (
        <div className="flex items-start gap-4 mb-5 pb-5 border-b border-blue-50">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black flex-shrink-0">
            {studentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="font-black text-blue-900 text-lg">{studentName}</h3>
            <p className="text-sm text-slate-500">Grade {grade}{section ? ` · ${section}` : ''}</p>
            {assessedDate && <p className="text-xs text-slate-400 mt-0.5">Assessed: {assessedDate}</p>}
          </div>
          <div className="ml-auto">{cfg.emoji}</div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Tier summary */}
        <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${cfg.lightBg} ${cfg.borderClass}`}>
          <div className={`w-10 h-10 ${cfg.bgClass} rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
            {cfg.icon}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{language} Reading Level</p>
            <p className={`font-black text-base ${cfg.textClass}`}>{cfg.label}</p>
            {cfg.sublabel && <p className={`text-xs font-bold ${cfg.textClass}`}>{cfg.sublabel}</p>}
          </div>
          <div className="ml-auto">
            <TierBadge tier={result.tier} size="md" />
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'WCPM', value: String(result.wcpm), sub: `Benchmark: ${benchmark}`, ok: result.wcpm >= benchmark * 0.75 },
            { label: 'Accuracy', value: `${result.accuracy}%`, sub: 'oral reading', ok: result.accuracy >= 95 },
            { label: 'Comprehension', value: `${result.compScore}%`, sub: '4 parameters', ok: result.compScore >= 75 },
          ].map((item) => (
            <div key={item.label} className={`rounded-2xl p-3 text-center border ${item.ok ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{item.label}</p>
              <p className={`text-xl font-black font-mono mt-0.5 ${item.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{item.value}</p>
              <p className="text-[10px] text-slate-400">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Fluency breakdown */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Fluency Parameters</p>
          <div className="grid grid-cols-2 gap-1.5">
            {result.fluencySubskills.map((sk) => (
              <div key={sk.name} className="flex items-center gap-1.5">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0
                  ${sk.status === 'Strong' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {sk.status === 'Strong' ? <Check size={8} strokeWidth={3} /> : <X size={8} strokeWidth={3} />}
                </span>
                <span className={`text-[10px] font-semibold ${sk.isLowestBrokenRung ? 'text-rose-700 font-bold' : 'text-slate-600'}`}>
                  {sk.name.split(' / ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Comprehension breakdown */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Comprehension Parameters</p>
          <div className="grid grid-cols-2 gap-1.5">
            {result.compSubskills.map((sk) => (
              <div key={sk.name} className="flex items-center gap-1.5">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0
                  ${sk.status === 'Correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {sk.status === 'Correct' ? <Check size={8} strokeWidth={3} /> : <X size={8} strokeWidth={3} />}
                </span>
                <span className={`text-[10px] font-semibold ${sk.isLowestBrokenRung ? 'text-rose-700 font-bold' : 'text-slate-600'} truncate`}>
                  {sk.name.replace(' / Main Idea', '')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary drill */}
        <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
          <Zap size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Primary Drill</p>
            <p className="text-sm font-bold text-amber-900 mt-0.5">{result.primaryGap}</p>
            <p className="text-xs text-amber-700 mt-1">{result.primaryDrill}</p>
          </div>
        </div>

        {/* Downstream flags */}
        {result.downstreamFlags.length > 0 && (
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3.5">
            <AlertTriangle size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-blue-700 uppercase tracking-wider">Downstream Flags</p>
              <p className="text-xs text-blue-600 font-semibold mt-1">
                Re-check after primary drill resolves: {result.downstreamFlags.join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Step6Report({ student, language, result, onNext }: {
  student: Student;
  language: Language;
  result: AssessmentResult;
  onNext: () => void;
}) {
  return (
    <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Student Report</h2>
        <p className="text-gray-500 text-sm mt-1">Assessment summary for {student.name}</p>
      </div>

      <ReportCard
        studentName={student.name}
        grade={student.grade}
        section={student.section}
        language={language}
        result={result}
        assessedDate={new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
      />

      <button onClick={onNext}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-base
          flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all
          ">
        <Mail size={18} /> Send Parent Report
      </button>
    </div>
  );
}

// ── Step 7: Send Parent Report ─────────────────────────────────────────────────

function Step7ParentEmail({ student, language, result, onDone }: {
  student: Student;
  language: Language;
  result: AssessmentResult;
  onDone: () => void;
}) {
  const [sent, setSent] = useState(false);
  const cfg = TIER_CONFIG[result.tier];
  const firstName = student.name.split(' ')[0];

  const token = `bk_${student.id}_${Date.now().toString(36)}_${language.toLowerCase().slice(0, 3)}`;
  const link = `app.bigkas.ph/parent/report?token=${token}`;
  const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleSend = () => {
    setSent(true);
    toast.success(`Parent report link sent to ${student.parentEmail}`);
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Send Parent Report</h2>
        <p className="text-gray-500 text-sm mt-1">Tokenized link · {student.name}</p>
      </div>

      {/* Email preview card */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
        {/* Email header */}
        <div className="bg-blue-600 px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <Mail size={14} className="text-blue-200" />
            <span className="text-blue-200 text-xs font-semibold">To: {student.parentEmail}</span>
          </div>
          <p className="text-white font-black text-sm">BIGKAS Reading Report — {firstName}</p>
          <p className="text-blue-200 text-xs mt-0.5">From: bigkas-noreply@deped.ph</p>
        </div>

        {/* Email body */}
        <div className="p-5 flex flex-col gap-4">
          <p className="text-sm text-slate-700 font-semibold leading-relaxed">
            Dear Parent / Guardian,
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {firstName}'s reading assessment for <strong>{language}</strong> has been completed.
            Please use the private link below to view the full report:
          </p>

          {/* Token link */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-2">Private Report Link</p>
            <p className="text-xs font-mono text-blue-700 break-all font-bold">{link}</p>
            <p className="text-[10px] text-slate-500 mt-2">
              This link is valid until <strong>{expiry}</strong>. Do not share it with others.
            </p>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The report includes your child's reading level, what they are working on, and simple activities to support reading at home.
          </p>

          {/* Result preview */}
          <div className={`flex items-center gap-3 p-3.5 rounded-xl border-2 ${cfg.lightBg} ${cfg.borderClass}`}>
            <span className="text-2xl">{cfg.emoji}</span>
            <div>
              <p className="text-xs font-black text-slate-500">Reading Level: {language}</p>
              <p className={`font-black text-sm ${cfg.textClass}`}>{cfg.label}</p>
            </div>
            <div className="ml-auto">
              <TierBadge tier={result.tier} size="sm" />
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
            Audio recordings are deleted immediately after scoring. This report was reviewed by your child's teacher.
            <br />If you have questions, contact your child's teacher directly.
          </p>
        </div>
      </div>

      {/* Token info */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <Star size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-black text-slate-600">How the parent link works</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Each parent gets a unique single-use token. No account or password needed.
            The link expires in 30 days or when the next assessment cycle starts. The child's full name does not appear in the URL.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {!sent ? (
          <button onClick={handleSend}
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-sm
              flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all
              ">
            <Send size={16} /> Send Report Email
          </button>
        ) : (
          <div className="flex-1 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 py-4 rounded-2xl font-black text-sm
            flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Report Sent! ✨
          </div>
        )}
        <button onClick={onDone}
          className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-4 rounded-2xl font-black text-sm
            flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all">
          <RotateCcw size={16} /> New Assessment
        </button>
      </div>
    </div>
  );
}

// ── Main Assessment Flow ───────────────────────────────────────────────────────

type Step = 1 | 2 | 2.5 | 3 | 4 | 5 | 6 | 7;

export function AssessmentFlow() {
  const [step, setStep] = useState<Step>(1);
  const [student, setStudent] = useState<Student | null>(null);
  const [language, setLanguage] = useState<Language>('Filipino');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const displayStep = step === 2.5 ? 3 : Math.ceil(step as number) as 1 | 2 | 3 | 4 | 5 | 6 | 7;

  const reset = () => {
    setStep(1);
    setStudent(null);
    setAssessmentResult(null);
  };

  const handleSelectStudent = (s: Student, lang: Language) => {
    setStudent(s);
    setLanguage(lang);
    setStep(2);
  };

  const handleCompSubmit = (answers: number[]) => {
    const grade = student!.grade as GradeLevel;
    const questions = COMP_QUESTIONS[language][grade];
    const correctAnswers = questions.map((q) => q.correctIndex);
    const result = buildAssessmentResult(language, answers, correctAnswers, grade);
    setAssessmentResult(result);
    setStep(5);
  };

  return (
    <div className="flex flex-col h-full">
      <StepIndicator current={displayStep} />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {step === 1 && <Step1SelectStudent onNext={handleSelectStudent} />}
        {step === 2 && student && (
          <Step2Passage student={student} language={language} onRecordingComplete={() => setStep(2.5)} />
        )}
        {step === 2.5 && <ProcessingScreen onDone={() => setStep(3)} />}
        {step === 3 && student && (
          <Step3FluencyResults student={student} language={language} onNext={() => setStep(4)} />
        )}
        {step === 4 && student && (
          <Step4CompQuestions student={student} language={language} onSubmit={handleCompSubmit} />
        )}
        {step === 5 && assessmentResult && (
          <Step5CompResults result={assessmentResult} onNext={() => setStep(6)} />
        )}
        {step === 6 && student && assessmentResult && (
          <Step6Report student={student} language={language} result={assessmentResult} onNext={() => setStep(7)} />
        )}
        {step === 7 && student && assessmentResult && (
          <Step7ParentEmail student={student} language={language} result={assessmentResult} onDone={reset} />
        )}
      </div>
    </div>
  );
}
