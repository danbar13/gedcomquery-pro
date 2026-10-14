import React from 'react';
import {
  Upload,
  Download,
  Settings,
  Sun,
  Moon,
  FolderOpen,
  ShieldCheck,
  Menu,
} from 'lucide-react';
import { GedcomTree } from '../types/gedcom';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  tree: GedcomTree | null;
  onLoadDemo: () => void;
  onLoadWorkspaceFile?: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tree,
  onLoadDemo,
  onLoadWorkspaceFile,
  onFileUpload,
  onOpenExport,
  onOpenSettings,
  darkMode,
  onToggleDarkMode,
  onToggleMobileMenu,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { lang, setLang, t } = useLanguage();

  const totalIndi = tree ? Object.keys(tree.individuals).length : 0;
  const totalFam = tree ? Object.keys(tree.families).length : 0;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 -mr-1 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
              title="תפריט ניווט"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <span className="font-black text-base sm:text-lg tracking-wider">GQ</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
                {t.appName.split(' ')[0]} <span className="text-indigo-600 dark:text-indigo-400">{t.appName.split(' ')[1]}</span>
              </h1>
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3 h-3" /> {t.clientPrivacyBadge}
              </span>
            </div>
            {tree && (
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                {tree.metadata.fileName || 'Tree'} • {t.individualsCount(totalIndi)}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileUpload}
            accept=".ged,.gedcom"
            className="hidden"
          />

          <button
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
                fileInputRef.current.click();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer"
            title={t.importGed}
          >
            <Upload className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">{t.importGed}</span>
            <span className="sm:hidden">GED</span>
          </button>

          <button
            onClick={onLoadDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 transition-colors"
            title={t.loadDemoTree}
          >
            <FolderOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">{t.loadDemoTree}</span>
            <span className="sm:hidden">{t.demoTreeShort}</span>
          </button>

          {onLoadWorkspaceFile && (
            <button
              onClick={onLoadWorkspaceFile}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60 transition-colors"
              title={t.workspaceGed}
            >
              <FolderOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{t.workspaceGed}</span>
            </button>
          )}

          {tree && (
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
              title={t.export}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.export}</span>
            </button>
          )}

          <div className="h-5 w-[1px] bg-gray-200 dark:bg-gray-800" />

          {/* Language Switcher with Flags */}
          <div className="inline-flex items-center p-0.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100/70 dark:bg-gray-800">
            <button
              onClick={() => setLang('he')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                lang === 'he'
                  ? 'bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
              title="מעבר לעברית"
            >
              <span className="text-base leading-none">🇮🇱</span>
              <span className="hidden sm:inline">עברית</span>
            </button>
            <button
              onClick={() => setLang('en')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
              title="Switch to English"
            >
              <span className="text-base leading-none">🇺🇸</span>
              <span className="hidden sm:inline">English</span>
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title={darkMode ? t.lightMode : t.darkMode}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title={t.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
