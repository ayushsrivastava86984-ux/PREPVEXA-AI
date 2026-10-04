import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Bell,
  Sliders,
  CheckCircle2,
  Save,
  Lock,
  Eye,
  Sparkles,
} from 'lucide-react';
import { UserProfile, Subject } from '../types';
import { StorageManager } from '../services/storage';
import { useToast } from '../context/ToastContext';

interface SettingsViewProps {
  user: UserProfile;
  onUserUpdate: (updated: UserProfile) => void;
  subjects: Subject[];
  reducedMotion: boolean;
  onToggleReducedMotion: (val: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUserUpdate,
  subjects,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'accessibility'>('profile');

  // Profile Form state
  const [fullName, setFullName] = useState(user.fullName);
  const [educationLevel, setEducationLevel] = useState(user.educationLevel);
  const [learningGoals, setLearningGoals] = useState(user.learningGoals);
  const [preferredSubs, setPreferredSubs] = useState<string[]>(user.preferredSubjects || []);
  const [isSaving, setIsSaving] = useState(false);

  // Notifications state
  const [studyReminders, setStudyReminders] = useState(true);
  const [examAlerts, setExamAlerts] = useState(true);
  const [aiInsightsWeekly, setAiInsightsWeekly] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      const updated: UserProfile = {
        ...user,
        fullName,
        educationLevel,
        learningGoals,
        preferredSubjects: preferredSubs,
      };
      StorageManager.saveUser(updated);
      onUserUpdate(updated);
      setIsSaving(false);
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal preferences have been saved successfully.',
      });
    }, 400);
  };

  const toggleSubject = (name: string) => {
    if (preferredSubs.includes(name)) {
      setPreferredSubs(preferredSubs.filter((s) => s !== name));
    } else {
      setPreferredSubs([...preferredSubs, name]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/80 to-transparent border border-white/10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            <Settings className="w-4 h-4 text-pink-400" />
            <span>Preferences & Account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Settings & Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage your academic targets, study notification channels, and display accessibility.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto">
        {[
          { id: 'profile', label: 'Student Profile', icon: User },
          { id: 'account', label: 'Security & Account', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'accessibility', label: 'Accessibility & Motion', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="max-w-2xl space-y-6">
          <div className="p-6 rounded-2xl glass-panel space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-white/[0.08]">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-pink-500/40"
              />
              <div>
                <h3 className="text-base font-bold text-white">{user.fullName}</h3>
                <p className="text-xs text-slate-400">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {user.role} Account
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Degree / Education Level
              </label>
              <input
                type="text"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                placeholder="e.g. Undergraduate Computer Science"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Learning Goal
              </label>
              <textarea
                rows={2}
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Preferred Focus Subjects
              </label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((sub) => {
                  const isChecked = preferredSubs.includes(sub.name);
                  return (
                    <button
                      type="button"
                      key={sub.id}
                      onClick={() => toggleSubject(sub.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        isChecked
                          ? 'bg-pink-500/20 border-pink-500 text-pink-200'
                          : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 flex items-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Profile Settings'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Security & Account */}
      {activeTab === 'account' && (
        <div className="max-w-2xl space-y-4">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white">Security & Password</h3>
            <p className="text-xs text-slate-400">
              Your account is authenticated via Supabase Auth with encrypted sessions.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() =>
                  addToast({
                    type: 'info',
                    title: 'Password Reset Dispatched',
                    message: `Security instructions sent to ${user.email}`,
                  })
                }
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-pink-400" />
                <span>Send Password Reset Link</span>
              </button>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-slate-400">
                <span className="font-semibold text-white">Role-Based Access: </span>
                Every signup is strictly provisioned as a Student. Administrative access is restricted via server-side claims and database RLS policies.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl space-y-4">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white">Notification Preferences</h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-white">Daily Study Reminders</p>
                  <p className="text-[11px] text-slate-400">Receive alerts to maintain your 7-day study streak.</p>
                </div>
                <input
                  type="checkbox"
                  checked={studyReminders}
                  onChange={(e) => setStudyReminders(e.target.checked)}
                  className="w-4 h-4 accent-pink-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-white">Exam Simulation Warnings</p>
                  <p className="text-[11px] text-slate-400">Countdown reminders for upcoming scheduled exam targets.</p>
                </div>
                <input
                  type="checkbox"
                  checked={examAlerts}
                  onChange={(e) => setExamAlerts(e.target.checked)}
                  className="w-4 h-4 accent-pink-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-white">AI Diagnostic Digests</p>
                  <p className="text-[11px] text-slate-400">Weekly summaries of your resolved weakness topics.</p>
                </div>
                <input
                  type="checkbox"
                  checked={aiInsightsWeekly}
                  onChange={(e) => setAiInsightsWeekly(e.target.checked)}
                  className="w-4 h-4 accent-pink-500 rounded"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Accessibility & Motion */}
      {activeTab === 'accessibility' && (
        <div className="max-w-2xl space-y-4">
          <div className="p-6 rounded-2xl glass-panel space-y-4">
            <h3 className="text-sm font-bold text-white">Accessibility & Motion Controls</h3>
            <p className="text-xs text-slate-400">
              Configure animation density and graphics overhead for low-power devices or sensory comfort.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/[0.08] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Reduced Motion Mode</p>
                <p className="text-[11px] text-slate-400">
                  Disables rotating 3D neural orbit rings and simplifies particle rendering.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextVal = !reducedMotion;
                  onToggleReducedMotion(nextVal);
                  StorageManager.setReducedMotion(nextVal);
                  addToast({
                    type: 'info',
                    title: nextVal ? 'Reduced Motion Enabled' : 'Full 3D Motion Enabled',
                  });
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  reducedMotion ? 'bg-pink-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
