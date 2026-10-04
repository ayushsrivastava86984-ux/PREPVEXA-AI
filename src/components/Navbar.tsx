import React, { useState } from 'react';
import {
  Sparkles,
  Bell,
  Flame,
  Check,
  Shield,
  GraduationCap,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../types';
import { StorageManager } from '../services/storage';

interface NavbarProps {
  user: UserProfile;
  notifications: NotificationItem[];
  onNotificationsChange: (items: NotificationItem[]) => void;
  onNavigate: (view: string) => void;
  currentView: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  notifications,
  onNotificationsChange,
  onNavigate,
  currentView,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onOpenAuth,
  isLoggedIn,
  onLogout,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    StorageManager.saveNotifications(updated);
    onNotificationsChange(updated);
  };

  const markItemAsRead = (id: string, actionUrl?: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    StorageManager.saveNotifications(updated);
    onNotificationsChange(updated);
    if (actionUrl) {
      onNavigate(actionUrl);
      setShowNotifMenu(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090b10]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div
            onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 p-[1px] shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/35 transition-all">
              <div className="w-full h-full bg-[#0d0f17] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent">
                  PREPVEXA
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-400 border border-pink-500/30">
                  AI
                </span>
              </div>
              <span className="text-[10px] tracking-wider text-slate-400 uppercase font-medium hidden sm:inline-block">
                Practice · Perform · Progress
              </span>
            </div>
          </div>
        </div>

        {/* Center: Quick navigation for non-logged in or desktop */}
        {!isLoggedIn ? (
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              onClick={() => onNavigate('landing')}
              className={`hover:text-white transition-colors ${currentView === 'landing' ? 'text-pink-400 font-semibold' : ''}`}
            >
              Overview
            </button>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#loop" className="hover:text-white transition-colors">
              The Learning Loop
            </a>
          </nav>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => onNavigate('ai-tutor')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Ask AI Tutor
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors"
            >
              Generate Quiz
            </button>
            <button
              onClick={() => onNavigate('exam')}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors"
            >
              Exam Simulator
            </button>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Streak badge */}
              <div
                onClick={() => onNavigate('achievements')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold cursor-pointer hover:bg-amber-500/20 transition-colors"
                title={`${user.studyStreakDays} Day Streak`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{user.studyStreakDays}d Streak</span>
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-[#090b10] animate-pulse" />
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel-elevated p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] mb-2 px-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-slate-400 hover:text-pink-400 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
                      ) : (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => markItemAsRead(item.id, item.actionUrl)}
                            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                              item.isRead
                                ? 'bg-slate-900/40 hover:bg-slate-800/40 text-slate-300'
                                : 'bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/15 text-white'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold">{item.title}</p>
                              {!item.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                              {item.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar / Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-full bg-slate-900 border border-white/10 hover:border-pink-500/40 transition-colors"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
                  />
                  <span className="text-xs font-medium text-slate-200 pr-2 hidden sm:inline-block">
                    {user.fullName.split(' ')[0]}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel-elevated p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
                      <p className="text-sm font-semibold text-white">{user.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      Student Profile
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
                    >
                      Settings & Preferences
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-pink-300 hover:bg-pink-500/10 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-pink-400" />
                        Admin Telemetry
                      </span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </button>

                    <div className="border-t border-white/[0.08] mt-1 pt-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Get Started Free
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
