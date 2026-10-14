import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { DirectoryView } from './components/DirectoryView';
import { TreeView } from './components/TreeView';
import { KinshipView } from './components/KinshipView';
import { DataQualityView } from './components/DataQualityView';
import { ResearchHubView } from './components/ResearchHubView';
import { EditPersonModal } from './components/EditPersonModal';
import { DiscoveryReviewModal } from './components/DiscoveryReviewModal';
import { ExportModal } from './components/ExportModal';
import { SettingsModal } from './components/SettingsModal';

import {
  GedcomTree,
  Individual,
  Family,
  ValidationAnomaly,
  ResearchDiscovery,
  ProposedField,
  RelativeRole,
} from './types/gedcom';
import { parseGedcom } from './services/gedcomParser';
import { getDemoTree, loadWorkspaceFamilyTree } from './services/demoData';
import { validateTree } from './services/validator';
import { researchIndividual } from './services/geminiService';
import {
  saveTreeToStorage,
  loadTreeFromStorage,
  clearTreeStorage,
} from './services/storage';
import { ingestGedcomFile } from './services/fileIngestion';
import { useLanguage } from './context/LanguageContext';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  X,
  LayoutDashboard,
  GitBranch,
  Users,
  Compass,
  AlertTriangle,
  Menu,
} from 'lucide-react';

