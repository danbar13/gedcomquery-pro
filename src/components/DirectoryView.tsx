import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  Edit3,
  Compass,
  UserPlus,
  MapPin,
  Calendar,
  Copy,
  Check,
} from 'lucide-react';
import { GedcomTree, Individual } from '../types/gedcom';
import { extractYear } from '../services/gedcomParser';
import { buildAIBiographyPrompt } from '../services/gedcomSerializer';
import { useLanguage } from '../context/LanguageContext';

interface DirectoryViewProps {
  tree: GedcomTree;
  onSelectPerson: (indi: Individual) => void;
  onEditPerson: (indi: Individual) => void;
  onResearchPerson: (indi: Individual) => void;
  onKinshipPerson: (indi: Individual) => void;
  onAddRelative: (indi: Individual) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  tree,
  onSelectPerson,
  onEditPerson,
  onResearchPerson,
  onKinshipPerson,
  onAddRelative,
}) => {
  const { t, isRTL } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVING' | 'DECEASED'>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'birth' | 'death' | 'id'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const individuals = useMemo(() => Object.values(tree.individuals), [tree]);

  // Extract all distinct location tags for filter
  const uniqueLocations = useMemo(() => {
    const locSet = new Set<string>();
    for (const indi of individuals) {
      if (indi.birthPlace) locSet.add(indi.birthPlace.split(',')[0].trim());
      if (indi.deathPlace) locSet.add(indi.deathPlace.split(',')[0].trim());
    }
    return Array.from(locSet).filter(Boolean).sort();
  }, [individuals]);

  // Multilingual & fuzzy search matching
  const filteredIndividuals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return individuals.filter((indi) => {
      // Gender filter
      if (genderFilter !== 'ALL' && indi.sex !== genderFilter) return false;

      // Status filter
      if (statusFilter === 'LIVING' && !indi.isLiving) return false;
      if (statusFilter === 'DECEASED' && indi.isLiving) return false;

      // Location filter
      if (selectedLocation !== 'ALL') {
        const hasBirthLoc = indi.birthPlace.toLowerCase().includes(selectedLocation.toLowerCase());
        const hasDeathLoc = indi.deathPlace.toLowerCase().includes(selectedLocation.toLowerCase());
        if (!hasBirthLoc && !hasDeathLoc) return false;
      }

      // Search query (names, places, notes, years, IDs)
      if (q) {
        const matchesName = (indi.name || '').toLowerCase().includes(q);
        const matchesGiven = (indi.givenName || '').toLowerCase().includes(q);
        const matchesSurn = (indi.surname || '').toLowerCase().includes(q);
        const matchesBirthPlace = (indi.birthPlace || '').toLowerCase().includes(q);
        const matchesDeathPlace = (indi.deathPlace || '').toLowerCase().includes(q);
        const matchesBirthDate = (indi.birthDate || '').toLowerCase().includes(q);
        const matchesDeathDate = (indi.deathDate || '').toLowerCase().includes(q);
        const matchesId = (indi.id || '').toLowerCase().includes(q);
        const matchesNotes = indi.notes.some((n) => n.toLowerCase().includes(q));

        if (
          !matchesName &&
          !matchesGiven &&
          !matchesSurn &&
          !matchesBirthPlace &&
          !matchesDeathPlace &&
          !matchesBirthDate &&
          !matchesDeathDate &&
          !matchesId &&
          !matchesNotes
        ) {
          return false;
        }
      }

      return true;
    });
  }, [individuals, searchQuery, genderFilter, statusFilter, selectedLocation]);

  // Sorting
  const sortedIndividuals = useMemo(() => {
    return [...filteredIndividuals].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') {
        cmp = (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'birth') {
        const yA = extractYear(a.birthDate) || 0;
        const yB = extractYear(b.birthDate) || 0;
        cmp = yA - yB;
      } else if (sortBy === 'death') {
        const yA = extractYear(a.deathDate) || 0;
        const yB = extractYear(b.deathDate) || 0;
        cmp = yA - yB;
      } else if (sortBy === 'id') {
        cmp = a.id.localeCompare(b.id);
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [filteredIndividuals, sortBy, sortOrder]);

  const handleCopyPrompt = (e: React.MouseEvent, indi: Individual) => {
    e.stopPropagation();
    const prompt = buildAIBiographyPrompt(indi, tree);
    navigator.clipboard.writeText(prompt);
    setCopiedPromptId(indi.id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className={`w-5 h-5 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-gray-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer`}
              >
                {t.clear}
              </button>
            )}
          </div>

          {/* Controls: View toggle & Sort */}
          <div className="flex items-center gap-3">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, ord] = e.target.value.split('-') as [any, any];
                setSortBy(by);
                setSortOrder(ord);
              }}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="name-asc">{t.sortNameAsc}</option>
              <option value="name-desc">{t.sortNameDesc}</option>
              <option value="birth-asc">{t.sortBirthAsc}</option>
              <option value="birth-desc">{t.sortBirthDesc}</option>
              <option value="id-asc">{t.sortIdAsc}</option>
            </select>

            <div className="flex items-center rounded-xl border border-gray-200 dark:border-gray-700 p-0.5 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Table view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
          <span className="text-gray-500 font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> {t.filters}
          </span>

          {/* Gender */}
          <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-900 p-0.5">
            <button
              onClick={() => setGenderFilter('ALL')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                genderFilter === 'ALL'
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 font-bold shadow-xs'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t.allGenders}
            </button>
            <button
              onClick={() => setGenderFilter('M')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                genderFilter === 'M'
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 font-bold shadow-xs'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t.male}
            </button>
            <button
              onClick={() => setGenderFilter('F')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                genderFilter === 'F'
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 font-bold shadow-xs'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t.female}
            </button>
          </div>

          {/* Status */}
          <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-900 p-0.5">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 font-bold shadow-xs'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t.allStatus}
            </button>
            <button
              onClick={() => setStatusFilter('LIVING')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                statusFilter === 'LIVING'
                  ? 'bg-white dark:bg-gray-800 text-emerald-600 font-bold shadow-xs'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t.living}
            </button>
            <button
              onClick={() => setStatusFilter('DECEASED')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                statusFilter === 'DECEASED'
                  ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold shadow-xs'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {t.deceased}
            </button>
          </div>

          {/* Location Dropdown */}
          {uniqueLocations.length > 0 && (
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">{t.allLocations}</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          )}

          <span className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-gray-400 text-xs`}>
            {t.showingRecords(sortedIndividuals.length, individuals.length)}
          </span>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedIndividuals.map((indi) => (
            <div
              key={indi.id}
              onClick={() => onSelectPerson(indi)}
              className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {indi.name}
                    </h3>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {indi.id} • {indi.sex === 'M' ? t.male : indi.sex === 'F' ? t.female : '—'}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      indi.isLiving
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {indi.isLiving ? t.living : t.deceased}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">
                      {indi.birthDate || '—'}
                      {indi.deathDate ? ` — ${indi.deathDate}` : ''}
                    </span>
                  </div>
                  {(indi.birthPlace || indi.deathPlace) && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{indi.birthPlace || indi.deathPlace}</span>
                    </div>
                  )}
                  {indi.notes.length > 0 && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 italic pt-1">
                      "{indi.notes[0]}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div
                className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-1 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onResearchPerson(indi)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold transition-colors cursor-pointer"
                  title={t.researchAction}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{t.researchAction}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onKinshipPerson(indi)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    title={t.kinshipAction}
                  >
                    <Compass className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onAddRelative(indi)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
                    title={t.addRelativeAction}
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleCopyPrompt(e, indi)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-sky-600 transition-colors cursor-pointer"
                    title={t.copyPromptAction}
                  >
                    {copiedPromptId === indi.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onEditPerson(indi)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    title={t.editAction}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/80 shadow-sm">
          <table className="w-full text-left border-collapse text-xs" dir={isRTL ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700/80 bg-gray-50/80 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-semibold">
                <th className="p-3">{t.tableId}</th>
                <th className="p-3">{t.tableName}</th>
                <th className="p-3">{t.tableSex}</th>
                <th className="p-3">{t.tableBirth}</th>
                <th className="p-3">{t.tableDeath}</th>
                <th className="p-3">{t.tableStatus}</th>
                <th className="p-3 text-right">{t.tableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
              {sortedIndividuals.map((indi) => (
                <tr
                  key={indi.id}
                  onClick={() => onSelectPerson(indi)}
                  className="hover:bg-indigo-50/40 dark:hover:bg-gray-700/40 cursor-pointer transition-colors"
                >
                  <td className="p-3 font-mono text-[11px] text-gray-500">{indi.id}</td>
                  <td className="p-3 font-bold text-gray-900 dark:text-white">{indi.name}</td>
                  <td className="p-3">{indi.sex === 'M' ? t.male : indi.sex === 'F' ? t.female : '—'}</td>
                  <td className="p-3">
                    <div>{indi.birthDate || '—'}</div>
                    <div className="text-[11px] text-gray-400">{indi.birthPlace}</div>
                  </td>
                  <td className="p-3">
                    <div>{indi.deathDate || '—'}</div>
                    <div className="text-[11px] text-gray-400">{indi.deathPlace}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        indi.isLiving
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {indi.isLiving ? t.living : t.deceased}
                    </span>
                  </td>
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onResearchPerson(indi)}
                        className="p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-950 text-indigo-600 transition-colors cursor-pointer"
                        title={t.researchAction}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onKinshipPerson(indi)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
                        title={t.kinshipAction}
                      >
                        <Compass className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEditPerson(indi)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
                        title={t.editAction}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
