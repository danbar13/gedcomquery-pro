export type Language = 'he' | 'en';

export interface Translations {
  appName: string;
  appTagline: string;
  clientPrivacyBadge: string;
  loadDemoTree: string;
  demoTreeShort: string;
  workspaceGed: string;
  importGed: string;
  export: string;
  settings: string;
  lightMode: string;
  darkMode: string;
  individualsCount: (count: number) => string;
  familiesCount: (count: number) => string;
  
  // Navigation Sidebar
  navDashboard: string;
  navTree: string;
  navDirectory: string;
  navKinship: string;
  navQuality: string;
  navResearch: string;
  navExport: string;

  // Dashboard
  welcomeTitle: string;
  welcomeSubtitle: string;
  selectGedFile: string;
  loadDemoBarkai: string;
  loadWorkspaceGed: string;
  privacyGuaranteeTitle: string;
  privacyGuaranteeDesc: string;
  activeTreeProfile: string;
  aiDiscoveryHub: string;
  kinshipCalculator: string;
  individuals: string;
  maleFemaleCount: (m: number, f: number) => string;
  families: string;
  lineageConnections: string;
  dateSpan: string;
  treeHealth: string;
  goodStatus: string;
  errorsCount: (n: number) => string;
  inspectAnomalies: string;
  treeCompletenessTitle: string;
  birthDatesRecorded: string;
  deathDatesRecorded: string;
  missingBirthCountNote: (n: number) => string;
  keyGeographicOrigins: string;
  noLocationsRecorded: string;
  featuredIndividuals: string;
  viewAllCount: (n: number) => string;
  living: string;
  deceased: string;
  birth: string;
  death: string;
  place: string;

  // Directory & Filters
  searchPlaceholder: string;
  clear: string;
  sortNameAsc: string;
  sortNameDesc: string;
  sortBirthAsc: string;
  sortBirthDesc: string;
  sortIdAsc: string;
  filters: string;
  allGenders: string;
  male: string;
  female: string;
  allStatus: string;
  allLocations: string;
  showingRecords: (showing: number, total: number) => string;
  researchAction: string;
  kinshipAction: string;
  addRelativeAction: string;
  copyPromptAction: string;
  copiedPrompt: string;
  editAction: string;
  tableId: string;
  tableName: string;
  tableSex: string;
  tableBirth: string;
  tableDeath: string;
  tableStatus: string;
  tableActions: string;

  // Interactive Tree
  pedigreeLineageGraph: string;
  pedigreeDesc: string;
  centerPerson: string;
  gen1Grandparents: string;
  gen2Parents: string;
  gen3FocusHousehold: string;
  gen4Children: string;
  father: string;
  mother: string;
  paternalGrandfather: string;
  paternalGrandmother: string;
  maternalGrandfather: string;
  maternalGrandmother: string;
  spouses: string;
  siblings: string;
  childrenTitle: string;
  focusPersonLabel: string;
  noRecordForRole: (role: string) => string;
  noChildrenForPerson: string;
  noSpouseRecorded: string;

  // Kinship Calculator
  kinshipTitle: string;
  kinshipSubtitle: string;
  personASource: string;
  personBTarget: string;
  swapPersons: string;
  calculatedKinshipBadge: string;
  kinshipExplanation: (personB: string, rel: string, personA: string, deg: number) => string;
  degreeWord: (deg: number) => string;
  connectionPathTitle: (n: number) => string;
  noKinshipFound: string;

  // Quality & Anomalies
  qualityTitle: string;
  qualitySubtitle: string;
  allFilter: (n: number) => string;
  errorsFilter: (n: number) => string;
  warningsFilter: (n: number) => string;
  candidatesFilter: (n: number) => string;
  targetLabel: string;
  fixRecordAction: string;
  aiResearchAction: string;
  noIssuesFoundTitle: string;
  noIssuesFoundDesc: string;

  // Web Discovery & AI
  discoveryHubTitle: string;
  discoveryHubDesc: string;
  apiKeyConnected: string;
  addApiKeyPrompt: string;
  researchSpecificPerson: string;
  choosePersonPlaceholder: string;
  startResearchGrounding: string;
  highPriorityCandidates: string;
  highPriorityCandidatesDesc: string;
  filterMissingDates: string;
  filterMissingParents: string;
  launchDiscoveryAction: string;
  missingCandidate: string;
  parentsInTree: string;
  parentsLinked: string;
  noneLinked: string;

