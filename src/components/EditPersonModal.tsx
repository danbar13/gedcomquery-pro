import React, { useState } from 'react';
import {
  X,
  Save,
  UserPlus,
} from 'lucide-react';
import { Individual, GedcomTree, Sex, RelativeRole } from '../types/gedcom';
import { useLanguage } from '../context/LanguageContext';

interface EditPersonModalProps {
  person: Individual;
  tree: GedcomTree;
  isOpen: boolean;
  onClose: () => void;
  onSavePerson: (updated: Individual) => void;
  onAddRelative: (
    relativeRole: RelativeRole,
    newPerson: Partial<Individual>
  ) => void;
  initialTab?: 'edit' | 'add_relative';
}

export const EditPersonModal: React.FC<EditPersonModalProps> = ({
  person,
  isOpen,
  onClose,
  onSavePerson,
  onAddRelative,
  initialTab = 'edit',
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'edit' | 'add_relative'>(initialTab);

  // Edit Form State
  const [name, setName] = useState(person.name);
  const [givenName, setGivenName] = useState(person.givenName);
  const [surname, setSurname] = useState(person.surname);
  const [sex, setSex] = useState<Sex>(person.sex);
  const [birthDate, setBirthDate] = useState(person.birthDate);
  const [birthPlace, setBirthPlace] = useState(person.birthPlace);
  const [deathDate, setDeathDate] = useState(person.deathDate);
  const [deathPlace, setDeathPlace] = useState(person.deathPlace);
  const [isLiving, setIsLiving] = useState<boolean>(person.isLiving ?? true);
  const [notes, setNotes] = useState<string>(person.notes.join('\n\n'));

  // Add Relative Form State
  const [relativeRole, setRelativeRole] = useState<RelativeRole>('father');
  const [relSex, setRelSex] = useState<Sex>('M');
  const [relGivenName, setRelGivenName] = useState('');
  const [relSurname, setRelSurname] = useState(person.surname || '');
  const [relBirthDate, setRelBirthDate] = useState('');
  const [relBirthPlace, setRelBirthPlace] = useState('');
  const [relNotes, setRelNotes] = useState('');

  const handleSelectRole = (role: RelativeRole) => {
    setRelativeRole(role);
    if (role === 'father' || role === 'brother') {
      setRelSex('M');
    } else if (role === 'mother' || role === 'sister') {
      setRelSex('F');
    } else if (role === 'spouse') {
      setRelSex(person.sex === 'M' ? 'F' : 'M');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Individual = {
      ...person,
      name: name.trim() || `${givenName} ${surname}`.trim(),
      givenName: givenName.trim(),
      surname: surname.trim(),
      sex,
      birthDate: birthDate.trim(),
      birthPlace: birthPlace.trim(),
      deathDate: deathDate.trim(),
      deathPlace: deathPlace.trim(),
      isLiving,
      notes: notes.trim() ? notes.split('\n\n').filter(Boolean) : [],
    };
    onSavePerson(updated);
    onClose();
  };

  const handleCreateRelative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relGivenName && !relSurname) return;

    onAddRelative(relativeRole, {
      givenName: relGivenName.trim(),
      surname: relSurname.trim(),
      name: `${relGivenName} ${relSurname}`.trim(),
      sex: relSex,
      birthDate: relBirthDate.trim(),
      birthPlace: relBirthPlace.trim(),
      notes: relNotes.trim() ? [relNotes.trim()] : [],
      isLiving: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
              {activeTab === 'edit' ? t.editRecordTitle(person.name) : t.attachRelativeToTitle(person.name)}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.tableId}: {person.id}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'edit'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs font-bold'
                    : 'text-gray-500'
                }`}
              >
                {t.editDetailsTab}
              </button>
              <button
                onClick={() => setActiveTab('add_relative')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'add_relative'
                    ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs font-bold'
                    : 'text-gray-500'
                }`}
              >
                {t.addRelativeTab}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'edit' ? (
            <form id="edit-person-form" onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.givenNameLabel}
                  </label>
                  <input
                    type="text"
                    value={givenName}
                    onChange={(e) => {
                      setGivenName(e.target.value);
                      setName(`${e.target.value} ${surname}`.trim());
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.surnameLabel}
                  </label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => {
                      setSurname(e.target.value);
                      setName(`${givenName} ${e.target.value}`.trim());
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.genderLabel}
                  </label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value as Sex)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="M">{t.male} (M)</option>
                    <option value="F">{t.female} (F)</option>
                    <option value="U">Unknown (U)</option>
                  </select>
                </div>
              </div>

              {/* Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.birthDateLabel}
                  </label>
                  <input
                    type="text"
                    value={birthDate}
                    placeholder="19 FEB 1960 / CIRCA 1930"
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.birthPlaceLabel}
                  </label>
                  <input
                    type="text"
                    value={birthPlace}
                    placeholder="תל אביב, ישראל"
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Living Status */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isLivingCheckbox"
                  checked={isLiving}
                  onChange={(e) => setIsLiving(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="isLivingCheckbox" className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                  {t.personLivingLabel}
                </label>
              </div>

              {/* Death (if not living) */}
              {!isLiving && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {t.deathDateLabel}
                    </label>
                    <input
                      type="text"
                      value={deathDate}
                      placeholder="18 AUG 2012"
                      onChange={(e) => setDeathDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      {t.deathPlaceLabel}
                    </label>
                    <input
                      type="text"
                      value={deathPlace}
                      placeholder="פתח תקווה, ישראל"
                      onChange={(e) => setDeathPlace(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {t.biographicalNotesLabel}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="הערות, מקורות ורשומות..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </form>
          ) : (
            /* Add Relative Tab */
            <form id="add-relative-form" onSubmit={handleCreateRelative} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {t.selectRelationTo(person.name)}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {([
                    { role: 'father' as const, label: t.roleFather },
                    { role: 'mother' as const, label: t.roleMother },
                    { role: 'brother' as const, label: t.roleBrother },
                    { role: 'sister' as const, label: t.roleSister },
                    { role: 'spouse' as const, label: t.roleSpouse },
                    { role: 'child' as const, label: t.roleChild },
                  ]).map(({ role, label }) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleSelectRole(role)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        relativeRole === role
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/30'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.givenNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={relGivenName}
                    placeholder="שם פרטי"
                    onChange={(e) => setRelGivenName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.surnameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={relSurname}
                    placeholder="שם משפחה"
                    onChange={(e) => setRelSurname(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.genderLabel}
                  </label>
                  <select
                    value={relSex}
                    onChange={(e) => setRelSex(e.target.value as Sex)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="M">{t.male} (M)</option>
                    <option value="F">{t.female} (F)</option>
                    <option value="U">Unknown (U)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.birthDateLabel} (אופציונלי):
                  </label>
                  <input
                    type="text"
                    value={relBirthDate}
                    placeholder="1950"
                    onChange={(e) => setRelBirthDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    {t.birthPlaceLabel} (אופציונלי):
                  </label>
                  <input
                    type="text"
                    value={relBirthPlace}
                    placeholder="ירושלים, ישראל"
                    onChange={(e) => setRelBirthPlace(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  {t.biographicalNotesLabel} (אופציונלי):
                </label>
                <textarea
                  rows={2}
                  value={relNotes}
                  onChange={(e) => setRelNotes(e.target.value)}
                  placeholder="הערות או מקור..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 text-[11px] text-indigo-700 dark:text-indigo-300">
                {t.autoIdNote}
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            {t.cancel}
          </button>

          {activeTab === 'edit' ? (
            <button
              type="submit"
              form="edit-person-form"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveChanges}</span>
            </button>
          ) : (
            <button
              type="submit"
              form="add-relative-form"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.attachNewRelative}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
