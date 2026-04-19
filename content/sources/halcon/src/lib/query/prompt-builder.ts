/**
 * HALCON Query System - Prompt Builder
 *
 * Builds structured prompts for Claude with complete astrological context.
 * Formats chart data, transits, progressions, and aspects into markdown tables
 * that Claude can reference when answering practitioner questions.
 *
 * @module lib/query/prompt-builder
 */

import {
  type QueryContext,
  type QueryDepth,
  type TransitNatalAspect,
  type ProgressedNatalAspect,
  DEPTH_CONFIGS,
  PLANET_KEYS,
  EXTENDED_PLANET_KEYS,
  ZODIAC_RULERS,
  HOUSE_THEMES
} from './types.js';
import { formatDegree } from '../display/formatters.js';

/**
 * System prompt for the astrologer collaborator persona
 */
export const SYSTEM_PROMPT = `You are an expert astrologer collaborating with an advanced practitioner.
You have been provided with complete, pre-calculated astrological data including:
- Natal chart with all planetary positions and house placements
- Current transits and their aspects to natal positions
- Secondary progressions (when available)
- All major and minor aspects

Your role:
1. UNDERSTAND the practitioner's specific question
2. IDENTIFY relevant placements from the provided data
3. RESEARCH any specialized concepts mentioned (e.g., "Venus Star Point", "Saturn return")
4. SYNTHESIZE insights combining the actual chart data with astrological knowledge
5. PROVIDE practical, insightful interpretation

Important Guidelines:
- Always reference ACTUAL positions from the data provided
- If the user mentions a placement that doesn't match the data, gently correct them
- Explain specialized concepts while showing how they apply to THIS specific chart
- Use the calculated aspects and house placements in your interpretation
- Frame interpretations as influences and opportunities, not fate
- Be specific: cite degrees, signs, houses, and orbs from the data
- For timing questions, use transit speeds and orbs to estimate
- Integrate transits, progressions, and natal chart when relevant

Response Style:
- Be conversational yet professional
- Use astrological terminology appropriate for an advanced practitioner
- Structure longer responses with clear sections
- Highlight the most significant patterns first`;

/**
 * Build the complete system prompt (may be customized by depth)
 */
export function buildSystemPrompt(depth: QueryDepth): string {
  const config = DEPTH_CONFIGS[depth];

  let prompt = SYSTEM_PROMPT;

  if (depth === 'quick') {
    prompt += `\n\nResponse Format: Provide a concise ${config.responseWordRange[0]}-${config.responseWordRange[1]} word response focused on the key insight.`;
  } else if (depth === 'standard') {
    prompt += `\n\nResponse Format: Provide a focused ${config.responseWordRange[0]}-${config.responseWordRange[1]} word response that addresses the question directly while incorporating relevant chart factors.`;
  } else {
    prompt += `\n\nResponse Format: Provide a comprehensive ${config.responseWordRange[0]}-${config.responseWordRange[1]} word integrated analysis. Include:
- Direct answer to the question
- Supporting evidence from natal placements
- Current transit influences
- Progressed chart developments
- Timing considerations
- Practical synthesis and advice`;
  }

  return prompt;
}

/**
 * Format natal positions table
 */
function formatNatalPositions(
  context: QueryContext,
  includeHouses: boolean = true
): string {
  const { natal, housePlacements } = context;
  const planetOrder = includeHouses ? EXTENDED_PLANET_KEYS : PLANET_KEYS;

  let output = `### Natal Positions`;
  if (includeHouses) {
    output += ` with House Placements\n`;
    output += `| Planet | Sign | Degree | House | Retrograde |\n`;
    output += `|--------|------|--------|-------|------------|\n`;
  } else {
    output += `\n| Planet | Sign | Degree | Retrograde |\n`;
    output += `|--------|------|--------|------------|\n`;
  }

  for (const key of planetOrder) {
    const body = natal.bodies[key as keyof typeof natal.bodies];
    if (!body) continue;

    const placement = housePlacements?.find(
      p => p.planet.toLowerCase() === body.name.toLowerCase()
    );

    if (includeHouses) {
      output += `| ${body.name} | ${body.sign} | ${body.signDegree.toFixed(2)}° | ${placement?.house || '-'} | ${body.retrograde ? 'R' : ''} |\n`;
    } else {
      output += `| ${body.name} | ${body.sign} | ${body.signDegree.toFixed(2)}° | ${body.retrograde ? 'R' : ''} |\n`;
    }
  }

  return output;
}

/**
 * Format natal angles
 */
function formatNatalAngles(context: QueryContext): string {
  const { natal } = context;

  return `
### Natal Angles
- **Ascendant (ASC)**: ${formatDegree(natal.angles.ascendant)} - Chart Ruler
- **Midheaven (MC)**: ${formatDegree(natal.angles.midheaven)} - Career/Public Image
- **Descendant (DSC)**: ${formatDegree(natal.angles.descendant)} - Relationships
- **IC (Imum Coeli)**: ${formatDegree(natal.angles.imumCoeli)} - Home/Roots
`;
}

