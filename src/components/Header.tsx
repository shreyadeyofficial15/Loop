import React from 'react';
import {
  RotateCcw,
  Sparkles,
  Shield,
  ChevronDown,
  Plus,
  Radio,
  UserCheck,
  Sun,
  Moon,
  Check,
  Database,
} from 'lucide-react';
import { WorkspaceTenant, UserRole } from '../types';

interface HeaderProps {
  workspaces: WorkspaceTenant[];
  currentWorkspace: WorkspaceTenant;
  onSelectWorkspace: (ws: WorkspaceTenant) => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenNewFeedback: () => void;
  onOpenAskAi: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  hasGeminiKey: boolean;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onOpenMernInspector?: () => void;
}

export const ROLE_LABELS: Record<UserRole, { label: string; desc: string; badgeColor: string; darkBadgeColor: string }> = {
  admin: {
    label: 'Workspace Admin',
    desc: 'Full configuration, API keys, team roles & purge access',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    darkBadgeColor: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
  },
  product_manager: {
    label: 'Product Manager',
    desc: 'Triage product gaps, feature clustering & roadmap impact',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    darkBadgeColor: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
  },
  support_lead: {
    label: 'Support Lead',
    desc: 'Urgent churn alerts, ticket escalation & SLA response',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    darkBadgeColor: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
  },
  executive: {
    label: 'Executive / Leadership',
    desc: 'Voice-of-Customer briefings, ARR churn risk & health KPIs',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    darkBadgeColor: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
  },
};

export function Header({
  workspaces,
  currentWorkspace,
  onSelectWorkspace,
  currentRole,
  onSelectRole,
  onOpenNewFeedback,
  onOpenAskAi,
  isSimulating,
  onToggleSimulation,
  hasGeminiKey,
  theme = 'light',
  onToggleTheme,
  onOpenMernInspector,
}: HeaderProps) {
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = React.useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const isDark = theme === 'dark';

  return (
    <header
      id="project-loop-header"
      className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        isDark
          ? 'bg-slate-900/95 border-slate-800 backdrop-blur-md text-slate-100'
          : 'bg-white/95 border-slate-200 backdrop-blur-md text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Workspace Switcher */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white transition-all shadow-xs ${
                  isDark ? 'bg-indigo-500 shadow-indigo-500/20' : 'bg-indigo-600 shadow-indigo-600/20'
                }`}
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-base sm:text-lg">
                    LOOP
                  </span>
                  <span
                    className={`hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      isDark
                        ? 'bg-indigo-950/80 text-indigo-300 border-indigo-800'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    Feedback Intel
                  </span>
                </div>
                <p className={`text-[11px] leading-none hidden md:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  AI Customer Signal Platform
                </p>
              </div>
            </div>

            {/* Multi-Tenant Workspace Selector */}
            <div className="relative">
              <button
                id="workspace-switcher-button"
                onClick={() => {
                  setWorkspaceDropdownOpen(!workspaceDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-left text-xs font-medium transition-all ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full bg-linear-to-br ${currentWorkspace.avatarGradient} shrink-0`} />
                <div className="hidden sm:block leading-tight">
                  <span className="font-semibold block text-xs">{currentWorkspace.name}</span>
                  <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {currentWorkspace.industry} • {currentWorkspace.plan}
                  </span>
                </div>
                <div className="sm:hidden font-semibold text-xs">{currentWorkspace.name}</div>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5 shrink-0" />
              </button>

              {workspaceDropdownOpen && (
                <div
                  id="workspace-dropdown-menu"
                  className={`absolute left-0 mt-2 w-72 rounded-xl shadow-xl border py-1.5 z-50 animate-in fade-in-50 zoom-in-95 ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/40'
                      : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/80'
                  }`}
                >
                  <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                    Switch Workspace Tenant
                  </div>
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      id={`select-workspace-${ws.id}`}
                      onClick={() => {
                        onSelectWorkspace(ws);
                        setWorkspaceDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                        ws.id === currentWorkspace.id
                          ? isDark
                            ? 'bg-indigo-950/70 text-indigo-200 font-semibold'
                            : 'bg-indigo-50 text-indigo-800 font-semibold'
                          : isDark
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full bg-linear-to-br ${ws.avatarGradient}`} />
                        <div>
                          <div className="font-semibold">{ws.name}</div>
                          <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {ws.industry}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                          {ws.feedbackCount}
                        </span>
                        {ws.id === currentWorkspace.id && (
                          <Check className="w-3.5 h-3.5 text-indigo-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live Inbound Simulation Toggle */}
            <button
              id="toggle-live-simulation-btn"
              onClick={onToggleSimulation}
              title={isSimulating ? 'Live ingestion simulation is active' : 'Click to simulate incoming customer signals'}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isSimulating
                  ? isDark
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'text-emerald-500 animate-pulse' : 'opacity-50'}`} />
              <span className="whitespace-nowrap">{isSimulating ? 'Live Ingesting' : 'Simulate Feed'}</span>
            </button>

            {/* MERN Stack Architecture Inspector Toggle */}
            <button
              id="mern-stack-inspector-btn"
              onClick={onOpenMernInspector}
              title="Inspect MERN Stack: MongoDB, Express.js, React.js, Node.js"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-950/70'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span>MERN Stack</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* AI Engine Status */}
            <div
              id="ai-engine-status-badge"
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                isDark
                  ? 'bg-indigo-950/40 text-indigo-300 border-indigo-900/60'
                  : 'bg-indigo-50/70 text-indigo-700 border-indigo-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="whitespace-nowrap">Gemini 3.8 Flash</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${hasGeminiKey ? 'bg-emerald-500' : 'bg-amber-500'}`}
                title={hasGeminiKey ? 'Gemini AI Online' : 'Local Fallback Engine'}
              />
            </div>

            {/* RBAC Role Switcher */}
            <div className="relative">
              <button
                id="rbac-role-switcher-btn"
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setWorkspaceDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  isDark ? ROLE_LABELS[currentRole].darkBadgeColor : ROLE_LABELS[currentRole].badgeColor
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline whitespace-nowrap">{ROLE_LABELS[currentRole].label}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <div
                  id="role-dropdown-menu"
                  className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl border py-1.5 z-50 animate-in fade-in-50 zoom-in-95 ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/40'
                      : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/80'
                  }`}
                >
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
                    Role-Based Access (RBAC)
                  </div>
                  {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
                    <button
                      key={role}
                      id={`select-role-${role}`}
                      onClick={() => {
                        onSelectRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left transition-colors ${
                        role === currentRole
                          ? isDark
                            ? 'bg-indigo-950/70 text-indigo-200 font-semibold'
                            : 'bg-indigo-50 text-indigo-800 font-semibold'
                          : isDark
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{ROLE_LABELS[role].label}</span>
                        {role === currentRole && <UserCheck className="w-3.5 h-3.5 text-indigo-500" />}
                      </div>
                      <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {ROLE_LABELS[role].desc}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Toggle */}
            {onToggleTheme && (
              <button
                id="theme-toggle-btn"
                onClick={onToggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Ask LOOP AI Action */}
            <button
              id="header-ask-ai-btn"
              onClick={onOpenAskAi}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                isDark
                  ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask LOOP</span>
            </button>

            {/* Ingest Signal Action */}
            <button
              id="header-add-feedback-btn"
              onClick={onOpenNewFeedback}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                isDark
                  ? 'bg-slate-100 hover:bg-white text-slate-900'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ingest Signal</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
