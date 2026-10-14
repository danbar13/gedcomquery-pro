import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { GedcomTree, Individual } from '../types/gedcom';
import { getStoredApiKey } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

interface ResearchHubViewProps {
  tree: GedcomTree;
  onResearchPerson: (indi: Individual) => void;
  onOpenSettings: () => void;
}

export const ResearchHubView: React.FC<ResearchHubViewProps> = ({
  tree,
  onResearchPerson,
  onOpenSettings,
}) => {
  const { t } = useLanguage();
  const [selectedIndiId, setSelectedIndiId] = useState<string>('');
  const [filterType, setFilterType] = useState<'ALL' | 'MISSING_DATES' | 'MISSING_PARENTS'>('MISSING_DATES');

  const apiKey = getStoredApiKey();
  const individuals = Object.values(tree.individuals);

  // Filter prime candidates for enrichment
  const candidates = individuals.filter((indi) => {
    if (filterType === 'MISSING_DATES') {
      return !indi.birthDate || (!indi.isLiving && !indi.deathDate);
    }
    if (filterType === 'MISSING_PARENTS') {
      return !indi.famc;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-sky-300 bg-sky-950/60 px-2.5 py-1 rounded-md mb-2 border border-sky-700/50">
            {t.aiDiscoveryHub}
          </span>
          <h2 className="text-2xl font-black">
            {t.discoveryHubTitle}
          </h2>
          <p className="text-indigo-200 text-xs mt-1 max-w-xl">
            {t.discoveryHubDesc}
          </p>
        </div>

        {apiKey ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{t.apiKeyConnected}</span>
          </div>
        ) : (
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.addApiKeyPrompt}</span>
          </button>
        )}
      </div>

      {/* Manual Person Selector for Research */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-500" />
          <span>{t.researchSpecificPerson}</span>
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedIndiId}
            onChange={(e) => setSelectedIndiId(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">{t.choosePersonPlaceholder}</option>
            {individuals.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.id}) {i.birthPlace ? `• ${i.birthPlace}` : ''}
              </option>
            ))}
          </select>

          <button
            disabled={!selectedIndiId}
            onClick={() => {
              if (tree.individuals[selectedIndiId]) {
                onResearchPerson(tree.individuals[selectedIndiId]);
              }
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.startResearchGrounding}</span>
          </button>
        </div>
      </div>

      {/* Research Candidates List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
              {t.highPriorityCandidates}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t.highPriorityCandidatesDesc}
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-900 text-xs font-semibold">
            <button
              onClick={() => setFilterType('MISSING_DATES')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'MISSING_DATES'
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-xs font-bold'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t.filterMissingDates}
            </button>
            <button
              onClick={() => setFilterType('MISSING_PARENTS')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'MISSING_PARENTS'
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-xs font-bold'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t.filterMissingParents}
            </button>
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-xs font-bold'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t.allFilter(individuals.length)}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((indi) => (
            <div
              key={indi.id}
              className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    {indi.name}
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400">{indi.id}</span>
                </div>

                <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">{t.birth}:</span>
                    <span className={indi.birthDate ? '' : 'text-amber-600 dark:text-amber-400 font-semibold'}>
                      {indi.birthDate || t.missingCandidate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">{t.place}:</span>
                    <span>{indi.birthPlace || '—'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">{t.parentsInTree}</span>
                    <span className={indi.famc ? '' : 'text-sky-600 dark:text-sky-400 font-semibold'}>
                      {indi.famc ? t.parentsLinked : t.noneLinked}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onResearchPerson(indi)}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{t.launchDiscoveryAction}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
