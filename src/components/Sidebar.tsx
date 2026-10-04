import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  HelpCircle,
  Timer,
  CalendarDays,
  Files,
  BarChart3,
  History,
  Award,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  user: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isCollapsed,
  setIsCollapsed,
  user,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'ai-tutor', label: 'AI Study Assistant', icon: Sparkles, badge: 'Live AI', color: 'text-pink-400' },
    { id: 'quiz', label: 'Quiz Generator', icon: HelpCircle, badge: null, color: 'text-emerald-400' },
    { id: 'exam', label: 'Exam Simulator', icon: Timer, badge: 'Timed', color: 'text-amber-400' },
    { id: 'study-plan', label: 'My Study Plan', icon: CalendarDays, badge: null },
    { id: 'materials', label: 'Study Materials', icon: Files, badge: null },
    { id: 'analytics', label: 'Performance Analytics', icon: BarChart3, badge: null },
    { id: 'history', label: 'Activity History', icon: History, badge: null },
    { id: 'achievements', label: 'Achievements', icon: Award, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-white/[0.08] bg-[#090b10] transition-all duration-300 select-none relative z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-slate-800 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center shadow-md z-40 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Student Quick Pill */}
      {!isCollapsed ? (
        <div className="p-4 mx-3 mt-4 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/5 to-transparent border border-pink-500/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">Active Study Session</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Goal: <span className="text-pink-300 font-medium">{user.learningGoals.slice(0, 32)}...</span>
          </p>
        </div>
      ) : (
        <div className="flex justify-center mt-4">
          <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center">
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/15 text-white border border-pink-500/35 shadow-sm shadow-pink-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-pink-400' : item.color || 'text-slate-400'
                }`}
              />
              {!isCollapsed && (
                <div className="flex items-center justify-between w-full min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin Portal Gateway at bottom */}
      <div className="p-3 border-t border-white/[0.08]">
        <button
          onClick={() => onNavigate('admin')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors ${
            currentView === 'admin' ? 'bg-slate-800/70 text-pink-300' : ''
          } ${isCollapsed ? 'justify-center px-0' : ''}`}
          title={isCollapsed ? 'Admin Dashboard' : undefined}
        >
          <Shield className="w-4 h-4 text-pink-400/80 shrink-0" />
          {!isCollapsed && <span className="truncate">Admin Telemetry</span>}
        </button>
      </div>
    </aside>
  );
};
