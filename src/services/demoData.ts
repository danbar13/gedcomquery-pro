import { GedcomTree, Individual, Family } from '../types/gedcom';

/**
 * A rich 3-4 generation bilingual demo tree (Barkai / Levin / Shapira family lineage)
 * with realistic dates, places, notes, relationships, and intentional anomaly cases
 * for evaluating data quality checks and web research.
 */
export function getDemoTree(): GedcomTree {
  const individuals: Record<string, Individual> = {
    '@I1@': {
      id: '@I1@',
      name: 'דן ברקאי',
      givenName: 'דן',
      surname: 'ברקאי',
      sex: 'M',
      birthDate: '19 FEB 1960',
      birthPlace: 'תל אביב, ישראל',
      deathDate: '',
      deathPlace: '',
      famc: '@F2@',
      fams: ['@F1@'],
      notes: ['מנהל בכיר, פעיל בקהילת הטכנולוגיה ומשאבי אנוש.'],
      customAttributes: { Email: 'dan.barkai@example.com', Residence: 'תל אביב' },
      isLiving: true,
    },
    '@I2@': {
      id: '@I2@',
      name: 'אריאלה חביב ברקאי',
      givenName: 'אריאלה',
      surname: 'חביב',
      sex: 'F',
      birthDate: '11 SEP 1953',
      birthPlace: 'עין שמר, ישראל',
      deathDate: '',
      deathPlace: '',
      famc: null,
      fams: ['@F1@'],
      notes: ['אמנית ויוצרת, נולדה בקיבוץ עין שמר.'],
      customAttributes: { 'Married Name': 'ברקאי', Residence: 'תל אביב' },
      isLiving: true,
    },
    '@I3@': {
      id: '@I3@',
      name: 'יונתן ברקאי',
      givenName: 'יונתן',
      surname: 'ברקאי',
      sex: 'M',
      birthDate: '15 MAY 1986',
      birthPlace: 'תל אביב, ישראל',
      deathDate: '',
      deathPlace: '',
      famc: '@F1@',
      fams: ['@F3@'],
      notes: ['מהנדס תוכנה ומומחה לבינה מלאכותית.'],
      customAttributes: { Residence: 'הרצליה' },
      isLiving: true,
    },
    '@I4@': {
      id: '@I4@',
      name: 'תמר ברקאי',
      givenName: 'תמר',
      surname: 'ברקאי',
      sex: 'F',
      birthDate: '22 NOV 1990',
      birthPlace: 'תל אביב, ישראל',
      deathDate: '',
      deathPlace: '',
      famc: '@F1@',
      fams: [],
      notes: ['רופאה חוקרת, בוגרת האוניברסיטה העברית.'],
      customAttributes: { Residence: 'ירושלים' },
      isLiving: true,
    },
    '@I5@': {
      id: '@I5@',
      name: 'מיכל לוין',
      givenName: 'מיכל',
      surname: 'לוין',
      sex: 'F',
      birthDate: '04 APR 1988',
      birthPlace: 'חיפה, ישראל',
      deathDate: '',
      deathPlace: '',
      famc: null,
      fams: ['@F3@'],
      notes: ['אדריכלית נוף ומתכננת ערים.'],
      customAttributes: { Residence: 'הרצליה' },
      isLiving: true,
    },
    '@I6@': {
      id: '@I6@',
      name: 'מאיה ברקאי',
      givenName: 'מאיה',
      surname: 'ברקאי',
      sex: 'F',
      birthDate: '10 JUN 2018',
      birthPlace: 'כפר סבא, ישראל',
      deathDate: '',
      deathPlace: '',
      famc: '@F3@',
      fams: [],
      notes: ['דור רביעי לשושלת ברקאי בארץ ישראל.'],
      customAttributes: {},
      isLiving: true,
    },
    '@I7@': {
      id: '@I7@',
      name: 'אברהם ברקאי',
      givenName: 'אברהם',
      surname: 'ברקאי',
      sex: 'M',
      birthDate: '12 MAR 1930',
      birthPlace: 'ורשה, פולין',
      deathDate: '18 AUG 2012',
      deathPlace: 'פתח תקווה, ישראל',
      famc: '@F4@',
      fams: ['@F2@'],
      notes: ['עלה ארצה ב-1947, מפעילי ענף הבנייה והתעשייה.'],
      customAttributes: { Immigration: '1947' },
      isLiving: false,
    },
    '@I8@': {
      id: '@I8@',
      name: 'שרה רוזנברג ברקאי',
      givenName: 'שרה',
      surname: 'רוזנברג',
      sex: 'F',
      birthDate: '25 OCT 1934',
      birthPlace: 'ירושלים, ארץ ישראל',
      deathDate: '02 DEC 2021',
      deathPlace: 'תל אביב, ישראל',
      famc: null,
      fams: ['@F2@'],
      notes: ['אשת חינוך ומנהלת בית ספר במשך ארבעה עשורים.'],
      customAttributes: { 'Married Name': 'ברקאי' },
      isLiving: false,
    },
    '@I9@': {
      id: '@I9@',
      name: 'יצחק ברקאי (בורוכוביץ)',
      givenName: 'יצחק',
      surname: 'ברקאי',
      sex: 'M',
      birthDate: '1898',
      birthPlace: 'ביאליסטוק, פולין',
      deathDate: '1974',
      deathPlace: 'חולון, ישראל',
      famc: null,
      fams: ['@F4@'],
      notes: ['שינה את שם המשפחה מבורוכוביץ לברקאי עם עלייתו ב-1936.'],
      customAttributes: { 'Original Surname': 'Borochovich' },
      isLiving: false,
    },
    '@I10@': {
      id: '@I10@',
      name: 'לאה שפירא',
      givenName: 'לאה',
      surname: 'שפירא',
      sex: 'F',
      birthDate: '', // Prime candidate for research enrichment
      birthPlace: 'לודז, פולין',
      deathDate: '1982',
      deathPlace: 'חולון, ישראל',
      famc: null,
      fams: ['@F4@'],
      notes: ['חסר תאריך לידה מדויק - מועמד למחקר ארכיוני מקוון.'],
      customAttributes: {},
      isLiving: false,
    },
    // Intentional anomaly case: Parent born after child or age constraint
    '@I11@': {
      id: '@I11@',
      name: 'חיים ברקאי (בדיקת איכות)',
      givenName: 'חיים',
      surname: 'ברקאי',
      sex: 'M',
      birthDate: '1965', // Born 1965, but child was born in 1960!
      birthPlace: 'חיפה',
      deathDate: '1980',
      deathPlace: 'חיפה',
      famc: null,
      fams: ['@F5@'],
      notes: ['רשומה מכוילת להדגמת זיהוי אנומליות ואימות נתונים ב-GedcomQuery Pro.'],
      customAttributes: {},
      isLiving: false,
    },
    '@I12@': {
      id: '@I12@',
      name: 'דוד ברקאי (ילד אנומליה)',
      givenName: 'דוד',
      surname: 'ברקאי',
      sex: 'M',
      birthDate: '1962', // Child born before parent (@I11@ born 1965)
      birthPlace: 'תל אביב',
      deathDate: '',
      deathPlace: '',
      famc: '@F5@',
      fams: [],
      notes: ['הורה נולד לאחר הילד - מזוהה מיד בדוח איכות העץ.'],
      customAttributes: {},
      isLiving: true,
    },
  };

  const families: Record<string, Family> = {
    '@F1@': {
      id: '@F1@',
      husbandId: '@I1@',
      wifeId: '@I2@',
      children: ['@I3@', '@I4@'],
      marriageDate: '10 JUL 1984',
      marriagePlace: 'בת ים, ישראל',
      notes: ['טקס נישואין בבת ים.'],
    },
    '@F2@': {
      id: '@F2@',
      husbandId: '@I7@',
      wifeId: '@I8@',
      children: ['@I1@'],
      marriageDate: '14 JUN 1956',
      marriagePlace: 'תל אביב, ישראל',
      notes: ['נישאו בבית הכנסת הגדול בתל אביב.'],
    },
    '@F3@': {
      id: '@F3@',
      husbandId: '@I3@',
      wifeId: '@I5@',
      children: ['@I6@'],
      marriageDate: '08 SEP 2015',
      marriagePlace: 'קיסריה, ישראל',
      notes: ['נישאו בגן אירועים בקיסריה.'],
    },
    '@F4@': {
      id: '@F4@',
      husbandId: '@I9@',
      wifeId: '@I10@',
      children: ['@I7@'],
      marriageDate: '1924',
      marriagePlace: 'ורשה, פולין',
      notes: ['נישאו בפולין לפני העלייה לארץ ישראל.'],
    },
    '@F5@': {
      id: '@F5@',
      husbandId: '@I11@',
      wifeId: null,
      children: ['@I12@'],
      marriageDate: '',
      marriagePlace: '',
      notes: ['משפחת בדיקה לאנומליות גיל.'],
    },
  };

  return {
    individuals,
    families,
    metadata: {
      fileName: 'Barkai_Heritage_Demo.ged',
      source: 'GedcomQuery Pro Demo Generator',
      version: '5.5.1',
      charset: 'UTF-8',
      language: 'Hebrew',
      lastModified: new Date().toISOString(),
      rawHeaderLines: [
        '0 HEAD',
        '1 GEDC',
        '2 VERS 5.5.1',
        '2 FORM LINEAGE-LINKED',
        '1 CHAR UTF-8',
        '1 LANG Hebrew',
        '1 SOUR GedcomQuery Pro Demo',
      ],
    },
  };
}

