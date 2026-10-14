import { GedcomTree, ValidationAnomaly } from '../types/gedcom';
import { extractYear } from './gedcomParser';
import { getParents, getChildren } from './treeGraph';

/**
 * Validates the tree and detects data anomalies and quality issues.
 */
export function validateTree(tree: GedcomTree): ValidationAnomaly[] {
  const anomalies: ValidationAnomaly[] = [];
  const currentYear = new Date().getFullYear();

  for (const indi of Object.values(tree.individuals)) {
    const bYear = extractYear(indi.birthDate);
    const dYear = extractYear(indi.deathDate);

    // Rule 1: Death prior to birth
    if (bYear && dYear && dYear < bYear) {
      anomalies.push({
        id: `anom_death_before_birth_${indi.id}`,
        individualId: indi.id,
        individualName: indi.name,
        severity: 'error',
        type: 'death_before_birth',
        description: 'Death occurs before birth',
        details: `Recorded birth is ${indi.birthDate} (${bYear}), but recorded death is ${indi.deathDate} (${dYear}).`,
      });
    }

    // Rule 2: Implausible lifespan (> 115 years)
    if (bYear && dYear && dYear - bYear > 115) {
      anomalies.push({
        id: `anom_lifespan_${indi.id}`,
        individualId: indi.id,
        individualName: indi.name,
        severity: 'warning',
        type: 'implausible_lifespan',
        description: 'Implausible lifespan (> 115 years)',
        details: `Calculated lifespan is ${dYear - bYear} years (${bYear} to ${dYear}).`,
      });
    } else if (bYear && !dYear && indi.isLiving && currentYear - bYear > 115) {
      anomalies.push({
        id: `anom_living_old_${indi.id}`,
        individualId: indi.id,
        individualName: indi.name,
        severity: 'warning',
        type: 'implausible_lifespan',
        description: 'Marked living but over 115 years old',
        details: `Born in ${bYear} (${currentYear - bYear} years ago) with no recorded death date.`,
      });
    }

    // Rule 3: Parent / Child age constraints
    const parents = getParents(tree, indi.id);
    for (const parent of parents) {
      const parentBYear = extractYear(parent.birthDate);
      if (bYear && parentBYear) {
        // Parent born after child
        if (parentBYear > bYear) {
          anomalies.push({
            id: `anom_parent_younger_${indi.id}_${parent.id}`,
            individualId: indi.id,
            individualName: indi.name,
            severity: 'error',
            type: 'parent_born_after_child',
            description: 'Parent born after child',
            details: `Parent ${parent.name} was born in ${parentBYear}, which is after child's birth in ${bYear}.`,
          });
        } else {
          const ageAtChildBirth = bYear - parentBYear;
          if (ageAtChildBirth < 13) {
            anomalies.push({
              id: `anom_parent_too_young_${indi.id}_${parent.id}`,
              individualId: indi.id,
              individualName: indi.name,
              severity: 'error',
              type: 'parent_too_young',
              description: 'Parent implausibly young at child birth (< 13 years)',
              details: `Parent ${parent.name} was approximately ${ageAtChildBirth} years old when ${indi.name} was born.`,
            });
          } else if (ageAtChildBirth > 70) {
            anomalies.push({
              id: `anom_parent_too_old_${indi.id}_${parent.id}`,
              individualId: indi.id,
              individualName: indi.name,
              severity: 'warning',
              type: 'parent_too_old',
              description: 'Parent unusually old at child birth (> 70 years)',
              details: `Parent ${parent.name} was approximately ${ageAtChildBirth} years old when ${indi.name} was born.`,
            });
          }
        }
      }
    }

    // Rule 4: Missing essential dates (Research candidates)
    if (!indi.birthDate) {
      anomalies.push({
        id: `anom_missing_birth_${indi.id}`,
        individualId: indi.id,
        individualName: indi.name,
        severity: 'info',
        type: 'missing_birth',
        description: 'Missing birth date',
        details: `No birth date recorded. Prime candidate for web discovery and historical records enrichment.`,
      });
    }

    if (!indi.isLiving && !indi.deathDate) {
      anomalies.push({
        id: `anom_missing_death_${indi.id}`,
        individualId: indi.id,
        individualName: indi.name,
        severity: 'info',
        type: 'missing_death',
        description: 'Missing death date for deceased individual',
        details: `Identified as deceased or historical person, but missing death date and burial records.`,
      });
    }
  }

  return anomalies;
}
