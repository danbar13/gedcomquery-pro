import React, { useState, useMemo } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Link2,
} from 'lucide-react';
import { GedcomTree, Individual, KinshipResult } from '../types/gedcom';
import { calculateKinship } from '../services/treeGraph';
import { useLanguage } from '../context/LanguageContext';

interface KinshipViewProps {
  tree: GedcomTree;
  preselectedAId?: string | null;
  onSelectPerson: (indi: Individual) => void;
}

export const KinshipView: React.FC<KinshipViewProps> = ({
  tree,
  preselectedAId,
  onSelectPerson,
}) => {
  const { t, isRTL, lang } = useLanguage();
  const individuals = useMemo(() => Object.values(tree.individuals), [tree]);

  const [personAId, setPersonAId] = useState<string>(
    preselectedAId || (individuals[0] ? individuals[0].id : '')
  );
  const [personBId, setPersonBId] = useState<string>(
    individuals[1] ? individuals[1].id : (individuals[0] ? individuals[0].id : '')
  );

  React.useEffect(() => {
    if (preselectedAId && tree.individuals[preselectedAId]) {
      setPersonAId(preselectedAId);
    }
  }, [preselectedAId, tree]);

  const kinshipResult = useMemo<KinshipResult | null>(() => {
    if (!personAId || !personBId) return null;
    return calculateKinship(tree, personAId, personBId);
  }, [tree, personAId, personBId]);

  const handleSwap = () => {
    const temp = personAId;
    setPersonAId(personBId);
    setPersonBId(temp);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title & Explainer Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Compass className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              {t.kinshipTitle}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t.kinshipSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Selector Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Person A */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {t.personASource}
            </label>
            <select
              value={personAId}
              onChange={(e) => setPersonAId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {individuals.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.id})
                </option>
              ))}
            </select>
            {tree.individuals[personAId] && (
              <p className="text-[11px] text-gray-400">
                {tree.individuals[personAId].birthDate || '—'} • {tree.individuals[personAId].birthPlace || '—'}
              </p>
            )}
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
              title={t.swapPersons}
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Person B */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {t.personBTarget}
            </label>
            <select
              value={personBId}
              onChange={(e) => setPersonBId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {individuals.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.id})
                </option>
              ))}
            </select>
            {tree.individuals[personBId] && (
              <p className="text-[11px] text-gray-400">
                {tree.individuals[personBId].birthDate || '—'} • {tree.individuals[personBId].birthPlace || '—'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Result Display */}
      {kinshipResult ? (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-indigo-950/40 dark:via-gray-800 dark:to-gray-900 border border-indigo-200 dark:border-indigo-900/60 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-3 py-1 rounded-full">
              {t.calculatedKinshipBadge}
            </span>

            {/* Bilingual Relationship Names */}
            <h3 className="text-3xl font-black text-gray-900 dark:text-white">
              {lang === 'he' ? kinshipResult.relationshipHe : kinshipResult.relationshipEn}
            </h3>
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
              {lang === 'he' ? kinshipResult.relationshipEn : kinshipResult.relationshipHe}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t.kinshipExplanation(
                kinshipResult.personB.name,
                lang === 'he' ? kinshipResult.relationshipHe : kinshipResult.relationshipEn,
                kinshipResult.personA.name,
                kinshipResult.degrees
              )}
            </p>
          </div>

          {/* Breadcrumb Path Visualization */}
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-800/90 border border-indigo-100 dark:border-gray-700">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-indigo-500" />
              <span>{t.connectionPathTitle(kinshipResult.path.length)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {kinshipResult.path.map((indi, idx) => {
                const isStart = idx === 0;
                const isEnd = idx === kinshipResult.path.length - 1;

                return (
                  <React.Fragment key={indi.id}>
                    <div
                      onClick={() => onSelectPerson(indi)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                        isStart
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : isEnd
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-indigo-50 hover:text-indigo-600'
                      }`}
                      title={indi.name}
                    >
                      <div className="font-bold">{indi.name}</div>
                      <div className="text-[10px] opacity-80">{indi.id}</div>
                    </div>

                    {idx < kinshipResult.path.length - 1 && (
                      <ArrowIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 text-center text-gray-500 text-sm">
          {t.noKinshipFound}
        </div>
      )}
    </div>
  );
};
