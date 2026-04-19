#!/usr/bin/env node
/**
 * HALCON Query Command
 * Natural language astrological query system for advanced practitioners
 *
 * Enables complex queries like:
 * "Analyze how the Venus Star Point transit relates to Neptune in my 7th house"
 *
 * Uses pre-calculated orbital data with Claude as a knowledgeable collaborator.
 *
 * @module commands/query
 */

import { Command } from 'commander';
import chalk from 'chalk';
import Anthropic from '@anthropic-ai/sdk';
import { calculateChart } from '../lib/swisseph/index.js';
import type { ChartOptions, ChartData } from '../lib/swisseph/types.js';
import { calculateProgressedDate, calculateAge } from '../lib/progressions/index.js';
import { loadProfileOrInput } from '../lib/middleware/profile-loader.js';
import {
  type QueryContext,
  type QueryDepth,
  type QueryResult,
  type HousePlacement,
  DEPTH_CONFIGS,
  PLANET_KEYS,
  EXTENDED_PLANET_KEYS,
  calculateTransitToNatalAspects,
  calculateProgressedToNatalAspects,
  buildPromptPair
} from '../lib/query/index.js';

const program = new Command();

/**
 * Calculate which house each planet is in
 */
function calculateHousePlacements(
  bodies: ChartData['bodies'],
  houses: ChartData['houses']
): HousePlacement[] {
  const placements: HousePlacement[] = [];
  const cusps = houses.cusps;

  const planetKeys = [...EXTENDED_PLANET_KEYS];

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
 * Calculate natal-to-natal aspects (reused from analysis.ts pattern)
 */
function calculateNatalAspects(bodies: ChartData['bodies'], orb: number = 8) {
  const aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
    nature?: 'harmonious' | 'challenging' | 'neutral';
  }> = [];

  const aspectTypes = [
    { name: 'Conjunction', angle: 0, symbol: '☌', nature: 'neutral' as const },
    { name: 'Sextile', angle: 60, symbol: '⚹', nature: 'harmonious' as const },
    { name: 'Square', angle: 90, symbol: '□', nature: 'challenging' as const },
    { name: 'Trine', angle: 120, symbol: '△', nature: 'harmonious' as const },
    { name: 'Opposition', angle: 180, symbol: '☍', nature: 'challenging' as const }
  ];

  const planetKeys = [...PLANET_KEYS];

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
            orb: Math.round(aspectOrb * 100) / 100,
            nature: aspectType.nature
          });
        }
      }
    }
  }

  return aspects.sort((a, b) => a.orb - b.orb);
}

/**
 * Get retrograde planets list
 */
function getRetrogradePlanets(bodies: ChartData['bodies']): string[] {
  const retrograde: string[] = [];
  for (const key of PLANET_KEYS) {
    const body = bodies[key as keyof typeof bodies];
    if (body?.retrograde) {
      retrograde.push(body.name);
    }
  }
  return retrograde;
}

/**
 * Build complete query context with all chart data
 */
