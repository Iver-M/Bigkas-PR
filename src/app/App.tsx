import { useState } from 'react';
import {
  ClipboardList, Users, BarChart2, BookOpen, Menu, Home,
  Target, Globe, LogOut, ChevronDown, Wifi, WifiOff,
} from 'lucide-react';
import { Toaster } from 'sonner';
import { LoginScreen } from '../screens/LoginScreen';
import { AssessmentFlow } from '../screens/AssessmentFlow';
import { TeacherDashboard } from '../screens/TeacherDashboard';
import { Analytics } from '../screens/Analytics';
import { ClassGrouping } from '../screens/ClassGrouping';
import { ParentPortal } from '../screens/ParentPortal';

// ── Types ──────────────────────────────────────────────────────────────────────

type Screen = 'dashboard' | 'assessment' | 'grouping' | 'portal' | 'analytics';

interface NavItem {
  key: Screen;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Class Roster', sublabel: 'Students & results', icon: <Users size={20} />, },
  { key: 'assessment', label: 'Assessment', sublabel: 'Run a new session', icon: <ClipboardList size={20} />, badge: 'NEW' },
  { key: 'grouping', label: 'Intervention Groups', sublabel: 'Drills by color group', icon: <Target size={20} /> },
  { key: 'portal', label: 'Parent Portal', sublabel: 'Preview parent report', icon: <Globe size={20} /> },
  { key: 'analytics', label: 'Analytics', sublabel: 'Reading dashboards', icon: <BarChart2 size={20} /> },
];

// ── Sidebar ────────────────────────────────────────────────────────────────────

function Sidebar({
  current, onSelect, collapsed, onToggle, userName, userRole, onLogout,
}: {
  current: Screen;
  onSelect: (s: Screen) => void;
  collapsed: boolean;
  onToggle: () => void;
  userName: string;
  userRole: string;
  onLogout: () => void;
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <aside
      className={`flex-shrink-0 flex flex-col transition-all duration-300 relative
        ${collapsed ? 'w-[72px]' : 'w-60'}
        bg-slate-900`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-white/10
          ${collapsed ? 'justify-center' : ''}`}
      >
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/40">
          <BookOpen size={20} className="text-blue-700" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-white font-black text-xl tracking-tight leading-none">BIGKAS</h1>
            <p className="text-blue-300/70 text-[10px] font-semibold mt-0.5 leading-tight">
              Reading Assessment · DepEd
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left w-full group
                ${active
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <span className={`flex-shrink-0 transition-colors
                ${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${active ? 'font-semibold text-white' : 'font-medium'}`}>
                      {item.label}
                    </p>
                    {item.badge && (
                      <span className="text-[9px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom area */}
      <div className="px-2 pb-4 border-t border-white/8 pt-3 flex flex-col gap-1">
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500
            hover:text-white hover:bg-white/5 transition-all w-full
            ${collapsed ? 'justify-center' : ''}`}
        >
          <Menu size={15} />
          {!collapsed && <span className="text-xs font-medium">Collapse</span>}
        </button>

        {/* User info */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu((s) => !s)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-all text-left
              ${collapsed ? 'justify-center' : ''}`}
          >
            <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-slate-200 text-xs font-semibold flex-shrink-0">
              {userName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-200 truncate">{userName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{userRole}</p>
                </div>
                <ChevronDown size={11} className="text-slate-500 flex-shrink-0" />
              </>
            )}
          </button>
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>

        {/* Sync indicator */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-1.5">
            <Wifi size={11} className="text-emerald-500 flex-shrink-0" />
            <span className="text-[10px] text-slate-500">Online · All synced</span>
          </div>
        )}
      </div>
    </aside>
  );
}

// ── Top Bar ────────────────────────────────────────────────────────────────────

function TopBar({ activeNav, userName, userRole, pendingSync }: {
  activeNav: NavItem;
  userName: string;
  userRole: string;
  pendingSync: number;
}) {
  return (
    <div className="flex-shrink-0 h-13 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-gray-400 flex-shrink-0">{activeNav.icon}</span>
        <h2 className="font-semibold text-gray-900 text-sm truncate">{activeNav.label}</h2>
        <span className="text-gray-200 text-xs flex-shrink-0">·</span>
        <span className="text-gray-400 text-xs truncate hidden sm:block">
          {activeNav.sublabel}
        </span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {pendingSync > 0 && (
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
            <WifiOff size={11} className="text-amber-500" />
            <span className="text-[10px] font-semibold text-amber-700">{pendingSync} pending upload</span>
          </div>
        )}
        <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {userName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs font-medium text-gray-700">{userName}</p>
          <p className="text-[10px] text-gray-400">{userRole}</p>
        </div>
      </div>
    </div>
  );
}

// ── App Root ───────────────────────────────────────────────────────────────────

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Rosa Santos');
  const [userRole, setUserRole] = useState('Teacher');
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingSync] = useState(0);

  const handleLogin = (role: string, name: string) => {
    setUserRole(role);
    setUserName(name);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setScreen('dashboard');
  };

  if (!loggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const activeNav = NAV_ITEMS.find((n) => n.key === screen)!;

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':   return <TeacherDashboard onNavigate={(s) => setScreen(s as Screen)} />;
      case 'assessment':  return <AssessmentFlow />;
      case 'grouping':    return <ClassGrouping />;
      case 'portal':      return <ParentPortal />;
      case 'analytics':   return <Analytics />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: 13 },
        }}
      />

      <Sidebar
        current={screen}
        onSelect={setScreen}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar activeNav={activeNav} userName={userName} userRole={userRole} pendingSync={pendingSync} />
        <div className="flex-1 overflow-y-auto">{renderScreen()}</div>
      </main>
    </div>
  );
}