export const WORKSPACE_FAMILYTREE_RAW = `0 HEAD
1 GEDC
2 VERS 5.5.1
2 FORM LINEAGE-LINKED
1 CHAR UTF-8
1 LANG Hebrew
1 SOUR MYHERITAGE
2 NAME MyHeritage Family Tree Builder
2 VERS 5.5.1
2 _RTLSAVE RTL
2 CORP MyHeritage.com
1 DEST MYHERITAGE
1 DATE 11 OCT 2026
1 FILE Exported by MyHeritage.com from barkaifm in ברקאי Web Site on Sun, 11 Oct 2026
1 _PROJECT_GUID 583ACAA8BAC1F75433052CB6550EF113
1 _EXPORTED_FROM_SITE_ID 390358572
0 @I1@ INDI
1 NAME דן /ברקאי/
2 GIVN דן
2 SURN ברקאי
1 SEX M
1 BIRT
2 DATE 19 FEB 1960
2 PLAC תל אביב
1 RESI
2 EMAIL barkaifm@@gmail.com
1 FAMS @F1@
1 RIN MH:I1
1 _UID 583acb2c89a131e69bcb3052cb6550f0
0 @I2@ INDI
1 NAME אריאלה /חביב/
2 GIVN אריאלה
2 SURN חביב
2 _MARNM ברקאי
1 SEX F
1 BIRT
2 DATE 11 SEP 1953
2 PLAC עין שמר
1 RESI
2 EMAIL ariella.barkai1@@gmail.com
1 FAMS @F1@
1 RIN MH:I2
1 _UID 583acb2cce0141e69bcb3052cb6550f0
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
1 RIN MH:F1
1 _UID 583acb2cb4c111e69bcb3052cb6550f0
1 MARR
2 DATE 10 JUL 1984
2 PLAC בת ים
0 TRLR`;
import { BARKAI_DANNY_FAMILYTREE_RAW } from './barkaiDannyTreeRaw';

export async function loadWorkspaceFamilyTree(): Promise<string> {
  const fileCandidates = [
    '/Barkai%20Danny%20Familytree.ged',
    '/Barkai Danny Familytree.ged',
    '/Familytree.ged',
  ];
  for (const url of fileCandidates) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        if (text.includes('HEAD') && text.includes('INDI')) {
          return text;
        }
      }
    } catch {
      // try next candidate
    }
  }
  return BARKAI_DANNY_FAMILYTREE_RAW;
}


