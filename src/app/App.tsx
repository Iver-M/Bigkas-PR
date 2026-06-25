import { useState, useEffect, useRef } from "react";
import {
  Mic, Home, Users, BarChart2, User, BookOpen,
  ChevronRight, ChevronLeft, Check, X,
  Bell, Zap, ArrowRight, Download, Play, Pause, Square,
  MessageSquare, RotateCcw, Wifi, WifiOff, Copy,
  LogOut, Mail, School, Clock, Star, TrendingUp,
  AlertTriangle, ClipboardList, Shield
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";

// ── Types ──────────────────────────────────────────────────────────────────────

type Tier = "green" | "yellow-fluency" | "yellow-comprehension" | "red" | "pending";
type Language = "Filipino" | "English";
type Screen =
  | "splash" | "login"
  | "dashboard" | "classes" | "assessments" | "reports" | "profile"
  | "class-select" | "student-list" | "language-select" | "passage"
  | "recording" | "processing" | "comprehension"
  | "results" | "intervention" | "report" | "parent-message";

interface StudentResult { tier: Tier; wcpm: number; accuracy: number; assessed: boolean; }
interface Student { id: string; name: string; filipino: StudentResult; english: StudentResult; }
interface ClassData { id: string; label: string; grade: number; section: string; students: Student[]; }
interface Question { q: string; options: string[]; correct: number; skill: string; }
interface MockResult {
  wcpm: number; accuracy: number; fluencyScore: number; compScore: number;
  tier: Tier; primaryGap: string;
  fluencySubskills: { name: string; severity: "solid" | "mild" | "moderate" | "severe" }[];
  compSubskills: { name: string; correct: boolean }[];
  drill: string; reassessDate: string;
}

// ── Seed Data ──────────────────────────────────────────────────────────────────

function sr(tier: Tier, wcpm: number, acc: number): StudentResult {
  return { tier, wcpm, accuracy: acc, assessed: tier !== "pending" };
}

const GRADE1: Student[] = [
  { id: "g1-1",  name: "Liza Aquino",      filipino: sr("green","76" as any, 95), english: sr("yellow-comprehension", 58, 88) },
  { id: "g1-2",  name: "Ramon Dela Torre", filipino: sr("red", 24, 57),           english: sr("red", 17, 51) },
  { id: "g1-3",  name: "Jasmin Santos",    filipino: sr("yellow-fluency", 41, 78), english: sr("red", 29, 63) },
  { id: "g1-4",  name: "Leo Bautista",     filipino: sr("green", 72, 96),          english: sr("green", 65, 93) },
  { id: "g1-5",  name: "Crisanta Reyes",   filipino: sr("red", 19, 52),            english: sr("red", 14, 46) },
  { id: "g1-6",  name: "Marco Villanueva", filipino: sr("yellow-comprehension", 63, 91), english: sr("yellow-fluency", 44, 80) },
  { id: "g1-7",  name: "Nena Garcia",      filipino: sr("green", 70, 94),          english: sr("yellow-comprehension", 56, 87) },
  { id: "g1-8",  name: "Dante Cruz",       filipino: sr("red", 21, 55),            english: sr("red", 16, 48) },
  { id: "g1-9",  name: "Perla Ramos",      filipino: sr("yellow-fluency", 38, 75), english: sr("yellow-fluency", 40, 77) },
  { id: "g1-10", name: "Anton Mendoza",    filipino: sr("green", 74, 97),          english: sr("green", 68, 94) },
];

const GRADE2: Student[] = [
  { id: "g2-1",  name: "Juan dela Cruz",   filipino: sr("yellow-comprehension", 62, 94), english: sr("red", 31, 67) },
  { id: "g2-2",  name: "Maria Santos",     filipino: sr("green", 78, 97),                english: sr("yellow-fluency", 48, 82) },
  { id: "g2-3",  name: "Ana Reyes",        filipino: sr("red", 28, 61),                  english: sr("red", 19, 54) },
  { id: "g2-4",  name: "Pedro Bautista",   filipino: sr("green", 81, 98),                english: sr("green", 72, 96) },
  { id: "g2-5",  name: "Luisa Garcia",     filipino: sr("yellow-fluency", 44, 79),       english: sr("yellow-comprehension", 58, 90) },
  { id: "g2-6",  name: "Carlo Mendoza",    filipino: sr("red", 22, 58),                  english: sr("red", 15, 49) },
  { id: "g2-7",  name: "Sofia Ramos",      filipino: sr("green", 76, 96),                english: sr("green", 68, 94) },
  { id: "g2-8",  name: "Miguel Torres",    filipino: sr("yellow-comprehension", 65, 92), english: sr("red", 33, 70) },
  { id: "g2-9",  name: "Elena Cruz",       filipino: sr("green", 74, 95),                english: sr("yellow-fluency", 46, 80) },
  { id: "g2-10", name: "Jose Villanueva",  filipino: sr("pending", 0, 0),                english: sr("pending", 0, 0) },
];

const GRADE3: Student[] = [
  { id: "g3-1",  name: "Patricia Lim",      filipino: sr("green", 88, 98),                english: sr("green", 80, 97) },
  { id: "g3-2",  name: "Roberto Tan",       filipino: sr("green", 84, 97),                english: sr("yellow-comprehension", 72, 94) },
  { id: "g3-3",  name: "Cecilia Flores",    filipino: sr("yellow-fluency", 52, 83),       english: sr("green", 76, 95) },
  { id: "g3-4",  name: "Manuel Rizal",      filipino: sr("green", 91, 99),                english: sr("green", 85, 98) },
  { id: "g3-5",  name: "Teresa Ocampo",     filipino: sr("yellow-comprehension", 74, 95), english: sr("yellow-fluency", 55, 85) },
  { id: "g3-6",  name: "Fernando Castro",   filipino: sr("pending", 0, 0),                english: sr("pending", 0, 0) },
  { id: "g3-7",  name: "Remedios Luna",     filipino: sr("green", 86, 97),                english: sr("green", 78, 96) },
  { id: "g3-8",  name: "Agustin Navarro",   filipino: sr("yellow-comprehension", 71, 93), english: sr("red", 38, 72) },
  { id: "g3-9",  name: "Dolores Batistina", filipino: sr("red", 31, 65),                  english: sr("red", 24, 58) },
  { id: "g3-10", name: "Salvador Magtibay", filipino: sr("green", 82, 97),                english: sr("yellow-comprehension", 68, 92) },
];

// Fix the sr function — wcpm should be number
GRADE1[0].filipino.wcpm = 76;

const CLASSES: ClassData[] = [
  { id: "1", label: "Grade 1 - Makabayan", grade: 1, section: "Makabayan", students: GRADE1 },
  { id: "2", label: "Grade 2 - Mabini",    grade: 2, section: "Mabini",    students: GRADE2 },
  { id: "3", label: "Grade 3 - Rizal",     grade: 3, section: "Rizal",     students: GRADE3 },
];

const ALL_STUDENTS = [...GRADE1, ...GRADE2, ...GRADE3];

// ── Passages ───────────────────────────────────────────────────────────────────

const PASSAGES: Record<Language, { title: string; text: string }> = {
  Filipino: {
    title: "Ang Batang Masipag",
    text: "Si Lino ay isang batang masipag. Araw-araw, pumupunta siya sa paaralan nang maaga. Mahilig siyang magbasa ng mga libro tungkol sa mga hayop. Ang kanyang paboritong hayop ay ang agila, ang pambansang ibon ng Pilipinas. Isang araw, gumawa siya ng maikling kuwento tungkol sa isang agila na lumilipad sa mga bundok. Ikinuwento niya ito sa kanyang klase at labis na nagustuhan ng kanyang mga kaklase.",
  },
  English: {
    title: "The Little Gardener",
    text: "Rosa loves her little garden. Every morning, she waters her plants before going to school. She grows tomatoes, kangkong, and bright yellow flowers. Her lola taught her how to take care of plants. Rosa says that gardening makes her feel calm and happy. One day, she brought some flowers to her teacher and her classmates smiled when they saw the beautiful colors.",
  },
};

// ── Questions ──────────────────────────────────────────────────────────────────

const QUESTIONS: Record<Language, Question[]> = {
  Filipino: [
    { q: "Sino ang pangunahing tauhan sa kuwento?",         options: ["Si Rosa",  "Si Lino",                   "Si Agila",   "Si Lola"],             correct: 1, skill: "Literal Recall" },
    { q: 'Ano ang ibig sabihin ng salitang "masipag"?',    options: ["Tamad",    "Matiyaga at nagtatrabaho",  "Matalino",   "Masaya"],              correct: 1, skill: "Vocabulary in Context" },
    { q: "Bakit pumupunta nang maaga si Lino sa paaralan?", options: ["Masipag siya", "Malayo ang bahay",     "May pagsubok", "Hindi sinabi"],       correct: 0, skill: "Inference" },
    { q: "Ano ang nangyari nang ikuwento niya ang agila?",  options: ["Umiyak siya", "Nagustuhan ng klase",   "Nagalit ang guro", "Walang nakinig"], correct: 1, skill: "Sequencing" },
  ],
  English: [
    { q: "Who is the main character in the story?",         options: ["Lola",    "Rosa",                      "A gardener", "A teacher"],            correct: 1, skill: "Literal Recall" },
    { q: 'What does the word "calm" most likely mean?',     options: ["Excited", "Peaceful and quiet",        "Tired",      "Busy"],                 correct: 1, skill: "Vocabulary in Context" },
    { q: "Why do you think Rosa brings flowers to school?", options: ["To sell them", "To make people happy", "Teacher told her", "She forgot"],     correct: 1, skill: "Inference" },
    { q: "What is the correct order of events?",            options: ["Brings flowers → waters plants", "Waters plants → grows flowers → brings to school", "Goes to school → gardens", "Lola teaches → sells flowers"], correct: 1, skill: "Sequencing" },
  ],
};

// ── Tier Config ────────────────────────────────────────────────────────────────

const T: Record<Tier, { label: string; sublabel?: string; bg: string; light: string; border: string; text: string; badge: string; drill: string; }> = {
  green:                { label: "On Track",        bg: "bg-emerald-500", light: "bg-emerald-50",  border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800", drill: "Enrichment reading activities" },
  "yellow-fluency":     { label: "Needs Practice",  sublabel: "Fluency",        bg: "bg-amber-400",   light: "bg-amber-50",    border: "border-amber-200",   text: "text-amber-700",   badge: "bg-amber-100 text-amber-800",   drill: "Fluency drills · repeated reading" },
  "yellow-comprehension":{ label: "Needs Practice", sublabel: "Comprehension",  bg: "bg-amber-400",   light: "bg-amber-50",    border: "border-amber-200",   text: "text-amber-700",   badge: "bg-amber-100 text-amber-800",   drill: "Comprehension drills · retelling" },
  red:                  { label: "Needs Support",   bg: "bg-red-500",     light: "bg-red-50",     border: "border-red-200",     text: "text-red-700",     badge: "bg-red-100 text-red-800",       drill: "Phonics & decoding · syllable blending" },
  pending:              { label: "Not Assessed",    bg: "bg-slate-300",   light: "bg-slate-50",   border: "border-slate-200",   text: "text-slate-400",   badge: "bg-slate-100 text-slate-500",   drill: "—" },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function overallTier(s: Student): Tier {
  if (!s.filipino.assessed && !s.english.assessed) return "pending";
  const tiers: Tier[] = [s.filipino.tier, s.english.tier];
  if (tiers.includes("red")) return "red";
  if (tiers.some(t => t.startsWith("yellow"))) return "yellow-comprehension";
  return "green";
}

function generateResult(student: Student, lang: Language, answers: number[]): MockResult {
  const src = lang === "Filipino" ? student.filipino : student.english;
  const wcpm = src.assessed ? src.wcpm : 30 + Math.floor(Math.random() * 50);
  const accuracy = src.assessed ? src.accuracy : 65 + Math.floor(Math.random() * 30);
  const correct = answers.filter((a, i) => a === QUESTIONS[lang][i].correct).length;
  const compScore = Math.round((correct / 4) * 100);
  const fluencyScore = Math.round(Math.min((wcpm / (lang === "Filipino" ? 60 : 65)) * 100, 100));

  let tier: Tier;
  if (wcpm < 40 && compScore < 60) tier = "red";
  else if (wcpm < 40) tier = "yellow-fluency";
  else if (compScore < 60) tier = "yellow-comprehension";
  else tier = "green";

  const primaryGap = tier === "red" ? "Decoding / Phonics" : tier === "yellow-fluency" ? "Pacing & Accuracy" : tier === "yellow-comprehension" ? "Inference" : "None";
  const drill = T[tier].drill;

  const today = new Date();
  const reassess = new Date(today);
  reassess.setDate(today.getDate() + 14);
  const reassessDate = reassess.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });

  return {
    wcpm, accuracy, fluencyScore, compScore, tier, primaryGap, drill, reassessDate,
    fluencySubskills: [
      { name: "Decoding / Phonics", severity: wcpm < 35 ? "severe" : wcpm < 50 ? "moderate" : "solid" },
      { name: "Syllable Blending",  severity: accuracy < 70 ? "severe" : accuracy < 85 ? "moderate" : "solid" },
      { name: "Sight Words",        severity: wcpm < 45 ? "moderate" : "solid" },
      { name: "Pacing & Accuracy",  severity: wcpm < 40 ? "moderate" : wcpm < 55 ? "mild" : "solid" },
    ],
    compSubskills: QUESTIONS[lang].map((q, i) => ({ name: q.skill, correct: answers[i] === q.correct })),
  };
}

// ── Shared UI components ───────────────────────────────────────────────────────

const PAL = ["bg-teal-600","bg-blue-600","bg-violet-600","bg-indigo-600","bg-sky-600","bg-rose-600"];

function Avi({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const c = PAL[name.charCodeAt(0) % PAL.length];
  const s = { sm:"w-8 h-8 text-xs", md:"w-10 h-10 text-sm", lg:"w-14 h-14 text-xl" }[size];
  return <div className={`${c} ${s} rounded-full flex items-center justify-center text-white font-black select-none flex-shrink-0`}>{name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>;
}

function TierPill({ tier, lang }: { tier: Tier; lang?: "FIL"|"ENG" }) {
  const t = T[tier];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${t.badge}`}>
      {lang && <span className="opacity-50">{lang}</span>}
      {t.label}{t.sublabel ? ` · ${t.sublabel.split(" ")[0]}` : ""}
    </span>
  );
}

function TierDot({ tier }: { tier: Tier }) {
  return <span className={`w-2.5 h-2.5 rounded-full ${T[tier].bg} flex-shrink-0 inline-block`} />;
}

function SeverityBar({ sev }: { sev: "solid"|"mild"|"moderate"|"severe" }) {
  const map = { solid: { w: "w-full", c: "bg-emerald-400", label: "Solid" }, mild: { w: "w-3/4", c: "bg-amber-300", label: "Mild" }, moderate: { w: "w-1/2", c: "bg-amber-500", label: "Moderate" }, severe: { w: "w-1/4", c: "bg-red-500", label: "Severe" } };
  const m = map[sev];
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${m.c} ${m.w} rounded-full transition-all`} />
      </div>
      <span className="text-[10px] font-bold text-slate-400 w-14 text-right">{m.label}</span>
    </div>
  );
}

function Waveform({ active }: { active: boolean }) {
  const [bars, setBars] = useState(() => Array(18).fill(0).map(() => 8 + Math.random() * 20));
  useEffect(() => {
    if (!active) { setBars(Array(18).fill(8)); return; }
    const id = setInterval(() => setBars(Array(18).fill(0).map(() => 8 + Math.random() * 40)), 100);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div className="flex items-center justify-center gap-0.5 h-14">
      {bars.map((h, i) => (
        <div key={i} className={`w-1 rounded-full transition-all duration-100 ${active ? "bg-[#0B5E75]" : "bg-slate-200"}`} style={{ height: h }} />
      ))}
    </div>
  );
}

function BackBtn({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 active:scale-95 transition-all">
      <ChevronLeft size={20} className="text-slate-600" />
    </button>
  );
}

// ── Splash Screen ──────────────────────────────────────────────────────────────

function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0B5E75] gap-6 px-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center">
          <BookOpen size={44} className="text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-black text-white tracking-tight">BIGKAS</h1>
          <p className="text-teal-200 text-sm font-semibold mt-1">Bilingual Reading Assessment</p>
        </div>
      </div>
      <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mt-4" />
      <div className="absolute bottom-12 flex flex-col items-center gap-1">
        <p className="text-teal-300/60 text-[10px] font-semibold uppercase tracking-widest">Powered by</p>
        <p className="text-white/70 text-xs font-bold">IBM Granite Speech</p>
      </div>
    </div>
  );
}