interface ToastMessage {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export function App() {
  const { t, isRTL } = useLanguage();
  const [tree, setTree] = useState<GedcomTree | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Loading & Ingestion feedback state
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestingFileName, setIngestingFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('gedcomquery_dark_mode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  // Active Person & Modals State
  const [selectedPerson, setSelectedPerson] = useState<Individual | null>(null);
  const [editingPerson, setEditingPerson] = useState<Individual | null>(null);
  const [editModalTab, setEditModalTab] = useState<'edit' | 'add_relative'>('edit');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [researchingPerson, setResearchingPerson] = useState<Individual | null>(null);
  const [activeDiscovery, setActiveDiscovery] = useState<ResearchDiscovery | null>(null);
  const [isResearchLoading, setIsResearchLoading] = useState(false);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [preselectedKinshipA, setPreselectedKinshipA] = useState<string | null>(null);

  const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
    setToast({ type, title, message });
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Dark Mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gedcomquery_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gedcomquery_dark_mode', 'false');
    }
  }, [darkMode]);

  // Helper to commit tree updates to state and storage
  const updateTree = useCallback(async (newTree: GedcomTree) => {
    setTree(newTree);
    await saveTreeToStorage(newTree);
  }, []);

  // Initial Load: Load the workspace Barkai Danny Familytree.ged as requested by user
  useEffect(() => {
    async function initTree() {
      try {
        const text = await loadWorkspaceFamilyTree();
        const workspaceTree = parseGedcom(text, 'Barkai Danny Familytree.ged');
        await updateTree(workspaceTree);
        showToast(
          'success',
          isRTL ? 'נטען עץ ברירת המחדל' : 'Default Tree Loaded',
          isRTL
            ? `קובץ Barkai Danny Familytree.ged נטען בהצלחה (${Object.keys(workspaceTree.individuals).length} נפשות, ${Object.keys(workspaceTree.families).length} משפחות).`
            : `Loaded Barkai Danny Familytree.ged (${Object.keys(workspaceTree.individuals).length} individuals, ${Object.keys(workspaceTree.families).length} families).`
        );
      } catch (err) {
        console.warn('Fallback to demo tree:', err);
        const demo = getDemoTree();
        await updateTree(demo);
      }
    }
    initTree();
  }, [updateTree, isRTL, showToast]);

  // Compute Anomalies
  const anomalies = useMemo<ValidationAnomaly[]>(() => {
    if (!tree) return [];
    return validateTree(tree);
  }, [tree]);

  // Process Ingestion of any File (Drag & Drop or File Input)
  const processFileIngestion = useCallback(
    async (file: File) => {
      setIsIngesting(true);
      setIngestingFileName(file.name);

      try {
        // Small delay for UI smoothness so user sees the loading state clearly
        await new Promise((r) => setTimeout(r, 200));

        const result = await ingestGedcomFile(file);
        await updateTree(result.tree);
        setCurrentTab('dashboard');

        showToast(
          'success',
          isRTL ? 'הקובץ נטען ופוענח בהצלחה!' : 'File Ingested Successfully!',
          isRTL
            ? `${result.fileName} • ${result.individualCount} נפשות • ${result.familyCount} משפחות (קידוד: ${result.encodingUsed})`
            : `${result.fileName} • ${result.individualCount} individuals • ${result.familyCount} families (${result.encodingUsed})`
        );
      } catch (err: any) {
        console.error('File ingestion error:', err);
        showToast(
          'error',
          isRTL ? 'שגיאה בטעינת הקובץ' : 'Error Reading File',
          err.message || (isRTL ? 'לא ניתן לפענח את קובץ ה-GEDCOM. אנא ודאו את תקינותו.' : 'Failed to parse GEDCOM file.')
        );
      } finally {
        setIsIngesting(false);
        setIngestingFileName('');
      }
    },
    [updateTree, isRTL, showToast]
  );

  // Handle File Input Change
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      processFileIngestion(file);
      e.target.value = '';
    },
    [processFileIngestion]
  );

  // Load Demo Tree
  const handleLoadDemo = useCallback(async () => {
    const demo = getDemoTree();
    await updateTree(demo);
    setCurrentTab('dashboard');
    showToast(
      'info',
      isRTL ? 'עץ לדוגמה נטען' : 'Demo Tree Loaded',
      isRTL ? 'עץ מורחב בן 4 דורות מוכן לחקירה' : '4-generation demo tree ready for exploration'
    );
  }, [updateTree, isRTL, showToast]);

  // Load Workspace Barkai Danny Familytree.ged
  const handleLoadWorkspaceTree = useCallback(async () => {
    setIsIngesting(true);
    setIngestingFileName('Barkai Danny Familytree.ged');
    try {
      await new Promise((r) => setTimeout(r, 150));
      const text = await loadWorkspaceFamilyTree();
      const parsed = parseGedcom(text, 'Barkai Danny Familytree.ged');
      await updateTree(parsed);
      setCurrentTab('dashboard');
      showToast(
        'success',
        isRTL ? 'קובץ Barkai Danny Familytree.ged נטען' : 'Barkai Danny Familytree.ged Loaded',
        isRTL
          ? `נטענו ${Object.keys(parsed.individuals).length} נפשות ו-${Object.keys(parsed.families).length} משפחות מסביבת העבודה.`
          : `Loaded ${Object.keys(parsed.individuals).length} individuals and ${Object.keys(parsed.families).length} families from workspace.`
      );
    } catch {
      showToast('error', 'שגיאה', 'לא ניתן לטעון את קובץ סביבת העבודה.');
    } finally {
      setIsIngesting(false);
      setIngestingFileName('');
    }
  }, [updateTree, isRTL, showToast]);

  // Window-level Drag and Drop Listeners
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.types?.includes('Files')) {
        setIsDragOver(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Only set false if leaving window
      if (!e.relatedTarget || (e.clientX <= 0 && e.clientY <= 0)) {
        setIsDragOver(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer?.files?.[0];
      if (file) {
        processFileIngestion(file);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [processFileIngestion]);

  // Reset Tree
  const handleResetTree = useCallback(async () => {
    const confirmMsg = isRTL
      ? 'האם אתם בטוחים שברצונכם לאפס את עץ הנתונים מהזיכרון המקומי? תוכלו לטעון מחדש את העץ או קובץ אחר בכל עת.'
      : 'Are you sure you want to clear the local tree? You can re-import or load the demo anytime.';

    if (confirm(confirmMsg)) {
      await clearTreeStorage();
      setTree(null);
      setIsSettingsOpen(false);
      setCurrentTab('dashboard');
    }
  }, [isRTL]);

  // Save Person Edits
  const handleSavePerson = useCallback(
    async (updated: Individual) => {
      if (!tree) return;
      const updatedIndis = { ...tree.individuals, [updated.id]: updated };
      const updatedTree: GedcomTree = {
        ...tree,
        individuals: updatedIndis,
      };
      await updateTree(updatedTree);
      if (selectedPerson?.id === updated.id) {
        setSelectedPerson(updated);
      }
      showToast('success', isRTL ? 'רשומה עודכנה' : 'Record Updated', `${updated.name}`);
    },
    [tree, selectedPerson, updateTree, isRTL, showToast]
  );

  // Add Relative (Auto generate GEDCOM ID @I_NEW_xxxx@ and @F_NEW_xxxx@)
  const handleAddRelative = useCallback(
    async (
      relativeRole: RelativeRole,
      newPersonData: Partial<Individual>
    ) => {
      if (!tree || !editingPerson) return;

      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const newIndiId = `@I_NEW_${randomSuffix}@`;
      const newFamId = `@F_NEW_${randomSuffix}@`;

      const defaultSex =
        newPersonData.sex ||
        (relativeRole === 'father' || relativeRole === 'brother'
          ? 'M'
          : relativeRole === 'mother' || relativeRole === 'sister'
          ? 'F'
          : 'U');

      const newIndi: Individual = {
        id: newIndiId,
        name: newPersonData.name || (isRTL ? 'קרוב/ת משפחה חדש/ה' : 'New Relative'),
        givenName: newPersonData.givenName || '',
        surname: newPersonData.surname || '',
        sex: defaultSex,
        birthDate: newPersonData.birthDate || '',
        birthPlace: newPersonData.birthPlace || '',
        deathDate: newPersonData.deathDate || '',
        deathPlace: newPersonData.deathPlace || '',
        famc: null,
        fams: [],
        notes: newPersonData.notes || [],
        customAttributes: {},
        isLiving: newPersonData.isLiving ?? true,
      };

      const updatedIndividuals = { ...tree.individuals, [newIndiId]: newIndi };
      const updatedFamilies = { ...tree.families };

      if (relativeRole === 'father' || relativeRole === 'mother') {
        let famcId = editingPerson.famc;
        if (!famcId || !updatedFamilies[famcId]) {
          famcId = newFamId;
          const newFam: Family = {
            id: famcId,
            husbandId: relativeRole === 'father' ? newIndiId : null,
            wifeId: relativeRole === 'mother' ? newIndiId : null,
            children: [editingPerson.id],
            marriageDate: '',
            marriagePlace: '',
            notes: [],
          };
          updatedFamilies[famcId] = newFam;
          editingPerson.famc = famcId;
          updatedIndividuals[editingPerson.id] = { ...editingPerson, famc: famcId };
        } else {
          const existingFam = { ...updatedFamilies[famcId] };
          if (relativeRole === 'father') existingFam.husbandId = newIndiId;
          if (relativeRole === 'mother') existingFam.wifeId = newIndiId;
          updatedFamilies[famcId] = existingFam;
        }
        newIndi.fams = [famcId];
      } else if (relativeRole === 'spouse') {
        const famId = newFamId;
        const newFam: Family = {
          id: famId,
          husbandId: editingPerson.sex === 'M' ? editingPerson.id : newIndiId,
          wifeId: editingPerson.sex === 'F' ? editingPerson.id : newIndiId,
          children: [],
          marriageDate: '',
          marriagePlace: '',
          notes: [],
        };
        updatedFamilies[famId] = newFam;
        newIndi.fams = [famId];

        const updatedPerson = {
          ...editingPerson,
          fams: [...editingPerson.fams, famId],
        };
        updatedIndividuals[editingPerson.id] = updatedPerson;
      } else if (relativeRole === 'child') {
        let famsId = editingPerson.fams[0];
        if (!famsId || !updatedFamilies[famsId]) {
          famsId = newFamId;
          const newFam: Family = {
            id: famsId,
            husbandId: editingPerson.sex === 'M' ? editingPerson.id : null,
            wifeId: editingPerson.sex === 'F' ? editingPerson.id : null,
            children: [newIndiId],
            marriageDate: '',
            marriagePlace: '',
            notes: [],
          };
          updatedFamilies[famsId] = newFam;
          const updatedPerson = {
            ...editingPerson,
            fams: [...editingPerson.fams, famsId],
          };
          updatedIndividuals[editingPerson.id] = updatedPerson;
        } else {
          const existingFam = { ...updatedFamilies[famsId] };
          if (!existingFam.children.includes(newIndiId)) {
            existingFam.children = [...existingFam.children, newIndiId];
          }
          updatedFamilies[famsId] = existingFam;
        }
        newIndi.famc = famsId;
      } else if (relativeRole === 'brother' || relativeRole === 'sister') {
        let famcId = editingPerson.famc;
        if (!famcId || !updatedFamilies[famcId]) {
          famcId = newFamId;
          const newFam: Family = {
            id: famcId,
            husbandId: null,
            wifeId: null,
            children: [editingPerson.id, newIndiId],
            marriageDate: '',
            marriagePlace: '',
            notes: [],
          };
          updatedFamilies[famcId] = newFam;
          editingPerson.famc = famcId;
          updatedIndividuals[editingPerson.id] = { ...editingPerson, famc: famcId };
        } else {
          const existingFam = { ...updatedFamilies[famcId] };
          const childrenSet = new Set(existingFam.children);
          childrenSet.add(editingPerson.id);
          childrenSet.add(newIndiId);
          existingFam.children = Array.from(childrenSet);
          updatedFamilies[famcId] = existingFam;
        }
        newIndi.famc = famcId;
      }

      const updatedTree: GedcomTree = {
        ...tree,
        individuals: updatedIndividuals,
        families: updatedFamilies,
      };

      await updateTree(updatedTree);
      showToast('success', isRTL ? 'קרוב/ה נוספו בהצלחה' : 'Relative Added', `${newIndi.name} (${newIndiId})`);
    },
    [tree, editingPerson, updateTree, isRTL, showToast]
  );

  // Trigger Research Discovery
  const handleLaunchResearch = useCallback(
    async (person: Individual) => {
      if (!tree) return;
      setResearchingPerson(person);
      setIsResearchLoading(true);
      setIsDiscoveryModalOpen(true);
      setActiveDiscovery(null);

      try {
        const discovery = await researchIndividual(person, tree);
        setActiveDiscovery(discovery);
      } catch (err) {
        console.error('Research failed:', err);
      } finally {
        setIsResearchLoading(false);
      }
    },
    [tree]
  );

  // Accept a single proposed research field (Human-in-the-Loop)
  const handleAcceptDiscoveryField = useCallback(
    async (field: ProposedField) => {
      if (!tree || !researchingPerson) return;

      const currentIndi = { ...tree.individuals[researchingPerson.id] };

      switch (field.field) {
        case 'birthDate':
          currentIndi.birthDate = field.proposedValue;
          break;
        case 'birthPlace':
          currentIndi.birthPlace = field.proposedValue;
          break;
        case 'deathDate':
          currentIndi.deathDate = field.proposedValue;
          currentIndi.isLiving = false;
          break;
        case 'deathPlace':
          currentIndi.deathPlace = field.proposedValue;
          break;
        case 'note':
          currentIndi.notes = [...currentIndi.notes, field.proposedValue];
          break;
        case 'father':
        case 'mother':
        case 'spouse':
          currentIndi.notes = [
            ...currentIndi.notes,
            `${isRTL ? 'ממצא ארכיוני' : 'Archival Discovery'} (${field.label}): ${field.proposedValue} [${isRTL ? 'מקור' : 'Source'}: ${field.source}]`,
          ];
          break;
      }

      await handleSavePerson(currentIndi);
      setResearchingPerson(currentIndi);
    },
    [tree, researchingPerson, handleSavePerson, isRTL]
  );

  // Accept all proposed research fields
  const handleAcceptAllDiscoveryFields = useCallback(
    async (fields: ProposedField[]) => {
      for (const f of fields) {
        await handleAcceptDiscoveryField(f);
      }
    },
    [handleAcceptDiscoveryField]
  );

  // Quick navigation to Kinship
  const handleStartKinship = useCallback((person: Individual) => {
    setPreselectedKinshipA(person.id);
    setCurrentTab('kinship');
  }, []);

  // Quick open Edit modal
  const handleOpenEdit = useCallback((person: Individual, tab: 'edit' | 'add_relative' = 'edit') => {
    setEditingPerson(person);
    setEditModalTab(tab);
    setIsEditModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold border ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-indigo-600 text-white border-indigo-500'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-white" />
            )}
            <div>
              <div className="font-bold">{toast.title}</div>
              <div className="opacity-90 text-[11px] font-normal">{toast.message}</div>
            </div>
            <button
              onClick={() => setToast(null)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Global Drag-and-Drop Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 z-50 bg-indigo-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 border-4 border-dashed border-white m-4 rounded-3xl animate-in fade-in duration-150">
          <Upload className="w-16 h-16 mb-4 animate-bounce text-indigo-200" />
          <h2 className="text-2xl font-black mb-2">
            {isRTL ? 'שחררו את קובץ ה-GEDCOM כאן' : 'Drop your GEDCOM file here'}
          </h2>
          <p className="text-sm text-indigo-200">
            {isRTL ? 'הקובץ ייטען ויפוענח באופן מיידי בתוך הדפדפן' : 'File will be instantly parsed locally in your browser'}
          </p>
        </div>
      )}

      {/* Loading & Parsing Spinner Overlay */}
      {isIngesting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 animate-in fade-in duration-150">
          <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col items-center max-w-sm text-center">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-1">
              {isRTL ? 'טוען ומפענח את קובץ ה-GEDCOM...' : 'Loading and Parsing GEDCOM...'}
            </h3>
            <p className="text-xs text-gray-500 font-mono truncate max-w-[260px]">
              {ingestingFileName || 'Reading file...'}
            </p>
            <p className="text-[11px] text-gray-400 mt-3">
              {isRTL ? 'הפענוח מתבצע 100% מקומית בדפדפן' : '100% processed client-side in browser'}
            </p>
          </div>
        </div>
      )}

      {/* Top Header */}
      <Header
        tree={tree}
        onLoadDemo={handleLoadDemo}
        onLoadWorkspaceFile={handleLoadWorkspaceTree}
        onFileUpload={handleFileUpload}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onToggleMobileMenu={() => setMobileNavOpen((prev) => !prev)}
      />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          anomalyCount={anomalies.length}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />

        {/* Tab Views Content Area */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">
          {currentTab === 'dashboard' && (
            <DashboardView
              tree={tree}
              anomalies={anomalies}
              onSelectPerson={(p) => {
                setSelectedPerson(p);
                handleOpenEdit(p, 'edit');
              }}
              onNavigateTab={setCurrentTab}
              onLoadDemo={handleLoadDemo}
              onLoadWorkspaceFile={handleLoadWorkspaceTree}
              onFileUpload={handleFileUpload}
            />
          )}

          {currentTab === 'directory' && tree && (
            <DirectoryView
              tree={tree}
              onSelectPerson={(p) => handleOpenEdit(p, 'edit')}
              onEditPerson={(p) => handleOpenEdit(p, 'edit')}
              onResearchPerson={handleLaunchResearch}
              onKinshipPerson={handleStartKinship}
              onAddRelative={(p) => handleOpenEdit(p, 'add_relative')}
            />
          )}

          {currentTab === 'tree' && tree && (
            <TreeView
              tree={tree}
              selectedPersonId={selectedPerson?.id || null}
              onSelectPerson={setSelectedPerson}
              onEditPerson={(p) => handleOpenEdit(p, 'edit')}
              onAddRelative={(p) => handleOpenEdit(p, 'add_relative')}
              onResearchPerson={handleLaunchResearch}
            />
          )}

          {currentTab === 'kinship' && tree && (
            <KinshipView
              tree={tree}
              preselectedAId={preselectedKinshipA}
              onSelectPerson={setSelectedPerson}
            />
          )}

          {currentTab === 'quality' && tree && (
            <DataQualityView
              tree={tree}
              anomalies={anomalies}
              onSelectPerson={(p) => handleOpenEdit(p, 'edit')}
              onEditPerson={(p) => handleOpenEdit(p, 'edit')}
              onResearchPerson={handleLaunchResearch}
            />
          )}

          {currentTab === 'research' && tree && (
            <ResearchHubView
              tree={tree}
              onResearchPerson={handleLaunchResearch}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {currentTab === 'export' && tree && (
            <div className="max-w-2xl mx-auto py-8">
              <div className="p-8 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-800 text-center space-y-4">
                <h3 className="text-xl font-black">{t.exportModalTitle}</h3>
                <p className="text-xs text-gray-500">
                  {t.exportModalSubtitle}
                </p>
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {t.export}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 md:hidden flex items-center justify-around py-1 px-1 shadow-lg">
        <button
          onClick={() => {
            setCurrentTab('dashboard');
            setMobileNavOpen(false);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            currentTab === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="truncate max-w-[55px]">{t.navDashboard}</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('tree');
            setMobileNavOpen(false);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            currentTab === 'tree'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <GitBranch className="w-5 h-5" />
          <span className="truncate max-w-[55px]">{t.navTree}</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('directory');
            setMobileNavOpen(false);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            currentTab === 'directory'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="truncate max-w-[55px]">{t.navDirectory}</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('kinship');
            setMobileNavOpen(false);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold transition-all cursor-pointer ${
            currentTab === 'kinship'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="truncate max-w-[55px]">{t.navKinship}</span>
        </button>

        <button
          onClick={() => {
            setCurrentTab('quality');
            setMobileNavOpen(false);
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold relative transition-all cursor-pointer ${
            currentTab === 'quality'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <div className="relative">
            <AlertTriangle className="w-5 h-5" />
            {anomalies.length > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center">
                {anomalies.length}
              </span>
            )}
          </div>
          <span className="truncate max-w-[55px]">{t.navQuality}</span>
        </button>

        <button
          onClick={() => setMobileNavOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 transition-all cursor-pointer"
        >
          <Menu className="w-5 h-5" />
          <span>{isRTL ? 'עוד' : 'More'}</span>
        </button>
      </nav>

      {/* Edit Person & Add Relative Modal */}
      {isEditModalOpen && editingPerson && tree && (
        <EditPersonModal
          person={editingPerson}
          tree={tree}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSavePerson={handleSavePerson}
          onAddRelative={handleAddRelative}
          initialTab={editModalTab}
        />
      )}

      {/* Discovery Review Diff Modal */}
      {isDiscoveryModalOpen && (
        <DiscoveryReviewModal
          isOpen={isDiscoveryModalOpen}
          onClose={() => setIsDiscoveryModalOpen(false)}
          discovery={activeDiscovery}
          isLoading={isResearchLoading}
          person={researchingPerson}
          onAcceptField={handleAcceptDiscoveryField}
          onAcceptAll={handleAcceptAllDiscoveryFields}
        />
      )}

      {/* Export Modal */}
      {isExportOpen && tree && (
        <ExportModal
          tree={tree}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onResetTree={handleResetTree}
        />
      )}
    </div>
  );
}

export default App;
