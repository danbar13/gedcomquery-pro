import { GedcomTree, Individual, Family } from '../types/gedcom';

/**
 * Serializes the in-memory GedcomTree back to standard GEDCOM 5.5.1 UTF-8 text.
 */
export function serializeToGedcom(tree: GedcomTree): string {
  const lines: string[] = [];

  // Header
  lines.push('0 HEAD');
  lines.push('1 GEDC');
  lines.push('2 VERS 5.5.1');
  lines.push('2 FORM LINEAGE-LINKED');
  lines.push('1 CHAR UTF-8');
  lines.push('1 SOUR GEDCOMQUERY_PRO');
  lines.push('2 NAME GedcomQuery Pro');
  lines.push('2 VERS 1.0.0');
  lines.push(`1 DATE ${formatCurrentGedcomDate()}`);
  if (tree.metadata.language) {
    lines.push(`1 LANG ${tree.metadata.language}`);
  }

  // Individuals
  const indiList = Object.values(tree.individuals);
  for (const indi of indiList) {
    lines.push(`0 ${indi.id} INDI`);

    // Name formatting
    const sName = indi.surname ? `/${indi.surname}/` : '';
    const gName = indi.givenName || '';
    const fullNameGedcom = gName && sName ? `${gName} ${sName}` : (indi.name ? indi.name : 'Unknown');
    lines.push(`1 NAME ${fullNameGedcom}`);
    if (indi.givenName) lines.push(`2 GIVN ${indi.givenName}`);
    if (indi.surname) lines.push(`2 SURN ${indi.surname}`);

    // Sex
    if (indi.sex && indi.sex !== 'U') {
      lines.push(`1 SEX ${indi.sex}`);
    }

    // Birth
    if (indi.birthDate || indi.birthPlace) {
      lines.push('1 BIRT');
      if (indi.birthDate) lines.push(`2 DATE ${indi.birthDate}`);
      if (indi.birthPlace) lines.push(`2 PLAC ${indi.birthPlace}`);
    }

    // Death
    if (indi.deathDate || indi.deathPlace || indi.isLiving === false) {
      lines.push('1 DEAT');
      if (indi.deathDate) lines.push(`2 DATE ${indi.deathDate}`);
      if (indi.deathPlace) lines.push(`2 PLAC ${indi.deathPlace}`);
    }

    // Family links
    if (indi.famc) {
      lines.push(`1 FAMC ${indi.famc}`);
    }
    for (const famsId of indi.fams) {
      lines.push(`1 FAMS ${famsId}`);
    }

    // Notes
    for (const note of indi.notes) {
      const noteLines = note.split('\n');
      lines.push(`1 NOTE ${noteLines[0]}`);
      for (let i = 1; i < noteLines.length; i++) {
        lines.push(`2 CONT ${noteLines[i]}`);
      }
    }

    // Custom Attributes
    for (const [key, val] of Object.entries(indi.customAttributes || {})) {
      if (['RIN', '_UID', 'OCCU', 'EDUC', 'EMAIL'].includes(key)) {
        lines.push(`1 ${key} ${val}`);
      }
    }
  }

  // Families
  const famList = Object.values(tree.families);
  for (const fam of famList) {
    lines.push(`0 ${fam.id} FAM`);
    if (fam.husbandId) lines.push(`1 HUSB ${fam.husbandId}`);
    if (fam.wifeId) lines.push(`1 WIFE ${fam.wifeId}`);
    for (const childId of fam.children) {
      lines.push(`1 CHIL ${childId}`);
    }

    // Marriage
    if (fam.marriageDate || fam.marriagePlace) {
      lines.push('1 MARR');
      if (fam.marriageDate) lines.push(`2 DATE ${fam.marriageDate}`);
      if (fam.marriagePlace) lines.push(`2 PLAC ${fam.marriagePlace}`);
    }

    // Notes
    for (const note of fam.notes) {
      const noteLines = note.split('\n');
      lines.push(`1 NOTE ${noteLines[0]}`);
      for (let i = 1; i < noteLines.length; i++) {
        lines.push(`2 CONT ${noteLines[i]}`);
      }
    }
  }

  // Trailer
  lines.push('0 TRLR');

  return lines.join('\r\n') + '\r\n';
}

