import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, CartesianGrid, LineChart, Line,
} from 'recharts';
import { Users, TrendingUp, BarChart2, AlertTriangle, ChevronRight } from 'lucide-react';
import {
  MOCK_SCHOOLS, PARAM_FREQUENCY, ASSESSMENT_CYCLES,
  type School, type Language,
} from '../data/mockData';

// ── KPI Card ──────────────────────────────────────────────────────────────────

function KPICard({ label, value, sub, icon, trend, color = 'text-blue-700' }: {
  label: string; value: string; sub: string; icon: React.ReactNode;
  trend?: string; color?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
      <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

// ── Parameter Frequency Chart ──────────────────────────────────────────────────

function ParamFrequencyChart({ language }: { language: Language }) {
  const data = PARAM_FREQUENCY[language].map((p) => ({
    name: p.param.replace(' / Phonics', '').replace(' / Main Idea', '').replace(' in Context', ''),
    count: p.count,
    full: p.param,
    param: `P${p.parameter}`,
  }));

  const maxVal = Math.max(...data.map((d) => d.count));

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 text-sm">Most Commonly Broken Parameters</h3>
        <p className="text-xs text-gray-400 mt-0.5">{language} · students per parameter</p>
      </div>
      <div className="flex flex-col gap-2.5">
        {data.sort((a, b) => b.count - a.count).map((item) => (
          <div key={item.full} className="flex items-center gap-3">
            <div className="w-6 flex-shrink-0 text-center">
              <span className={`text-[9px] font-black px-1 py-0.5 rounded
                ${item.param === 'P6' || item.param === 'P5' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                {item.param}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-600 w-36 flex-shrink-0 truncate">{item.full}</p>
            <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
              <div
                className={`h-full rounded-full flex items-center px-2 transition-all
                  ${item.count === maxVal ? 'bg-rose-500' : item.count > maxVal * 0.75 ? 'bg-amber-400' : 'bg-blue-400'}`}
                style={{ width: `${(item.count / maxVal) * 100}%` }}
              >
                <span className="text-[9px] font-black text-white ml-auto pr-1">{item.count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 mt-4 font-semibold">
        The highest bar tells you where to focus whole-class instruction.
      </p>
    </div>
  );
}

// ── Tier Distribution Chart ────────────────────────────────────────────────────

function TierDistributionChart({ schools }: { schools: School[] }) {
  const data = schools.map((s) => {
    const filYellow = Math.round((100 - s.filipinoGreen) * 0.55);
    const filRed = 100 - s.filipinoGreen - filYellow;
    const engYellow = Math.round((100 - s.englishGreen) * 0.55);
    const engRed = 100 - s.englishGreen - engYellow;
    return {
      school: s.name.replace(' Elementary School', ''),
      'FIL 🟢': s.filipinoGreen,
      'ENG 🟢': s.englishGreen,
      'FIL 🟡': filYellow,
      'ENG 🟡': engYellow,
      'FIL 🔴': filRed,
      'ENG 🔴': engRed,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.fill }} className="font-semibold">
              {p.name}: {p.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <div className="mb-5">
        <h3 className="font-semibold text-gray-900">Reading Tier Distribution by School</h3>
        <p className="text-xs text-slate-400 mt-0.5">Filipino and English side by side · % of students assessed</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={2} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="#EFF6FF" vertical={false} />
          <XAxis dataKey="school" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} unit="%" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
          <Bar dataKey="FIL 🟢" stackId="fil" fill="#10B981" radius={[0, 0, 0, 0]} />
          <Bar dataKey="FIL 🟡" stackId="fil" fill="#F59E0B" />
          <Bar dataKey="FIL 🔴" stackId="fil" fill="#F43F5E" radius={[4, 4, 0, 0]} />
          <Bar dataKey="ENG 🟢" stackId="eng" fill="#34D399" radius={[0, 0, 0, 0]} />
          <Bar dataKey="ENG 🟡" stackId="eng" fill="#FCD34D" />
          <Bar dataKey="ENG 🔴" stackId="eng" fill="#FB7185" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Progress Over Time Chart ───────────────────────────────────────────────────

function ProgressChart() {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <div className="mb-5">
        <h3 className="font-semibold text-gray-900">Progress Over Time</h3>
        <p className="text-xs text-slate-400 mt-0.5">% of students at On Track (Green) level · Filipino vs English</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={ASSESSMENT_CYCLES}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EFF6FF" vertical={false} />
          <XAxis dataKey="cycle" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
          <Tooltip formatter={(val: any) => `${val}%`} labelStyle={{ fontWeight: 700, color: '#1E3A5F' }} />
          <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
          <Line type="monotone" dataKey="filipinoGreen" name="🇵🇭 Filipino On Track" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 5, fill: '#2563EB' }} />
          <Line type="monotone" dataKey="englishGreen" name="🇺🇸 English On Track" stroke="#10B981" strokeWidth={2.5} dot={{ r: 5, fill: '#10B981' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── School Table ───────────────────────────────────────────────────────────────

function SchoolTable({ schools }: { schools: School[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm">School Comparison</h3>
        <p className="text-xs text-gray-400 mt-0.5">All schools in scope · Read-only view</p>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {['School', 'Division', 'Assessed', 'Coverage', 'FIL Green', 'ENG Green', 'Top Gap', ''].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => {
            const coverage = Math.round((school.studentsAssessed / school.totalEnrolled) * 100);
            const lowCoverage = coverage < 70;
            return (
              <>
                <tr
                  key={school.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                  onClick={() => setExpanded((e) => e === school.id ? null : school.id)}
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-sm text-slate-800">{school.name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-slate-500 font-semibold">{school.division}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-black font-mono text-blue-900">{school.studentsAssessed}</p>
                    <p className="text-[10px] text-slate-400">of {school.totalEnrolled}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${coverage >= 70 ? 'bg-emerald-400' : 'bg-rose-400'}`}
                          style={{ width: `${coverage}%` }} />
                      </div>
                      <span className={`text-xs font-black ${lowCoverage ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {coverage}%
                      </span>
                      {lowCoverage && <AlertTriangle size={11} className="text-rose-500" />}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-black font-mono ${school.filipinoGreen >= 50 ? 'text-emerald-600' : school.filipinoGreen >= 35 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {school.filipinoGreen}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-black font-mono ${school.englishGreen >= 50 ? 'text-emerald-600' : school.englishGreen >= 35 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {school.englishGreen}%
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold text-slate-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full">
                      {school.mostCommonGap}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ChevronRight size={14} className={`transition-transform ${expanded === school.id ? 'rotate-90' : ''} text-slate-400`} />
                  </td>
                </tr>
                {expanded === school.id && (
                  <tr key={`${school.id}-exp`}>
                    <td colSpan={8} className="px-6 py-4 bg-blue-50/30 border-b border-blue-50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Classes — {school.name}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {school.classes.map((cls) => (
                          <div key={cls.name} className="bg-white rounded-xl p-3 border border-gray-200">
                            <p className="text-xs font-bold text-blue-900 mb-2">{cls.name}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                              <span className="text-emerald-600 font-black">{cls.filipinoGreen}%</span> FIL ·
                              <span className="text-emerald-600 font-black">{cls.englishGreen}%</span> ENG
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">{cls.students} students</p>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Analytics Main ─────────────────────────────────────────────────────────────

type DashLevel = 'teacher' | 'school' | 'division' | 'national';

export function Analytics() {
  const [level, setLevel] = useState<DashLevel>('teacher');
  const [language, setLanguage] = useState<Language>('Filipino');

  const totalAssessed = MOCK_SCHOOLS.reduce((a, s) => a + s.studentsAssessed, 0);
  const totalEnrolled = MOCK_SCHOOLS.reduce((a, s) => a + s.totalEnrolled, 0);
  const avgFilGreen = Math.round(MOCK_SCHOOLS.reduce((a, s) => a + s.filipinoGreen, 0) / MOCK_SCHOOLS.length);
  const avgEngGreen = Math.round(MOCK_SCHOOLS.reduce((a, s) => a + s.englishGreen, 0) / MOCK_SCHOOLS.length);
  const coverage = Math.round((totalAssessed / totalEnrolled) * 100);

  const levelLabels: Record<DashLevel, { label: string; scope: string }> = {
    teacher: { label: 'Teacher Dashboard', scope: 'Class: Grade 4 · Section Rizal' },
    school: { label: 'School Head Dashboard', scope: 'Mabini Elementary School' },
    division: { label: 'Division Supervisor Dashboard', scope: 'NCR — Manila Division' },
    national: { label: 'National / DepEd Admin Dashboard', scope: 'All Divisions · All Regions' },
  };

  const current = levelLabels[level];

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">{current.label} · {current.scope}</p>
        </div>
        <div className="flex items-center gap-2">
          {(['Filipino', 'English'] as Language[]).map((l) => (
            <button key={l} onClick={() => setLanguage(l)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all
                ${language === l ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard level tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
        {(['teacher', 'school', 'division', 'national'] as DashLevel[]).map((l) => (
          <button key={l} onClick={() => setLevel(l)}
            className={`flex-1 min-w-0 py-2 px-3 rounded-lg text-xs font-medium transition-all capitalize whitespace-nowrap
              ${level === l ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {l === 'teacher' ? 'Teacher' : l === 'school' ? 'School Head' : l === 'division' ? 'Division' : 'National'}
          </button>
        ))}
      </div>

      {/* Access note */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
        <BarChart2 size={13} className="text-gray-400 flex-shrink-0" />
        <p className="text-xs text-gray-500">
          <span className="font-medium">{current.label}</span> — access limited to {current.scope}. Demo data.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard
          label="Students Assessed"
          value={totalAssessed.toLocaleString()}
          sub={`of ${totalEnrolled.toLocaleString()} enrolled`}
          icon={<Users size={18} />}
          trend={`${coverage}% coverage`}
        />
        <KPICard
          label="On Track — Filipino"
          value={`${avgFilGreen}%`}
          sub="🟢 Green level · Filipino"
          icon={<TrendingUp size={18} />}
          trend="+10pp vs pretest"
          color="text-emerald-600"
        />
        <KPICard
          label="On Track — English"
          value={`${avgEngGreen}%`}
          sub="🟢 Green level · English"
          icon={<TrendingUp size={18} />}
          trend="+11pp vs pretest"
          color="text-emerald-600"
        />
        <KPICard
          label="Schools in Scope"
          value={String(MOCK_SCHOOLS.length)}
          sub={`${level === 'teacher' ? '1 class' : level === 'school' ? '4 classes' : level === 'division' ? '3 schools' : '3 schools demo'}`}
          icon={<BarChart2 size={18} />}
          color="text-blue-700"
        />
      </div>

      {/* Low coverage alert */}
      {MOCK_SCHOOLS.some((s) => (s.studentsAssessed / s.totalEnrolled) < 0.7) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-black text-amber-800 text-sm">Low Coverage Alert</p>
            <p className="text-amber-700 text-xs mt-1">
              Schools with less than 70% of enrolled students assessed are highlighted.
              {' '}Follow up with those school heads to complete assessments.
            </p>
          </div>
        </div>
      )}

      {/* Parameter frequency */}
      <ParamFrequencyChart language={language} />

      {/* Tier distribution chart */}
      <TierDistributionChart schools={MOCK_SCHOOLS} />

      {/* Progress over time */}
      <ProgressChart />

      {/* School table */}
      {(level === 'school' || level === 'division' || level === 'national') && (
        <SchoolTable schools={MOCK_SCHOOLS} />
      )}

      {/* SDG-4 panel (national only) */}
      {level === 'national' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
              SDG
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">SDG-4 Reporting Panel</h3>
              <p className="text-xs text-slate-400 mt-0.5">Quality Education metrics · Pre-formatted for official reporting</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'At Independent Level', value: `${avgFilGreen}%`, sub: 'Filipino — on track for grade', color: 'text-emerald-600' },
              { label: 'At Frustration Level', value: `${Math.round((100 - avgFilGreen) * 0.35)}%`, sub: 'Filipino — learning poverty', color: 'text-rose-600' },
              { label: 'At Independent Level', value: `${avgEngGreen}%`, sub: 'English — on track for grade', color: 'text-emerald-600' },
              { label: 'At Frustration Level', value: `${Math.round((100 - avgEngGreen) * 0.4)}%`, sub: 'English — learning poverty', color: 'text-rose-600' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
                <p className={`text-2xl font-black font-mono ${item.color}`}>{item.value}</p>
                <p className="text-xs font-bold text-slate-700 mt-1">{item.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-4">
            These metrics are pre-formatted for SDG Goal 4 (Quality Education) reporting.
            Year-on-year change and regional breakdown available in the full export.
          </p>
        </div>
      )}
    </div>
  );
}
