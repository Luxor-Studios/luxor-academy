#!/usr/bin/env node
/**
 * HALCON Analysis Command
 * Generate comprehensive astrological snapshot analysis using Claude AI
 *
 * Combines natal chart, transits, progressions, and aspects into a unified analysis
 *
 * @module commands/analysis
 */

import { Command } from 'commander';
import chalk from 'chalk';
import Anthropic from '@anthropic-ai/sdk';
import { calculateChart } from '../lib/swisseph/index.js';
import type { ChartOptions, ChartData } from '../lib/swisseph/types.js';
import { calculateProgressedDate, calculateAge } from '../lib/progressions/index.js';
import { loadProfileOrInput } from '../lib/middleware/profile-loader.js';
import { formatDegree } from '../lib/display/formatters.js';

const program = new Command();

interface AnalysisData {
  profile: {
    name?: string | undefined;
    birthDate: Date;
    location: {
      name: string;
      latitude: number;
      longitude: number;
    };
  };
  natal: ChartData;
  transits: ChartData;
  progressed: ChartData;
  progression: {
    age: number;
    progressedDate: Date;
  };
  aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
  }>;
  // House placements for deep analysis
  housePlacements?: Array<{
    planet: string;
    house: number;
    sign: string;
    degree: number;
    retrograde: boolean;
  }> | undefined;
}

/**
 * Calculate which house each planet is in
 */
function calculateHousePlacements(bodies: ChartData['bodies'], houses: ChartData['houses']): AnalysisData['housePlacements'] {
  const placements: AnalysisData['housePlacements'] = [];
  const cusps = houses.cusps;

  const planetKeys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'northNode'];

  for (const key of planetKeys) {
    const body = bodies[key as keyof typeof bodies];
    if (!body) continue;

    const longitude = body.longitude;
    let houseNum = 1;

    // Find which house the planet is in
    for (let i = 0; i < 12; i++) {
      const currentCusp = cusps[i] ?? 0;
      const nextCusp = cusps[(i + 1) % 12] ?? 0;

      // Handle wrap-around at 0°/360°
      if (nextCusp < currentCusp) {
        // House spans 0° Aries
        if (longitude >= currentCusp || longitude < nextCusp) {
          houseNum = i + 1;
          break;
        }
      } else {
        if (longitude >= currentCusp && longitude < nextCusp) {
          houseNum = i + 1;
          break;
        }
      }
    }

    placements.push({
      planet: body.name,
      house: houseNum,
      sign: body.sign,
      degree: body.signDegree,
      retrograde: body.retrograde
    });
  }

  return placements;
}

/**
 * Calculate aspects between planets
 */
function calculateAspects(bodies: ChartData['bodies'], orb: number = 8): AnalysisData['aspects'] {
  const aspects: AnalysisData['aspects'] = [];
  const aspectTypes = [
    { name: 'Conjunction', angle: 0, symbol: '☌' },
    { name: 'Sextile', angle: 60, symbol: '⚹' },
    { name: 'Square', angle: 90, symbol: '□' },
    { name: 'Trine', angle: 120, symbol: '△' },
    { name: 'Opposition', angle: 180, symbol: '☍' }
  ];

  const planetKeys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

  for (let i = 0; i < planetKeys.length; i++) {
    for (let j = i + 1; j < planetKeys.length; j++) {
      const p1 = bodies[planetKeys[i] as keyof typeof bodies];
      const p2 = bodies[planetKeys[j] as keyof typeof bodies];

      if (!p1 || !p2) continue;

      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const aspectType of aspectTypes) {
        const aspectOrb = Math.abs(diff - aspectType.angle);
        if (aspectOrb <= orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            aspect: `${aspectType.symbol} ${aspectType.name}`,
            orb: Math.round(aspectOrb * 100) / 100
          });
        }
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb);
}

/**
 * Format chart data for Claude analysis
 */