async function buildQueryContext(
  profileArg: string,
  question: string,
  depth: QueryDepth
): Promise<QueryContext> {
  const config = DEPTH_CONFIGS[depth];

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
  const transits = await calculateChart(
    new Date(),
    { latitude: 0, longitude: 0, name: 'Greenwich' },
    chartOptions
  );

  // Calculate house placements
  console.log(chalk.gray('   ✓ Calculating house placements...'));
  const housePlacements = calculateHousePlacements(natal.bodies, natal.houses);

  // Calculate natal aspects
  console.log(chalk.gray('   ✓ Calculating natal aspects...'));
  const natalAspects = calculateNatalAspects(natal.bodies);

  // Calculate transit-to-natal aspects
  console.log(chalk.gray('   ✓ Calculating transit-to-natal aspects...'));
  const transitAspects = calculateTransitToNatalAspects(
    transits.bodies,
    natal.bodies,
    config.transitOrbDegrees,
    depth === 'deep'
  );

  // Get retrograde planets
  const retrogradePlanets = getRetrogradePlanets(transits.bodies);

  // Build base context
  const profileData: QueryContext['profile'] = {
    birthDate: birthDateTime,
    location: {
      name: location.name || 'Unknown',
      latitude: location.latitude,
      longitude: location.longitude
    }
  };
  if (profileName) {
    profileData.name = profileName;
  }

  const context: QueryContext = {
    profile: profileData,
    natal,
    transits,
    natalAspects,
    transitAspects,
    housePlacements,
    retrogradePlanets,
    queryMeta: {
      depth,
      timestamp: new Date(),
      question
    }
  };

  // Add progressions for standard/deep
  if (config.includeProgressions || depth === 'standard') {
    console.log(chalk.gray('   ✓ Calculating progressions...'));
    const targetDate = new Date();
    const progression = calculateProgressedDate(birthDateTime, targetDate);
    const age = calculateAge(birthDateTime, targetDate);
    const progressed = await calculateChart(progression.progressedDate, location, chartOptions);

    context.progressed = progressed;
    context.progression = {
      age,
      progressedDate: progression.progressedDate
    };

    // Add progressed aspects for deep analysis
    if (depth === 'deep') {
      console.log(chalk.gray('   ✓ Calculating progressed-to-natal aspects...'));
      context.progressedAspects = calculateProgressedToNatalAspects(
        progressed.bodies,
        natal.bodies,
        config.progressedOrbDegrees,
        true
      );
    }
  }

  console.log();
  return context;
}

/**
 * Execute query with Claude
 */
async function executeQuery(context: QueryContext): Promise<QueryResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'ANTHROPIC_API_KEY environment variable is not set'
    };
  }

  const startTime = Date.now();
  const { system, user, maxTokens } = buildPromptPair(context);

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: user }],
      system
    });

    const textBlock = response.content.find(block => block.type === 'text');
    const processingTimeMs = Date.now() - startTime;

    return {
      success: true,
      analysis: textBlock?.text ?? 'No response generated.',
      tokens: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
        total: response.usage.input_tokens + response.usage.output_tokens
      },
      metadata: {
        model: response.model,
        depth: context.queryMeta.depth,
        timestamp: new Date().toISOString(),
        processingTimeMs
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Stream query response from Claude
 */
async function streamQuery(context: QueryContext): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const { system, user, maxTokens } = buildPromptPair(context);
  const client = new Anthropic({ apiKey });

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: user }],
    system
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta') {
      const delta = event.delta;
      if ('text' in delta) {
        process.stdout.write(delta.text);
      }
    }
  }

  // Final newline
  console.log();
}

/**
 * Display query data summary (when no API key)
 */
function displayQuerySummary(context: QueryContext): void {
  const { profile, natal, transitAspects, retrogradePlanets } = context;

  console.log(chalk.bold.cyan('\n' + '═'.repeat(75)));
  console.log(chalk.bold.white('                    HALCON QUERY - DATA SUMMARY'));
  console.log(chalk.bold.cyan('═'.repeat(75) + '\n'));

  // Question
  console.log(chalk.bold.yellow('❓ Question:'));
  console.log(chalk.white(`   ${context.queryMeta.question}\n`));

  // Profile
  console.log(chalk.bold.yellow(`👤 Profile: ${profile.name || 'Unknown'}`));
  console.log(chalk.gray(`   Birth: ${profile.birthDate.toISOString().split('T')[0]} | ${profile.location.name}\n`));

  // Key Natal Placements
  console.log(chalk.bold.yellow('🌟 Key Natal Placements:'));
  const sun = natal.bodies.sun;
  const moon = natal.bodies.moon;
  console.log(chalk.white(`   ☉ Sun: ${sun?.signDegree.toFixed(0)}° ${sun?.sign}`));
  console.log(chalk.white(`   ☽ Moon: ${moon?.signDegree.toFixed(0)}° ${moon?.sign}`));
  console.log(chalk.white(`   ASC: ${natal.angles.ascendant.toFixed(1)}°`));
  console.log();

  // Top Transit Aspects
  console.log(chalk.bold.yellow('⚡ Active Transit-to-Natal Aspects:'));
  for (const aspect of transitAspects.slice(0, 5)) {
    const status = aspect.isApplying ? chalk.green('→') : chalk.gray('←');
    console.log(chalk.white(`   ${status} ${aspect.transitingPlanet} ${aspect.symbol} ${aspect.natalPlanet} (${aspect.orb}°)`));
  }
  console.log();

  // Retrograde Planets
  if (retrogradePlanets.length > 0) {
    console.log(chalk.bold.yellow('℞ Retrograde Planets:'));
    console.log(chalk.white(`   ${retrogradePlanets.join(', ')}`));
    console.log();
  }

  console.log(chalk.bold.cyan('═'.repeat(75)));
  console.log(chalk.gray('💡 Set ANTHROPIC_API_KEY for AI-powered interpretation'));
  console.log(chalk.bold.cyan('═'.repeat(75) + '\n'));
}