// ── Login Screen ───────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("rosa.santos@mabini.deped.gov.ph");
  const [password, setPassword] = useState("••••••••");
  return (
    <div className="flex flex-col h-full bg-[#0B5E75]">
      <div className="flex flex-col items-center pt-16 pb-8 px-6">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
          <BookOpen size={30} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-white">BIGKAS</h1>
        <p className="text-teal-200 text-sm mt-1">Welcome back, Teacher</p>
      </div>

      <div className="flex-1 bg-[#F5F0E8] rounded-t-[32px] px-6 pt-8 pb-6 flex flex-col gap-5">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
          <input
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-3.5 text-sm border border-slate-200 outline-none focus:border-[#0B5E75] focus:ring-2 focus:ring-teal-100 transition-all font-semibold text-slate-700"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-white rounded-xl px-4 py-3.5 text-sm border border-slate-200 outline-none focus:border-[#0B5E75] focus:ring-2 focus:ring-teal-100 transition-all font-semibold text-slate-700"
          />
        </div>
        <button
          onClick={onLogin}
          className="w-full bg-[#0B5E75] text-white rounded-2xl py-4 font-black text-base mt-2 hover:bg-[#0a5368] active:scale-[0.98] transition-all shadow-lg shadow-teal-900/20">
          Log In
        </button>
        <p className="text-center text-xs text-slate-400 font-semibold">DepEd Teacher Portal · Mabini Elementary School</p>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

function DashboardScreen({ onStartAssess, onReports }: { onStartAssess: () => void; onReports: () => void }) {
  const assessed = ALL_STUDENTS.filter(s => s.filipino.assessed || s.english.assessed);
  const green  = assessed.filter(s => overallTier(s) === "green").length;
  const yellow = assessed.filter(s => overallTier(s).startsWith("yellow")).length;
  const red    = assessed.filter(s => overallTier(s) === "red").length;
  const pending= ALL_STUDENTS.filter(s => overallTier(s) === "pending").length;
  const recent = [...GRADE2, ...GRADE1].filter(s => s.filipino.assessed).slice(0, 5);

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <div className="px-5 pt-4 pb-5 bg-[#0B5E75] rounded-b-[32px]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-teal-300 text-[11px] font-bold uppercase tracking-widest">Kamusta po!</p>
            <h1 className="text-white text-lg font-black mt-0.5">Ma'am Rosa Santos</h1>
            <p className="text-teal-300/80 text-[11px] mt-0.5">Mabini Elementary School</p>
          </div>
          <div className="relative">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95">
              <Bell size={18} />
            </button>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full text-[9px] font-black text-slate-900 flex items-center justify-center">3</span>
          </div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-white text-sm font-bold">Total Progress</span>
            <span className="text-teal-200 font-mono text-sm font-bold">{assessed.length}/{ALL_STUDENTS.length}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(assessed.length/ALL_STUDENTS.length)*100}%` }} />
          </div>
          <p className="text-teal-200/80 text-[11px] mt-2">{pending} students not yet assessed</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Reading Tiers</p>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Total",   val: ALL_STUDENTS.length, bg: "bg-slate-50",    border: "border-slate-200",   text: "text-slate-700"    },
            { label: "Green",   val: green,                bg: "bg-emerald-50",  border: "border-emerald-100", text: "text-emerald-700"  },
            { label: "Yellow",  val: yellow,               bg: "bg-amber-50",    border: "border-amber-100",   text: "text-amber-700"    },
            { label: "Red",     val: red,                  bg: "bg-red-50",      border: "border-red-100",     text: "text-red-700"      },
          ].map(item => (
            <div key={item.label} className={`${item.bg} ${item.border} border rounded-2xl p-3 text-center`}>
              <div className={`text-2xl font-black font-mono ${item.text}`}>{item.val}</div>
              <div className={`text-[9px] font-bold ${item.text} mt-0.5`}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Assessment */}
      <div className="px-5">
        <button onClick={onStartAssess}
          className="w-full bg-[#0B5E75] text-white rounded-2xl px-5 py-4 flex items-center justify-between group hover:bg-[#0a5368] active:scale-[0.98] transition-all shadow-lg shadow-teal-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Mic size={20} />
            </div>
            <div className="text-left">
              <div className="font-black text-base">Start Assessment</div>
              <div className="text-teal-200 text-xs">{pending} students remaining</div>
            </div>
          </div>
          <ArrowRight size={20} className="text-teal-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Recent */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Assessments</p>
          <button onClick={onReports} className="text-[11px] text-[#0B5E75] font-bold">See All</button>
        </div>
        <div className="flex flex-col gap-2">
          {recent.map(s => (
            <div key={s.id} className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
              <Avi name={s.name} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-800 truncate">{s.name}</p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <TierPill tier={s.filipino.tier} lang="FIL" />
                  <TierPill tier={s.english.tier} lang="ENG" />
                </div>
              </div>
              <div className="font-mono text-sm font-black text-slate-700 flex-shrink-0">
                {s.filipino.wcpm}<span className="text-[10px] text-slate-400 font-normal">wpm</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="px-5">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex gap-3">
          <Zap size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-800 text-xs leading-relaxed">
            <span className="font-black">Ladder Rule:</span> Fix the lowest broken rung first. Red-tier students need phonics before comprehension.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Assessment: Class Select ───────────────────────────────────────────────────

function ClassSelectScreen({ onSelect, onBack }: { onSelect: (c: ClassData) => void; onBack: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3 flex-shrink-0">
        <BackBtn onBack={onBack} />
        <div>
          <h1 className="text-xl font-black text-slate-800">Select Class</h1>
          <p className="text-slate-500 text-xs mt-0.5">Choose which class to assess</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-6 flex flex-col gap-3 pt-2">
        {CLASSES.map(cls => {
          const assessed = cls.students.filter(s => s.filipino.assessed).length;
          const green  = cls.students.filter(s => overallTier(s) === "green").length;
          const yellow = cls.students.filter(s => overallTier(s).startsWith("yellow")).length;
          const red    = cls.students.filter(s => overallTier(s) === "red").length;
          return (
            <button key={cls.id} onClick={() => onSelect(cls)}
              className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border-2 border-transparent hover:border-teal-200 active:scale-[0.98] transition-all text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#0B5E75]/8 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-black text-[#0B5E75]">{cls.grade}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-800">{cls.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{cls.students.length} students · {assessed} assessed</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />{green}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{yellow}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-700"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />{red}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Assessment: Student List ───────────────────────────────────────────────────

function StudentListScreen({ cls, onSelect, onBack }: { cls: ClassData; onSelect: (s: Student) => void; onBack: () => void }) {
  const [filter, setFilter] = useState<"all"|"pending"|"assessed">("all");
  const shown = cls.students.filter(s =>
    filter === "all" ? true : filter === "pending" ? !s.filipino.assessed : s.filipino.assessed
  );
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <BackBtn onBack={onBack} />
          <div>
            <h1 className="text-xl font-black text-slate-800">{cls.label}</h1>
            <p className="text-slate-500 text-xs">{cls.students.length} students</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {(["all","pending","assessed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors capitalize ${filter===f ? "bg-[#0B5E75] text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {f} {f === "pending" ? cls.students.filter(s => !s.filipino.assessed).length : f === "assessed" ? cls.students.filter(s => s.filipino.assessed).length : cls.students.length}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-6 flex flex-col gap-2">
        {shown.map(s => (
          <button key={s.id} onClick={() => onSelect(s)}
            className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 border-2 border-transparent hover:border-teal-200 active:scale-[0.98] transition-all text-left shadow-sm">
            <Avi name={s.name} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-sm">{s.name}</p>
              {s.filipino.assessed
                ? <div className="flex items-center gap-1.5 mt-1 flex-wrap"><TierPill tier={s.filipino.tier} lang="FIL" /><TierPill tier={s.english.tier} lang="ENG" /></div>
                : <p className="text-xs text-slate-400 mt-0.5">Not yet assessed</p>}
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Assessment: Language Select ────────────────────────────────────────────────

function LanguageSelectScreen({ student, onSelect, onBack }: { student: Student; onSelect: (l: Language) => void; onBack: () => void }) {
  return (
    <div className="flex flex-col h-full px-5 pt-4">
      <div className="flex items-center gap-3 mb-6">
        <BackBtn onBack={onBack} />
        <h1 className="text-xl font-black text-slate-800">Select Language</h1>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <Avi name={student.name} size="lg" />
        <div>
          <p className="font-black text-slate-800 text-lg">{student.name}</p>
          <p className="text-slate-500 text-sm">Grade level assessment</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {(["Filipino", "English"] as Language[]).map(lang => {
          const res = lang === "Filipino" ? student.filipino : student.english;
          return (
            <button key={lang} onClick={() => onSelect(lang)}
              className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 border-2 border-transparent hover:border-teal-200 active:scale-[0.98] transition-all text-left shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${lang === "Filipino" ? "bg-blue-50" : "bg-red-50"}`}>
                {lang === "Filipino" ? "🇵🇭" : "🇺🇸"}
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-800">{lang}</p>
                {res.assessed
                  ? <div className="flex items-center gap-2 mt-1"><TierPill tier={res.tier} /><span className="font-mono text-xs text-slate-400">{res.wcpm} WCPM</span></div>
                  : <p className="text-xs text-slate-400 mt-0.5">Not yet assessed</p>}
              </div>
              {res.assessed && <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full font-bold flex-shrink-0">Re-assess</span>}
              <ChevronRight size={16} className="text-slate-300 flex-shrink-0" />
            </button>
          );
        })}
      </div>
      <div className="mt-4 bg-teal-50 border border-teal-100 rounded-2xl px-4 py-3">
        <p className="text-teal-800 text-xs leading-relaxed font-semibold">Filipino and English are assessed separately. Never mix languages in one session.</p>
      </div>
    </div>
  );
}