function formatDataForAnalysis(data: AnalysisData): string {
  const { profile, natal, transits, progressed, progression, aspects } = data;

  let output = `# Astrological Data for Analysis\n\n`;

  // Profile info
  output += `## Subject Information\n`;
  output += `- Name: ${profile.name || 'Unknown'}\n`;
  output += `- Birth Date: ${profile.birthDate.toISOString().split('T')[0]}\n`;
  output += `- Birth Location: ${profile.location.name} (${profile.location.latitude.toFixed(2)}°N, ${profile.location.longitude.toFixed(2)}°E)\n`;
  output += `- Current Age: ${progression.age.toFixed(1)} years\n\n`;

  // Natal Chart
  output += `## Natal Chart\n`;
  output += `| Planet | Sign | Degree | Retrograde |\n`;
  output += `|--------|------|--------|------------|\n`;
  const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  for (const key of planetOrder) {
    const body = natal.bodies[key as keyof typeof natal.bodies];
    if (body) {
      output += `| ${body.name} | ${body.sign} | ${body.signDegree.toFixed(2)}° | ${body.retrograde ? 'R' : ''} |\n`;
    }
  }
  output += `\n### Natal Angles\n`;
  output += `- Ascendant: ${formatDegree(natal.angles.ascendant)}\n`;
  output += `- Midheaven (MC): ${formatDegree(natal.angles.midheaven)}\n`;
  output += `- Descendant: ${formatDegree(natal.angles.descendant)}\n`;
  output += `- IC: ${formatDegree(natal.angles.imumCoeli)}\n\n`;

  // Current Transits
  output += `## Current Transits (${new Date().toISOString().split('T')[0]})\n`;
  output += `| Planet | Sign | Degree | Retrograde |\n`;
  output += `|--------|------|--------|------------|\n`;
  for (const key of planetOrder) {
    const body = transits.bodies[key as keyof typeof transits.bodies];
    if (body) {
      output += `| ${body.name} | ${body.sign} | ${body.signDegree.toFixed(2)}° | ${body.retrograde ? 'R' : ''} |\n`;
    }
  }
  output += `\n`;

  // Progressions
  output += `## Secondary Progressions (Age ${progression.age.toFixed(1)})\n`;
  output += `Progressed Date: ${progression.progressedDate.toISOString().split('T')[0]}\n\n`;
  output += `| Planet | Natal | Progressed | Movement |\n`;
  output += `|--------|-------|------------|----------|\n`;
  for (const key of planetOrder) {
    const natalBody = natal.bodies[key as keyof typeof natal.bodies];
    const progBody = progressed.bodies[key as keyof typeof progressed.bodies];
    if (natalBody && progBody) {
      const movement = progBody.longitude - natalBody.longitude;
      const movementStr = movement >= 0 ? `+${movement.toFixed(2)}°` : `${movement.toFixed(2)}°`;
      output += `| ${natalBody.name} | ${natalBody.signDegree.toFixed(1)}° ${natalBody.sign} | ${progBody.signDegree.toFixed(1)}° ${progBody.sign} | ${movementStr} |\n`;
    }
  }
  output += `\n### Progressed Angles\n`;
  output += `- Progressed ASC: ${formatDegree(progressed.angles.ascendant)}\n`;
  output += `- Progressed MC: ${formatDegree(progressed.angles.midheaven)}\n\n`;

  // Major Aspects
  output += `## Natal Aspects (top 10 by orb)\n`;
  output += `| Planet 1 | Aspect | Planet 2 | Orb |\n`;
  output += `|----------|--------|----------|-----|\n`;
  for (const aspect of aspects.slice(0, 10)) {
    output += `| ${aspect.planet1} | ${aspect.aspect} | ${aspect.planet2} | ${aspect.orb}° |\n`;
  }

  return output;
}

/**
 * Format data for deep integrated analysis
 */
