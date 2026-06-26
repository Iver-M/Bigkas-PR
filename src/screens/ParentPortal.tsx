import { useState } from 'react';
import { BookOpen, Heart, ExternalLink, ChevronDown, ChevronUp, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Language, Student } from '../data/mockData';
import { MOCK_STUDENTS, TIER_CONFIG } from '../data/mockData';
import { PARENT_PARAM_DESCRIPTIONS } from '../utils/gradingLogic';

// ── Mobile phone frame wrapper ─────────────────────────────────────────────────

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <div className="w-80 bg-slate-800 rounded-[2.5rem] p-3 shadow-2xl shadow-slate-900/50">
        {/* Notch */}
        <div className="flex justify-center mb-1">
          <div className="w-20 h-5 bg-slate-700 rounded-full" />
        </div>
        <div className="bg-white rounded-[2rem] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Parent report page (mobile layout) ────────────────────────────────────────

function ParentReportPage({ student, language }: { student: Student; language: Language }) {
  const result = language === 'Filipino' ? student.filipino : student.english;
  const cfg = TIER_CONFIG[result.tier];
  const firstName = student.name.split(' ')[0];
  const paramInfo = PARENT_PARAM_DESCRIPTIONS[result.primaryGap];
  const [openActivities, setOpenActivities] = useState(false);
  const [openResources, setOpenResources] = useState(false);

  const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-PH', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  const plainMessage = () => {
    switch (result.tier) {
      case 'green':
        return `${firstName} is reading well in ${language}. They can read the words accurately and understand what they read. Keep encouraging reading at home!`;
      case 'yellow-fluency':
        return `${firstName} understands what they read but is still working on reading the words smoothly and accurately. The specific area to focus on is: ${result.primaryGap}.`;
      case 'yellow-comprehension':
        return `${firstName} can read the words well but is still working on fully understanding what they mean. The specific area to focus on is: ${result.primaryGap}.`;
      case 'red':
        return `${firstName} needs extra support with reading right now. Their teacher is already working on this with them. The most important thing to focus on at home is: ${result.primaryGap}.`;
    }
  };

  const FREE_RESOURCES = [
    { label: 'Adarna House Free Reads', url: 'adarna.com.ph', desc: 'Filipino children\'s books' },
    { label: 'DepEd Learning Resource Portal', url: 'lrmds.deped.gov.ph', desc: 'Official DepEd materials' },
    { label: 'StoryWeaver by Pratham', url: 'storyweaver.org.in', desc: 'Multilingual picture books' },
    { label: 'Let\'s Read Asia', url: 'letsreadasia.org', desc: 'Free Filipino stories online' },
  ];

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Header bar */}
      <div className="bg-blue-600 px-5 pt-5 pb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
            <BookOpen size={16} className="text-blue-600" />
          </div>
          <span className="text-white font-black text-sm">BIGKAS</span>
          <span className="text-blue-300 text-xs ml-auto">DepEd · Official Report</span>
        </div>
        <h1 className="text-white font-black text-xl leading-tight">
          Reading Report
        </h1>
        <p className="text-blue-200 text-sm mt-1 font-semibold">
          {firstName} · Grade {student.grade}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full bg-white/20 text-white`}>
            {language === 'Filipino' ? '🇵🇭 Filipino' : '🇺🇸 English'}
          </span>
          <span className="text-[10px] text-blue-200 font-semibold">{result.lastAssessed}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-5">
        {/* Reading level card */}
        <div className={`rounded-2xl p-4 border-2 ${cfg.lightBg} ${cfg.borderClass}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{cfg.emoji}</span>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{language} Reading Level</p>
              <p className={`font-black text-base ${cfg.textClass}`}>{cfg.label}</p>
            </div>
          </div>
          <p className={`text-sm font-semibold ${cfg.textClass} leading-relaxed`}>
            {plainMessage()}
          </p>
        </div>

        {/* What this means */}
        {paramInfo && result.primaryGap !== 'None' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star size={14} className="text-amber-500" />
              <p className="font-black text-slate-800 text-sm">What This Means</p>
            </div>
            <p className="text-[11px] font-black text-blue-700 mb-1">{paramInfo.title}</p>
            <p className="text-xs text-slate-600 leading-relaxed">{paramInfo.explanation}</p>
          </div>
        )}

        {/* What you can do at home */}
        {paramInfo && result.primaryGap !== 'None' && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 overflow-hidden">
            <button
              onClick={() => setOpenActivities((o) => !o)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
            >
              <Heart size={14} className="text-rose-500 flex-shrink-0" />
              <p className="font-black text-blue-900 text-sm flex-1">What You Can Do at Home</p>
              {openActivities ? <ChevronUp size={14} className="text-blue-500" /> : <ChevronDown size={14} className="text-blue-500" />}
            </button>
            {openActivities && (
              <div className="px-4 pb-4 flex flex-col gap-3">
                {paramInfo.activities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-blue-100">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">{activity}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Green message activities */}
        {result.tier === 'green' && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={14} className="text-emerald-600" />
              <p className="font-black text-emerald-800 text-sm">Keep it Going! 🌟</p>
            </div>
            <div className="flex flex-col gap-2">
              {[
                'Read together for at least 20 minutes each day at their level',
                'Let them choose books on topics they love — interest drives practice',
                'Ask questions about what they read — "What was your favorite part?"',
                'Visit the library or browse free online books together',
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Star size={9} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-emerald-700 font-semibold">{a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Free reading resources */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <button
            onClick={() => setOpenResources((o) => !o)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
          >
            <BookOpen size={14} className="text-blue-500 flex-shrink-0" />
            <p className="font-black text-slate-800 text-sm flex-1">Free Reading Resources</p>
            {openResources ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
          </button>
          {openResources && (
            <div className="px-4 pb-4 flex flex-col gap-2">
              {FREE_RESOURCES.map((r) => (
                <div key={r.label} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{r.label}</p>
                    <p className="text-[10px] text-slate-400">{r.desc}</p>
                  </div>
                  <ExternalLink size={12} className="text-blue-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            This report was generated by <strong>Bigkas</strong> and reviewed by {firstName}'s teacher.
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            If you have questions, contact your child's teacher directly.
          </p>
          <p className="text-[10px] text-amber-600 font-bold mt-2">
            ⏱ This link expires on {expiry}. After that, ask the teacher for a new one.
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Audio recordings are deleted immediately after scoring. Your child's privacy is protected.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Parent Portal (Teacher demo view) ─────────────────────────────────────────

export function ParentPortal() {
  const [selectedStudentId, setSelectedStudentId] = useState(1);
  const [language, setLanguage] = useState<Language>('Filipino');

  const student = MOCK_STUDENTS.find((s) => s.id === selectedStudentId) ?? MOCK_STUDENTS[0];
  const result = language === 'Filipino' ? student.filipino : student.english;
  const cfg = TIER_CONFIG[result.tier];

  const tokenPreview = `bk_${student.id}_${Math.random().toString(36).slice(2, 8)}_${language.toLowerCase().slice(0, 3)}`;

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-blue-900">Parent Portal Preview 🔗</h1>
        <p className="text-slate-500 text-sm mt-1">
          This is exactly what parents see when they click their tokenized link.
          No login required — mobile-first design.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Preview Student</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold
              focus:outline-none focus:border-blue-500 bg-white w-52"
          >
            {MOCK_STUDENTS.filter((s) => s.consentStatus === 'confirmed').map((s) => (
              <option key={s.id} value={s.id}>{s.name} — Grade {s.grade}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Language</label>
          <div className="flex gap-2">
            {(['Filipino', 'English'] as Language[]).map((l) => (
              <button key={l} onClick={() => setLanguage(l)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all
                  ${language === l ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:border-blue-200'}`}>
                {l === 'Filipino' ? '🇵🇭' : '🇺🇸'} {l}
              </button>
            ))}
          </div>
        </div>

        {/* Reading level badge */}
        <div className={`ml-auto flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${cfg.lightBg} ${cfg.borderClass}`}>
          <span className="text-2xl">{cfg.emoji}</span>
          <div>
            <p className="text-[10px] font-black text-slate-500">Current Level</p>
            <p className={`font-black text-sm ${cfg.textClass}`}>{cfg.label}</p>
          </div>
        </div>
      </div>

      {/* Token info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-black text-amber-800 text-sm">How the parent link works</p>
          <p className="text-amber-700 text-xs mt-1 leading-relaxed">
            Each parent receives a <strong>unique tokenized link</strong> via email — like this:
          </p>
          <p className="font-mono text-[11px] text-blue-700 bg-white rounded-lg px-3 py-2 mt-2 border border-blue-100 break-all">
            app.bigkas.ph/parent/report?token={tokenPreview}
          </p>
          <p className="text-amber-600 text-[10px] mt-2 font-semibold">
            No username. No password. No child's name in the URL. Single-use. Expires in 30 days.
          </p>
        </div>
      </div>

      {/* Phone mockup + desktop side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Mobile preview */}
        <div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4 text-center">
            Mobile View (what most parents see)
          </p>
          <MobileFrame>
            <div className="overflow-y-auto max-h-[600px]">
              <ParentReportPage student={student} language={language} />
            </div>
          </MobileFrame>
        </div>

        {/* What the portal guarantees */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Portal Design Principles</p>

          {[
            { icon: '🔒', title: 'No account needed', desc: 'Parent clicks the link → sees the report. No signup, no app install, no password.' },
            { icon: '🌏', title: 'Plain language only', desc: 'No jargon. No Phil-IRI levels. No WCPM. Just clear sentences any parent can understand.' },
            { icon: '📱', title: 'Mobile-first', desc: 'Designed for the phone in a parent\'s pocket. Readable on a 4-inch screen with one hand.' },
            { icon: '🛡️', title: 'Child privacy protected', desc: 'Full name never appears in the URL or email subject. Each parent sees only their own child\'s data.' },
            { icon: '🏠', title: 'Actionable at home', desc: '3 free, specific activities matched to the exact skill gap — no cost, no materials required.' },
            { icon: '⏱️', title: 'Auto-expiry', desc: 'Each link is valid for 30 days or until the next assessment. Expired links show a clear message.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-black text-blue-900 text-sm">{item.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
