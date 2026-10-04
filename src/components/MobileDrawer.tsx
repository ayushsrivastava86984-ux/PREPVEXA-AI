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
  X,
  Flame,
} from 'lucide-react';
import { UserProfile } from '../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  user,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-tutor', label: 'AI Study Assistant', icon: Sparkles, color: 'text-pink-400' },
    { id: 'quiz', label: 'Quiz Generator', icon: HelpCircle, color: 'text-emerald-400' },
    { id: 'exam', label: 'Exam Simulator', icon: Timer, color: 'text-amber-400' },
    { id: 'study-plan', label: 'My Study Plan', icon: CalendarDays },
    { id: 'materials', label: 'Study Materials', icon: Files },
    { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
    { id: 'history', label: 'Activity History', icon: History },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'admin', label: 'Admin Telemetry', icon: Shield, color: 'text-pink-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-[#090b10] border-r border-white/10 h-full p-5 flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">PREPVEXA AI</p>
              <p className="text-[10px] text-pink-400 font-semibold tracking-wide">PRACTICE · PERFORM · PROGRESS</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student summary */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/[0.08] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white">{user.fullName}</p>
            <p className="text-[10px] text-slate-400">{user.educationLevel}</p>
          </div>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            {user.studyStreakDays}d
          </div>
        </div>

        {/* Nav list */}
        <nav className="flex-1 mt-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-pink-500/20 text-white border border-pink-500/35'
                    : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : item.color || 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