function formatDataForDeepAnalysis(data: AnalysisData): string {
  const { profile, natal, transits, progressed, progression, aspects, housePlacements } = data;

  let output = `# COMPLETE ASTROLOGICAL DATA FOR DEEP INTEGRATED ANALYSIS\n\n`;

  // Profile info
  output += `## Subject Information\n`;
  output += `- Name: ${profile.name || 'Unknown'}\n`;
  output += `- Birth Date: ${profile.birthDate.toISOString().split('T')[0]}\n`;
  output += `- Birth Location: ${profile.location.name} (${profile.location.latitude.toFixed(2)}°N, ${profile.location.longitude.toFixed(2)}°E)\n`;
  output += `- Current Age: ${progression.age.toFixed(1)} years\n\n`;

  // Natal Chart with HOUSE PLACEMENTS
  output += `## Natal Chart with House Placements\n`;
  output += `| Planet | Sign | Degree | House | Retrograde |\n`;
  output += `|--------|------|--------|-------|------------|\n`;

  const planetOrder = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'northNode'];

  for (const key of planetOrder) {
    const body = natal.bodies[key as keyof typeof natal.bodies];
    const placement = housePlacements?.find(p => p.planet.toLowerCase() === body?.name.toLowerCase());
    if (body) {
      output += `| ${body.name} | ${body.sign} | ${body.signDegree.toFixed(2)}° | ${placement?.house || 'N/A'} | ${body.retrograde ? 'R' : ''} |\n`;
    }
  }

  // Natal Angles
  output += `\n### Angles\n`;
  output += `- Ascendant (ASC): ${formatDegree(natal.angles.ascendant)} - Chart Ruler placement\n`;
  output += `- Midheaven (MC): ${formatDegree(natal.angles.midheaven)} - Career/Public image\n`;
  output += `- Descendant (DSC): ${formatDegree(natal.angles.descendant)} - Relationship axis\n`;
  output += `- IC (Imum Coeli): ${formatDegree(natal.angles.imumCoeli)} - Home/Roots\n\n`;

  // House Cusps with Sign Rulers
  output += `## House Cusps & Signs\n`;
  output += `| House | Sign on Cusp | Theme |\n`;
  output += `|-------|--------------|-------|\n`;
  const houseThemes = [
    'Self, Identity, First Impressions',
    'Values, Resources, Self-Worth',
    'Communication, Siblings, Local Environment',
    'Home, Family, Psychological Roots',
    'Creativity, Romance, Children',
    'Work, Health, Daily Routines',
    'Partnerships, Open Enemies',
    'Transformation, Shared Resources, Intimacy',
    'Philosophy, Higher Learning, Travel',
    'Career, Public Image, Authority',
    'Friends, Groups, Hopes & Wishes',
    'Spirituality, Hidden Realms, Self-Undoing'
  ];

  for (let i = 0; i < 12; i++) {
    const cusp = natal.houses.cusps[i] ?? 0;
    const signIndex = Math.floor(cusp / 30);
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    output += `| ${i + 1} | ${signs[signIndex] ?? 'Unknown'} | ${houseThemes[i] ?? ''} |\n`;
  }
  output += `\n`;

  // All Natal Aspects
  output += `## All Natal Aspects\n`;
  output += `| Planet 1 | Aspect | Planet 2 | Orb |\n`;
  output += `|----------|--------|----------|-----|\n`;
  for (const aspect of aspects) {
    output += `| ${aspect.planet1} | ${aspect.aspect} | ${aspect.planet2} | ${aspect.orb}° |\n`;
  }
  output += `\n`;

  // Current Transits
  output += `## Current Transits (${new Date().toISOString().split('T')[0]})\n`;
  output += `| Planet | Sign | Degree | Retrograde |\n`;
  output += `|--------|------|--------|------------|\n`;
  for (const key of planetOrder.slice(0, 10)) {
    const body = transits.bodies[key as keyof typeof transits.bodies];
    if (body) {
      output += `| ${body.name} | ${body.sign} | ${body.signDegree.toFixed(2)}° | ${body.retrograde ? 'R' : ''} |\n`;
    }
  }
  output += `\n`;

  // Progressions with house shifts
  output += `## Secondary Progressions (Age ${progression.age.toFixed(1)})\n`;
  output += `Progressed Date: ${progression.progressedDate.toISOString().split('T')[0]}\n\n`;
  output += `| Planet | Natal Position | Progressed Position | Movement |\n`;
  output += `|--------|----------------|---------------------|----------|\n`;
  for (const key of planetOrder.slice(0, 10)) {
    const natalBody = natal.bodies[key as keyof typeof natal.bodies];
    const progBody = progressed.bodies[key as keyof typeof progressed.bodies];
    if (natalBody && progBody) {
      const movement = progBody.longitude - natalBody.longitude;
      const movementStr = movement >= 0 ? `+${movement.toFixed(2)}°` : `${movement.toFixed(2)}°`;
      output += `| ${natalBody.name} | ${natalBody.signDegree.toFixed(1)}° ${natalBody.sign} | ${progBody.signDegree.toFixed(1)}° ${progBody.sign} | ${movementStr} |\n`;
    }
  }
  output += `\n### Progressed Angles\n`;
  output += `- Progressed ASC: ${formatDegree(progressed.angles.ascendant)}\n`;
  output += `- Progressed MC: ${formatDegree(progressed.angles.midheaven)}\n\n`;

  return output;
}

