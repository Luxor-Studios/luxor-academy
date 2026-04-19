/**
 * HALCON Query System
 *
 * Natural language astrological query system that enables advanced practitioners
 * to investigate chart phenomena with Claude AI as a knowledgeable collaborator.
 *
 * @module lib/query
 */

// Re-export all types
export * from './types.js';

// Re-export aspect calculator functions
export {
  calculateAngleDifference,
  isAspectApplying,
  estimateDaysToExact,
  calculateTransitToNatalAspects,
  calculateProgressedToNatalAspects,
  filterSignificantAspects,
  groupAspectsByTransitPlanet,
  getMostSignificantTransits,
  findAspectsInvolvingPlanet
} from './aspect-calculator.js';

// Re-export prompt builder functions
export {
  SYSTEM_PROMPT,
  buildSystemPrompt,
  buildUserPrompt,
  buildPromptPair,
  estimatePromptTokens
} from './prompt-builder.js';
