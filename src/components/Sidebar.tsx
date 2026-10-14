import React from 'react';
import {
  LayoutDashboard,
  GitBranch,
  Users,
  Compass,
  AlertTriangle,
  Sparkles,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type TabType = 'dashboard' | 'tree' | 'directory' | 'kinship' | 'quality' | 'research' | 'export';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  anomalyCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSettings: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  anomalyCount,
  collapsed,
  onToggleCollapse,
  onOpenSettings,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { t, isRTL } = useLanguage();

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: t.navDashboard,
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'tree',
      label: t.navTree,
      icon: <GitBranch className="w-5 h-5" />,
    },
    {
      id: 'directory',
      label: t.navDirectory,
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'kinship',
      label: t.navKinship,
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'quality',
      label: t.navQuality,
      icon: <AlertTriangle className="w-5 h-5" />,
      badge: anomalyCount,
    },
    {
      id: 'research',
      label: t.navResearch,
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'export',
      label: t.navExport,
      icon: <Download className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex relative flex-col bg-white dark:bg-gray-900 border-r dark:border-r-gray-800 border-gray-200 transition-all duration-200 select-none ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all relative cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}

                {/* Anomaly Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white text-indigo-700'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Collapse & Settings Footer */}
        <div className="p-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
              collapsed ? 'mx-auto' : ''
            }`}
            title={t.settings}
          >
            <Settings className="w-4 h-4" />
            {!collapsed && <span>{t.settings}</span>}
          </button>

          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden md:block cursor-pointer"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? (
              isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-50 w-72 bg-white dark:bg-gray-900 shadow-2xl flex flex-col md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')
        }`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center text-white font-black text-xs shadow-xs">
              GQ
            </div>
            <div>
              <span className="font-extrabold text-sm text-gray-900 dark:text-white">GedcomQuery Pro</span>
              <p className="text-[10px] text-gray-400">{t.clientPrivacyBadge}</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => {
              onOpenSettings();
              onCloseMobile?.();
            }}
            className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>{t.settings}</span>
          </button>
        </div>
      </div>
    </>
  );
};