/**
 * Generate analysis using Claude
 */
async function generateAnalysis(data: AnalysisData, analysisType: string, isDeep: boolean = false): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const client = new Anthropic({ apiKey });

  const formattedData = isDeep ? formatDataForDeepAnalysis(data) : formatDataForAnalysis(data);

  // Deep analysis system prompt - integrated house-sign-aspect methodology
  const deepSystemPrompt = `You are a master astrologer providing DEEPLY INTEGRATED chart analysis. Your methodology reads the chart as a LIVING WHOLE where every placement is understood through Sign + House + Aspects simultaneously.

## CRITICAL METHODOLOGY

### The Integration Principle
NEVER describe a planet by sign alone. Every placement must be understood as:
"[Planet] in [Sign] in the [House] house, [aspects]"

Example: "Sun in Pisces in the 7th house = Identity (Sun) is found through merging with others (7th). Self-definition comes through relationships, art collaborations, and one-on-one connections. The Pisces quality makes these bonds feel spiritually destined."

### Chart Ruler Priority
The Ascendant's ruling planet is the chart ruler—its condition colors the ENTIRE life. Trace:
1. What sign is it in? (How does it operate?)
2. What house is it in? (Where does it express?)
3. What aspects does it make? (What dialogues exist?)
4. Does it rule other houses? (What life areas connect?)

### Stellium Analysis
When 3+ planets cluster in one house, that house becomes the PRIMARY life arena. Analyze the stellium as a unified theme, not separate placements.

### Axis Awareness
Always pair opposing houses:
- 1st/7th: Self vs. Other
- 4th/10th: Private roots vs. Public achievement
- 6th/12th: Daily service vs. Spiritual transcendence

### "Lived Experience" Sections
For each major placement, include a "Lived Experience" paragraph describing how this actually manifests in daily life, relationships, and psychology. Make it vivid and specific.

### Shadow Integration
Every placement has gifts AND shadows. Name both explicitly.

## OUTPUT FORMAT

Use this EXACT structure with markdown formatting:

### For each major planetary placement:
1. **Header**: "[Planet] in [Sign] in the [House] House" with a descriptive subtitle
2. **Integration Table**:
   | Integration | Meaning |
   | Sign + House | [unified meaning] |
   | Ruling connections | [what houses it rules, aspects] |
   | Key aspects | [major aspects with interpretations] |
3. **Lived Experience**: Vivid paragraph on how this manifests
4. **Shadow**: The challenging expression

### Special formatting:
- Use "★ Insight" boxes (with the star symbol) for key revelations about chart ruler, stelliums, or major patterns
- Use tables liberally for integration patterns
- Include "The [X] Pattern" subsections for significant configurations
- End sections with both Gifts and Shadows

Length: 2500-4000 words for truly comprehensive integration.`;

  // Standard system prompt
  const standardSystemPrompt = `You are an expert astrologer providing insightful, practical analysis. Your interpretations blend traditional and modern techniques with psychological insight.

Key principles:
1. Focus on the most significant patterns and themes
2. Identify key transits affecting the natal chart NOW
3. Note important progressed positions and their implications
4. Be specific about timing when relevant
5. Provide actionable insights, not fatalistic predictions
6. Keep the tone empowering and balanced
7. Use clear, accessible language

Format your response with clear sections and bullet points for readability.`;

  const deepUserPrompt = `${formattedData}

Please provide a DEEP INTEGRATED ${analysisType} astrological analysis following this EXACT structure:

---

# [Name]'s Integrated Chart Analysis

## Birth Data
- **Date**: [date]
- **Time**: [time]
- **Location**: [location]

---

## The Integrated Self

★ **Insight**: [Open with a key insight about how the chart ruler relates to the Ascendant and creates a fundamental pattern. For example, if Virgo Rising has Mercury in Pisces, note this tension between analytical presentation and intuitive processing.]

---

## [Sun Sign] Sun in the [House Number] House

**[Descriptive subtitle like "Not just 'Pisces Sun' but Pisces Sun expressing through the House of Partnership"]**

| Integration | Meaning |
|-------------|---------|
| **Sign + House** | [How the Sun's sign expresses through this house domain] |
| **Ruling the [X]th** | [Sun rules Leo - what house has Leo on the cusp?] |
| **Key Aspects** | [Major aspects to Sun and their meaning] |

**Lived Experience**: [Vivid paragraph describing how this actually manifests in daily life, identity, and purpose]

**Shadow**: [The challenging expression of this placement]

---

## Moon in [Sign] in the [House Number] House

**[Descriptive subtitle about emotional nature and house theme]**

| Integration | Meaning |
|-------------|---------|
| **Sign + House** | [How Moon's emotional needs express through this house] |
| **Conjunctions/Major Aspects** | [Key lunar aspects] |
| **Ruling the [X]th** | [Moon rules Cancer - what house connection?] |

**Lived Experience**: [How this manifests emotionally, in relationships, in needs]

**The [Relevant Pattern Name]**: [If Moon conjuncts Sun, forms a stellium, etc., name the pattern]

---

## Mercury in [Sign] in the [House Number] House [RETROGRADE if applicable]

**[Subtitle about the chart ruler if Mercury rules the Ascendant]**

★ **Insight**: [If Mercury is the chart ruler, emphasize its critical importance]

| Integration | Meaning |
|-------------|---------|
| **Ruling Ascendant from [X]th** | [How self-presentation filters through this house] |
| **Sign Quality** | [How Mercury operates in this sign - detriment? exaltation?] |
| **Key Aspects** | [Sextiles, squares, etc. with meaning] |

**Lived Experience**: [Communication style, thinking patterns, learning approach]

**Communication Style**: [Specific description]

---

[Continue for Venus, Mars, Jupiter, Saturn, and outer planets with the same format]

---

## North Node in [Sign] in the [House Number] House

**Soul Growth Direction**

| Integration | Meaning |
|-------------|---------|
| **Sign + House** | [Soul direction combining sign and house themes] |
| **South Node Polarity** | [What the comfort zone is vs. growth edge] |
| **House Context** | [How this house shapes the destiny path] |

**Lived Experience**: [How this manifests as life direction and growth]

---

## Integrated House Dynamics

### The [X]th House Stellium (if applicable)
[Planets] in the [house] means [theme] aren't optional—they're the curriculum.

| What This Creates | Expression |
|-------------------|------------|
| Pattern 1 | [meaning] |
| Pattern 2 | [meaning] |
| **Gifts** | [list] |
| **Challenges** | [list] |

### The [X]/[Y] House Axis
[Theme] → [Theme]

- **[Lower house]**: [description]
- **[Upper house]**: [description]
- **Integration**: [how they work together]

---

## Current Progressions - Integrated View

★ **Insight**: [Key insight about the current life chapter based on progressed positions]

### Progressed Sun at [degree] [Sign] - [House context]

| Shift | Meaning |
|-------|---------|
| **From [X] to [Y]** | [House or sign shift and meaning] |
| **Current Phase** | [What life chapter this represents] |

**Lived Experience**: [How this is manifesting now]

### Progressed Moon at [degree] [Sign]

| Cycle Meaning | Expression |
|---------------|------------|
| **Phase** | [Balsamic, New, First Quarter, etc.] |
| **Sign Quality** | [How emotions are currently operating] |

### Progressed Ascendant/MC Shifts
[Any significant angle progressions]

---

## Full Synthesis: The Living Chart

### Core Dynamic
**[3-5 word title like "The Sensitive Seer with Hidden Fire"]**

[Paragraph weaving together the major patterns]

### Life Pattern
**[Pattern name]**

[Paragraph about the recurring life themes]

### Current Chapter (Age [X]-[Y])
**[Chapter title]**

[Paragraph about current life phase based on progressions]

### The Destiny Pattern (North Node [Sign] in [House])
[Paragraph about soul direction]

---

★ **Final Integrated Insight**

[Closing synthesis paragraph that captures the essential paradoxes and creative tensions of the chart - what makes this person unique, what their medicine is for the world, how the apparent contradictions actually generate creative power]

---

CRITICAL REMINDERS:
- Every planet MUST include its house placement, not just sign
- Include "Lived Experience" paragraphs that are vivid and specific
- Name both Gifts and Shadows for each placement
- Use the ★ Insight format for key revelations
- Tables should show Integration patterns, not just keywords
- The synthesis should weave everything into ONE coherent narrative
- Length: 2500-4000 words minimum for comprehensive reading`;

  const standardUserPrompt = `${formattedData}

Please provide a ${analysisType} astrological analysis based on this data. Focus on:

1. **Current Energy Snapshot**: What's the dominant theme right now based on transits to the natal chart?

2. **Key Transit Highlights**: Identify the 3-5 most significant current transits and their effects.

3. **Progression Insights**: What major progressed positions are active and what do they indicate?

4. **Opportunities & Challenges**: What should the subject focus on or be aware of?

5. **Practical Guidance**: Specific, actionable advice for the coming weeks.

Keep the analysis concise but insightful (around 500-700 words).`;

  const response = await client.messages.create({
    model: isDeep ? 'claude-sonnet-4-20250514' : 'claude-sonnet-4-20250514',
    max_tokens: isDeep ? 8000 : 1500,
    messages: [
      { role: 'user', content: isDeep ? deepUserPrompt : standardUserPrompt }
    ],
    system: isDeep ? deepSystemPrompt : standardSystemPrompt
  });

  const textBlock = response.content.find(block => block.type === 'text');
  return textBlock ? textBlock.text : 'Analysis generation failed.';
}