function formatCurrentGedcomDate(): string {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const d = new Date();
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Exports individuals table as CSV
 */
export function exportToCSV(individuals: Individual[]): string {
  const headers = ['ID', 'Full Name', 'Given Name', 'Surname', 'Gender', 'Birth Date', 'Birth Place', 'Death Date', 'Death Place', 'Is Living', 'Notes'];
  
  const rows = individuals.map(i => [
    i.id,
    `"${(i.name || '').replace(/"/g, '""')}"`,
    `"${(i.givenName || '').replace(/"/g, '""')}"`,
    `"${(i.surname || '').replace(/"/g, '""')}"`,
    i.sex,
    `"${(i.birthDate || '').replace(/"/g, '""')}"`,
    `"${(i.birthPlace || '').replace(/"/g, '""')}"`,
    `"${(i.deathDate || '').replace(/"/g, '""')}"`,
    `"${(i.deathPlace || '').replace(/"/g, '""')}"`,
    i.isLiving ? 'Yes' : 'No',
    `"${(i.notes.join('; ') || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

/**
 * Exports tree data as clean JSON
 */
export function exportToJSON(tree: GedcomTree): string {
  return JSON.stringify(
    {
      metadata: tree.metadata,
      individuals: Object.values(tree.individuals),
      families: Object.values(tree.families),
    },
    null,
    2
  );
}

/**
 * Builds an LLM Biographical Narrative prompt for an individual
 */
export function buildAIBiographyPrompt(indi: Individual, tree: GedcomTree): string {
  const parents: string[] = [];
  if (indi.famc && tree.families[indi.famc]) {
    const f = tree.families[indi.famc];
    if (f.husbandId && tree.individuals[f.husbandId]) {
      parents.push(`Father: ${tree.individuals[f.husbandId].name}`);
    }
    if (f.wifeId && tree.individuals[f.wifeId]) {
      parents.push(`Mother: ${tree.individuals[f.wifeId].name}`);
    }
  }

  const spouses: string[] = [];
  const children: string[] = [];
  for (const famId of indi.fams) {
    const f = tree.families[famId];
    if (f) {
      const spouseId = indi.sex === 'M' ? f.wifeId : f.husbandId;
      if (spouseId && tree.individuals[spouseId]) {
        spouses.push(`${tree.individuals[spouseId].name} (Married: ${f.marriageDate || 'Unknown date'}, ${f.marriagePlace || ''})`);
      }
      for (const chId of f.children) {
        if (tree.individuals[chId]) {
          children.push(tree.individuals[chId].name);
        }
      }
    }
  }

  return `You are a historical biographer and master genealogist.
Write a rich, empathetic, and historically anchored biographical story for the following person based on their family tree records:

Full Name: ${indi.name} (${indi.givenName || ''} ${indi.surname || ''})
Gender: ${indi.sex === 'M' ? 'Male' : indi.sex === 'F' ? 'Female' : 'Unknown'}
Birth: ${indi.birthDate || 'Unknown date'} in ${indi.birthPlace || 'Unknown location'}
Death: ${indi.isLiving ? 'Still living / Active' : `${indi.deathDate || 'Unknown date'} in ${indi.deathPlace || 'Unknown location'}`}
${parents.length > 0 ? `Parents:\n- ${parents.join('\n- ')}` : ''}
${spouses.length > 0 ? `Spouse(s):\n- ${spouses.join('\n- ')}` : ''}
${children.length > 0 ? `Children:\n- ${children.join('\n- ')}` : ''}
${indi.notes.length > 0 ? `Notes & Archives:\n${indi.notes.join('\n')}` : ''}
${Object.keys(indi.customAttributes || {}).length > 0 ? `Additional Details:\n${JSON.stringify(indi.customAttributes, null, 2)}` : ''}

Style Requirements:
1. Provide a 3-part structured narrative:
   - Early Life & Family Origins (setting the historical context of the birth era and location).
   - Milestones, Family Life & Achievements.
   - Legacy & Enduring Memory.
2. Weave in the historical backdrop of their era and region.
3. Highlight missing mysteries or avenues for further archival discovery.
`;
}