  // Discovery Review Modal
  reviewModalTitle: string;
  groundedSearchBadge: string;
  historicalSynthesisBadge: string;
  proposedEnrichmentsTitle: string;
  acceptAllAction: string;
  acceptFieldAction: string;
  acceptedBadge: string;
  currentTreeValue: string;
  proposedWebFinding: string;
  sourceLabel: string;
  verifySource: string;
  highConfidence: string;
  mediumConfidence: string;
  lowConfidence: string;
  narrativeSummaryTitle: string;
  citationsReferencesTitle: string;
  humanInLoopNote: string;
  doneReviewingAction: string;
  searchingRecordsTitle: string;
  searchingRecordsDesc: string;

  // Edit Person & Add Relative Modal
  editRecordTitle: (name: string) => string;
  attachRelativeToTitle: (name: string) => string;
  editDetailsTab: string;
  addRelativeTab: string;
  givenNameLabel: string;
  surnameLabel: string;
  fullNameLabel: string;
  genderLabel: string;
  birthDateLabel: string;
  birthPlaceLabel: string;
  personLivingLabel: string;
  deathDateLabel: string;
  deathPlaceLabel: string;
  biographicalNotesLabel: string;
  selectRelationTo: (name: string) => string;
  roleFather: string;
  roleMother: string;
  roleBrother: string;
  roleSister: string;
  roleSpouse: string;
  roleChild: string;
  cancel: string;
  saveChanges: string;
  attachNewRelative: string;
  autoIdNote: string;

  // Export Modal
  exportModalTitle: string;
  exportModalSubtitle: string;
  gedcomExportTitle: string;
  gedcomExportDesc: string;
  csvExportTitle: string;
  csvExportDesc: string;
  jsonExportTitle: string;
  jsonExportDesc: string;
  aiBiographyPromptTitle: string;
  aiBiographyPromptDesc: (name: string) => string;
  copyStoryPromptAction: string;
  copiedStoryPromptAction: string;
  downloadedFileNotice: (filename: string) => string;
  close: string;

  // Settings Modal
  settingsModalTitle: string;
  settingsModalSubtitle: string;
  geminiApiKeyLabel: string;
  getFreeKey: string;
  apiKeyStorageNote: string;
  modelSelectLabel: string;
  zeroTelemetryTitle: string;
  zeroTelemetryDesc: string;
  clearTreeCacheTitle: string;
  clearTreeCacheDesc: string;
  clearTreeAction: string;
  saveSettingsAction: string;
  savedAction: string;
  testApiKeyButton: string;
  testingApiKey: string;
  apiKeyValid: (count: number) => string;
  apiKeyInvalid: string;
  customModelNote: string;
}

