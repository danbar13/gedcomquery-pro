import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { GedcomTree, ValidationAnomaly, Individual } from '../types/gedcom';
import { useLanguage } from '../context/LanguageContext';

interface DataQualityViewProps {
  tree: GedcomTree;
  anomalies: ValidationAnomaly[];
  onSelectPerson: (indi: Individual) => void;
  onEditPerson: (indi: Individual) => void;
  onResearchPerson: (indi: Individual) => void;
}

export const DataQualityView: React.FC<DataQualityViewProps> = ({
  tree,
  anomalies,
  onSelectPerson,
  onEditPerson,
  onResearchPerson,
}) => {
  const { t, lang } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | 'error' | 'warning' | 'info'>('ALL');

  const filteredAnomalies = anomalies.filter((a) => {
    if (filter === 'ALL') return true;
    return a.severity === filter;
  });

  const errorCount = anomalies.filter((a) => a.severity === 'error').length;
  const warningCount = anomalies.filter((a) => a.severity === 'warning').length;
  const infoCount = anomalies.filter((a) => a.severity === 'info').length;

  // Localized anomaly descriptions for Hebrew
  const getLocalizedAnomaly = (anom: ValidationAnomaly) => {
    if (lang !== 'he') {
      return { description: anom.description, details: anom.details };
    }

    switch (anom.type) {
      case 'death_before_birth':
        return {
          description: 'תאריך פטירה קודם לתאריך הלידה',
          details: anom.details.replace('Recorded birth is', 'לידה רשומה:').replace('but recorded death is', 'אך פטירה רשומה:'),
        };
      case 'implausible_lifespan':
        return {
          description: 'אורך חיים חריג (מעל 115 שנים)',
          details: anom.details.replace('Calculated lifespan is', 'אורך חיים מחושב:').replace('years', 'שנים').replace('Born in', 'נולד/ה ב-').replace('with no recorded death date', 'ללא תאריך פטירה רשום.'),
        };
      case 'parent_born_after_child':
        return {
          description: 'הורה נולד לאחר הילד/ה',
          details: anom.details.replace('Parent', 'הורה').replace('was born in', 'נולד/ה ב-').replace("which is after child's birth in", 'שזה אחרי שנת לידת הילד/ה:'),
        };
      case 'parent_too_young':
        return {
          description: 'הורה צעיר מדי בעת לידת הילד (פחות מגיל 13)',
          details: anom.details.replace('Parent', 'הורה').replace('was approximately', 'היה/היתה כבן/בת').replace('years old when', 'שנים בעת לידת').replace('was born', ''),
        };
      case 'parent_too_old':
        return {
          description: 'הורה מבוגר באופן חריג בעת לידת הילד (מעל גיל 70)',
          details: anom.details.replace('Parent', 'הורה').replace('was approximately', 'היה/היתה כבן/בת').replace('years old when', 'שנים בעת לידת').replace('was born', ''),
        };
      case 'missing_birth':
        return {
          description: 'חסר תאריך לידה',
          details: 'לא תועד תאריך לידה. מועמד מוביל להעשרת מידע מארכיונים דיגיטליים.',
        };
      case 'missing_death':
        return {
          description: 'חסר תאריך פטירה עבור אדם היסטורי / שנפטר',
          details: 'מוגדר כנפטר/ת או אדם מתקופה קדומה אך ללא תאריך פטירה או תיעוד קבורה.',
        };
      default:
        return { description: anom.description, details: anom.details };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              {t.qualityTitle}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t.qualitySubtitle}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-900 text-xs font-semibold">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'ALL'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-xs font-bold'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {t.allFilter(anomalies.length)}
          </button>
          <button
            onClick={() => setFilter('error')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'error'
                ? 'bg-white dark:bg-gray-800 text-rose-600 shadow-xs font-bold'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {t.errorsFilter(errorCount)}
          </button>
          <button
            onClick={() => setFilter('warning')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'warning'
                ? 'bg-white dark:bg-gray-800 text-amber-600 shadow-xs font-bold'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {t.warningsFilter(warningCount)}
          </button>
          <button
            onClick={() => setFilter('info')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'info'
                ? 'bg-white dark:bg-gray-800 text-sky-600 shadow-xs font-bold'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {t.candidatesFilter(infoCount)}
          </button>
        </div>
      </div>

      {/* Anomalies List */}
      {filteredAnomalies.length > 0 ? (
        <div className="space-y-3">
          {filteredAnomalies.map((anom) => {
            const indi = tree.individuals[anom.individualId];
            const loc = getLocalizedAnomaly(anom);

            return (
              <div
                key={anom.id}
                className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5">
                    {anom.severity === 'error' ? (
                      <AlertCircle className="w-5 h-5 text-rose-500" />
                    ) : anom.severity === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-sky-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                        {loc.description}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          anom.severity === 'error'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : anom.severity === 'warning'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                        }`}
                      >
                        {anom.severity === 'error' ? (lang === 'he' ? 'שגיאה' : 'error') : anom.severity === 'warning' ? (lang === 'he' ? 'אזהרה' : 'warning') : (lang === 'he' ? 'מידע' : 'info')}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      {loc.details}
                    </p>

                    <div className="text-[11px] text-gray-400 mt-1">
                      {t.targetLabel}: <span className="font-semibold text-gray-700 dark:text-gray-300">{anom.individualName}</span> ({anom.individualId})
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {indi && (
                    <>
                      <button
                        onClick={() => onResearchPerson(indi)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors cursor-pointer"
                        title={t.aiResearchAction}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>{t.aiResearchAction}</span>
                      </button>

                      <button
                        onClick={() => onEditPerson(indi)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-semibold transition-colors cursor-pointer"
                        title={t.fixRecordAction}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{t.fixRecordAction}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-base text-gray-900 dark:text-white">
            {t.noIssuesFoundTitle}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {t.noIssuesFoundDesc}
          </p>
        </div>
      )}
    </div>
  );
};
