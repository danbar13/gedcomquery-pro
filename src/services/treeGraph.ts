import { GedcomTree, Individual, Family, KinshipResult } from '../types/gedcom';

/**
 * Gets parents of an individual.
 */
export function getParents(tree: GedcomTree, personId: string): Individual[] {
  const indi = tree.individuals[personId];
  if (!indi || !indi.famc) return [];
  const fam = tree.families[indi.famc];
  if (!fam) return [];

  const parents: Individual[] = [];
  if (fam.husbandId && tree.individuals[fam.husbandId]) {
    parents.push(tree.individuals[fam.husbandId]);
  }
  if (fam.wifeId && tree.individuals[fam.wifeId]) {
    parents.push(tree.individuals[fam.wifeId]);
  }
  return parents;
}

/**
 * Gets spouses of an individual along with the corresponding family record.
 */
export function getSpouses(tree: GedcomTree, personId: string): { spouse: Individual; family: Family }[] {
  const indi = tree.individuals[personId];
  if (!indi || !indi.fams) return [];

  const results: { spouse: Individual; family: Family }[] = [];
  for (const famId of indi.fams) {
    const fam = tree.families[famId];
    if (!fam) continue;

    const spouseId = fam.husbandId === personId ? fam.wifeId : fam.husbandId;
    if (spouseId && tree.individuals[spouseId]) {
      results.push({
        spouse: tree.individuals[spouseId],
        family: fam,
      });
    }
  }
  return results;
}

/**
 * Gets children of an individual.
 */
export function getChildren(tree: GedcomTree, personId: string): Individual[] {
  const indi = tree.individuals[personId];
  if (!indi || !indi.fams) return [];

  const childMap = new Map<string, Individual>();
  for (const famId of indi.fams) {
    const fam = tree.families[famId];
    if (!fam) continue;
    for (const chId of fam.children) {
      if (tree.individuals[chId]) {
        childMap.set(chId, tree.individuals[chId]);
      }
    }
  }
  return Array.from(childMap.values());
}

/**
 * Gets siblings of an individual (sharing at least one parent).
 */
export function getSiblings(tree: GedcomTree, personId: string): Individual[] {
  const indi = tree.individuals[personId];
  if (!indi || !indi.famc) return [];
  const fam = tree.families[indi.famc];
  if (!fam) return [];

  return fam.children
    .filter(chId => chId !== personId && tree.individuals[chId])
    .map(chId => tree.individuals[chId]);
}

/**
 * Generational Ancestors traversal.
 */
export function getAncestors(
  tree: GedcomTree,
  personId: string,
  maxGenerations = 5
): { person: Individual; generation: number; relationship: string }[] {
  const results: { person: Individual; generation: number; relationship: string }[] = [];
  const visited = new Set<string>();

  function traverse(currentId: string, gen: number) {
    if (gen > maxGenerations || visited.has(currentId)) return;
    visited.add(currentId);

    const parents = getParents(tree, currentId);
    for (const p of parents) {
      let rel = '';
      if (gen === 1) rel = p.sex === 'M' ? 'Father' : p.sex === 'F' ? 'Mother' : 'Parent';
      else if (gen === 2) rel = p.sex === 'M' ? 'Grandfather' : p.sex === 'F' ? 'Grandmother' : 'Grandparent';
      else if (gen === 3) rel = `Great-Grandparent (${p.sex === 'M' ? 'M' : 'F'})`;
      else rel = `${gen - 2}x Great-Grandparent`;

      results.push({ person: p, generation: gen, relationship: rel });
      traverse(p.id, gen + 1);
    }
  }

  traverse(personId, 1);
  return results;
}

/**
 * Generational Descendants traversal.
 */
export function getDescendants(
  tree: GedcomTree,
  personId: string,
  maxGenerations = 5
): { person: Individual; generation: number; relationship: string }[] {
  const results: { person: Individual; generation: number; relationship: string }[] = [];
  const visited = new Set<string>();

  function traverse(currentId: string, gen: number) {
    if (gen > maxGenerations || visited.has(currentId)) return;
    visited.add(currentId);

    const children = getChildren(tree, currentId);
    for (const ch of children) {
      let rel = '';
      if (gen === 1) rel = ch.sex === 'M' ? 'Son' : ch.sex === 'F' ? 'Daughter' : 'Child';
      else if (gen === 2) rel = ch.sex === 'M' ? 'Grandson' : ch.sex === 'F' ? 'Granddaughter' : 'Grandchild';
      else if (gen === 3) rel = `Great-Grandchild`;
      else rel = `${gen - 2}x Great-Grandchild`;

      results.push({ person: ch, generation: gen, relationship: rel });
      traverse(ch.id, gen + 1);
    }
  }

  traverse(personId, 1);
  return results;
}

/**
 * Finds shortest relationship path in the graph (BFS bidirectional graph)
 * and determines kinship description.
 */
