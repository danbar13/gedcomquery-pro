import React, { useState } from 'react';
import {
  X,
  Download,
  FileCode,
  FileSpreadsheet,
  FileJson,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { GedcomTree } from '../types/gedcom';
import {
  serializeToGedcom,
  exportToCSV,
  exportToJSON,
  buildAIBiographyPrompt,
} from '../services/gedcomSerializer';
import { useLanguage } from '../context/LanguageContext';

interface ExportModalProps {
  tree: GedcomTree;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ tree, isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const individuals = Object.values(tree.individuals);
  const [selectedIndiId, setSelectedIndiId] = useState<string>(individuals[0]?.id || '');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);

  const selectedIndi = tree.individuals[selectedIndiId] || individuals[0];
  const aiPrompt = selectedIndi ? buildAIBiographyPrompt(selectedIndi, tree) : '';

  const handleDownloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportedFormat(filename);
    setTimeout(() => setExportedFormat(null), 3000);
  };

  const handleExportGedcom = () => {
    const gedText = serializeToGedcom(tree);
    const baseName = (tree.metadata.fileName || 'exported_tree').replace(/\.[^/.]+$/, '');
    handleDownloadFile(gedText, `${baseName}_updated.ged`, 'text/plain;charset=utf-8');
  };

  const handleExportCSV = () => {
    const csvText = exportToCSV(individuals);
    handleDownloadFile(csvText, `tree_individuals.csv`, 'text/csv;charset=utf-8');
  };

  const handleExportJSON = () => {
    const jsonText = exportToJSON(tree);
    handleDownloadFile(jsonText, `tree_data.json`, 'application/json;charset=utf-8');
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                {t.exportModalTitle}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.exportModalSubtitle}
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
          {/* File Formats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Standard GEDCOM */}
            <button
              onClick={handleExportGedcom}
              className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 hover:border-emerald-500 transition-all text-left group cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 w-fit mb-3">
                <FileCode className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                {t.gedcomExportTitle}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                {t.gedcomExportDesc}
              </p>
            </button>

            {/* CSV Spreadsheet */}
            <button
              onClick={handleExportCSV}
              className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 hover:border-emerald-500 transition-all text-left group cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 w-fit mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                {t.csvExportTitle}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                {t.csvExportDesc}
              </p>
            </button>

            {/* JSON Data */}
            <button
              onClick={handleExportJSON}
              className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800 hover:border-emerald-500 transition-all text-left group cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 w-fit mb-3">
                <FileJson className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                {t.jsonExportTitle}
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                {t.jsonExportDesc}
              </p>
            </button>
          </div>

          {exportedFormat && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{t.downloadedFileNotice(exportedFormat)}</span>
            </div>
          )}

          {/* AI Biography Prompt Builder */}
          <div className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>{t.aiBiographyPromptTitle}</span>
              </h4>

              <div className="flex items-center gap-2">
                <select
                  value={selectedIndiId}
                  onChange={(e) => setSelectedIndiId(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  {individuals.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleCopyPrompt}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.copiedStoryPromptAction}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.copyStoryPromptAction}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t.aiBiographyPromptDesc(selectedIndi?.name || '')}
            </p>

            <textarea
              readOnly
              rows={6}
              value={aiPrompt}
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-mono text-[11px] focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end bg-gray-50/50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 text-xs font-bold transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
