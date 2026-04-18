/**
 * HALCON Query System - Type Definitions
 *
 * Types for the natural language astrological query system that enables
 * advanced practitioners to investigate chart phenomena with Claude AI.
 *
 * @module lib/query/types
 */

import type { ChartData } from '../swisseph/types.js';

/**
 * Query depth modes controlling data inclusion and response length
 */
export type QueryDepth = 'quick' | 'standard' | 'deep';

/**
 * Configuration for each query depth mode
 */
export interface QueryDepthConfig {
  /** Human-readable name */
  name: string;
  /** Description of what's included */
  description: string;
  /** Maximum orb for transit-to-natal aspects */
  transitOrbDegrees: number;
  /** Maximum orb for progressed aspects */
  progressedOrbDegrees: number;
  /** Limit on natal aspects (0 = no limit) */
  natalAspectLimit: number;
  /** Whether to include progressions */
  includeProgressions: boolean;
  /** Whether to include house rulers */
  includeHouseRulers: boolean;
  /** Whether to include dignity calculations */
  includeDignities: boolean;
  /** Max tokens for Claude response */
  maxTokens: number;
  /** Target response word count range */
  responseWordRange: [number, number];
}

/**
 * Aspect types with their angles and symbols
 */
export interface AspectType {
  name: string;
  angle: number;
  symbol: string;
  nature: 'harmonious' | 'challenging' | 'neutral';
}

/**
 * Standard major aspects used in calculations
 */
export const MAJOR_ASPECTS: AspectType[] = [
  { name: 'Conjunction', angle: 0, symbol: '☌', nature: 'neutral' },
  { name: 'Sextile', angle: 60, symbol: '⚹', nature: 'harmonious' },
  { name: 'Square', angle: 90, symbol: '□', nature: 'challenging' },
  { name: 'Trine', angle: 120, symbol: '△', nature: 'harmonious' },
  { name: 'Opposition', angle: 180, symbol: '☍', nature: 'challenging' }
];

/**
 * Extended aspects for deep analysis
 */
export const MINOR_ASPECTS: AspectType[] = [
  { name: 'Semi-Sextile', angle: 30, symbol: '⚺', nature: 'neutral' },
  { name: 'Semi-Square', angle: 45, symbol: '∠', nature: 'challenging' },
  { name: 'Quintile', angle: 72, symbol: 'Q', nature: 'harmonious' },
  { name: 'Sesquiquadrate', angle: 135, symbol: '⚼', nature: 'challenging' },
  { name: 'Quincunx', angle: 150, symbol: '⚻', nature: 'neutral' }
];

/**
 * Transit-to-natal aspect calculation result
 */
export interface TransitNatalAspect {
  /** The transiting planet */
  transitingPlanet: string;
  /** The natal planet being aspected */
  natalPlanet: string;
  /** Type of aspect (Conjunction, Square, etc.) */
  aspectType: string;
  /** Unicode symbol for the aspect */
  symbol: string;
  /** Exact angle of this aspect type */
  exactAngle: number;
  /** Actual angle between planets */
  actualAngle: number;
  /** Orb (deviation from exact aspect) */
  orb: number;
  /** Whether aspect is applying (getting closer) or separating */
  isApplying: boolean;
  /** Transit planet's daily motion in degrees */
  transitSpeed: number;
  /** Estimated days until/since exact */
  daysToExact: number | null;
  /** Aspect nature (harmonious, challenging, neutral) */
  nature: 'harmonious' | 'challenging' | 'neutral';
}

/**
 * Progressed-to-natal aspect result
 */
export interface ProgressedNatalAspect {
  /** The progressed planet */
  progressedPlanet: string;
  /** The natal planet being aspected */
  natalPlanet: string;
  /** Type of aspect */
  aspectType: string;
  /** Unicode symbol */
  symbol: string;
  /** Orb */
  orb: number;
  /** Movement since natal (in degrees) */
  progressedMovement: number;
  /** Aspect nature */
  nature: 'harmonious' | 'challenging' | 'neutral';
}

/**
 * House placement with ruler information
 */
export interface HousePlacement {
  /** Planet name */
  planet: string;
  /** House number (1-12) */
  house: number;
  /** Sign the planet is in */
  sign: string;
  /** Degree within the sign */
  degree: number;
  /** Whether planet is retrograde */
  retrograde: boolean;
  /** Planet's dignity status */
  dignity?: 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'peregrine';
}

/**
 * House cusp with ruler information
 */
export interface HouseCuspInfo {
  /** House number (1-12) */
  house: number;
  /** Sign on the cusp */
  sign: string;
  /** Degree of the cusp */
  degree: number;
  /** Traditional ruler of the sign */
  ruler: string;
  /** Where the ruler is placed (house number) */
  rulerHouse: number;
  /** House theme/meaning */
  theme: string;
}

