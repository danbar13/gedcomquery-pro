import React from 'react';
import {
  Users,
  Home,
  Calendar,
  MapPin,
  HeartPulse,
  Sparkles,
  Compass,
  ArrowRight,
  ArrowLeft,
  Upload,
  FolderOpen,
  CheckCircle2,
} from 'lucide-react';
import { GedcomTree, ValidationAnomaly, Individual } from '../types/gedcom';
import { extractYear } from '../services/gedcomParser';
import { useLanguage } from '../context/LanguageContext';

interface DashboardViewProps {
  tree: GedcomTree | null;
  anomalies: ValidationAnomaly[];
  onSelectPerson: (indi: Individual) => void;
  onNavigateTab: (tab: any) => void;
  onLoadDemo: () => void;
  onLoadWorkspaceFile?: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tree,
  anomalies,
  onSelectPerson,
  onNavigateTab,
  onLoadDemo,
  onLoadWorkspaceFile,
  onFileUpload,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { t, isRTL } = useLanguage();

  if (!tree) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-100 dark:border-indigo-800">
          <Upload className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
          {t.welcomeTitle}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-8">
          {t.welcomeSubtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileUpload}
            accept=".ged,.gedcom"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            <span>{t.selectGedFile}</span>
          </button>
          <button
            onClick={onLoadDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60 text-gray-800 dark:text-gray-200 font-semibold shadow-sm transition-all cursor-pointer"
          >
            <FolderOpen className="w-5 h-5 text-indigo-500" />
            <span>{t.loadDemoBarkai}</span>
          </button>
          {onLoadWorkspaceFile && (
            <button
              onClick={onLoadWorkspaceFile}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 hover:bg-sky-100 text-sky-800 dark:text-sky-300 font-semibold shadow-sm transition-all cursor-pointer"
            >
              <FolderOpen className="w-5 h-5 text-sky-600" />
              <span>{t.loadWorkspaceGed}</span>
            </button>
          )}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 text-left max-w-xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-200 mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t.privacyGuaranteeTitle}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {t.privacyGuaranteeDesc}
          </p>
        </div>
      </div>
    );
  }

  const individuals = Object.values(tree.individuals);
  const families = Object.values(tree.families);

  const maleCount = individuals.filter((i) => i.sex === 'M').length;
  const femaleCount = individuals.filter((i) => i.sex === 'F').length;

  // Extract date range
  const years: number[] = [];
  for (const indi of individuals) {
    const by = extractYear(indi.birthDate);
    if (by) years.push(by);
    const dy = extractYear(indi.deathDate);
    if (dy) years.push(dy);
  }
  const minYear = years.length ? Math.min(...years) : null;
  const maxYear = years.length ? Math.max(...years) : null;

  // Top locations
  const locationCounts: Record<string, number> = {};
  for (const indi of individuals) {
    for (const loc of [indi.birthPlace, indi.deathPlace]) {
      if (loc && loc.trim()) {
        const cleanLoc = loc.split(',')[0].trim();
        locationCounts[cleanLoc] = (locationCounts[cleanLoc] || 0) + 1;
      }
    }
  }
  const sortedLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Tree Health Metrics
  const withBirth = individuals.filter((i) => i.birthDate).length;
  const birthRate = Math.round((withBirth / individuals.length) * 100) || 0;

  const deceasedCount = individuals.filter((i) => !i.isLiving).length;
  const withDeath = individuals.filter((i) => !i.isLiving && i.deathDate).length;
  const deathRate = deceasedCount ? Math.round((withDeath / deceasedCount) * 100) : 100;

  const errorAnomalies = anomalies.filter((a) => a.severity === 'error');

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-md mb-2 border border-indigo-700/50">
            {t.activeTreeProfile}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {tree.metadata.fileName || 'Active Family Tree'}
          </h2>
          <p className="text-indigo-200 text-sm mt-1 max-w-xl">
            {tree.metadata.source || 'Standard GEDCOM 5.5.1'} • {t.individualsCount(individuals.length)} • {t.familiesCount(families.length)}
            {minYear && maxYear ? ` • ${minYear} – ${maxYear}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow-md hover:bg-indigo-50 transition-colors cursor-pointer"
            title={t.importGed}
          >
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>{t.importGed}</span>
          </button>
          <button
            onClick={() => onNavigateTab('research')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-600 text-white font-bold text-xs border border-indigo-400/40 shadow-md transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{t.aiDiscoveryHub}</span>
          </button>
          <button
            onClick={() => onNavigateTab('kinship')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-600 text-white font-semibold text-xs border border-indigo-400/40 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-indigo-200" />
            <span>{t.kinshipCalculator}</span>
          </button>
        </div>
      </div>

      {/* Quick Tree Sources Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
          <FolderOpen className="w-4 h-4 text-indigo-500" />
          <span>עצים זמינים להחלפה מהירה:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onLoadWorkspaceFile && (
            <button
              onClick={onLoadWorkspaceFile}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                tree.metadata.fileName?.includes('Barkai Danny') || tree.metadata.fileName?.includes('Barkai')
                  ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-700 dark:text-sky-300 ring-2 ring-sky-400/30'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              📄 Barkai Danny Familytree.ged (עץ ראשי)
            </button>
          )}
          <button
            onClick={onLoadDemo}
            className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
              tree.metadata.fileName?.includes('Demo')
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-400/30'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            🌳 עץ מורחב לדוגמה (4 דורות)
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Individuals */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.individuals}</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {individuals.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t.maleFemaleCount(maleCount, femaleCount)}
          </div>
        </div>

        {/* Total Families */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.families}</span>
            <Home className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {families.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t.lineageConnections}
          </div>
        </div>

        {/* Date Span */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.dateSpan}</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">
            {minYear && maxYear ? `${maxYear - minYear} ${isRTL ? 'שנים' : 'yrs'}` : '—'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            {minYear && maxYear ? `${minYear} – ${maxYear}` : '—'}
          </div>
        </div>

        {/* Anomalies & Health */}
        <div
          onClick={() => onNavigateTab('quality')}
          className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm cursor-pointer hover:border-indigo-400 transition-colors"
        >
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t.treeHealth}</span>
            <HeartPulse className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              {anomalies.length}
            </span>
            {errorAnomalies.length > 0 ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold">
                {t.errorsCount(errorAnomalies.length)}
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                {t.goodStatus}
              </span>
            )}
          </div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1 flex items-center gap-1">
            <span>{t.inspectAnomalies}</span>
            <ArrowIcon className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Middle Row: Tree Health Progress & Top Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quality Progress */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-indigo-500" />
            <span>{t.treeCompletenessTitle}</span>
          </h3>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              <span>{t.birthDatesRecorded}</span>
              <span>{birthRate}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${birthRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              <span>{t.deathDatesRecorded}</span>
              <span>{deathRate}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${deathRate}%` }}
              />
            </div>
          </div>

          <div className="pt-2 text-xs text-gray-500 dark:text-gray-400">
            {t.missingBirthCountNote(individuals.length - withBirth)}
          </div>
        </div>

        {/* Top Locations Cloud */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" />
            <span>{t.keyGeographicOrigins}</span>
          </h3>

          <div className="flex flex-wrap gap-2 pt-1">
            {sortedLocations.length > 0 ? (
              sortedLocations.map(([loc, count]) => (
                <div
                  key={loc}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 text-xs font-semibold"
                >
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{loc}</span>
                  <span className="text-[10px] bg-indigo-200/60 dark:bg-indigo-800 px-1.5 py-0.2 rounded-full font-bold">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">{t.noLocationsRecorded}</p>
            )}
          </div>
        </div>
      </div>

      {/* Featured Individuals Preview */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            <span>{t.featuredIndividuals}</span>
          </h3>
          <button
            onClick={() => onNavigateTab('directory')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{t.viewAllCount(individuals.length)}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {individuals.slice(0, 6).map((indi) => (
            <div
              key={indi.id}
              onClick={() => onSelectPerson(indi)}
              className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700/70 hover:border-indigo-500 dark:hover:border-indigo-500 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {indi.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {indi.sex === 'M' ? t.male : indi.sex === 'F' ? t.female : '—'} • {indi.id}
                  </p>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    indi.isLiving
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {indi.isLiving ? t.living : t.deceased}
                </span>
              </div>

              <div className="mt-3 text-xs text-gray-600 dark:text-gray-300 space-y-1">
                {indi.birthDate && <div>{t.birth}: {indi.birthDate}</div>}
                {indi.birthPlace && <div className="truncate">{t.place}: {indi.birthPlace}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
