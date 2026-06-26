import { useState } from 'react';
import {
  Download, ChevronDown, ChevronUp, Filter, Search,
  AlertTriangle, Zap, Check, X, Clock, ShieldCheck,
  ShieldAlert, Target, Users, Star,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Tier, Language, Student } from '../data/mockData';
import { MOCK_STUDENTS, TIER_CONFIG } from '../data/mockData';
import { TierBadge, TierPill } from '../components/TierBadge';

// ── Summary Strip ──────────────────────────────────────────────────────────────

function SummaryStrip({ students }: { students: Student[] }) {
  const total = students.length;
  const assessed = students.filter((s) => s.filipino.lastAssessed).length;
  const consented = students.filter((s) => s.consentStatus === 'confirmed').length;

  const tierCount = (lang: 'filipino' | 'english', tier: string) =>
    students.filter((s) => s[lang].tier === tier).length;

  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* KPI row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: total },
          { label: 'Assessed', value: assessed },
          { label: 'Consented', value: consented },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{item.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Lang breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(['filipino', 'english'] as const).map((lang) => (
          <div key={lang} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-700 mb-3">
              {lang === 'filipino' ? '🇵🇭 Filipino' : '🇺🇸 English'}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'On Track', tier: 'green', dot: 'bg-emerald-500' },
                { label: 'Fluency', tier: 'yellow-fluency', dot: 'bg-amber-400' },
                { label: 'Comp.', tier: 'yellow-comprehension', dot: 'bg-amber-400' },
                { label: 'Support', tier: 'red', dot: 'bg-red-500' },
              ].map((item) => (
                <div key={item.tier} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dot} flex-shrink-0`} />
                  </div>
                  <p className="text-lg font-bold text-gray-900 tabular-nums">
                    {tierCount(lang, item.tier)}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Inline Report Panel ────────────────────────────────────────────────────────

function InlineReportPanel({ student }: { student: Student }) {
  return (
    <div className="bg-gray-50 border-t border-gray-200 p-6">
      <div className="max-w-3xl">
        <p className="text-xs font-medium text-gray-400 mb-4">
          Full Assessment · {student.name}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {([
            { lang: 'Filipino' as Language, flag: '🇵🇭', result: student.filipino },
            { lang: 'English' as Language, flag: '🇺🇸', result: student.english },
          ] as const).map(({ lang, flag, result }) => {
            const cfg = TIER_CONFIG[result.tier];
            return (
              <div key={lang} className={`rounded-2xl p-4 border-2 ${cfg.lightBg} ${cfg.borderClass}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span>{flag}</span>
                  <p className="font-black text-sm text-blue-900">{lang}</p>
                  <span className="text-lg">{cfg.emoji}</span>
                  <div className="ml-auto"><TierBadge tier={result.tier} size="sm" /></div>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'WCPM', value: String(result.wcpm) },
                    { label: 'Accuracy', value: `${result.accuracy}%` },
                    { label: 'Last Assessed', value: result.lastAssessed.split(',')[0] },
                  ].map((item) => (
                    <div key={item.label} className="bg-white rounded-xl p-2 text-center">
                      <p className="text-[9px] text-slate-400 font-bold">{item.label}</p>
                      <p className="text-sm font-black font-mono text-blue-900">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Fluency */}
                <div className="mb-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Fluency</p>
                  <div className="flex flex-col gap-1.5">
                    {result.fluencySubskills.map((sk) => (
                      <div key={sk.name} className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                          ${sk.status === 'Strong' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {sk.status === 'Strong' ? <Check size={9} strokeWidth={3} /> : <X size={9} strokeWidth={3} />}
                        </span>
                        <span className={`text-xs font-semibold flex-1
                          ${sk.isLowestBrokenRung ? 'text-rose-700 font-bold' : 'text-slate-600'}`}>
                          {sk.name}
                        </span>
                        {sk.isLowestBrokenRung && (
                          <span className="text-[9px] text-rose-500 font-bold bg-rose-100 px-1.5 py-0.5 rounded-full">Primary</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comprehension */}
                <div className="mb-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Comprehension</p>
                  <div className="flex flex-col gap-1.5">
                    {result.compSubskills.map((sk) => (
                      <div key={sk.name} className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                          ${sk.status === 'Correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {sk.status === 'Correct' ? <Check size={9} strokeWidth={3} /> : <X size={9} strokeWidth={3} />}
                        </span>
                        <span className={`text-xs font-semibold flex-1 truncate
                          ${sk.isLowestBrokenRung ? 'text-rose-700 font-bold' : 'text-slate-600'}`}>
                          {sk.name}
                        </span>
                        {sk.isLowestBrokenRung && (
                          <span className="text-[9px] text-rose-500 font-bold bg-rose-100 px-1.5 py-0.5 rounded-full">Primary</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary drill */}
                <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3 border border-amber-100">
                  <Zap size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black text-amber-700 uppercase tracking-wider">Primary Drill</p>
                    <p className="text-xs font-bold text-amber-900 mt-0.5">{result.primaryDrill}</p>
                  </div>
                </div>

                {result.flaggedForRecheck && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-orange-700 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2">
                    <AlertTriangle size={11} />
                    <span className="font-semibold">Flagged for re-check</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Student Row ────────────────────────────────────────────────────────────────

function StudentRow({ student, expanded, onToggle }: {
  student: Student;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        className={`cursor-pointer transition-colors border-b border-gray-100
          ${expanded ? 'bg-gray-50' : 'hover:bg-gray-50/60'}`}
        onClick={onToggle}
      >
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
              {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="font-medium text-sm text-gray-900">{student.name}</p>
              <p className="text-xs text-gray-400">Grade {student.grade} · {student.section}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5">
          {student.consentStatus === 'confirmed' ? (
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full w-fit">
              <ShieldCheck size={10} /> Confirmed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-full w-fit">
              <ShieldAlert size={10} /> Pending
            </span>
          )}
        </td>
        <td className="px-4 py-3.5">
          <TierBadge tier={student.filipino.tier} size="sm" />
        </td>
        <td className="px-4 py-3.5">
          <p className="text-xs text-gray-500 max-w-[140px] truncate">
            {student.filipino.primaryGap === 'None' ? '—' : student.filipino.primaryGap}
          </p>
        </td>
        <td className="px-4 py-3.5">
          <TierBadge tier={student.english.tier} size="sm" />
        </td>
        <td className="px-4 py-3.5">
          <p className="text-xs text-gray-500 max-w-[140px] truncate">
            {student.english.primaryGap === 'None' ? '—' : student.english.primaryGap}
          </p>
        </td>
        <td className="px-4 py-3.5">
          <span className="text-xs text-gray-400">{student.filipino.lastAssessed.split(',')[0]}</span>
        </td>
        <td className="px-4 py-3.5">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors
            ${expanded ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={8} className="p-0">
            <InlineReportPanel student={student} />
          </td>
        </tr>
      )}
    </>
  );
}

// ── Teacher Dashboard ─────────────────────────────────────────────────────────

export function TeacherDashboard({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [tierFilter, setTierFilter] = useState<'all' | 'green' | 'yellow' | 'red'>('all');
  const [langFilter, setLangFilter] = useState<'all' | 'filipino' | 'english'>('all');
  const [search, setSearch] = useState('');
  const [consentFilter, setConsentFilter] = useState<'all' | 'confirmed' | 'pending'>('all');

  const filtered = MOCK_STUDENTS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchConsent = consentFilter === 'all' || s.consentStatus === consentFilter;
    const checkLang = (l: 'filipino' | 'english') => {
      if (tierFilter === 'all') return true;
      if (tierFilter === 'yellow') return s[l].tier.startsWith('yellow');
      return s[l].tier === tierFilter;
    };
    const matchTier =
      langFilter === 'all'
        ? checkLang('filipino') || checkLang('english')
        : checkLang(langFilter as 'filipino' | 'english');
    return matchSearch && matchTier && matchConsent;
  });

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Class Roster</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Rosa Santos · Grade 4 — Section Rizal · Mabini Elementary School
          </p>
          <p className="text-xs text-gray-400 mt-0.5">SY 2025–2026 · June 2026 cycle</p>
        </div>
        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('grouping')}
              className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3.5 py-2 rounded-xl text-sm font-medium
                hover:bg-gray-50 active:scale-[0.98] transition-all">
              <Target size={14} /> Groups
            </button>
          )}
          <button
            onClick={() => toast.success('Class report downloaded!')}
            className="flex items-center gap-2 bg-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium
              hover:bg-blue-700 active:scale-[0.98] transition-all">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Summary */}
      <SummaryStrip students={MOCK_STUDENTS} />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students…"
            className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all w-48"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter size={12} className="text-gray-400" />
          <span className="text-xs text-gray-500">Tier:</span>
          {([
            { k: 'all', l: 'All' },
            { k: 'green', l: 'Green' },
            { k: 'yellow', l: 'Yellow' },
            { k: 'red', l: 'Red' },
          ] as const).map(({ k, l }) => (
            <button key={k} onClick={() => setTierFilter(k)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors
                ${tierFilter === k ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Lang:</span>
          {([
            { k: 'all', l: 'Both' },
            { k: 'filipino', l: 'Filipino' },
            { k: 'english', l: 'English' },
          ] as const).map(({ k, l }) => (
            <button key={k} onClick={() => setLangFilter(k)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors
                ${langFilter === k ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Consent:</span>
          {([
            { k: 'all', l: 'All' },
            { k: 'confirmed', l: 'Confirmed' },
            { k: 'pending', l: 'Pending' },
          ] as const).map(({ k, l }) => (
            <button key={k} onClick={() => setConsentFilter(k)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors
                ${consentFilter === k ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {l}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-400 ml-auto">
          {filtered.length} of {MOCK_STUDENTS.length} students
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Student', 'Consent', 'Filipino', 'FIL Drill', 'English', 'ENG Drill', 'Assessed', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400 text-sm font-semibold">
                  No students match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  expanded={expandedId === student.id}
                  onToggle={() => setExpandedId((prev) => (prev === student.id ? null : student.id))}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reading Ladder Legend */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-6">
        <div className="flex items-start gap-2 min-w-[200px]">
          <Zap size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-gray-700">Reading Ladder Rule</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Fix the lowest broken rung first: Decoding → Blending → Sight Words → Pacing, then P4→P7.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          {[
            { dot: 'bg-emerald-500', label: 'Green', desc: 'On track' },
            { dot: 'bg-amber-400', label: 'Yellow-Fluency', desc: 'Fluency gap' },
            { dot: 'bg-amber-400', label: 'Yellow-Comp', desc: 'Comprehension gap' },
            { dot: 'bg-red-500', label: 'Red', desc: 'Needs support' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`} />
              <span className="text-[11px] text-gray-500">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