// ── Assessment: Passage ────────────────────────────────────────────────────────

function PassageScreen({ student, language, onStart, onBack }: { student: Student; language: Language; onStart: () => void; onBack: () => void }) {
  const p = PASSAGES[language];
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3 flex-shrink-0">
        <BackBtn onBack={onBack} />
        <div>
          <p className="text-[11px] text-slate-400 font-semibold">{student.name} · {language}</p>
          <h2 className="font-black text-slate-800 text-sm">Reading Passage</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-3">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${language === "Filipino" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>{language.toUpperCase()}</span>
            <span className="text-[11px] text-slate-400 font-semibold">~90 words · Read aloud</span>
          </div>
          <h3 className="font-black text-slate-800 text-base mb-3">{p.title}</h3>
          <p className="text-slate-700 text-lg leading-[1.9] font-semibold">{p.text}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <p className="text-amber-700 text-xs leading-relaxed font-semibold">Have the student read the passage aloud from the beginning. Tap <span className="font-black">Start Reading</span> when ready.</p>
        </div>
      </div>
      <div className="px-5 py-4 flex-shrink-0">
        <button onClick={onStart}
          className="w-full bg-[#0B5E75] text-white rounded-2xl py-4 font-black text-base flex items-center justify-center gap-3 hover:bg-[#0a5368] active:scale-[0.98] transition-all shadow-lg shadow-teal-900/20">
          <Play size={20} fill="white" /> Start Reading
        </button>
      </div>
    </div>
  );
}