/**
 * Display raw data summary (when no API key)
 */
function displayDataSummary(data: AnalysisData): void {
  const { profile, natal, transits, progressed, progression, aspects } = data;

  console.log(chalk.bold.cyan('\n' + '═'.repeat(75)));
  console.log(chalk.bold.white('                    HALCON ASTROLOGICAL SNAPSHOT'));
  console.log(chalk.bold.cyan('═'.repeat(75) + '\n'));

  // Profile
  console.log(chalk.bold.yellow(`👤 Profile: ${profile.name || 'Unknown'}`));
  console.log(chalk.gray(`   Birth: ${profile.birthDate.toISOString().split('T')[0]} | ${profile.location.name}`));
  console.log(chalk.gray(`   Current Age: ${progression.age.toFixed(1)} years\n`));

  // Key Natal Placements
  console.log(chalk.bold.yellow('🌟 Key Natal Placements:'));
  const sun = natal.bodies.sun;
  const moon = natal.bodies.moon;
  console.log(chalk.white(`   ☉ Sun: ${sun?.signDegree.toFixed(0)}° ${sun?.sign}`));
  console.log(chalk.white(`   ☽ Moon: ${moon?.signDegree.toFixed(0)}° ${moon?.sign}`));
  console.log(chalk.white(`   ASC: ${formatDegree(natal.angles.ascendant)}`));
  console.log(chalk.white(`   MC: ${formatDegree(natal.angles.midheaven)}\n`));

  // Current Transits
  console.log(chalk.bold.yellow('🌌 Current Transits (Key Planets):'));
  const transitPlanets = ['saturn', 'jupiter', 'uranus', 'neptune', 'pluto'];
  for (const key of transitPlanets) {
    const body = transits.bodies[key as keyof typeof transits.bodies];
    if (body) {
      const retro = body.retrograde ? chalk.red(' R') : '';
      console.log(chalk.white(`   ${body.name.padEnd(8)}: ${body.signDegree.toFixed(1).padStart(5)}° ${body.sign.padEnd(11)}${retro}`));
    }
  }
  console.log();

  // Progressed Highlights
  console.log(chalk.bold.yellow('🔮 Progressed Positions:'));
  const progSun = progressed.bodies.sun;
  const progMoon = progressed.bodies.moon;
  console.log(chalk.white(`   ☉ Prog Sun: ${progSun?.signDegree.toFixed(1)}° ${progSun?.sign}`));
  console.log(chalk.white(`   ☽ Prog Moon: ${progMoon?.signDegree.toFixed(1)}° ${progMoon?.sign}`));
  console.log(chalk.white(`   Prog ASC: ${formatDegree(progressed.angles.ascendant)}`));
  console.log(chalk.white(`   Prog MC: ${formatDegree(progressed.angles.midheaven)}\n`));

  // Top Aspects
  console.log(chalk.bold.yellow('⚡ Strongest Natal Aspects:'));
  for (const aspect of aspects.slice(0, 5)) {
    console.log(chalk.white(`   ${aspect.planet1.padEnd(8)} ${aspect.aspect.padEnd(14)} ${aspect.planet2.padEnd(8)} (${aspect.orb}°)`));
  }
  console.log();

  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log(chalk.gray('💡 Set ANTHROPIC_API_KEY for AI-powered interpretation'));
  console.log(chalk.bold.cyan('═'.repeat(75) + '\n'));
}

