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
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  getStoredApiKey,
  setStoredApiKey,
  getStoredModel,
  setStoredModel,
  testAndListModels,
  isViableTextModel,
  AvailableModel,
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
  const [model, setModel] = useState('gemini-2.5-flash');
  const [saved, setSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [dynamicModels, setDynamicModels] = useState<AvailableModel[]>([]);

  useEffect(() => {
    setApiKey(getStoredApiKey());
    const stored = getStoredModel();
    if (!isViableTextModel(stored) || stored.includes('lite')) {
      setModel('gemini-2.5-flash');
      setStoredModel('gemini-2.5-flash');
    } else {
      setModel(stored);
    }
    setTestStatus(null);
  }, [isOpen]);

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestStatus({
        type: 'error',
        message: 'אנא הזינו מפתח API לפני הבדיקה.',
      });
      return;
    }

    setIsTesting(true);
    setTestStatus(null);

    try {
      const res = await testAndListModels(apiKey);
      if (res.success && res.models.length > 0) {
        const viable = res.models.filter((m) => isViableTextModel(m.id));
        setDynamicModels(viable);
        setTestStatus({
          type: 'success',
          message: t.apiKeyValid(viable.length),
        });

        // Auto select best model if current not in list or not viable
        const ids = viable.map((m) => m.id);
        if (!ids.includes(model) || !isViableTextModel(model) || model.includes('lite')) {
          const nextModel =
            res.bestModel && ids.includes(res.bestModel)
              ? res.bestModel
              : viable[0]?.id || 'gemini-2.5-flash';
          setModel(nextModel);
          setStoredModel(nextModel);
        }
      } else {
        setTestStatus({
          type: 'error',
          message: res.error || t.apiKeyInvalid,
        });
      }
    } catch (err: any) {
      setTestStatus({
        type: 'error',
        message: err?.message || 'שגיאת תקשורת בבדיקת המפתח.',
      });
    } finally {
      setIsTesting(false);
    }
  };

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
          <div className="space-y-2">
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

            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestStatus(null);
                }}
                placeholder="AIzaSy..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleTestKey}
                disabled={isTesting || !apiKey.trim()}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800/80 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t.testingApiKey}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.testApiKeyButton}</span>
                  </>
                )}
              </button>
            </div>

            {/* Test Status Feedback Alert */}
            {testStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 animate-in fade-in duration-200 ${
                  testStatus.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                }`}
              >
                {testStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                )}
                <div className="leading-relaxed whitespace-pre-line">{testStatus.message}</div>
              </div>
            )}

            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {t.apiKeyStorageNote}
            </p>
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t.modelSelectLabel}</span>
              </label>
              {dynamicModels.length > 0 && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {t.customModelNote}
                </span>
              )}
            </div>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {dynamicModels.length > 0 ? (
                dynamicModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id === 'gemini-2.5-flash'
                      ? '⭐ Gemini 2.5 Flash (מומלץ ע"י Google - מהיר, חינמי ועדכני)'
                      : m.id === 'gemini-2.0-flash'
                      ? 'Gemini 2.0 Flash (מהיר, חינמי ויציב)'
                      : m.id === 'gemini-2.5-pro'
                      ? 'Gemini 2.5 Pro (הסקה עמוקה ומתקדמת)'
                      : m.id.includes('1.5-flash')
                      ? `Gemini 1.5 Flash (${m.id})`
                      : `${m.displayName || m.id} (${m.id})`}
                  </option>
                ))
              ) : (
                <>
                  <option value="gemini-2.5-flash">⭐ Gemini 2.5 Flash (מומלץ ע"י Google - מהיר, חינמי ועדכני)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (מהיר, חינמי ויציב)</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (הסקה עמוקה)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (יציב, מכסה חינמית)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (הסקה עמוקה ומורכבת)</option>
                </>
              )}
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
