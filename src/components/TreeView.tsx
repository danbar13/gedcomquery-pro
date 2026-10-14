import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Edit3,
  Sparkles,
  GitCommit,
} from 'lucide-react';
import { GedcomTree, Individual } from '../types/gedcom';
import { getParents, getSpouses, getChildren, getSiblings } from '../services/treeGraph';
import { useLanguage } from '../context/LanguageContext';

interface TreeViewProps {
  tree: GedcomTree;
  selectedPersonId: string | null;
  onSelectPerson: (indi: Individual) => void;
  onEditPerson: (indi: Individual) => void;
  onAddRelative: (indi: Individual) => void;
  onResearchPerson: (indi: Individual) => void;
}

export const TreeView: React.FC<TreeViewProps> = ({
  tree,
  selectedPersonId,
  onSelectPerson,
  onEditPerson,
  onAddRelative,
  onResearchPerson,
}) => {
  const { t, isRTL } = useLanguage();
  const individuals = useMemo(() => Object.values(tree.individuals), [tree]);

  // Default focus person: selectedPersonId or first individual
  const [focusId, setFocusId] = useState<string>(
    selectedPersonId || (individuals[0] ? individuals[0].id : '')
  );

  React.useEffect(() => {
    if (selectedPersonId && selectedPersonId !== focusId) {
      setFocusId(selectedPersonId);
    }
  }, [selectedPersonId]);

  const focusPerson = tree.individuals[focusId] || individuals[0];

  if (!focusPerson) {
    return (
      <div className="p-8 text-center text-gray-500">
        {t.noLocationsRecorded}
      </div>
    );
  }

  const parents = getParents(tree, focusPerson.id);
  const spouses = getSpouses(tree, focusPerson.id);
  const children = getChildren(tree, focusPerson.id);
  const siblings = getSiblings(tree, focusPerson.id);

  // Grandparents
  const paternalGrandparents = parents[0] ? getParents(tree, parents[0].id) : [];
  const maternalGrandparents = parents[1] ? getParents(tree, parents[1].id) : [];

  const renderPersonCard = (
    indi: Individual | null,
    role: string,
    isFocus = false
  ) => {
    if (!indi) {
      return (
        <div className="w-56 p-3 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20 text-center text-xs text-gray-400 flex flex-col items-center justify-center min-h-[90px]">
          <span>{t.noRecordForRole(role)}</span>
          {isFocus === false && (
            <button
              onClick={() => onAddRelative(focusPerson)}
              className="mt-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="w-3 h-3" /> {t.addRelativeAction} ({role})
            </button>
          )}
        </div>
      );
    }

    return (
      <div
        className={`w-60 p-4 rounded-2xl transition-all cursor-pointer relative group ${
          isFocus
            ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400'
            : 'bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 text-gray-800 dark:text-gray-100 shadow-sm'
        }`}
        onClick={() => {
          setFocusId(indi.id);
          onSelectPerson(indi);
        }}
      >
        <div className="flex items-start justify-between">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              isFocus
                ? 'bg-indigo-800/80 text-indigo-100'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            {role}
          </span>
          <span
            className={`text-[10px] font-semibold ${
              isFocus ? 'text-indigo-200' : 'text-gray-400'
            }`}
          >
            {indi.sex === 'M' ? `♂ ${t.male}` : indi.sex === 'F' ? `♀ ${t.female}` : '—'}
          </span>
        </div>

        <h4 className="font-extrabold text-sm mt-2 truncate">{indi.name}</h4>

        <div
          className={`text-xs mt-1 space-y-0.5 ${
            isFocus ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <div className="truncate">
            {indi.birthDate ? `* ${indi.birthDate}` : '* —'}
          </div>
          {indi.birthPlace && <div className="truncate">📍 {indi.birthPlace}</div>}
        </div>

        {/* Action icons on hover */}
        <div
          className="mt-3 pt-2 border-t border-white/20 dark:border-gray-700 flex items-center justify-between text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onResearchPerson(indi)}
            className={`p-1 rounded hover:bg-white/20 transition-colors cursor-pointer ${
              isFocus ? 'text-indigo-100' : 'text-indigo-600 dark:text-indigo-400'
            }`}
            title={t.researchAction}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onAddRelative(indi)}
              className={`p-1 rounded hover:bg-white/20 transition-colors cursor-pointer ${
                isFocus ? 'text-indigo-100' : 'text-emerald-600 dark:text-emerald-400'
              }`}
              title={t.addRelativeAction}
            >
              <UserPlus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEditPerson(indi)}
              className={`p-1 rounded hover:bg-white/20 transition-colors cursor-pointer ${
                isFocus ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
              }`}
              title={t.editAction}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Selector & Switcher Header */}
      <div className="p-4 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              {t.pedigreeLineageGraph}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t.pedigreeDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
            {t.centerPerson}
          </label>
          <select
            value={focusId}
            onChange={(e) => {
              setFocusId(e.target.value);
              if (tree.individuals[e.target.value]) {
                onSelectPerson(tree.individuals[e.target.value]);
              }
            }}
            className="w-full sm:w-64 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            {individuals.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Pedigree & Descendant Chart Canvas */}
      <div className="p-8 rounded-3xl bg-slate-50/70 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 shadow-inner overflow-x-auto">
        <div className="min-w-[760px] flex flex-col items-center gap-8">
          {/* LEVEL 1: Grandparents (Generational Ancestors) */}
          <div>
            <div className="text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
              {t.gen1Grandparents}
            </div>
            <div className="flex items-center justify-center gap-4">
              {renderPersonCard(paternalGrandparents[0] || null, t.paternalGrandfather)}
              {renderPersonCard(paternalGrandparents[1] || null, t.paternalGrandmother)}
              <div className="w-6" />
              {renderPersonCard(maternalGrandparents[0] || null, t.maternalGrandfather)}
              {renderPersonCard(maternalGrandparents[1] || null, t.maternalGrandmother)}
            </div>
          </div>

          <div className="w-12 h-6 border-b-2 border-indigo-200 dark:border-indigo-900" />

          {/* LEVEL 2: Parents */}
          <div>
            <div className="text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
              {t.gen2Parents}
            </div>
            <div className="flex items-center justify-center gap-8">
              {renderPersonCard(parents[0] || null, t.father)}
              {renderPersonCard(parents[1] || null, t.mother)}
            </div>
          </div>

          <div className="w-12 h-6 border-b-2 border-indigo-400 dark:border-indigo-600" />

          {/* LEVEL 3: Focus Person, Spouses & Siblings */}
          <div className="w-full">
            <div className="text-center text-[11px] font-bold uppercase tracking-wider text-indigo-500 mb-3">
              {t.gen3FocusHousehold}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Siblings */}
              {siblings.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase text-center">
                    {t.siblings}
                  </span>
                  {siblings.map((sib) => (
                    <div key={sib.id}>{renderPersonCard(sib, t.siblings)}</div>
                  ))}
                </div>
              )}

              {/* The Focus Person Card */}
              <div className="scale-105 transform">
                {renderPersonCard(focusPerson, t.focusPersonLabel, true)}
              </div>

              {/* Spouses */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase text-center">
                  {t.spouses}
                </span>
                {spouses.length > 0 ? (
                  spouses.map(({ spouse }) => (
                    <div key={spouse.id}>{renderPersonCard(spouse, t.spouses)}</div>
                  ))
                ) : (
                  <div className="w-56 p-3 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20 text-center text-xs text-gray-400 flex flex-col items-center justify-center min-h-[90px]">
                    <span>{t.noSpouseRecorded}</span>
                    <button
                      onClick={() => onAddRelative(focusPerson)}
                      className="mt-1.5 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3 h-3" /> {t.addRelativeAction} ({t.spouses})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-12 h-6 border-b-2 border-indigo-400 dark:border-indigo-600" />

          {/* LEVEL 4: Children & Descendants */}
          <div className="w-full">
            <div className="text-center text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
              {t.gen4Children}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {children.length > 0 ? (
                children.map((child) => (
                  <div key={child.id}>{renderPersonCard(child, t.roleChild)}</div>
                ))
              ) : (
                <div className="w-60 p-4 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center text-xs text-gray-400">
                  <span>{t.noChildrenForPerson}</span>
                  <button
                    onClick={() => onAddRelative(focusPerson)}
                    className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> {t.addRelativeAction} ({t.roleChild})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