export function calculateKinship(
  tree: GedcomTree,
  personAId: string,
  personBId: string
): KinshipResult | null {
  const personA = tree.individuals[personAId];
  const personB = tree.individuals[personBId];
  if (!personA || !personB) return null;

  if (personAId === personBId) {
    return {
      personA,
      personB,
      relationshipEn: 'Self',
      relationshipHe: 'אותו אדם',
      degrees: 0,
      path: [personA],
      pathDescription: 'Same person',
      isConsanguineous: true,
    };
  }

  // Build adjacency graph of individuals
  // Neighbor types: parent, child, spouse, sibling
  const adj = new Map<string, { id: string; role: 'parent' | 'child' | 'spouse' | 'sibling' }[]>();

  for (const indi of Object.values(tree.individuals)) {
    const neighbors: { id: string; role: 'parent' | 'child' | 'spouse' | 'sibling' }[] = [];

    // Parents
    for (const p of getParents(tree, indi.id)) {
      neighbors.push({ id: p.id, role: 'parent' });
    }
    // Children
    for (const c of getChildren(tree, indi.id)) {
      neighbors.push({ id: c.id, role: 'child' });
    }
    // Spouses
    for (const sp of getSpouses(tree, indi.id)) {
      neighbors.push({ id: sp.spouse.id, role: 'spouse' });
    }
    // Siblings
    for (const sib of getSiblings(tree, indi.id)) {
      neighbors.push({ id: sib.id, role: 'sibling' });
    }

    adj.set(indi.id, neighbors);
  }

  // BFS to find shortest path
  const queue: { id: string; path: string[] }[] = [{ id: personAId, path: [personAId] }];
  const visited = new Set<string>([personAId]);

  let foundPath: string[] | null = null;

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.id === personBId) {
      foundPath = current.path;
      break;
    }

    const neighbors = adj.get(current.id) || [];
    for (const nb of neighbors) {
      if (!visited.has(nb.id)) {
        visited.add(nb.id);
        queue.push({ id: nb.id, path: [...current.path, nb.id] });
      }
    }
  }

  if (!foundPath) return null;

  const pathIndividuals = foundPath.map(id => tree.individuals[id]).filter(Boolean);

  // Compute specialized consanguinity / lineage name
  const { en, he, isConsanguineous } = determineRelationshipName(tree, personA, personB, foundPath);

  return {
    personA,
    personB,
    relationshipEn: en,
    relationshipHe: he,
    degrees: foundPath.length - 1,
    path: pathIndividuals,
    pathDescription: pathIndividuals.map(p => p.name).join(' → '),
    isConsanguineous,
  };
}

/**
 * Determines natural English and Hebrew kinship titles based on graph path & ancestry
 */