program
  .name('halcon-analysis')
  .description('Generate comprehensive astrological snapshot analysis')
  .version('0.1.0')
  .argument('[profile]', 'Profile name', '')
  .option('--type <type>', 'Analysis type (general, career, love, spiritual)', 'general')
  .option('--deep', 'Deep integrated analysis (house+sign+aspect synthesis)')
  .option('--json', 'Output raw data as JSON')
  .option('--data-only', 'Show data summary without AI analysis')
  .action(async (profileArg, options) => {
    try {
      if (!profileArg) {
        console.error(chalk.red('❌ Error: Profile name is required'));
        console.log(chalk.gray('   Usage: halcon analysis <profile>'));
        console.log(chalk.gray('   Example: halcon analysis manu'));
        process.exit(1);
      }

      console.log(chalk.cyan('\n🔮 Gathering astrological data...\n'));

      // Load profile
      const { dateTime: birthDateTime, location, profileName } = await loadProfileOrInput({
        dateArg: profileArg,
        timeArg: ''
      });

      const chartOptions: ChartOptions = {
        houseSystem: 'placidus',
        includeChiron: true,
        includeLilith: true,
        includeNodes: true
      };

      // Calculate natal chart
      console.log(chalk.gray('   ✓ Calculating natal chart...'));
      const natal = await calculateChart(birthDateTime, location, chartOptions);

      // Calculate current transits
      console.log(chalk.gray('   ✓ Calculating current transits...'));
      const transits = await calculateChart(new Date(), { latitude: 0, longitude: 0, name: 'Greenwich' }, chartOptions);

      // Calculate progressions
      console.log(chalk.gray('   ✓ Calculating progressions...'));
      const targetDate = new Date();
      const progression = calculateProgressedDate(birthDateTime, targetDate);
      const age = calculateAge(birthDateTime, targetDate);
      const progressed = await calculateChart(progression.progressedDate, location, chartOptions);

      // Calculate aspects
      console.log(chalk.gray('   ✓ Calculating aspects...'));
      const aspects = calculateAspects(natal.bodies);

      // Calculate house placements for deep analysis
      let housePlacements: AnalysisData['housePlacements'] | undefined;
      if (options.deep) {
        console.log(chalk.gray('   ✓ Calculating house placements...'));
        housePlacements = calculateHousePlacements(natal.bodies, natal.houses);
      }
      console.log();

      const analysisData: AnalysisData = {
        profile: {
          name: profileName ?? undefined,
          birthDate: birthDateTime,
          location: {
            name: location.name || 'Unknown',
            latitude: location.latitude,
            longitude: location.longitude
          }
        },
        natal,
        transits,
        progressed,
        progression: {
          age,
          progressedDate: progression.progressedDate
        },
        aspects,
        housePlacements
      };

      if (options.json) {
        console.log(JSON.stringify(analysisData, null, 2));
        return;
      }

      if (options.dataOnly || !process.env.ANTHROPIC_API_KEY) {
        displayDataSummary(analysisData);
        return;
      }

      // Generate AI analysis
      const analysisMode = options.deep ? 'deep integrated' : 'standard';
      console.log(chalk.cyan(`🤖 Generating ${analysisMode} AI analysis...\n`));
      const analysis = await generateAnalysis(analysisData, options.type, options.deep || false);

      console.log(chalk.bold.cyan('═'.repeat(80)));
      if (options.deep) {
        console.log(chalk.bold.magenta('              HALCON DEEP INTEGRATED ASTROLOGICAL ANALYSIS'));
        console.log(chalk.gray('                  (House + Sign + Aspect Synthesis)'));
      } else {
        console.log(chalk.bold.white('                    HALCON ASTROLOGICAL ANALYSIS'));
      }
      console.log(chalk.bold.cyan('═'.repeat(80) + '\n'));
      console.log(chalk.white(analysis));
      console.log(chalk.bold.cyan('\n' + '═'.repeat(80)));
      console.log(chalk.green(`✨ ${options.deep ? 'Deep' : 'Standard'} analysis complete!`));
      console.log(chalk.bold.cyan('═'.repeat(80) + '\n'));

    } catch (error) {
      console.error(chalk.red('❌ Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}

export { program };