// ── Assessment: Recording ──────────────────────────────────────────────────────

function RecordingScreen({ student, language, onStop, onBack }: { student: Student; language: Language; onStop: () => void; onBack: () => void }) {
  const [phase, setPhase] = useState<"idle"|"recording"|"paused">("idle");
  const [secs, setSecs] = useState(0);
  const [isOffline] = useState(() => Math.random() < 0.2);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => {
    if (phase === "recording") {
      timerRef.current = setInterval(() => setSecs(s => s+1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const handleStop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onStop();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3 flex-shrink-0">
        <BackBtn onBack={onBack} />
        <div>
          <p className="text-[11px] text-slate-400 font-semibold">{student.name} · {language}</p>
          <h2 className="font-black text-slate-800 text-sm">Recording</h2>
        </div>
        {isOffline && (
          <div className="ml-auto flex items-center gap-1 bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
            <WifiOff size={11} />
            <span className="text-[10px] font-bold">Offline</span>
          </div>
        )}
      </div>

      {isOffline && (
        <div className="mx-5 mb-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 flex items-center gap-2">
          <WifiOff size={12} className="text-orange-500 flex-shrink-0" />
          <p className="text-orange-700 text-[11px] font-semibold">No internet. Assessment will be saved offline and synced later.</p>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        {/* Mic icon with pulse rings */}
        <div className="relative flex items-center justify-center">
          {phase === "recording" && <>
            <div className="absolute w-32 h-32 rounded-full bg-[#0B5E75]/10 animate-ping" style={{ animationDuration: "1.5s" }} />
            <div className="absolute w-24 h-24 rounded-full bg-[#0B5E75]/15 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.3s" }} />
          </>}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center z-10 transition-colors ${phase === "recording" ? "bg-red-500" : phase === "paused" ? "bg-amber-400" : "bg-[#0B5E75]"}`}>
            <Mic size={36} className="text-white" />
          </div>
        </div>

        {/* Status + timer */}
        <div className="text-center">
          <p className="font-mono text-4xl font-black text-slate-800">{fmt(secs)}</p>
          <p className={`text-sm font-bold mt-1 ${phase === "recording" ? "text-red-500" : phase === "paused" ? "text-amber-500" : "text-slate-400"}`}>
            {phase === "recording" ? "● Recording..." : phase === "paused" ? "⏸ Paused" : "Ready to record"}
          </p>
        </div>

        {/* Waveform */}
        <div className="w-full">
          <Waveform active={phase === "recording"} />
        </div>

        {/* Hint */}
        <p className="text-xs text-slate-400 text-center font-semibold max-w-[240px]">
          {phase === "idle" ? "Tap Start Recording when the student begins reading." : phase === "paused" ? "Recording is paused. Resume when ready." : "Student is reading. Stop when finished."}
        </p>
      </div>

      {/* Controls */}
      <div className="px-5 py-5 flex-shrink-0">
        {phase === "idle" && (
          <button onClick={() => setPhase("recording")}
            className="w-full bg-[#0B5E75] text-white rounded-2xl py-4 font-black text-base flex items-center justify-center gap-3 hover:bg-[#0a5368] active:scale-[0.98] transition-all">
            <Play size={20} fill="white" /> Start Recording
          </button>
        )}
        {(phase === "recording" || phase === "paused") && (
          <div className="flex gap-3">
            <button
              onClick={() => setPhase(p => p === "recording" ? "paused" : "recording")}
              className="flex-1 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl py-4 font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all">
              {phase === "recording" ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Resume</>}
            </button>
            <button onClick={handleStop}
              className="flex-1 bg-red-500 text-white rounded-2xl py-4 font-black text-sm flex items-center justify-center gap-2 hover:bg-red-600 active:scale-[0.98] transition-all">
              <Square size={18} fill="white" /> Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Assessment: Processing ─────────────────────────────────────────────────────

function ProcessingScreen({ onDone }: { onDone: () => void }) {
  const steps = [
    "Transcribing audio with Granite Speech…",
    "Aligning words with passage…",
    "Scoring reading fluency…",
    "Generating comprehension assessment…",
  ];
  const [done, setDone] = useState<number[]>([]);
  const [cur, setCur] = useState(0);

  useEffect(() => {
    if (cur >= steps.length) { setTimeout(onDone, 600); return; }
    const t = setTimeout(() => { setDone(d => [...d, cur]); setCur(c => c+1); }, 750);
    return () => clearTimeout(t);
  }, [cur, onDone]);

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#0B5E75]/10 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0B5E75] border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-slate-800">Analyzing Reading</h2>
          <p className="text-slate-500 text-sm mt-1">IBM Granite Speech is processing…</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        {steps.map((step, i) => {
          const isComplete = done.includes(i);
          const isCurrent = cur === i;
          return (
            <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl transition-all ${isComplete ? "bg-emerald-50" : isCurrent ? "bg-teal-50" : "bg-slate-50"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isComplete ? "bg-emerald-500" : isCurrent ? "bg-[#0B5E75]" : "bg-slate-200"}`}>
                {isComplete ? <Check size={14} className="text-white" strokeWidth={3} /> :
                 isCurrent ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
                 <span className="text-[10px] font-black text-slate-400">{i+1}</span>}
              </div>
              <p className={`text-xs font-bold ${isComplete ? "text-emerald-700" : isCurrent ? "text-[#0B5E75]" : "text-slate-400"}`}>{step}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Assessment: Comprehension ──────────────────────────────────────────────────

function ComprehensionScreen({ student, language, onSubmit, onBack }: { student: Student; language: Language; onSubmit: (answers: number[]) => void; onBack: () => void }) {
  const qs = QUESTIONS[language];
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number|null)[]>(Array(qs.length).fill(null));
  const isLast = idx === qs.length - 1;
  const q = qs[idx];
  const selected = answers[idx];

  const pick = (opt: number) => {
    setAnswers(prev => { const n = [...prev]; n[idx] = opt; return n; });
  };

  const next = () => {
    if (isLast) { onSubmit(answers as number[]); }
    else { setIdx(i => i+1); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <BackBtn onBack={onBack} />
          <div className="flex-1">
            <p className="text-[11px] text-slate-400 font-semibold">{student.name} · {language}</p>
            <h2 className="font-black text-slate-800 text-sm">Comprehension Check</h2>
          </div>
        </div>
        <div className="flex gap-1.5 mb-2">
          {qs.map((_,i) => <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < idx ? "bg-[#0B5E75]" : i === idx ? "bg-teal-300" : "bg-slate-200"}`} />)}
        </div>
        <div className="flex justify-between">
          <span className="text-[11px] text-slate-400 font-semibold">{q.skill}</span>
          <span className="text-[11px] font-mono text-slate-400 font-bold">Q{idx+1}/{qs.length}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-3">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-slate-800 text-base font-bold leading-relaxed">{q.q}</p>
        </div>
        <div className="flex flex-col gap-2.5">
          {q.options.map((opt, i) => {
            const isSel = selected === i;
            return (
              <button key={i} onClick={() => pick(i)}
                className={`rounded-xl px-4 py-3.5 text-left font-semibold text-sm flex items-center gap-3 active:scale-[0.98] transition-all border-2 ${isSel ? "bg-teal-50 border-teal-400 text-teal-800" : "bg-white border-slate-100 text-slate-700 hover:border-slate-200"}`}>
                <span className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-black border-2 border-current ${isSel ? "bg-teal-600 text-white border-teal-600" : ""}`}>
                  {isSel ? <Check size={12} strokeWidth={3} /> : String.fromCharCode(65+i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-4 flex-shrink-0">
        <button onClick={next} disabled={selected === null}
          className={`w-full rounded-2xl py-4 font-black text-base flex items-center justify-center gap-2 transition-all ${selected !== null ? "bg-[#0B5E75] text-white hover:bg-[#0a5368] active:scale-[0.98] shadow-lg shadow-teal-900/20" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
          {isLast ? <>Submit <Check size={18} /></> : <>Next Question <ChevronRight size={18} /></>}
        </button>
      </div>
    </div>
  );
}

// ── Assessment: Results ────────────────────────────────────────────────────────

function ResultsScreen({ student, language, result, onViewIntervention, onBack }: { student: Student; language: Language; result: MockResult; onViewIntervention: () => void; onBack: () => void }) {
  const t = T[result.tier];
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3 flex-shrink-0">
        <BackBtn onBack={onBack} />
        <div>
          <p className="text-[11px] text-slate-400 font-semibold">{student.name} · {language}</p>
          <h2 className="font-black text-slate-800 text-sm">Assessment Results</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-3">
        {/* Tier card */}
        <div className={`${t.light} ${t.border} border-2 rounded-2xl p-5`}>
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 ${t.bg} rounded-2xl flex items-center justify-center text-white text-2xl font-black flex-shrink-0`}>
              {result.tier === "green" ? "✓" : result.tier === "red" ? "!" : "~"}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{language} Reading Level</p>
              <h2 className={`text-xl font-black ${t.text}`}>{t.label}</h2>
              {t.sublabel && <p className={`text-sm font-bold ${t.text}`}>{t.sublabel} Focus</p>}
            </div>
          </div>
        </div>

        {/* Scores grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "WCPM", val: result.wcpm, sub: "Words/min" },
            { label: "Accuracy", val: `${result.accuracy}%`, sub: "Oral reading" },
            { label: "Fluency", val: `${result.fluencyScore}%`, sub: "vs. benchmark" },
            { label: "Comprehension", val: `${result.compScore}%`, sub: `${result.compSubskills.filter(s=>s.correct).length}/4 correct` },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-2xl font-black font-mono text-slate-800">{item.val}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Fluency sub-skills */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Fluency Sub-skills</p>
          <div className="flex flex-col gap-2.5">
            {result.fluencySubskills.map(sk => (
              <div key={sk.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-bold text-slate-600">{sk.name}</span>
                </div>
                <SeverityBar sev={sk.severity} />
              </div>
            ))}
          </div>
        </div>

        {/* Primary gap */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-0.5">Primary Skill Gap</p>
            <p className="text-sm font-black text-red-800">{result.primaryGap}</p>
          </div>
        </div>

        {/* Comprehension breakdown */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Comprehension Breakdown</p>
          <div className="flex flex-col gap-2">
            {result.compSubskills.map(sk => (
              <div key={sk.name} className="flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${sk.correct ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {sk.correct ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
                </span>
                <span className="text-xs font-bold text-slate-600">{sk.name}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onViewIntervention}
          className="w-full bg-[#0B5E75] text-white rounded-2xl py-4 font-black text-base flex items-center justify-center gap-2 hover:bg-[#0a5368] active:scale-[0.98] transition-all shadow-lg shadow-teal-900/20">
          <Zap size={18} /> View Intervention Plan
        </button>
      </div>
    </div>
  );
}

// ── Assessment: Intervention ───────────────────────────────────────────────────

const ACTIVITIES: Record<string, { icon: string; title: string; desc: string }[]> = {
  "Decoding / Phonics": [
    { icon: "🔤", title: "Letter-Sound Drills", desc: "Practice mapping letters to sounds using flashcards." },
    { icon: "🃏", title: "CVC Word Building", desc: "Build simple consonant-vowel-consonant words." },
    { icon: "📖", title: "Decodable Readers", desc: "Read simple phonics-based books daily." },
  ],
  "Pacing & Accuracy": [
    { icon: "🔁", title: "Repeated Reading", desc: "Read the same passage 3× to build speed." },
    { icon: "⏱", title: "Timed Reading Practice", desc: "One-minute reads to track WCPM progress." },
    { icon: "👂", title: "Echo Reading", desc: "Student repeats sentences after teacher models." },
  ],
  "Inference": [
    { icon: "🤔", title: "Prediction Exercises", desc: "Ask 'What do you think will happen next?' before reading." },
    { icon: "🗺", title: "Story Map Activity", desc: "Draw characters, setting, problem, solution." },
    { icon: "💬", title: "Think-Aloud Strategy", desc: "Model inferencing by thinking aloud while reading." },
  ],
  "None": [
    { icon: "⭐", title: "Enrichment Reading", desc: "Assign above-grade texts for challenge." },
    { icon: "📚", title: "Independent Reading Log", desc: "Track books read independently each week." },
    { icon: "✍️", title: "Reading Response Journal", desc: "Write reactions and questions about books." },
  ],
};

function InterventionScreen({ student, language, result, onViewReport, onBack }: { student: Student; language: Language; result: MockResult; onViewReport: () => void; onBack: () => void }) {
  const [saved, setSaved] = useState(false);
  const acts = ACTIVITIES[result.primaryGap] ?? ACTIVITIES["None"];
  const t = T[result.tier];
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3 flex-shrink-0">
        <BackBtn onBack={onBack} />
        <div>
          <p className="text-[11px] text-slate-400 font-semibold">{student.name} · {language}</p>
          <h2 className="font-black text-slate-800 text-sm">Intervention Plan</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-4">
        {/* Primary problem */}
        <div className={`${t.light} ${t.border} border-2 rounded-2xl p-4`}>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Primary Problem</p>
          <h3 className={`text-lg font-black ${t.text}`}>{result.primaryGap === "None" ? "No gap detected" : result.primaryGap}</h3>
          <p className={`text-sm font-semibold ${t.text} mt-0.5`}>{t.label}{t.sublabel ? ` · ${t.sublabel}` : ""}</p>
        </div>

        {/* Drill assigned */}
        <div className="bg-[#0B5E75]/8 border border-[#0B5E75]/20 rounded-2xl p-4 flex items-start gap-3">
          <Zap size={14} className="text-[#0B5E75] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-black text-[#0B5E75] uppercase tracking-widest mb-0.5">Assigned Drill</p>
            <p className="text-sm font-black text-slate-700">{result.drill}</p>
          </div>
        </div>

        {/* Recommended activities */}
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recommended Activities</p>
          <div className="flex flex-col gap-2.5">
            {acts.map((act, i) => (
              <div key={i} className="bg-white rounded-2xl px-4 py-3.5 flex items-start gap-3 shadow-sm">
                <span className="text-2xl flex-shrink-0 mt-0.5">{act.icon}</span>
                <div>
                  <p className="font-black text-slate-800 text-sm">{act.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reassess */}
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
          <Clock size={16} className="text-slate-400 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Reassessment Date</p>
            <p className="text-sm font-black text-slate-700">{result.reassessDate}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => setSaved(true)}
            className={`flex-1 rounded-xl py-3.5 font-black text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${saved ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-700" : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
            {saved ? <><Check size={16} /> Saved</> : <><ClipboardList size={16} /> Save Plan</>}
          </button>
          <button onClick={onViewReport}
            className="flex-1 bg-[#0B5E75] text-white rounded-xl py-3.5 font-black text-sm flex items-center justify-center gap-2 hover:bg-[#0a5368] active:scale-[0.98] transition-all">
            <ArrowRight size={16} /> View Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Assessment: Student Report ─────────────────────────────────────────────────

function StudentReportScreen({ student, language, result, onParentMsg, onBack }: { student: Student; language: Language; result: MockResult; onParentMsg: () => void; onBack: () => void }) {
  const [saved, setSaved] = useState(false);
  const t = T[result.tier];
  const today = new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3 flex-shrink-0">
        <BackBtn onBack={onBack} />
        <h2 className="font-black text-slate-800 text-sm">Student Report</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-3">
        {/* Profile */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <Avi name={student.name} size="lg" />
          <div>
            <h3 className="font-black text-slate-800 text-base">{student.name}</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Mabini Elementary School · Grade 2</p>
            <p className="text-[11px] text-slate-400 mt-1">Assessed: {today}</p>
          </div>
        </div>

        {/* Language tag */}
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${language === "Filipino" ? "bg-blue-50 border border-blue-100" : "bg-red-50 border border-red-100"}`}>
          <span className="text-xl">{language === "Filipino" ? "🇵🇭" : "🇺🇸"}</span>
          <p className={`text-sm font-black ${language === "Filipino" ? "text-blue-700" : "text-red-700"}`}>{language} Assessment Report</p>
        </div>

        {/* Tier */}
        <div className={`${t.light} ${t.border} border-2 rounded-2xl px-4 py-3 flex items-center gap-3`}>
          <div className={`w-10 h-10 ${t.bg} rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
            {result.tier === "green" ? "✓" : result.tier === "red" ? "!" : "~"}
          </div>
          <div>
            <p className={`font-black ${t.text}`}>{t.label}</p>
            {t.sublabel && <p className={`text-xs font-bold ${t.text}`}>{t.sublabel} Focus</p>}
          </div>
        </div>

        {/* Results table */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Fluency Results</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { k: "Words/min (WCPM)", v: String(result.wcpm) },
              { k: "Accuracy",         v: `${result.accuracy}%` },
              { k: "Fluency Score",    v: `${result.fluencyScore}%` },
            ].map(r => (
              <div key={r.k} className="bg-slate-50 rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-slate-400 font-bold">{r.k}</p>
                <p className="font-black font-mono text-slate-800 text-lg">{r.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Comprehension Results</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-slate-400 font-bold">Score</p>
              <p className="font-black font-mono text-slate-800 text-lg">{result.compScore}%</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-slate-400 font-bold">Correct</p>
              <p className="font-black font-mono text-slate-800 text-lg">{result.compSubskills.filter(s=>s.correct).length}/4</p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {result.compSubskills.map(sk => (
              <div key={sk.name} className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${sk.correct ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                  {sk.correct ? <Check size={9} strokeWidth={3}/> : <X size={9} strokeWidth={3}/>}
                </span>
                <span className="text-[11px] font-bold text-slate-600">{sk.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gap + drill + date */}
        {[
          { label: "Primary Weak Skill", val: result.primaryGap, icon: <AlertTriangle size={13} className="text-red-400" /> },
          { label: "Recommended Drill",  val: result.drill,       icon: <Zap size={13} className="text-[#0B5E75]" /> },
          { label: "Reassessment Date",  val: result.reassessDate, icon: <Clock size={13} className="text-slate-400" /> },
        ].map(row => (
          <div key={row.label} className="bg-white rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
            <div className="flex-shrink-0">{row.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.label}</p>
              <p className="text-sm font-black text-slate-700 mt-0.5">{row.val}</p>
            </div>
          </div>
        ))}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button onClick={() => setSaved(true)}
            className={`flex-1 rounded-xl py-3.5 font-black text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${saved ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-700" : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
            {saved ? <><Check size={16} /> Saved</> : <><Download size={16} /> Save Report</>}
          </button>
          <button onClick={onParentMsg}
            className="flex-1 bg-[#0B5E75] text-white rounded-xl py-3.5 font-black text-sm flex items-center justify-center gap-2 hover:bg-[#0a5368] active:scale-[0.98] transition-all">
            <MessageSquare size={16} /> Parent Message
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Assessment: Parent Message ─────────────────────────────────────────────────

function ParentMessageScreen({ student, language, result, onDone, onNext }: { student: Student; language: Language; result: MockResult; onDone: () => void; onNext: () => void }) {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [showDecision, setShowDecision] = useState(false);
  const firstName = student.name.split(" ")[0];

  const msgFil = result.tier === "green"
    ? `Magandang araw po! Nais naming ipagbigay-alam na si ${firstName} ay mahusay na bumabasa sa wikang ${language}. WCPM: ${result.wcpm}. Patuloy po nating palakasin ang pagbabasa sa tahanan. Maraming salamat!`
    : `Magandang araw po! Ang inyong anak na si ${firstName} ay nangangailangan ng karagdagang tulong sa pagbabasa. Paki-tulungan siyang magbasa ng 15 minuto araw-araw. Ang pangunahing kinakailan: ${result.primaryGap}. Maraming salamat!`;

  const msgEng = result.tier === "green"
    ? `Good day! ${firstName} is performing well in ${language} reading. WCPM: ${result.wcpm}. Please continue to support daily reading at home. Thank you!`
    : `Good day! ${firstName} needs additional support in ${language} reading. Please practice reading together for 15 minutes daily. Main skill to work on: ${result.primaryGap}. Thank you!`;

  return (
    <div className="flex flex-col h-full">
      {showDecision && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 flex flex-col gap-4">
            <h3 className="text-xl font-black text-slate-800 text-center">Assess another student?</h3>
            <p className="text-slate-500 text-sm text-center">Continue with the next student or return to the dashboard.</p>
            <button onClick={onNext} className="w-full bg-[#0B5E75] text-white rounded-2xl py-4 font-black text-base hover:bg-[#0a5368] active:scale-[0.98] transition-all">
              Yes, Next Student
            </button>
            <button onClick={onDone} className="w-full bg-white border-2 border-slate-200 text-slate-700 rounded-2xl py-4 font-black text-base hover:bg-slate-50 active:scale-[0.98] transition-all">
              No, Go to Dashboard
            </button>
          </div>
        </div>
      )}

      <div className="px-5 pt-4 pb-3 flex items-center gap-3 flex-shrink-0">
        <h2 className="font-black text-slate-800 text-sm">Parent Message</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avi name={student.name} size="sm" />
          <div>
            <p className="font-black text-sm text-slate-800">{student.name}</p>
            <p className="text-[11px] text-slate-400">{language} · <TierPill tier={result.tier} /></p>
          </div>
        </div>

        {/* Messages */}
        {[{ label: "Filipino (Tagalog)", msg: msgFil }, { label: "English", msg: msgEng }].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{m.label}</p>
            <div className="bg-teal-50 rounded-xl p-3">
              <p className="text-xs text-teal-900 leading-relaxed font-semibold italic">"{m.msg}"</p>
            </div>
          </div>
        ))}

        {/* Action buttons */}
        <div className="flex gap-2.5">
          <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className={`flex-1 rounded-xl py-3.5 font-black text-sm flex items-center justify-center gap-2 border-2 active:scale-[0.98] transition-all ${copied ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
            {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy</>}
          </button>
          <button onClick={() => setSent(true)}
            className={`flex-1 rounded-xl py-3.5 font-black text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${sent ? "bg-emerald-500 text-white" : "bg-[#0B5E75] text-white hover:bg-[#0a5368]"}`}>
            {sent ? <><Check size={15} /> Sent!</> : <><MessageSquare size={15} /> Send SMS</>}
          </button>
        </div>

        <button onClick={() => setShowDecision(true)}
          className="w-full bg-amber-400 text-slate-900 rounded-2xl py-4 font-black text-base flex items-center justify-center gap-2 hover:bg-amber-500 active:scale-[0.98] transition-all mt-2">
          <Check size={20} /> Finish Assessment
        </button>
      </div>
    </div>
  );
}

// ── Classes Tab ────────────────────────────────────────────────────────────────

function ClassesScreen({ onSelectClass }: { onSelectClass: (c: ClassData) => void }) {
  return (
    <div className="flex flex-col pb-6">
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-xl font-black text-slate-800">My Classes</h1>
        <p className="text-slate-500 text-sm">Mabini Elementary School</p>
      </div>
      <div className="px-5 flex flex-col gap-3">
        {CLASSES.map(cls => {
          const total = cls.students.length;
          const assessed = cls.students.filter(s => s.filipino.assessed).length;
          const green  = cls.students.filter(s => overallTier(s) === "green").length;
          const yellow = cls.students.filter(s => overallTier(s).startsWith("yellow")).length;
          const red    = cls.students.filter(s => overallTier(s) === "red").length;
          return (
            <button key={cls.id} onClick={() => onSelectClass(cls)}
              className="bg-white rounded-2xl p-5 shadow-sm border-2 border-transparent hover:border-teal-200 active:scale-[0.98] transition-all text-left w-full">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-[#0B5E75]/8 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-black text-[#0B5E75]">{cls.grade}</span>
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-800">{cls.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{total} students · {assessed} assessed</p>
                </div>
                <ChevronRight size={18} className="text-slate-300 flex-shrink-0" />
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0B5E75] rounded-full" style={{ width: `${(assessed/total)*100}%` }} />
              </div>
              <div className="flex items-center gap-3 mt-2.5">
                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />{green} On Track</span>
                <span className="flex items-center gap-1 text-[10px] font-black text-amber-700"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{yellow} Practice</span>
                <span className="flex items-center gap-1 text-[10px] font-black text-red-700"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />{red} Support</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Assessments Tab ────────────────────────────────────────────────────────────

function AssessmentsScreen() {
  const recent = ALL_STUDENTS.filter(s => s.filipino.assessed).slice(0, 15);
  return (
    <div className="flex flex-col pb-6">
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-xl font-black text-slate-800">Assessment History</h1>
        <p className="text-slate-500 text-sm">{recent.length} completed</p>
      </div>
      <div className="px-5 flex flex-col gap-2">
        {recent.map((s, i) => {
          const daysAgo = i < 3 ? "Today" : i < 6 ? "Yesterday" : `${i-2} days ago`;
          return (
            <div key={s.id} className="bg-white rounded-2xl px-4 py-3.5 shadow-sm flex items-center gap-3">
              <Avi name={s.name} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-800 truncate">{s.name}</p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <TierPill tier={s.filipino.tier} lang="FIL" />
                  <TierPill tier={s.english.tier} lang="ENG" />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-mono text-sm font-black text-slate-700">{s.filipino.wcpm}<span className="text-[10px] text-slate-400 font-normal">wpm</span></p>
                <p className="text-[10px] text-slate-400 mt-0.5">{daysAgo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Reports Tab ────────────────────────────────────────────────────────────────

function ReportsScreen() {
  const assessed = ALL_STUDENTS.filter(s => s.filipino.assessed);
  const avgFil = Math.round(assessed.reduce((a,s) => a + s.filipino.wcpm, 0) / assessed.length);
  const avgEng = Math.round(ALL_STUDENTS.filter(s=>s.english.assessed).reduce((a,s) => a + s.english.wcpm, 0) / ALL_STUDENTS.filter(s=>s.english.assessed).length);

  const green  = assessed.filter(s => overallTier(s) === "green").length;
  const yellow = assessed.filter(s => overallTier(s).startsWith("yellow")).length;
  const red    = assessed.filter(s => overallTier(s) === "red").length;
  const pieData = [
    { name: "On Track",       value: green,  color: "#10B981" },
    { name: "Needs Practice", value: yellow, color: "#FBBF24" },
    { name: "Needs Support",  value: red,    color: "#EF4444" },
  ];

  const barData = CLASSES.map(cls => ({
    name: `Gr${cls.grade}`,
    green:  cls.students.filter(s => overallTier(s) === "green").length,
    yellow: cls.students.filter(s => overallTier(s).startsWith("yellow")).length,
    red:    cls.students.filter(s => overallTier(s) === "red").length,
  }));

  return (
    <div className="flex flex-col pb-6">
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-xl font-black text-slate-800">School Reports</h1>
        <p className="text-slate-500 text-sm">Q2 SY 2025–26 · {assessed.length} assessed</p>
      </div>

      {/* KPIs */}
      <div className="px-5 mb-4 grid grid-cols-2 gap-3">
        {[
          { label: "Avg Filipino WCPM", val: avgFil, benchmark: 60, bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700" },
          { label: "Avg English WCPM",  val: avgEng, benchmark: 65, bg: "bg-red-50",  border: "border-red-100",  text: "text-red-700"  },
        ].map(item => (
          <div key={item.label} className={`${item.bg} ${item.border} border rounded-2xl p-4`}>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{item.label}</p>
            <p className={`text-3xl font-black font-mono ${item.text}`}>{item.val}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Benchmark: {item.benchmark}</p>
            <div className="h-1.5 bg-white/60 rounded-full mt-2 overflow-hidden">
              <div className={`h-full rounded-full ${item.val >= item.benchmark ? "bg-emerald-400" : "bg-amber-400"}`} style={{ width: `${Math.min((item.val/item.benchmark)*100,100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Pie chart */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-black text-slate-700 mb-3">Overall Tier Distribution</p>
          <div className="flex items-center gap-4">
            <PieChart width={110} height={110}>
              <Pie data={pieData} cx={50} cy={50} innerRadius={30} outerRadius={50} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div className="flex flex-col gap-2 flex-1">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-xs font-bold text-slate-600">{d.name}</span>
                  </div>
                  <span className="font-mono font-black text-slate-800 text-sm">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bar chart per class */}
      <div className="px-5 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-black text-slate-700 mb-4">Tiers by Class</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={barData} barSize={16} barGap={3} barCategoryGap="30%">
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "Nunito" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 11 }} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
              <Bar dataKey="green"  name="On Track"      fill="#10B981" radius={[4,4,0,0]} />
              <Bar dataKey="yellow" name="Needs Practice" fill="#FBBF24" radius={[4,4,0,0]} />
              <Bar dataKey="red"    name="Needs Support"  fill="#EF4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export */}
      <div className="px-5 flex gap-3">
        <button className="flex-1 bg-[#0B5E75] text-white rounded-xl py-3.5 font-black text-sm flex items-center justify-center gap-2 hover:bg-[#0a5368] active:scale-[0.98] transition-all">
          <Download size={16} /> Phil-IRI Export
        </button>
        <button className="flex-1 bg-white border border-slate-200 text-slate-700 rounded-xl py-3.5 font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.98] transition-all">
          <MessageSquare size={16} /> Send to Admin
        </button>
      </div>
    </div>
  );
}

// ── Profile Tab ────────────────────────────────────────────────────────────────

function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex flex-col pb-6">
      <div className="px-5 pt-5 pb-4 bg-[#0B5E75] rounded-b-[32px] mb-4">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-black">RS</div>
          <div className="text-center">
            <h1 className="text-white text-lg font-black">Rosa M. Santos</h1>
            <p className="text-teal-200 text-sm">Elementary Teacher · Grade 2</p>
          </div>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-3">
        {[
          { icon: <Mail size={16} />, label: "Email", val: "rosa.santos@mabini.deped.gov.ph" },
          { icon: <School size={16} />, label: "School", val: "Mabini Elementary School" },
          { icon: <Users size={16} />, label: "Assigned Classes", val: "Grade 1-Makabayan, Grade 2-Mabini, Grade 3-Rizal" },
          { icon: <BookOpen size={16} />, label: "Total Students", val: "30 students across 3 classes" },
          { icon: <TrendingUp size={16} />, label: "Assessments Completed", val: "28 this quarter" },
          { icon: <Shield size={16} />, label: "DepEd Employee ID", val: "DEP-2025-08472" },
        ].map(row => (
          <div key={row.label} className="bg-white rounded-2xl px-4 py-3.5 shadow-sm flex items-start gap-3">
            <div className="text-[#0B5E75] mt-0.5 flex-shrink-0">{row.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.label}</p>
              <p className="text-sm font-bold text-slate-700 mt-0.5 break-words">{row.val}</p>
            </div>
          </div>
        ))}

        <button onClick={onLogout}
          className="w-full mt-2 bg-red-50 border-2 border-red-100 text-red-600 rounded-2xl py-4 font-black text-base flex items-center justify-center gap-2 hover:bg-red-100 active:scale-[0.98] transition-all">
          <LogOut size={20} /> Log Out
        </button>
      </div>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────────

type Tab = "dashboard" | "classes" | "assessments" | "reports" | "profile";
const TAB_SCREENS: Screen[] = ["dashboard","classes","assessments","reports","profile"];
const isTab = (s: Screen) => (TAB_SCREENS as string[]).includes(s);
const isAuth = (s: Screen) => s === "splash" || s === "login";

export default function App() {
  const [screen, setScreen]   = useState<Screen>("splash");
  const [tab, setTab]         = useState<Tab>("dashboard");
  const [selClass, setSelClass]     = useState<ClassData | null>(null);
  const [selStudent, setSelStudent] = useState<Student | null>(null);
  const [selLang, setSelLang]       = useState<Language | null>(null);
  const [answers, setAnswers]       = useState<number[]>([]);
  const [result, setResult]         = useState<MockResult | null>(null);
  // Stack for class-tab browsing
  const [tabClass, setTabClass] = useState<ClassData | null>(null);
  const [showClassStudents, setShowClassStudents] = useState(false);

  const nav = (s: Screen) => setScreen(s);
  const goTab = (t: Tab) => { setTab(t); setScreen(t); setTabClass(null); setShowClassStudents(false); };
  const goBack = () => nav(tab);

  const startAssessFlow = () => { setSelClass(null); nav("class-select"); };

  const showBottomNav = !isAuth(screen) && isTab(screen);
  const showAssessNav = !isAuth(screen) && !isTab(screen);

  const NAV_ITEMS: { key: Tab; icon: React.ReactNode; label: string }[] = [
    { key: "dashboard",   icon: <Home size={20} />,       label: "Home"      },
    { key: "classes",     icon: <Users size={20} />,      label: "Classes"   },
    { key: "assessments", icon: <ClipboardList size={20} />, label: "Assess" },
    { key: "reports",     icon: <BarChart2 size={20} />,  label: "Reports"   },
    { key: "profile",     icon: <User size={20} />,       label: "Profile"   },
  ];

  const handleComprehensionSubmit = (ans: number[]) => {
    setAnswers(ans);
    if (selStudent && selLang) {
      setResult(generateResult(selStudent, selLang, ans));
    }
    nav("results");
  };

  const handleFinishAssessment = () => { setTab("dashboard"); nav("dashboard"); };
  const handleNextStudent = () => {
    setSelStudent(null); setSelLang(null); setAnswers([]); setResult(null);
    if (selClass) nav("student-list");
    else nav("class-select");
  };

  const handleClassTabSelect = (cls: ClassData) => { setTabClass(cls); setShowClassStudents(true); };
  const handleClassTabStudentSelect = (s: Student) => {
    setTabClass(null); setShowClassStudents(false);
    setSelClass(null); setSelStudent(s); setSelLang(null); setAnswers([]); setResult(null);
    nav("language-select");
  };

  return (
    <div className="size-full bg-stone-300 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-[390px] h-full max-h-[844px] bg-[#F5F0E8] flex flex-col overflow-hidden shadow-2xl relative" style={{ borderRadius: 44, border: "1px solid rgba(0,0,0,0.12)" }}>
        {/* Status bar */}
        {!isAuth(screen) && (
          <div className="flex items-center justify-between px-7 pt-3 pb-1 flex-shrink-0">
            <span className="text-xs font-black text-slate-700">9:41</span>
            <div className="flex items-center gap-1.5">
              <Wifi size={13} className="text-slate-600" />
              <div className="flex gap-0.5 items-end h-3.5">
                {[1,2,3].map(i => <div key={i} className="w-1 bg-slate-600 rounded-sm" style={{ height: `${i * 4 + 2}px` }} />)}
              </div>
              <div className="w-5 h-2.5 rounded-sm border border-slate-500 relative overflow-hidden ml-0.5">
                <div className="absolute inset-0 right-1 bg-slate-600 rounded-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          {/* Auth */}
          {screen === "splash" && <SplashScreen onDone={() => nav("login")} />}
          {screen === "login"  && <LoginScreen onLogin={() => { nav("dashboard"); }} />}

          {/* Main tabs */}
          {screen === "dashboard"   && <DashboardScreen onStartAssess={startAssessFlow} onReports={() => goTab("reports")} />}
          {screen === "assessments" && <AssessmentsScreen />}
          {screen === "reports"     && <ReportsScreen />}
          {screen === "profile"     && <ProfileScreen onLogout={() => nav("splash")} />}
          {screen === "classes"     && !showClassStudents && <ClassesScreen onSelectClass={handleClassTabSelect} />}
          {screen === "classes"     && showClassStudents && tabClass && (
            <StudentListScreen cls={tabClass} onSelect={handleClassTabStudentSelect} onBack={() => setShowClassStudents(false)} />
          )}

          {/* Assessment flow */}
          {screen === "class-select" && (
            <ClassSelectScreen onSelect={c => { setSelClass(c); nav("student-list"); }} onBack={goBack} />
          )}
          {screen === "student-list" && selClass && (
            <StudentListScreen cls={selClass} onSelect={s => { setSelStudent(s); nav("language-select"); }} onBack={() => nav("class-select")} />
          )}
          {screen === "language-select" && selStudent && (
            <LanguageSelectScreen student={selStudent} onSelect={l => { setSelLang(l); nav("passage"); }} onBack={() => nav(selClass ? "student-list" : "class-select")} />
          )}
          {screen === "passage" && selStudent && selLang && (
            <PassageScreen student={selStudent} language={selLang} onStart={() => nav("recording")} onBack={() => nav("language-select")} />
          )}
          {screen === "recording" && selStudent && selLang && (
            <RecordingScreen student={selStudent} language={selLang} onStop={() => nav("processing")} onBack={() => nav("passage")} />
          )}
          {screen === "processing" && (
            <ProcessingScreen onDone={() => nav("comprehension")} />
          )}
          {screen === "comprehension" && selStudent && selLang && (
            <ComprehensionScreen student={selStudent} language={selLang} onSubmit={handleComprehensionSubmit} onBack={() => nav("recording")} />
          )}
          {screen === "results" && selStudent && selLang && result && (
            <ResultsScreen student={selStudent} language={selLang} result={result} onViewIntervention={() => nav("intervention")} onBack={() => nav("comprehension")} />
          )}
          {screen === "intervention" && selStudent && selLang && result && (
            <InterventionScreen student={selStudent} language={selLang} result={result} onViewReport={() => nav("report")} onBack={() => nav("results")} />
          )}
          {screen === "report" && selStudent && selLang && result && (
            <StudentReportScreen student={selStudent} language={selLang} result={result} onParentMsg={() => nav("parent-message")} onBack={() => nav("intervention")} />
          )}
          {screen === "parent-message" && selStudent && selLang && result && (
            <ParentMessageScreen student={selStudent} language={selLang} result={result} onDone={handleFinishAssessment} onNext={handleNextStudent} />
          )}
        </div>

        {/* Bottom Nav */}
        {showBottomNav && (
          <div className="flex-shrink-0 bg-white border-t border-slate-100 pb-5">
            <div className="flex">
              {NAV_ITEMS.map(item => {
                const active = tab === item.key;
                return (
                  <button key={item.key} onClick={() => goTab(item.key)}
                    className={`flex-1 flex flex-col items-center justify-center pt-3 pb-1 gap-0.5 transition-colors ${active ? "text-[#0B5E75]" : "text-slate-400 hover:text-slate-600"}`}>
                    {item.icon}
                    <span className="text-[9px] font-black tracking-wide">{item.label}</span>
                    {active && <span className="w-1 h-1 rounded-full bg-[#0B5E75]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