/**
 * Format house cusps with rulers (for deep analysis)
 */
function formatHouseCusps(context: QueryContext): string {
  const { natal, housePlacements } = context;
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  let output = `### House Cusps & Rulers\n`;
  output += `| House | Sign | Ruler | Ruler Location | Theme |\n`;
  output += `|-------|------|-------|----------------|-------|\n`;

  for (let i = 0; i < 12; i++) {
    const cusp = natal.houses.cusps[i] ?? 0;
    const signIndex = Math.floor(cusp / 30);
    const sign = signs[signIndex] ?? 'Unknown';
    const ruler = ZODIAC_RULERS[sign]?.traditional ?? '-';

    // Find where the ruler is placed
    const rulerPlacement = housePlacements?.find(
      p => p.planet.toLowerCase() === ruler.toLowerCase()
    );
    const rulerLocation = rulerPlacement ? `House ${rulerPlacement.house}` : '-';

    output += `| ${i + 1} | ${sign} | ${ruler} | ${rulerLocation} | ${HOUSE_THEMES[i] ?? ''} |\n`;
  }

  return output;
}

/**
 * Format current transits table
 */
function formatTransits(context: QueryContext): string {
  const { transits, retrogradePlanets, moonPhase } = context;
  const today = new Date().toISOString().split('T')[0];

  let output = `### Current Transits (${today})\n`;
  output += `| Planet | Sign | Degree | Speed | Retrograde |\n`;
  output += `|--------|------|--------|-------|------------|\n`;

  for (const key of PLANET_KEYS) {
    const body = transits.bodies[key as keyof typeof transits.bodies];
    if (!body) continue;

    const speed = body.longitudeSpeed?.toFixed(3) ?? '-';
    output += `| ${body.name} | ${body.sign} | ${body.signDegree.toFixed(2)}° | ${speed}°/day | ${body.retrograde ? 'R' : ''} |\n`;
  }

  // Add retrograde planets summary
  if (retrogradePlanets.length > 0) {
    output += `\n**Retrograde Planets**: ${retrogradePlanets.join(', ')}\n`;
  }

  // Add moon phase if available
  if (moonPhase) {
    output += `\n**Moon Phase**: ${moonPhase.name} (${moonPhase.illumination.toFixed(1)}% illumination)\n`;
  }

  return output;
}

/**
 * Format transit-to-natal aspects
 */
function formatTransitAspects(
  aspects: TransitNatalAspect[],
  depth: QueryDepth
): string {
  if (aspects.length === 0) {
    return `### Transit-to-Natal Aspects\nNo significant transit aspects within orb.\n`;
  }

  const config = DEPTH_CONFIGS[depth];
  const showDetails = depth !== 'quick';

  let output = `### Transit-to-Natal Aspects (Active)\n`;

  if (showDetails) {
    output += `| Transit | Aspect | Natal | Orb | Status | Days to Exact |\n`;
    output += `|---------|--------|-------|-----|--------|---------------|\n`;
  } else {
    output += `| Transit | Aspect | Natal | Orb |\n`;
    output += `|---------|--------|-------|-----|\n`;
  }

  const filteredAspects = aspects.filter(a => a.orb <= config.transitOrbDegrees);

  for (const aspect of filteredAspects) {
    const status = aspect.isApplying ? 'Applying' : 'Separating';
    const daysStr = aspect.daysToExact !== null
      ? `${aspect.daysToExact > 0 ? '+' : ''}${aspect.daysToExact.toFixed(0)}d`
      : '-';

    if (showDetails) {
      output += `| ${aspect.transitingPlanet} | ${aspect.symbol} ${aspect.aspectType} | ${aspect.natalPlanet} | ${aspect.orb}° | ${status} | ${daysStr} |\n`;
    } else {
      output += `| ${aspect.transitingPlanet} | ${aspect.symbol} ${aspect.aspectType} | ${aspect.natalPlanet} | ${aspect.orb}° |\n`;
    }
  }

  return output;
}

/**
 * Format secondary progressions
 */
function formatProgressions(context: QueryContext): string {
  if (!context.progressed || !context.progression) {
    return '';
  }

  const { natal, progressed, progression } = context;

  let output = `### Secondary Progressions (Age ${progression.age.toFixed(1)})\n`;
  output += `**Progressed Date**: ${progression.progressedDate.toISOString().split('T')[0]}\n\n`;
  output += `| Planet | Natal | Progressed | Movement |\n`;
  output += `|--------|-------|------------|----------|\n`;

  for (const key of PLANET_KEYS) {
    const natalBody = natal.bodies[key as keyof typeof natal.bodies];
    const progBody = progressed.bodies[key as keyof typeof progressed.bodies];
    if (!natalBody || !progBody) continue;

    const movement = progBody.longitude - natalBody.longitude;
    // Normalize to -180 to 180
    const normalizedMovement = ((movement + 540) % 360) - 180;
    const movementStr = normalizedMovement >= 0 ? `+${normalizedMovement.toFixed(2)}°` : `${normalizedMovement.toFixed(2)}°`;

    output += `| ${natalBody.name} | ${natalBody.signDegree.toFixed(1)}° ${natalBody.sign} | ${progBody.signDegree.toFixed(1)}° ${progBody.sign} | ${movementStr} |\n`;
  }

  // Progressed angles
  output += `\n**Progressed Angles**:\n`;
  output += `- Progressed ASC: ${formatDegree(progressed.angles.ascendant)}\n`;
  output += `- Progressed MC: ${formatDegree(progressed.angles.midheaven)}\n`;

  return output;
}