export const translations: Record<Language, Translations> = {
  he: {
    appName: 'GedcomQuery Pro',
    appTagline: 'תחנת עבודה גנאלוגית פרטית ומאובטחת',
    clientPrivacyBadge: '100% פרטיות מקומית בדפדפן',
    loadDemoTree: 'טען עץ לדוגמה',
    demoTreeShort: 'עץ לדוגמה',
    workspaceGed: 'Barkai Danny Familytree',
    importGed: 'ייבוא קובץ GED.',
    export: 'ייצוא',
    settings: 'הגדרות',
    lightMode: 'מצב בהיר',
    darkMode: 'מצב כהה',
    individualsCount: (count) => `${count} אנשים`,
    familiesCount: (count) => `${count} משפחות`,

    // Navigation Sidebar
    navDashboard: 'לוח בקרה',
    navTree: 'עץ שושלת אינטראקטיבי',
    navDirectory: 'ספריית שמות וסינון',
    navKinship: 'מחשבון קרבת משפחה',
    navQuality: 'איכות נתונים ואנומליות',
    navResearch: 'גילוי ברשת ובינה מלאכותית',
    navExport: 'ייצוא וסיפור ביוגרפי',

    // Dashboard
    welcomeTitle: 'ברוכים הבאים ל-GedcomQuery Pro',
    welcomeSubtitle: 'תחנת עבודה גנאלוגית בעברית עם דגש על פרטיות מלאה. ייבאו קובצי GEDCOM 5.5/5.5.1 כדי לחקור קשרים, לחשב קרבה מדויקת, לאתר שגיאות ולבצע העשרת מידע מארכיונים באמצעות Google Search Grounding.',
    selectGedFile: 'בחר קובץ GED. מהמחשב',
    loadDemoBarkai: 'טען עץ לדוגמה (מורשת ברקאי - 4 דורות)',
    loadWorkspaceGed: 'טען Barkai Danny Familytree',
    privacyGuaranteeTitle: 'אבטחה ופרטיות Local-First מלאה',
    privacyGuaranteeDesc: 'כל ניתוח הנתונים, בניית גרף הקשרים, בדיקות האיכות והעריכות מתבצעים אך ורק בזיכרון המקומי של הדפדפן וב-IndexedDB. נתוני העץ לעולם אינם מועברים לשרת מרוחק פרטי.',
    activeTreeProfile: 'פרופיל עץ פעיל',
    aiDiscoveryHub: 'מוקד גילוי ומחקר AI',
    kinshipCalculator: 'מחשבון קרבת משפחה',
    individuals: 'נפשות בעץ',
    maleFemaleCount: (m, f) => `${m} גברים • ${f} נשים`,
    families: 'משפחות וקשרים',
    lineageConnections: 'קשרי נישואין והורות',
    dateSpan: 'טווח שנים',
    treeHealth: 'בריאות העץ',
    goodStatus: 'תקין',
    errorsCount: (n) => `${n} שגיאות`,
    inspectAnomalies: 'בדוק אנומליות בעץ',
    treeCompletenessTitle: 'שלמות נתונים ואיכות העץ',
    birthDatesRecorded: 'תאריכי לידה מתועדים',
    deathDatesRecorded: 'תאריכי פטירה מתועדים (נפטרים)',
    missingBirthCountNote: (n) => `ל-${n} אנשים חסר תאריך לידה – מועמדים מצוינים להעשרה באמצעות מוקד הגילוי.`,
    keyGeographicOrigins: 'מוקדים גיאוגרפיים מרכזיים',
    noLocationsRecorded: 'לא תועדו מיקומים בעץ הנתונים.',
    featuredIndividuals: 'אנשים בולטים בעץ',
    viewAllCount: (n) => `הצג את כל ה-${n}`,
    living: 'בחיים',
    deceased: 'נפטר/ה',
    birth: 'לידה',
    death: 'פטירה',
    place: 'מקום',

    // Directory & Filters
    searchPlaceholder: 'חיפוש שמות (עברית / לועזית), שנים, מקומות, הערות, מזהים...',
    clear: 'נקה',
    sortNameAsc: 'מיון: שם (א-ת)',
    sortNameDesc: 'מיון: שם (ת-א)',
    sortBirthAsc: 'מיון: שנת לידה (מהוותיק)',
    sortBirthDesc: 'מיון: שנת לידה (מהחדש)',
    sortIdAsc: 'מיון: לפי מזהה ID',
    filters: 'סינון',
    allGenders: 'כל המינים',
    male: 'גברים',
    female: 'נשים',
    allStatus: 'כל הסטטוסים',
    allLocations: 'כל המיקומים',
    showingRecords: (showing, total) => `מציג ${showing} מתוך ${total} רשומות`,
    researchAction: 'מחקר',
    kinshipAction: 'קרבה',
    addRelativeAction: 'הוסף קרוב',
    copyPromptAction: 'העתק פרומפט לסיפור',
    copiedPrompt: 'הועתק!',
    editAction: 'עריכה',
    tableId: 'מזהה',
    tableName: 'שם מלא',
    tableSex: 'מין',
    tableBirth: 'לידה ומקום',
    tableDeath: 'פטירה ומקום',
    tableStatus: 'סטטוס',
    tableActions: 'פעולות',

    // Interactive Tree
    pedigreeLineageGraph: 'גרף שושלת ומפת יוחסין אינטראקטיבית',
    pedigreeDesc: 'בחרו כל בן משפחה כדי למרכז את תצוגת האילן ולחקור את דורותיו קדימה ואחורה.',
    centerPerson: 'מרכז את האילן על:',
    gen1Grandparents: 'דור ראשון • סבים וסבתות',
    gen2Parents: 'דור שני • הורים',
    gen3FocusHousehold: 'דור שלישי • האדם הנבחר ומשק הבית',
    gen4Children: 'דור רביעי • ילדים וצאצאים',
    father: 'אב',
    mother: 'אם',
    paternalGrandfather: 'סבא מצד האב',
    paternalGrandmother: 'סבתא מצד האב',
    maternalGrandfather: 'סבא מצד האם',
    maternalGrandmother: 'סבתא מצד האם',
    spouses: 'בן/בת זוג',
    siblings: 'אחים ואחיות',
    childrenTitle: 'ילדים',
    focusPersonLabel: 'אדם במרכז',
    noRecordForRole: (role) => `אין תיעוד ל${role}`,
    noChildrenForPerson: 'לא תועדו ילדים לאדם זה',
    noSpouseRecorded: 'לא תועד/ה בן/בת זוג',

    // Kinship Calculator
    kinshipTitle: 'מחשבון קרבת משפחה וייחוס',
    kinshipSubtitle: 'מנווט במסלול הקצר ביותר בגרף המשפחתי כדי לחשב ייחוס מדויק, דרגת קרבה ושם הקשר בעברית ובאנגלית.',
    personASource: 'אדם א\' (נקודת מוצא):',
    personBTarget: 'אדם ב\' (הקרוב המבוקש):',
    swapPersons: 'החלף בין האנשים',
    calculatedKinshipBadge: 'תוצאת חישוב הקרבה',
    kinshipExplanation: (personB, rel, personA, deg) => `${personB} הוא/היא ה${rel} של ${personA} (במרחק ${deg} ${deg === 1 ? 'דרגת קרבה אחת' : 'דרגות קרבה'}).`,
    degreeWord: (deg) => deg === 1 ? 'דרגת קרבה אחת' : `${deg} דרגות קרבה`,
    connectionPathTitle: (n) => `מסלול החיבור הקצר ביותר (${n} נפשות):`,
    noKinshipFound: 'לא נמצא קשר משפחתי בין שני האנשים בגרף הנוכחי.',

    // Quality & Anomalies
    qualityTitle: 'בקרת איכות נתונים ואיתור אנומליות',
    qualitySubtitle: 'בדיקות עקביות אוטומטיות לאיתור סתירות תאריכים, פערי גילאים בלתי סבירים ותיעודים חסרים.',
    allFilter: (n) => `הכל (${n})`,
    errorsFilter: (n) => `שגיאות (${n})`,
    warningsFilter: (n) => `אזהרות (${n})`,
    candidatesFilter: (n) => `מועמדים למחקר (${n})`,
    targetLabel: 'יעד',
    fixRecordAction: 'תקן רשומה',
    aiResearchAction: 'מחקר AI',
    noIssuesFoundTitle: 'לא נמצאו בעיות איכות בקטגוריה זו',
    noIssuesFoundDesc: 'כל הרשומות בקטגוריה שנבחרה תואמות את כללי העקביות הגנאלוגיים.',

    // Web Discovery & AI
    discoveryHubTitle: 'מוקד מחקר היסטורי וגילוי ברשת',
    discoveryHubDesc: 'תשאול ארכיונים פתוחים, מרשמי אוכלוסין, עיתונות היסטורית (JPress), יד ושם ו-JewishGen מבוסס מודל Gemini עם Google Search Grounding.',
    apiKeyConnected: 'מפתח Gemini מחובר',
    addApiKeyPrompt: 'הגדר מפתח API (או השתמש בסימולציית הגילוי המובנית)',
    researchSpecificPerson: 'מחקר אדם ספציפי',
    choosePersonPlaceholder: 'בחרו אדם למחקר ארכיוני...',
    startResearchGrounding: 'הפעל מחקר מקוון עם Grounding',
    highPriorityCandidates: 'מועמדים בעדיפות גבוהה להעשרה',
    highPriorityCandidatesDesc: 'בני משפחה עם נתונים חסרים שניתן להשלים ולאמת מארכיונים דיגיטליים.',
    filterMissingDates: 'חסרי תאריכים',
    filterMissingParents: 'ללא הורים מקושרים',
    launchDiscoveryAction: 'הפעל גילוי מקוון',
    missingCandidate: 'חסר (מועמד להעשרה)',
    parentsInTree: 'הורים בעץ:',
    parentsLinked: 'מקושרים',
    noneLinked: 'לא מקושרים',

    // Discovery Review Modal
    reviewModalTitle: 'בדיקת ממצאי גילוי והעשרה',
    groundedSearchBadge: 'חיפוש מעוגן בזמן אמת (Grounding)',
    historicalSynthesisBadge: 'סנכרון ארכיוני היסטורי',
    proposedEnrichmentsTitle: 'הצעות לעדכון העץ (השוואת Diff זו לצד זו)',
    acceptAllAction: 'אשר את כל ההצעות',
    acceptFieldAction: 'אשר שדה זה',
    acceptedBadge: 'עודכן בעץ ✓',
    currentTreeValue: 'ערך נוכחי בעץ',
    proposedWebFinding: 'ממצא מקוון מוצע',
    sourceLabel: 'מקור:',
    verifySource: 'אמת מקור',
    highConfidence: 'ודאות גבוהה',
    mediumConfidence: 'ודאות בינונית',
    lowConfidence: 'ודאות נמוכה',
    narrativeSummaryTitle: 'תקציר נרטיבי ביוגרפי וארכיוני',
    citationsReferencesTitle: 'מקורות מידע ואזכורים מאומתים',
    humanInLoopNote: 'אישור אנושי (Human-in-the-Loop): העץ מתעדכן רק בלחיצה על "אשר".',
    doneReviewingAction: 'סיום בדיקה',
    searchingRecordsTitle: 'מתשאל מאגרי מידע וארכיונים היסטוריים...',
    searchingRecordsDesc: 'מבצע חיפושי Google Search Grounding מול ארכיונים, עיתונות יהודית היסטורית, מרשמי תושבים ויד ושם.',

    // Edit Person & Add Relative Modal
    editRecordTitle: (name) => `עריכת רשומה: ${name}`,
    attachRelativeToTitle: (name) => `הוספת קרוב/ת משפחה ל-${name}`,
    editDetailsTab: 'עריכת פרטים',
    addRelativeTab: '+ הוספת קרוב/ה',
    givenNameLabel: 'שם פרטי:',
    surnameLabel: 'שם משפחה:',
    fullNameLabel: 'שם מלא לתצוגה:',
    genderLabel: 'מין:',
    birthDateLabel: 'תאריך לידה:',
    birthPlaceLabel: 'מקום לידה:',
    personLivingLabel: 'אדם זה עדיין בחיים',
    deathDateLabel: 'תאריך פטירה:',
    deathPlaceLabel: 'מקום פטירה:',
    biographicalNotesLabel: 'הערות ביוגרפיות, מקורות וארכיונים:',
    selectRelationTo: (name) => `בחרו סוג קרבה ל-${name}:`,
    roleFather: 'אב',
    roleMother: 'אם',
    roleBrother: 'אח',
    roleSister: 'אחות',
    roleSpouse: 'בן/בת זוג',
    roleChild: 'ילד/ה',
    cancel: 'ביטול',
    saveChanges: 'שמור שינויים',
    attachNewRelative: 'קשר קרוב חדש לעץ',
    autoIdNote: 'מזהה GEDCOM ייחודי (כגון I_NEW_xxxx@) וקשר משפחתי (F_NEW_xxxx@) ייווצרו ויתועדו אוטומטית בעץ.',

    // Export Modal
    exportModalTitle: 'מרכז ייצוא נתונים ומחולל סיפור ביוגרפי',
    exportModalSubtitle: 'ייצוא גרף העץ המעודכן לקובץ GEDCOM 5.5.1 תקני, גיליונות CSV, קובצי JSON או הפקת פרומפטים לכתיבת ביוגרפיה.',
    gedcomExportTitle: 'קובץ GEDCOM תקני',
    gedcomExportDesc: 'קובץ ged. תקני בקידוד UTF-8 הכולל את כל העריכות והמזהים החדשים.',
    csvExportTitle: 'ייצוא לאקסל / CSV',
    csvExportDesc: 'טבלה נקייה של כל הנפשות, תאריכים, מקומות והערות.',
    jsonExportTitle: 'מבנה נתונים JSON',
    jsonExportDesc: 'גרף נתונים גולמי בפורמט JSON לשילוב עם כלים נוספים.',
    aiBiographyPromptTitle: 'מחולל פרומפט לסיפור ביוגרפי היסטורי (AI)',
    aiBiographyPromptDesc: (name) => `בלחיצה אחת, פרטי החיים של ${name} מומרים לפרומפט מובנה ועשיר ליצירת סיפור חיים מרגש.`,
    copyStoryPromptAction: 'העתק פרומפט לכתיבת סיפור',
    copiedStoryPromptAction: 'הפרומפט הועתק ללוח!',
    downloadedFileNotice: (filename) => `הקובץ הורד בהצלחה: ${filename}`,
    close: 'סגור',

    // Settings Modal
    settingsModalTitle: 'הגדרות מערכת ובינה מלאכותית',
    settingsModalSubtitle: 'תצורת מפתח Gemini API ופרטיות מקומית',
    geminiApiKeyLabel: 'מפתח Google Gemini API:',
    getFreeKey: 'קבל מפתח חינמי מ-Google',
    apiKeyStorageNote: 'המפתח נשמר אך ורק ב-localStorage של הדפדפן שלך ולא מועבר לשום שרת צד שלישי.',
    modelSelectLabel: 'דגם Gemini (עם Google Search Grounding פעיל):',
    zeroTelemetryTitle: 'התחייבות ל-100% פרטיות מקומית (Zero Telemetry)',
    zeroTelemetryDesc: 'נתוני עץ המשפחה שלכם לעולם אינם מועלים לאף שרת חיצוני. כל הניתוח, החישובים והייצוא רצים בתוך כרטיסיית הדפדפן שלכם בלבד.',
    clearTreeCacheTitle: 'ניקוי זיכרון העץ המקומי',
    clearTreeCacheDesc: 'מחיקת עותק ה-IndexedDB כדי לטעון עץ נקי או להתחיל מחדש.',
    clearTreeAction: 'נקה עץ מהזיכרון',
    saveSettingsAction: 'שמור הגדרות',
    savedAction: 'נשמר בהצלחה!',
    testApiKeyButton: 'בדוק תקינות מפתח ובדוק מודלים',
    testingApiKey: 'בודק מול Google...',
    apiKeyValid: (count) => `מפתח תקין ומאושר! זוהו ${count} מודלים זמינים מחשבונך.`,
    apiKeyInvalid: 'שגיאה באימות המפתח',
    customModelNote: 'רשימת הדגמים נטענת בזמן אמת מחשבונך ב-Google Cloud / AI Studio.',
  },
  en: {
    appName: 'GedcomQuery Pro',
    appTagline: 'Privacy-First Client-Side Genealogy Workstation',
    clientPrivacyBadge: '100% Client-Side Privacy',
    loadDemoTree: 'Load Demo Tree',
    demoTreeShort: 'Demo Tree',
    workspaceGed: 'Barkai Danny Tree',
    importGed: 'Import .GED',
    export: 'Export',
    settings: 'Settings',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    individualsCount: (count) => `${count} individuals`,
    familiesCount: (count) => `${count} families`,

    // Navigation Sidebar
    navDashboard: 'Dashboard',
    navTree: 'Interactive Tree',
    navDirectory: 'Directory & Filter',
    navKinship: 'Kinship Calculator',
    navQuality: 'Quality & Anomalies',
    navResearch: 'Web Discovery & AI',
    navExport: 'Export & Biography',

    // Dashboard
    welcomeTitle: 'Welcome to GedcomQuery Pro',
    welcomeSubtitle: 'The privacy-first genealogy workstation. Import standard GEDCOM 5.5/5.5.1 files to explore, calculate kinship, detect anomalies, and enrich family trees using Google Search grounding.',
    selectGedFile: 'Select .GED File from Computer',
    loadDemoBarkai: 'Load Demo Tree (Barkai Heritage - 4 Gen)',
    loadWorkspaceGed: 'Load Barkai Danny Familytree',
    privacyGuaranteeTitle: 'Zero-Telemetry Privacy Guarantee',
    privacyGuaranteeDesc: 'All data parsing, kinship tree search, and editing happens strictly in your browser’s local memory and IndexedDB. Your genealogy records are never uploaded to any remote server.',
    activeTreeProfile: 'Active Tree Profile',
    aiDiscoveryHub: 'AI Discovery Hub',
    kinshipCalculator: 'Kinship Calculator',
    individuals: 'Individuals',
    maleFemaleCount: (m, f) => `${m} Male • ${f} Female`,
    families: 'Families',
    lineageConnections: 'Lineage connections',
    dateSpan: 'Date Span',
    treeHealth: 'Tree Health',
    goodStatus: 'Good',
    errorsCount: (n) => `${n} errors`,
    inspectAnomalies: 'Inspect anomalies',
    treeCompletenessTitle: 'Tree Completeness & Quality',
    birthDatesRecorded: 'Birth Dates Recorded',
    deathDatesRecorded: 'Death Dates Recorded (Deceased)',
    missingBirthCountNote: (n) => `${n} people have missing birth records and can be enriched using the Web Discovery tool.`,
    keyGeographicOrigins: 'Key Geographic Origins',
    noLocationsRecorded: 'No location records parsed in tree.',
    featuredIndividuals: 'Featured Individuals in Tree',
    viewAllCount: (n) => `View all ${n}`,
    living: 'Living',
    deceased: 'Deceased',
    birth: 'Birth',
    death: 'Death',
    place: 'Place',

    // Directory & Filters
    searchPlaceholder: 'Search multilingual names (Hebrew/Latin), years, places, notes...',
    clear: 'Clear',
    sortNameAsc: 'Sort: Name (A-Z)',
    sortNameDesc: 'Sort: Name (Z-A)',
    sortBirthAsc: 'Sort: Oldest Birth Year',
    sortBirthDesc: 'Sort: Newest Birth Year',
    sortIdAsc: 'Sort: ID Order',
    filters: 'Filters:',
    allGenders: 'All Genders',
    male: 'Male',
    female: 'Female',
    allStatus: 'All Status',
    allLocations: 'All Locations',
    showingRecords: (showing, total) => `Showing ${showing} of ${total} records`,
    researchAction: 'Research',
    kinshipAction: 'Kinship',
    addRelativeAction: 'Add Relative',
    copyPromptAction: 'Copy Story Prompt',
    copiedPrompt: 'Copied!',
    editAction: 'Edit',
    tableId: 'ID',
    tableName: 'Full Name',
    tableSex: 'Sex',
    tableBirth: 'Birth Date & Place',
    tableDeath: 'Death Date & Place',
    tableStatus: 'Status',
    tableActions: 'Actions',

    // Interactive Tree
    pedigreeLineageGraph: 'Pedigree & Lineage Graph',
    pedigreeDesc: 'Select any family member to center and inspect their generational tree.',
    centerPerson: 'Center Person:',
    gen1Grandparents: 'Generation I • Grandparents',
    gen2Parents: 'Generation II • Parents',
    gen3FocusHousehold: 'Generation III • Primary Focus & Household',
    gen4Children: 'Generation IV • Children & Descendants',
    father: 'Father',
    mother: 'Mother',
    paternalGrandfather: 'Paternal Grandfather',
    paternalGrandmother: 'Paternal Grandmother',
    maternalGrandfather: 'Maternal Grandfather',
    maternalGrandmother: 'Maternal Grandmother',
    spouses: 'Spouse(s)',
    siblings: 'Siblings',
    childrenTitle: 'Children',
    focusPersonLabel: 'Focus Person',
    noRecordForRole: (role) => `No ${role} recorded`,
    noChildrenForPerson: 'No children recorded for this person',
    noSpouseRecorded: 'No spouse recorded',

    // Kinship Calculator
    kinshipTitle: 'Kinship & Relationship Calculator',
    kinshipSubtitle: 'Traverses the shortest path in the genealogy graph to deduce precise genealogical consanguinity and family ties in English & Hebrew.',
    personASource: 'Person A (Source Reference):',
    personBTarget: 'Person B (Target Relative):',
    swapPersons: 'Swap Persons',
    calculatedKinshipBadge: 'Calculated Kinship',
    kinshipExplanation: (personB, rel, personA, deg) => `${personB} is the ${rel.toLowerCase()} of ${personA} (${deg} degree${deg !== 1 ? 's' : ''} of separation).`,
    degreeWord: (deg) => `${deg} degree${deg !== 1 ? 's' : ''}`,
    connectionPathTitle: (n) => `Shortest Connection Path (${n} people):`,
    noKinshipFound: 'No family connection found between these two individuals in the current graph.',

    // Quality & Anomalies
    qualityTitle: 'Data Quality & Anomaly Detection',
    qualitySubtitle: 'Automated consistency checks for temporal conflicts, age constraints, and missing records.',
    allFilter: (n) => `All (${n})`,
    errorsFilter: (n) => `Errors (${n})`,
    warningsFilter: (n) => `Warnings (${n})`,
    candidatesFilter: (n) => `Research Candidates (${n})`,
    targetLabel: 'Target',
    fixRecordAction: 'Fix Record',
    aiResearchAction: 'AI Research',
    noIssuesFoundTitle: 'No Quality Issues Found in this Category',
    noIssuesFoundDesc: 'All records in this filter category conform to genealogical consistency constraints.',

    // Web Discovery & AI
    discoveryHubTitle: 'AI Research & Web Grounding Hub',
    discoveryHubDesc: 'Query public archives, JewishGen, Yad Vashem open registries, municipal records, and historical newspapers powered by Gemini + Google Search Grounding.',
    apiKeyConnected: 'Gemini API Key Connected',
    addApiKeyPrompt: 'Add API Key (or use Built-in Demo Discovery)',
    researchSpecificPerson: 'Research Specific Individual',
    choosePersonPlaceholder: 'Choose individual to research...',
    startResearchGrounding: 'Start Research & Grounding',
    highPriorityCandidates: 'High-Priority Research Candidates',
    highPriorityCandidatesDesc: 'Individuals with gaps in their record that can be enriched from online archives.',
    filterMissingDates: 'Missing Dates',
    filterMissingParents: 'Missing Parents',
    launchDiscoveryAction: 'Launch Web Discovery',
    missingCandidate: 'Missing (Candidate)',
    parentsInTree: 'Parents in tree:',
    parentsLinked: 'Linked',
    noneLinked: 'None linked',

    // Discovery Review Modal
    reviewModalTitle: 'Discovery & Enrichment Review',
    groundedSearchBadge: 'Grounded Search',
    historicalSynthesisBadge: 'Historical Synthesis',
    proposedEnrichmentsTitle: 'Proposed Tree Enrichments (Side-by-Side Diff)',
    acceptAllAction: 'Accept All Proposed',
    acceptFieldAction: 'Accept Field',
    acceptedBadge: 'Accepted in Tree ✓',
    currentTreeValue: 'Current Tree Value',
    proposedWebFinding: 'Proposed Web Finding',
    sourceLabel: 'Source:',
    verifySource: 'Verify source',
    highConfidence: 'High confidence',
    mediumConfidence: 'Medium confidence',
    lowConfidence: 'Low confidence',
    narrativeSummaryTitle: 'Archival & Biographical Narrative Summary',
    citationsReferencesTitle: 'Grounded Source Citations & References',
    humanInLoopNote: 'Human-in-the-Loop: Tree is only updated when you click "Accept".',
    doneReviewingAction: 'Done Reviewing',
    searchingRecordsTitle: 'Querying Genealogical Records & Archives...',
    searchingRecordsDesc: 'Executing real-time Google Search grounding queries across historical archives, newspapers, Yad Vashem, and public registries.',

    // Edit Person & Add Relative Modal
    editRecordTitle: (name) => `Edit Record: ${name}`,
    attachRelativeToTitle: (name) => `Attach Relative to ${name}`,
    editDetailsTab: 'Edit Details',
    addRelativeTab: '+ Add Relative',
    givenNameLabel: 'Given Name:',
    surnameLabel: 'Surname:',
    fullNameLabel: 'Full Display Name:',
    genderLabel: 'Gender:',
    birthDateLabel: 'Birth Date:',
    birthPlaceLabel: 'Birth Place:',
    personLivingLabel: 'Person is still living',
    deathDateLabel: 'Death Date:',
    deathPlaceLabel: 'Death Place:',
    biographicalNotesLabel: 'Biographical Notes & Archives:',
    selectRelationTo: (name) => `Select Relationship to ${name}:`,
    roleFather: 'Father',
    roleMother: 'Mother',
    roleBrother: 'Brother',
    roleSister: 'Sister',
    roleSpouse: 'Spouse',
    roleChild: 'Child',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    attachNewRelative: 'Attach New Relative',
    autoIdNote: 'A unique GEDCOM identifier (e.g. @I_NEW_xxxx@) and family connection (@F_NEW_xxxx@) will be automatically generated and linked.',

    // Export Modal
    exportModalTitle: 'Export Tree & AI Narrative Builder',
    exportModalSubtitle: 'Serialize client-side graph back into valid GEDCOM, CSV, JSON, or copy LLM prompts.',
    gedcomExportTitle: 'Standard GEDCOM',
    gedcomExportDesc: 'Valid 5.5.1 UTF-8 `.ged` file with all merged edits and new IDs.',
    csvExportTitle: 'Excel / CSV Export',
    csvExportDesc: 'Clean tabular data of all individuals, dates, places, and notes.',
    jsonExportTitle: 'Structured JSON',
    jsonExportDesc: 'Raw JSON graph for integration with custom scripts or APIs.',
    aiBiographyPromptTitle: 'AI Biography Narrative Prompt Builder',
    aiBiographyPromptDesc: (name) => `One-click formats the full biographical graph of ${name} into a structured LLM prompt to generate an empathetic historical narrative.`,
    copyStoryPromptAction: 'Copy Story Prompt',
    copiedStoryPromptAction: 'Copied Prompt!',
    downloadedFileNotice: (filename) => `Downloaded file: ${filename}`,
    close: 'Close',

    // Settings Modal
    settingsModalTitle: 'Application Settings',
    settingsModalSubtitle: 'Gemini API Key & Privacy Configuration',
    geminiApiKeyLabel: 'Google Gemini API Key:',
    getFreeKey: 'Get Free Key',
    apiKeyStorageNote: 'Stored strictly in your browser’s localStorage. Never transmitted to any third-party backend.',
    modelSelectLabel: 'Gemini Model (with Google Search Grounding):',
    zeroTelemetryTitle: 'Zero-Telemetry Privacy Guarantee',
    zeroTelemetryDesc: 'Your family tree data never touches any external database. All parsing, graph calculations, and file serialization run inside your browser tab.',
    clearTreeCacheTitle: 'Clear Local Tree Cache',
    clearTreeCacheDesc: 'Purge IndexedDB local copy to load a fresh tree.',
    clearTreeAction: 'Clear Tree',
    saveSettingsAction: 'Save Settings',
    savedAction: 'Saved!',
    testApiKeyButton: 'Verify Key & Load Models',
    testingApiKey: 'Connecting to Google...',
    apiKeyValid: (count) => `Key verified! Loaded ${count} available models from your account.`,
    apiKeyInvalid: 'API key validation failed',
    customModelNote: 'Model options loaded dynamically from your Google AI Studio account.',
  },
};
