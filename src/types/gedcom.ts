export type Sex = 'M' | 'F' | 'U';
export type RelativeRole = 'father' | 'mother' | 'spouse' | 'child' | 'brother' | 'sister';

export interface Individual {
  id: string; // e.g., "@I1@"
  name: string; // Full display name
  givenName: string;
  surname: string;
  sex: Sex;
  birthDate: string;
  birthPlace: string;
  deathDate: string;
  deathPlace: string;
  famc: string | null; // Family ID where this person is child
  fams: string[]; // Family IDs where this person is spouse/parent
  notes: string[];
  customAttributes: Record<string, string>;
  isLiving?: boolean;
}

export interface Family {
  id: string; // e.g., "@F1@"
  husbandId: string | null;
  wifeId: string | null;
  children: string[];
  marriageDate: string;
  marriagePlace: string;
  notes: string[];
  customAttributes?: Record<string, string>;
}

export interface TreeMetadata {
  source?: string;
  version?: string;
  charset?: string;
  language?: string;
  rawHeaderLines: string[];
  fileName?: string;
  lastModified?: string;
}

export interface GedcomTree {
  individuals: Record<string, Individual>;
  families: Record<string, Family>;
  metadata: TreeMetadata;
}

export type AnomalySeverity = 'error' | 'warning' | 'info';

export type AnomalyType =
  | 'parent_born_after_child'
  | 'parent_too_young'
  | 'parent_too_old'
  | 'death_before_birth'
  | 'implausible_lifespan'
  | 'missing_birth'
  | 'missing_death';

export interface ValidationAnomaly {
  id: string;
  individualId: string;
  individualName: string;
  severity: AnomalySeverity;
  type: AnomalyType;
  description: string;
  details: string;
}

export interface ProposedField {
  field: 'birthDate' | 'birthPlace' | 'deathDate' | 'deathPlace' | 'father' | 'mother' | 'spouse' | 'note';
  label: string;
  currentValue: string;
  proposedValue: string;
  confidence: 'high' | 'medium' | 'low';
  source: string;
  citationUrl?: string;
  accepted?: boolean;
}

export interface ResearchDiscovery {
  individualId: string;
  individualName: string;
  proposedFields: ProposedField[];
  biographicalSummary: string;
  historicalContext: string;
  sources: { title: string; url?: string; snippet?: string }[];
  searchQueriesUsed: string[];
  groundingEnabled: boolean;
  generatedAt: string;
}

export interface KinshipResult {
  personA: Individual;
  personB: Individual;
  relationshipEn: string;
  relationshipHe: string;
  degrees: number;
  path: Individual[];
  pathDescription: string;
  isConsanguineous: boolean;
}