/**
 * Format progressed-to-natal aspects
 */
function formatProgressedAspects(aspects?: ProgressedNatalAspect[]): string {
  if (!aspects || aspects.length === 0) {
    return '';
  }

  let output = `### Progressed-to-Natal Aspects\n`;
  output += `| Progressed | Aspect | Natal | Orb |\n`;
  output += `|------------|--------|-------|-----|\n`;

  for (const aspect of aspects) {
    output += `| ${aspect.progressedPlanet} | ${aspect.symbol} ${aspect.aspectType} | ${aspect.natalPlanet} | ${aspect.orb}° |\n`;
  }

  return output;
}

/**
 * Format natal aspects
 */
function formatNatalAspects(context: QueryContext, limit: number = 0): string {
  const { natalAspects } = context;

  if (natalAspects.length === 0) {
    return `### Natal Aspects\nNo major natal aspects.\n`;
  }

  const aspectsToShow = limit > 0 ? natalAspects.slice(0, limit) : natalAspects;
  const limitNote = limit > 0 && natalAspects.length > limit
    ? ` (top ${limit} by orb)`
    : '';

  let output = `### Natal Aspects${limitNote}\n`;
  output += `| Planet 1 | Aspect | Planet 2 | Orb |\n`;
  output += `|----------|--------|----------|-----|\n`;

  for (const aspect of aspectsToShow) {
    output += `| ${aspect.planet1} | ${aspect.aspect} | ${aspect.planet2} | ${aspect.orb}° |\n`;
  }

  return output;
}

/**
 * Build the complete user prompt with chart data and question
 */
export function buildUserPrompt(context: QueryContext): string {
  const { profile, progression, queryMeta } = context;
  const { depth, question } = queryMeta;
  const config = DEPTH_CONFIGS[depth];

  let output = `# Astrological Query\n\n`;

  // Question first
  output += `## Question\n${question}\n\n`;

  // Profile information
  output += `## Chart Data for ${profile.name || 'Subject'}\n\n`;
  output += `### Birth Information\n`;
  output += `- **Birth Date**: ${profile.birthDate.toISOString().split('T')[0]}\n`;
  output += `- **Birth Location**: ${profile.location.name} (${profile.location.latitude.toFixed(4)}°N, ${profile.location.longitude.toFixed(4)}°E)\n`;
  if (progression) {
    output += `- **Current Age**: ${progression.age.toFixed(1)} years\n`;
  }
  output += `\n`;

  // Natal positions (always included)
  output += formatNatalPositions(context, depth !== 'quick');
  output += `\n`;

  // Natal angles (always included)
  output += formatNatalAngles(context);
  output += `\n`;

  // House cusps with rulers (deep only)
  if (config.includeHouseRulers) {
    output += formatHouseCusps(context);
    output += `\n`;
  }

  // Current transits (always included)
  output += formatTransits(context);
  output += `\n`;

  // Transit-to-natal aspects
  output += formatTransitAspects(context.transitAspects, depth);
  output += `\n`;

  // Progressions (standard/deep only)
  if (config.includeProgressions) {
    const progressionsSection = formatProgressions(context);
    if (progressionsSection) {
      output += progressionsSection;
      output += `\n`;
    }

    // Progressed aspects (deep only)
    if (depth === 'deep') {
      const progressedAspectsSection = formatProgressedAspects(context.progressedAspects);
      if (progressedAspectsSection) {
        output += progressedAspectsSection;
        output += `\n`;
      }
    }
  }

  // Natal aspects
  output += formatNatalAspects(context, config.natalAspectLimit);
  output += `\n`;

  // Final instruction
  output += `---\n\n`;
  output += `Please analyze this chart data in response to the question above.`;

  return output;
}

/**
 * Build the complete prompt pair for Claude API
 */
export function buildPromptPair(context: QueryContext): {
  system: string;
  user: string;
  maxTokens: number;
} {
  const depth = context.queryMeta.depth;
  const config = DEPTH_CONFIGS[depth];

  return {
    system: buildSystemPrompt(depth),
    user: buildUserPrompt(context),
    maxTokens: config.maxTokens
  };
}

/**
 * Estimate prompt token count (rough approximation)
 * Claude uses ~4 characters per token on average
 */
export function estimatePromptTokens(context: QueryContext): number {
  const { system, user } = buildPromptPair(context);
  const totalChars = system.length + user.length;
  return Math.ceil(totalChars / 4);
}
