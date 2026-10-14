import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Key,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import {
  getStoredApiKey,
  setStoredApiKey,
  getStoredModel,
  setStoredModel,
} from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetTree: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetTree,
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-2.0-flash');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApiKey(getStoredApiKey());
    setModel(getStoredModel());
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(apiKey);
    setStoredModel(model);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                {t.settingsModalTitle}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.settingsModalSubtitle}
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
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t.geminiApiKeyLabel}</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
              >
                <span>{t.getFreeKey}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {t.apiKeyStorageNote}
            </p>
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t.modelSelectLabel}</span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (מומלץ - מהיר עם חיפוש רשת חי)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (יציב ויעיל)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (הסקה עמוקה ומורכבת)</option>
            </select>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.zeroTelemetryTitle}</span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
              {t.zeroTelemetryDesc}
            </p>
          </div>

          {/* Reset Tree Cache */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {t.clearTreeCacheTitle}
              </div>
              <div className="text-[11px] text-gray-400">
                {t.clearTreeCacheDesc}
              </div>
            </div>
            <button
              type="button"
              onClick={onResetTree}
              className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearTreeAction}</span>
            </button>
          </div>

          {/* Footer Save */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.savedAction}</span>
                </>
              ) : (
                <span>{t.saveSettingsAction}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