// CLI Configuration
program
  .name('halcon-query')
  .description('Natural language astrological query system for advanced practitioners')
  .version('0.1.0')
  .argument('<profile>', 'Profile name to query')
  .argument('<question>', 'Natural language question about the chart')
  .option('--deep', 'Full spectrum analysis (all tools, progressions, extended aspects)')
  .option('--quick', 'Concise response (natal + transits only)')
  .option('--json', 'Output result as JSON')
  .option('--no-stream', 'Wait for full response instead of streaming')
  .option('--data-only', 'Show data summary without AI analysis')
  .addHelpText('after', `
Examples:
  $ halcon query manu "What does my Venus Star Point transit mean for relationships?"
  $ halcon query manu "How is Saturn affecting my career right now?"
  $ halcon query manu "Explain the significance of Neptune in my 7th house"
  $ halcon query manu "What should I focus on during this Mercury retrograde?"

  # With depth options
  $ halcon query manu "Analyze my current transits" --deep
  $ halcon query manu "Quick check on today's energy" --quick

Query Depth Modes:
  Standard (default)  - Natal + Transits + Key Aspects + House Placements
  --quick             - Concise 200-400 word response
  --deep              - Full spectrum including progressions (1500-3000 words)
`)
  .action(async (profileArg: string, questionArg: string, options) => {
    try {
      // Determine depth mode
      let depth: QueryDepth = 'standard';
      if (options.quick) {
        depth = 'quick';
      } else if (options.deep) {
        depth = 'deep';
      }

      const config = DEPTH_CONFIGS[depth];

      console.log(chalk.cyan('\n🔮 Building query context...\n'));
      console.log(chalk.gray(`   Depth: ${config.name} - ${config.description}`));

      // Build query context
      const context = await buildQueryContext(profileArg, questionArg, depth);

      // JSON output
      if (options.json) {
        const result = await executeQuery(context);
        console.log(JSON.stringify(result, null, 2));
        return;
      }

      // Data only mode
      if (options.dataOnly || !process.env.ANTHROPIC_API_KEY) {
        displayQuerySummary(context);
        return;
      }

      // Display header
      console.log(chalk.bold.cyan('═'.repeat(80)));
      console.log(chalk.bold.white('                    HALCON ASTROLOGICAL QUERY'));
      if (depth === 'deep') {
        console.log(chalk.gray('                    (Full Spectrum Analysis)'));
      }
      console.log(chalk.bold.cyan('═'.repeat(80)));
      console.log(chalk.bold.yellow(`\n❓ ${questionArg}\n`));
      console.log(chalk.gray('─'.repeat(80)));
      console.log();

      // Execute query with streaming or wait for full response
      if (options.stream === false) {
        console.log(chalk.cyan('🤖 Generating analysis...\n'));
        const result = await executeQuery(context);

        if (!result.success) {
          console.error(chalk.red(`❌ Error: ${result.error}`));
          process.exit(1);
        }

        console.log(chalk.white(result.analysis));

        if (result.metadata && result.tokens) {
          console.log(chalk.gray(`\n─────────────────────────────────────────`));
          console.log(chalk.gray(`Tokens: ${result.tokens.total} | Time: ${result.metadata.processingTimeMs}ms`));
        }
      } else {
        await streamQuery(context);
      }

      console.log(chalk.bold.cyan('\n' + '═'.repeat(80)));
      console.log(chalk.green(`✨ Query complete! (${depth} mode)`));
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

export { program, buildQueryContext, executeQuery };
