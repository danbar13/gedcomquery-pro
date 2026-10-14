import { GedcomTree } from '../types/gedcom';
import { parseGedcom } from './gedcomParser';

export interface IngestionResult {
  tree: GedcomTree;
  fileName: string;
  fileSizeBytes: number;
  individualCount: number;
  familyCount: number;
  encodingUsed: string;
}

/**
 * Safely reads and parses a GEDCOM File object in the browser.
 * Supports UTF-8 (with or without BOM) and falls back to Windows-1255 (Hebrew ANSI)
 * if UTF-8 produces replacement characters (\uFFFD).
 */
export async function ingestGedcomFile(file: File): Promise<IngestionResult> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  let text = '';
  let encodingUsed = 'UTF-8';

  // Try UTF-8 first
  try {
    const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
    const decoded = utf8Decoder.decode(bytes);

    // If there are replacement characters and the file might be Hebrew ANSI
    const replacementCount = (decoded.match(/\uFFFD/g) || []).length;
    if (replacementCount > 3) {
      try {
        const hebrewDecoder = new TextDecoder('windows-1255', { fatal: false });
        const hebrewDecoded = hebrewDecoder.decode(bytes);
        text = hebrewDecoded;
        encodingUsed = 'windows-1255';
      } catch {
        text = decoded;
      }
    } else {
      text = decoded;
    }
  } catch {
    // Fallback to basic string
    text = new TextDecoder().decode(bytes);
  }

  // Basic GEDCOM signature check
  if (!text.includes('HEAD') && !text.includes('INDI') && !text.includes('FAM')) {
    throw new Error('הקובץ שנבחר אינו נראה כקובץ GEDCOM תקני (לא זוהו תגיות HEAD, INDI או FAM).');
  }

  const tree = parseGedcom(text, file.name);

  const individualCount = Object.keys(tree.individuals).length;
  const familyCount = Object.keys(tree.families).length;

  return {
    tree,
    fileName: file.name,
    fileSizeBytes: file.size,
    individualCount,
    familyCount,
    encodingUsed,
  };
}
