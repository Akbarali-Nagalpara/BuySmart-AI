import { useState } from 'react';
import { Navigation } from '../layout/Navigation';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Lock,
  Trash2,
  Save,
  Moon,
  Sun,
} from 'lucide-react';

export function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { success, error: showError } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSaveSettings = () => {
    success('Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      showError('Account deletion is not available in demo mode');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your account preferences and settings
            </p>
          </div>

          <div className="space-y-6">
            {/* Appearance */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Appearance</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white mb-1">
                      Theme Mode
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Choose your preferred theme
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`
                      relative w-16 h-8 rounded-full transition-colors
                      ${isDark ? 'bg-primary-600' : 'bg-slate-300'}
                    `}
                  >
                    <div
                      className={`
                        absolute top-1 left-1 w-6 h-6 bg-white rounded-full
                        flex items-center justify-center transition-transform
                        ${isDark ? 'translate-x-8' : 'translate-x-0'}
                      `}
                    >
                      {isDark ? (
                        <Moon className="w-4 h-4 text-primary-600" />
                      ) : (
                        <Sun className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white mb-1">
                      Email Notifications
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Receive email updates about your analyses
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white mb-1">
                      Price Drop Alerts
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Get notified when tracked products go on sale
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={priceAlerts}
                      onChange={(e) => setPriceAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white mb-1">
                      Weekly Digest
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Receive weekly summary of your shopping insights
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={weeklyDigest}
                      onChange={(e) => setWeeklyDigest(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-200/50 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Privacy & Security
                </h2>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">Change Password</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Change Email</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Globe className="w-5 h-5" />
                  <span className="font-medium">Data & Privacy</span>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h2 className="text-xl font-bold text-red-900 dark:text-red-400">Danger Zone</h2>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-red-800 dark:text-red-300">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleSaveSettings}
                className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
