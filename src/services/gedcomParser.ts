import { Individual, Family, GedcomTree, TreeMetadata, Sex } from '../types/gedcom';

interface ParsedLine {
  level: number;
  id?: string;
  tag: string;
  value: string;
}

/**
 * Parses a raw line of a GEDCOM file according to standard 5.5/5.5.1 specifications.
 */
function parseGedcomLine(line: string): ParsedLine | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Regex to match: [level] (@ID@)? [TAG] [value]?
  // Example 1: 0 @I1@ INDI
  // Example 2: 1 NAME John /Doe/
  // Example 3: 2 DATE 19 FEB 1960
  const match = trimmed.match(/^(\d+)\s+(?:(@[^@]+@)\s+)?([A-Za-z0-9_]+)(?:\s+(.*))?$/);
  if (!match) return null;

  return {
    level: parseInt(match[1], 10),
    id: match[2],
    tag: match[3].toUpperCase(),
    value: (match[4] || '').trim(),
  };
}

export function parseGedcom(rawText: string, fileName = 'tree.ged'): GedcomTree {
  // Normalize line endings and strip BOM if present
  const cleanText = rawText.replace(/^\uFEFF/, '');
  const rawLines = cleanText.split(/\r?\n/);

  const individuals: Record<string, Individual> = {};
  const families: Record<string, Family> = {};
  const rawHeaderLines: string[] = [];

  let currentEntity: 'HEAD' | 'INDI' | 'FAM' | null = null;
  let currentIndi: Individual | null = null;
  let currentFam: Family | null = null;

  // Context trackers for nested structures (BIRT, DEAT, MARR, NAME, etc.)
  let currentSubContext: 'BIRT' | 'DEAT' | 'MARR' | 'NAME' | 'RESI' | 'NOTE' | null = null;
  let currentNoteOwner: 'INDI' | 'FAM' | null = null;
  let lastNoteIndex = -1;

  for (const line of rawLines) {
    const parsed = parseGedcomLine(line);
    if (!parsed) continue;

    const { level, id, tag, value } = parsed;

    if (level === 0) {
      // Save previously open entity
      if (currentIndi) {
        individuals[currentIndi.id] = currentIndi;
        currentIndi = null;
      }
      if (currentFam) {
        families[currentFam.id] = currentFam;
        currentFam = null;
      }
      currentSubContext = null;
      currentNoteOwner = null;

      if (tag === 'HEAD') {
        currentEntity = 'HEAD';
        rawHeaderLines.push(line);
      } else if (tag === 'INDI' || (value === 'INDI' && id)) {
        currentEntity = 'INDI';
        const indiId = id || value;
        currentIndi = {
          id: indiId,
          name: '',
          givenName: '',
          surname: '',
          sex: 'U',
          birthDate: '',
          birthPlace: '',
          deathDate: '',
          deathPlace: '',
          famc: null,
          fams: [],
          notes: [],
          customAttributes: {},
          isLiving: true,
        };
      } else if (tag === 'FAM' || (value === 'FAM' && id)) {
        currentEntity = 'FAM';
        const famId = id || value;
        currentFam = {
          id: famId,
          husbandId: null,
          wifeId: null,
          children: [],
          marriageDate: '',
          marriagePlace: '',
          notes: [],
          customAttributes: {},
        };
      } else {
        currentEntity = null;
      }
      continue;
    }

    if (currentEntity === 'HEAD') {
      rawHeaderLines.push(line);
      continue;
    }

    // Handle Individual attributes
    if (currentEntity === 'INDI' && currentIndi) {
      if (level === 1) {
        currentSubContext = null;

        switch (tag) {
          case 'NAME': {
            currentSubContext = 'NAME';
            let formattedName = value;
            let surn = '';
            let givn = '';

            const surnMatch = value.match(/\/([^\/]*)\//);
            if (surnMatch) {
              surn = surnMatch[1].trim();
              givn = value.replace(/\/[^\/]*\//, '').trim();
              formattedName = `${givn} ${surn}`.trim();
            } else {
              formattedName = value;
              givn = value;
            }

            currentIndi.name = formattedName || currentIndi.name;
            currentIndi.givenName = givn || currentIndi.givenName;
            currentIndi.surname = surn || currentIndi.surname;
            break;
          }
          case 'SEX': {
            const s = value.toUpperCase();
            if (s === 'M' || s === 'F') {
              currentIndi.sex = s;
            } else {
              currentIndi.sex = 'U';
            }
            break;
          }
          case 'BIRT':
            currentSubContext = 'BIRT';
            break;
          case 'DEAT':
            currentSubContext = 'DEAT';
            currentIndi.isLiving = false;
            break;
          case 'FAMC':
            currentIndi.famc = value;
            break;
          case 'FAMS':
            if (!currentIndi.fams.includes(value)) {
              currentIndi.fams.push(value);
            }
            break;
          case 'NOTE':
            currentSubContext = 'NOTE';
            currentNoteOwner = 'INDI';
            currentIndi.notes.push(value);
            lastNoteIndex = currentIndi.notes.length - 1;
            break;
          case 'RESI':
            currentSubContext = 'RESI';
            break;
          default:
            if (value) {
              currentIndi.customAttributes[tag] = value;
            }
            break;
        }
      } else if (level === 2) {
        if (currentSubContext === 'NAME') {
          if (tag === 'GIVN' && value) {
            currentIndi.givenName = value;
            if (currentIndi.surname) {
              currentIndi.name = `${value} ${currentIndi.surname}`.trim();
            }
          } else if (tag === 'SURN' && value) {
            currentIndi.surname = value;
            if (currentIndi.givenName) {
              currentIndi.name = `${currentIndi.givenName} ${value}`.trim();
            }
          } else if (tag === '_MARNM' && value) {
            currentIndi.customAttributes['Married Name'] = value;
          }
        } else if (currentSubContext === 'BIRT') {
          if (tag === 'DATE') currentIndi.birthDate = value;
          if (tag === 'PLAC') currentIndi.birthPlace = value;
        } else if (currentSubContext === 'DEAT') {
          if (tag === 'DATE') currentIndi.deathDate = value;
          if (tag === 'PLAC') currentIndi.deathPlace = value;
        } else if (currentSubContext === 'NOTE' && currentNoteOwner === 'INDI' && lastNoteIndex >= 0) {
          if (tag === 'CONT') {
            currentIndi.notes[lastNoteIndex] += '\n' + value;
          } else if (tag === 'CONC') {
            currentIndi.notes[lastNoteIndex] += value;
          }
        } else if (currentSubContext === 'RESI') {
          if (tag === 'EMAIL') currentIndi.customAttributes['Email'] = value.replace('@@', '@');
          if (tag === 'PLAC') currentIndi.customAttributes['Residence'] = value;
        } else {
          if (value) {
            currentIndi.customAttributes[tag] = value;
          }
        }
      }
      continue;
    }

    // Handle Family attributes
    if (currentEntity === 'FAM' && currentFam) {
      if (level === 1) {
        currentSubContext = null;

        switch (tag) {
          case 'HUSB':
            currentFam.husbandId = value;
            break;
          case 'WIFE':
            currentFam.wifeId = value;
            break;
          case 'CHIL':
            if (!currentFam.children.includes(value)) {
              currentFam.children.push(value);
            }
            break;
          case 'MARR':
            currentSubContext = 'MARR';
            break;
          case 'NOTE':
            currentSubContext = 'NOTE';
            currentNoteOwner = 'FAM';
            currentFam.notes.push(value);
            lastNoteIndex = currentFam.notes.length - 1;
            break;
          default:
            if (value && currentFam.customAttributes) {
              currentFam.customAttributes[tag] = value;
            }
            break;
        }
      } else if (level === 2) {
        if (currentSubContext === 'MARR') {
          if (tag === 'DATE') currentFam.marriageDate = value;
          if (tag === 'PLAC') currentFam.marriagePlace = value;
        } else if (currentSubContext === 'NOTE' && currentNoteOwner === 'FAM' && lastNoteIndex >= 0) {
          if (tag === 'CONT') {
            currentFam.notes[lastNoteIndex] += '\n' + value;
          } else if (tag === 'CONC') {
            currentFam.notes[lastNoteIndex] += value;
          }
        }
      }
      continue;
    }
  }

  // Final flush
  if (currentIndi) {
    individuals[currentIndi.id] = currentIndi;
  }
  if (currentFam) {
    families[currentFam.id] = currentFam;
  }

  // Cross-reference sync: ensure bi-directional consistency
  for (const fam of Object.values(families)) {
    if (fam.husbandId && individuals[fam.husbandId]) {
      if (!individuals[fam.husbandId].fams.includes(fam.id)) {
        individuals[fam.husbandId].fams.push(fam.id);
      }
    }
    if (fam.wifeId && individuals[fam.wifeId]) {
      if (!individuals[fam.wifeId].fams.includes(fam.id)) {
        individuals[fam.wifeId].fams.push(fam.id);
      }
    }
    for (const childId of fam.children) {
      if (individuals[childId]) {
        if (!individuals[childId].famc) {
          individuals[childId].famc = fam.id;
        }
      }
    }
  }

  // Clean and finalize names and living status
  for (const indi of Object.values(individuals)) {
    if (!indi.name) {
      const parts = [indi.givenName, indi.surname].filter(Boolean);
      indi.name = parts.length > 0 ? parts.join(' ') : 'Unknown Individual';
    }
    // Living status calculation if not explicitly marked dead
    if (indi.isLiving) {
      const birthYear = extractYear(indi.birthDate);
      const currentYear = new Date().getFullYear();
      if (indi.deathDate) {
        indi.isLiving = false;
      } else if (birthYear && currentYear - birthYear > 115) {
        indi.isLiving = false;
      }
    }
  }

  // Extract metadata
  const metadata: TreeMetadata = {
    fileName,
    lastModified: new Date().toISOString(),
    rawHeaderLines,
  };

  for (const line of rawHeaderLines) {
    if (line.includes('CHAR')) {
      const parts = line.split(/\s+/);
      metadata.charset = parts[2] || 'UTF-8';
    }
    if (line.includes('LANG')) {
      const parts = line.split(/\s+/);
      metadata.language = parts[2] || 'Hebrew';
    }
    if (line.includes('SOUR')) {
      metadata.source = line.replace(/^\d+\s+SOUR\s+/, '').trim();
    }
    if (line.includes('VERS')) {
      metadata.version = line.replace(/^\d+\s+VERS\s+/, '').trim();
    }
  }

  return {
    individuals,
    families,
    metadata,
  };
}

export function extractYear(dateStr?: string): number | null {
  if (!dateStr) return null;
  const match = dateStr.match(/\b(1\d{3}|20\d{2})\b/);
  return match ? parseInt(match[1], 10) : null;
}
