import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  CheckCheck,
  ExternalLink,
  Globe,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { Individual, ResearchDiscovery, ProposedField } from '../types/gedcom';
import { useLanguage } from '../context/LanguageContext';

interface DiscoveryReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  discovery: ResearchDiscovery | null;
  isLoading: boolean;
  person: Individual | null;
  onAcceptField: (field: ProposedField) => void;
  onAcceptAll: (fields: ProposedField[]) => void;
}

export const DiscoveryReviewModal: React.FC<DiscoveryReviewModalProps> = ({
  isOpen,
  onClose,
  discovery,
  isLoading,
  person,
  onAcceptField,
  onAcceptAll,
}) => {
  const { t, lang } = useLanguage();
  if (!isOpen) return null;

  const [acceptedFields, setAcceptedFields] = useState<Record<string, boolean>>({});

  const handleToggleAccept = (field: ProposedField) => {
    const nextState = !acceptedFields[field.field];
    setAcceptedFields({
      ...acceptedFields,
      [field.field]: nextState,
    });
    if (nextState) {
      onAcceptField(field);
    }
  };

  const handleAcceptAllClick = () => {
    if (!discovery) return;
    const allMap: Record<string, boolean> = {};
    for (const f of discovery.proposedFields) {
      allMap[f.field] = true;
    }
    setAcceptedFields(allMap);
    onAcceptAll(discovery.proposedFields);
  };

  const getLocalizedFieldLabel = (field: ProposedField) => {
    if (lang !== 'he') return field.label;
    switch (field.field) {
      case 'birthDate': return 'תאריך לידה';
      case 'birthPlace': return 'מקום לידה';
      case 'deathDate': return 'תאריך פטירה';
      case 'deathPlace': return 'מקום פטירה';
      case 'father': return 'אב';
      case 'mother': return 'אם';
      case 'spouse': return 'בן/בת זוג';
      case 'note': return 'הערה ביוגרפית / ארכיונית';
      default: return field.label;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <span>{t.reviewModalTitle}</span>
                {discovery?.groundingEnabled ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center gap-1">
                    <Globe className="w-3 h-3" /> {t.groundedSearchBadge}
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                    {t.historicalSynthesisBadge}
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.targetLabel}: <span className="font-semibold text-gray-700 dark:text-gray-200">{person?.name}</span> ({person?.id})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <h4 className="font-bold text-base text-gray-800 dark:text-gray-200">
                {t.searchingRecordsTitle}
              </h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                {t.searchingRecordsDesc}
              </p>
            </div>
          ) : discovery ? (
            <>
              {/* Diff Comparison Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>{t.proposedEnrichmentsTitle}</span>
                  </h4>

                  <button
                    onClick={handleAcceptAllClick}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>{t.acceptAllAction}</span>
                  </button>
                </div>

                {discovery.proposedFields.length > 0 ? (
                  <div className="space-y-3">
                    {discovery.proposedFields.map((field) => {
                      const isAccepted = acceptedFields[field.field];

                      return (
                        <div
                          key={field.field}
                          className={`p-4 rounded-2xl border transition-all ${
                            isAccepted
                              ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                              : 'border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                                {getLocalizedFieldLabel(field)}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                  field.confidence === 'high'
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : field.confidence === 'medium'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {field.confidence === 'high' ? t.highConfidence : field.confidence === 'medium' ? t.mediumConfidence : t.lowConfidence}
                              </span>
                            </div>

                            <button
                              onClick={() => handleToggleAccept(field)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isAccepted
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-white dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isAccepted ? t.acceptedBadge : t.acceptFieldAction}</span>
                            </button>
                          </div>

                          {/* Side-by-Side Comparison */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                                {t.currentTreeValue}
                              </span>
                              <div className="text-gray-600 dark:text-gray-300 font-medium">
                                {field.currentValue || '(ריק)'}
                              </div>
                            </div>

                            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60">
                              <span className="text-[10px] font-bold text-indigo-500 uppercase block mb-1">
                                {t.proposedWebFinding}
                              </span>
                              <div className="text-indigo-950 dark:text-indigo-200 font-bold">
                                {field.proposedValue}
                              </div>
                            </div>
                          </div>

                          {/* Source Citation */}
                          <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-between">
                            <span>
                              {t.sourceLabel} <span className="font-semibold">{field.source}</span>
                            </span>
                            {field.citationUrl && (
                              <a
                                href={field.citationUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
                              >
                                <span>{t.verifySource}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    לא הוצעו שינויים לשדות אלו.
                  </p>
                )}
              </div>

              {/* Biographical Synthesis */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
                <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  {t.narrativeSummaryTitle}
                </h4>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {discovery.biographicalSummary}
                </p>
              </div>

              {/* Source Records */}
              {discovery.sources.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t.citationsReferencesTitle}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {discovery.sources.map((src, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-xs"
                      >
                        <div className="font-bold text-gray-900 dark:text-white flex items-center justify-between">
                          <span className="truncate">{src.title}</span>
                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-500 hover:text-indigo-700 ml-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        {src.snippet && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {src.snippet}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-gray-500 text-xs">
              אין נתונים פעילים.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <span className="text-[11px] text-gray-500">
            {t.humanInLoopNote}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 text-xs font-bold transition-colors cursor-pointer"
          >
            {t.doneReviewingAction}
          </button>
        </div>
      </div>
    </div>
  );
};