/**
 * Complete query context containing all chart data
 */
export interface QueryContext {
  /** Profile information */
  profile: {
    name?: string;
    birthDate: Date;
    location: {
      name: string;
      latitude: number;
      longitude: number;
      timezone?: string;
    };
  };

  /** Natal chart data */
  natal: ChartData;

  /** Current transit data */
  transits: ChartData;

  /** Secondary progressions (optional, for standard/deep) */
  progressed?: ChartData;

  /** Progression metadata */
  progression?: {
    age: number;
    progressedDate: Date;
  };

  /** Natal-to-natal aspects */
  natalAspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
    nature?: 'harmonious' | 'challenging' | 'neutral';
  }>;

  /** Transit-to-natal aspects */
  transitAspects: TransitNatalAspect[];

  /** Progressed-to-natal aspects (for deep analysis) */
  progressedAspects?: ProgressedNatalAspect[];

  /** House placements with dignity */
  housePlacements: HousePlacement[];

  /** House cusp information with rulers (for deep analysis) */
  houseCusps?: HouseCuspInfo[];

  /** Moon phase information */
  moonPhase?: {
    name: string;
    illumination: number;
    age: number;
  };

  /** Retrograde planets */
  retrogradePlanets: string[];

  /** Query metadata */
  queryMeta: {
    depth: QueryDepth;
    timestamp: Date;
    question: string;
  };
}

/**
 * Query result from Claude analysis
 */
export interface QueryResult {
  /** Whether the query was successful */
  success: boolean;
  /** Claude's analysis response */
  analysis?: string;
  /** Error message if failed */
  error?: string;
  /** Token usage */
  tokens?: {
    input: number;
    output: number;
    total: number;
  };
  /** Response metadata */
  metadata?: {
    model: string;
    depth: QueryDepth;
    timestamp: string;
    processingTimeMs: number;
  };
}

/**
 * Query command options
 */
export interface QueryOptions {
  /** Profile name to query */
  profile: string;
  /** Natural language question */
  question: string;
  /** Query depth mode */
  depth: QueryDepth;
  /** Output as JSON instead of streamed text */
  json?: boolean;
  /** Skip streaming (wait for full response) */
  noStream?: boolean;
}

/**
 * Depth configuration presets
 */
export const DEPTH_CONFIGS: Record<QueryDepth, QueryDepthConfig> = {
  quick: {
    name: 'Quick',
    description: 'Natal + Current Transits only',
    transitOrbDegrees: 3,
    progressedOrbDegrees: 0,
    natalAspectLimit: 5,
    includeProgressions: false,
    includeHouseRulers: false,
    includeDignities: false,
    maxTokens: 1000,
    responseWordRange: [200, 400]
  },
  standard: {
    name: 'Standard',
    description: 'Natal + Transits + Key Aspects + House Placements',
    transitOrbDegrees: 5,
    progressedOrbDegrees: 3,
    natalAspectLimit: 15,
    includeProgressions: false,
    includeHouseRulers: false,
    includeDignities: false,
    maxTokens: 2500,
    responseWordRange: [500, 800]
  },
  deep: {
    name: 'Deep',
    description: 'Full spectrum: Natal + Transits + Progressions + All Aspects + House Rulers + Dignities',
    transitOrbDegrees: 10,
    progressedOrbDegrees: 5,
    natalAspectLimit: 0, // No limit
    includeProgressions: true,
    includeHouseRulers: true,
    includeDignities: true,
    maxTokens: 6000,
    responseWordRange: [1500, 3000]
  }
};

/**
 * Planet list for calculations
 */
export const PLANET_KEYS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
] as const;

export const EXTENDED_PLANET_KEYS = [
  ...PLANET_KEYS, 'chiron', 'northNode'
] as const;

/**
 * Zodiac signs with their rulers
 */
export const ZODIAC_RULERS: Record<string, { traditional: string; modern?: string }> = {
  'Aries': { traditional: 'Mars' },
  'Taurus': { traditional: 'Venus' },
  'Gemini': { traditional: 'Mercury' },
  'Cancer': { traditional: 'Moon' },
  'Leo': { traditional: 'Sun' },
  'Virgo': { traditional: 'Mercury' },
  'Libra': { traditional: 'Venus' },
  'Scorpio': { traditional: 'Mars', modern: 'Pluto' },
  'Sagittarius': { traditional: 'Jupiter' },
  'Capricorn': { traditional: 'Saturn' },
  'Aquarius': { traditional: 'Saturn', modern: 'Uranus' },
  'Pisces': { traditional: 'Jupiter', modern: 'Neptune' }
};

/**
 * House themes for interpretation
 */
export const HOUSE_THEMES: string[] = [
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