function determineRelationshipName(
  tree: GedcomTree,
  personA: Individual,
  personB: Individual,
  path: string[]
): { en: string; he: string; isConsanguineous: boolean } {
  const steps = path.length - 1;
  const isFemale = personB.sex === 'F';
  const isMale = personB.sex === 'M';

  // 1 step: immediate
  if (steps === 1) {
    const parentsOfA = getParents(tree, personA.id).map(p => p.id);
    const parentsOfB = getParents(tree, personB.id).map(p => p.id);
    const spousesOfA = getSpouses(tree, personA.id).map(s => s.spouse.id);

    if (parentsOfA.includes(personB.id)) {
      return {
        en: isFemale ? 'Mother' : isMale ? 'Father' : 'Parent',
        he: isFemale ? 'אם' : isMale ? 'אב' : 'הורה',
        isConsanguineous: true,
      };
    }
    if (parentsOfB.includes(personA.id)) {
      return {
        en: isFemale ? 'Daughter' : isMale ? 'Son' : 'Child',
        he: isFemale ? 'בת' : isMale ? 'בן' : 'ילד/ה',
        isConsanguineous: true,
      };
    }
    if (spousesOfA.includes(personB.id)) {
      return {
        en: isFemale ? 'Wife' : isMale ? 'Husband' : 'Spouse',
        he: isFemale ? 'רעיה / בת זוג' : isMale ? 'בעל / בן זוג' : 'בן/בת זוג',
        isConsanguineous: false,
      };
    }
    // Sibling directly
    return {
      en: isFemale ? 'Sister' : isMale ? 'Brother' : 'Sibling',
      he: isFemale ? 'אחות' : isMale ? 'אח' : 'אח/ות',
      isConsanguineous: true,
    };
  }

  // 2 steps
  if (steps === 2) {
    const intermediate = tree.individuals[path[1]];
    const parentsOfA = getParents(tree, personA.id).map(p => p.id);
    const childrenOfA = getChildren(tree, personA.id).map(c => c.id);

    // Grandparent?
    if (parentsOfA.includes(intermediate.id) && getParents(tree, intermediate.id).some(gp => gp.id === personB.id)) {
      const side = intermediate.sex === 'F' ? 'Maternal' : 'Paternal';
      const sideHe = intermediate.sex === 'F' ? 'מצד האם' : 'מצד האב';
      return {
        en: `${side} ${isFemale ? 'Grandmother' : isMale ? 'Grandfather' : 'Grandparent'}`,
        he: `${isFemale ? 'סבתא' : 'סבא'} ${sideHe}`,
        isConsanguineous: true,
      };
    }

    // Grandchild?
    if (childrenOfA.includes(intermediate.id) && getChildren(tree, intermediate.id).some(gc => gc.id === personB.id)) {
      return {
        en: isFemale ? 'Granddaughter' : isMale ? 'Grandson' : 'Grandchild',
        he: isFemale ? 'נכדה' : isMale ? 'נכד' : 'נכד/ה',
        isConsanguineous: true,
      };
    }

    // Uncle / Aunt? (parent's sibling)
    if (parentsOfA.includes(intermediate.id) && getSiblings(tree, intermediate.id).some(s => s.id === personB.id)) {
      const side = intermediate.sex === 'F' ? 'Maternal' : 'Paternal';
      const sideHe = intermediate.sex === 'F' ? 'מצד האם' : 'מצד האב';
      return {
        en: `${side} ${isFemale ? 'Aunt' : isMale ? 'Uncle' : 'Aunt/Uncle'}`,
        he: `${isFemale ? 'דודה' : 'דוד'} ${sideHe}`,
        isConsanguineous: true,
      };
    }

    // Nephew / Niece? (sibling's child)
    if (getSiblings(tree, personA.id).some(s => s.id === intermediate.id) && getChildren(tree, intermediate.id).some(c => c.id === personB.id)) {
      return {
        en: isFemale ? 'Niece' : isMale ? 'Nephew' : 'Niece/Nephew',
        he: isFemale ? 'אחיינית' : isMale ? 'אחיין' : 'אחיין/נית',
        isConsanguineous: true,
      };
    }

    // Sibling via parent intermediate
    if (parentsOfA.includes(intermediate.id) && getChildren(tree, intermediate.id).some(c => c.id === personB.id)) {
      return {
        en: isFemale ? 'Sister' : isMale ? 'Brother' : 'Sibling',
        he: isFemale ? 'אחות' : isMale ? 'אח' : 'אח/ות',
        isConsanguineous: true,
      };
    }
  }

  // Check if Person B is a direct ancestor of Person A
  const ancestorsOfA = getAncestors(tree, personA.id, 8);
  const ancestorMatch = ancestorsOfA.find(a => a.person.id === personB.id);
  if (ancestorMatch) {
    const gen = ancestorMatch.generation;
    if (gen === 3) {
      return {
        en: isFemale ? 'Great-Grandmother' : isMale ? 'Great-Grandfather' : 'Great-Grandparent',
        he: isFemale ? 'סבתא רבא' : isMale ? 'סבא רבא' : 'הורה-סב קדמון',
        isConsanguineous: true,
      };
    }
    return {
      en: `Direct Ancestor (${gen} generations)`,
      he: `אב/אם קדמון ישיר (${gen} דורות אחורה)`,
      isConsanguineous: true,
    };
  }

  // Check if Person B is a direct descendant of Person A
  const descendantsOfA = getDescendants(tree, personA.id, 8);
  const descendantMatch = descendantsOfA.find(d => d.person.id === personB.id);
  if (descendantMatch) {
    const gen = descendantMatch.generation;
    if (gen === 3) {
      return {
        en: isFemale ? 'Great-Granddaughter' : isMale ? 'Great-Grandson' : 'Great-Grandchild',
        he: isFemale ? 'נינה' : isMale ? 'נין' : 'נין/נינה',
        isConsanguineous: true,
      };
    }
    return {
      en: `Direct Descendant (${gen} generations)`,
      he: `צאצא ישיר (${gen} דורות קדימה)`,
      isConsanguineous: true,
    };
  }

  // Cousin checks:
  // First cousins share grandparents
  const grandParentsA = new Set<string>();
  for (const p of getParents(tree, personA.id)) {
    for (const gp of getParents(tree, p.id)) {
      grandParentsA.add(gp.id);
    }
  }
  const grandParentsB = new Set<string>();
  for (const p of getParents(tree, personB.id)) {
    for (const gp of getParents(tree, p.id)) {
      grandParentsB.add(gp.id);
    }
  }

  let sharesGrandparent = false;
  for (const gpId of grandParentsA) {
    if (grandParentsB.has(gpId)) {
      sharesGrandparent = true;
      break;
    }
  }

  if (sharesGrandparent) {
    return {
      en: isFemale ? 'First Cousin (female)' : isMale ? 'First Cousin (male)' : 'First Cousin',
      he: isFemale ? 'בת דוד ראשונה' : isMale ? 'בן דוד ראשון' : 'בן/בת דוד ראשון',
      isConsanguineous: true,
    };
  }

  // Default fallback according to path length
  return {
    en: `Relative (${steps} degrees of separation)`,
    he: `קרוב/ת משפחה (${steps} דרגות קרבה)`,
    isConsanguineous: steps <= 4,
  };
}
