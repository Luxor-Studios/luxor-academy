/**
 * HALCON Query System - Unit Tests
 *
 * Tests for the natural language astrological query system
 * including aspect calculations, prompt building, and type definitions.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateAngleDifference,
  isAspectApplying,
  estimateDaysToExact,
  calculateTransitToNatalAspects,
  calculateProgressedToNatalAspects,
  filterSignificantAspects,
  getMostSignificantTransits,
  findAspectsInvolvingPlanet,
  groupAspectsByTransitPlanet
} from '../../lib/query/aspect-calculator.js';
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildPromptPair,
  estimatePromptTokens
} from '../../lib/query/prompt-builder.js';
import {
  DEPTH_CONFIGS,
  MAJOR_ASPECTS,
  ZODIAC_RULERS,
  HOUSE_THEMES,
  type QueryContext,
  type TransitNatalAspect
} from '../../lib/query/types.js';

// Mock chart data for testing
const mockNatalBodies = {
  sun: {
    name: 'Sun',
    longitude: 349.69,
    latitude: 0,
    signDegree: 19.69,
    sign: 'Pisces',
    retrograde: false,
    longitudeSpeed: 1.0
  },
  moon: {
    name: 'Moon',
    longitude: 159.07,
    latitude: 0,
    signDegree: 9.07,
    sign: 'Virgo',
    retrograde: false,
    longitudeSpeed: 13.0
  },
  mercury: {
    name: 'Mercury',
    longitude: 330.5,
    latitude: 0,
    signDegree: 0.5,
    sign: 'Pisces',
    retrograde: true,
    longitudeSpeed: -0.5
  },
  venus: {
    name: 'Venus',
    longitude: 303.45,
    latitude: 0,
    signDegree: 3.45,
    sign: 'Aquarius',
    retrograde: false,
    longitudeSpeed: 1.2
  },
  mars: {
    name: 'Mars',
    longitude: 45.2,
    latitude: 0,
    signDegree: 15.2,
    sign: 'Taurus',
    retrograde: false,
    longitudeSpeed: 0.7
  },
  jupiter: {
    name: 'Jupiter',
    longitude: 120.5,
    latitude: 0,
    signDegree: 0.5,
    sign: 'Leo',
    retrograde: false,
    longitudeSpeed: 0.08
  },
  saturn: {
    name: 'Saturn',
    longitude: 230.15,
    latitude: 0,
    signDegree: 20.15,
    sign: 'Scorpio',
    retrograde: false,
    longitudeSpeed: 0.05
  },
  uranus: {
    name: 'Uranus',
    longitude: 55.3,
    latitude: 0,
    signDegree: 25.3,
    sign: 'Taurus',
    retrograde: false,
    longitudeSpeed: 0.02
  },
  neptune: {
    name: 'Neptune',
    longitude: 282.8,
    latitude: 0,
    signDegree: 12.8,
    sign: 'Capricorn',
    retrograde: false,
    longitudeSpeed: 0.01
  },
  pluto: {
    name: 'Pluto',
    longitude: 197.45,
    latitude: 0,
    signDegree: 17.45,
    sign: 'Libra',
    retrograde: false,
    longitudeSpeed: 0.005
  }
};

const mockTransitBodies = {
  sun: {
    name: 'Sun',
    longitude: 300.0,
    latitude: 0,
    signDegree: 0.0,
    sign: 'Aquarius',
    retrograde: false,
    longitudeSpeed: 1.0
  },
  moon: {
    name: 'Moon',
    longitude: 45.0,
    latitude: 0,
    signDegree: 15.0,
    sign: 'Taurus',
    retrograde: false,
    longitudeSpeed: 13.0
  },
  mercury: {
    name: 'Mercury',
    longitude: 285.0,
    latitude: 0,
    signDegree: 15.0,
    sign: 'Capricorn',
    retrograde: false,
    longitudeSpeed: 1.5
  },
  venus: {
    name: 'Venus',
    longitude: 288.0,
    latitude: 0,
    signDegree: 18.0,
    sign: 'Capricorn',
    retrograde: false,
    longitudeSpeed: 1.2
  },
  mars: {
    name: 'Mars',
    longitude: 120.0,
    latitude: 0,
    signDegree: 0.0,
    sign: 'Leo',
    retrograde: false,
    longitudeSpeed: 0.7
  },
  jupiter: {
    name: 'Jupiter',
    longitude: 65.0,
    latitude: 0,
    signDegree: 5.0,
    sign: 'Gemini',
    retrograde: false,
    longitudeSpeed: 0.1
  },
  saturn: {
    name: 'Saturn',
    longitude: 350.0,
    latitude: 0,
    signDegree: 20.0,
    sign: 'Pisces',
    retrograde: false,
    longitudeSpeed: 0.05
  },
  uranus: {
    name: 'Uranus',
    longitude: 55.0,
    latitude: 0,
    signDegree: 25.0,
    sign: 'Taurus',
    retrograde: false,
    longitudeSpeed: 0.02
  },
  neptune: {
    name: 'Neptune',
    longitude: 0.5,
    latitude: 0,
    signDegree: 0.5,
    sign: 'Aries',
    retrograde: false,
    longitudeSpeed: 0.01
  },
  pluto: {
    name: 'Pluto',
    longitude: 2.0,
    latitude: 0,
    signDegree: 2.0,
    sign: 'Aquarius',
    retrograde: false,
    longitudeSpeed: 0.01
  }
};

describe('Query Types', () => {
  describe('DEPTH_CONFIGS', () => {
    it('should have configurations for all depth modes', () => {
      expect(DEPTH_CONFIGS.quick).toBeDefined();
      expect(DEPTH_CONFIGS.standard).toBeDefined();
      expect(DEPTH_CONFIGS.deep).toBeDefined();
    });

    it('quick mode should have lowest token limit', () => {
      expect(DEPTH_CONFIGS.quick.maxTokens).toBeLessThan(DEPTH_CONFIGS.standard.maxTokens);
      expect(DEPTH_CONFIGS.standard.maxTokens).toBeLessThan(DEPTH_CONFIGS.deep.maxTokens);
    });

    it('quick mode should not include progressions', () => {
      expect(DEPTH_CONFIGS.quick.includeProgressions).toBe(false);
    });

    it('deep mode should include all features', () => {
      expect(DEPTH_CONFIGS.deep.includeProgressions).toBe(true);
      expect(DEPTH_CONFIGS.deep.includeHouseRulers).toBe(true);
      expect(DEPTH_CONFIGS.deep.includeDignities).toBe(true);
    });

    it('deep mode should have no aspect limit', () => {
      expect(DEPTH_CONFIGS.deep.natalAspectLimit).toBe(0);
    });
  });

  describe('MAJOR_ASPECTS', () => {
    it('should have 5 major aspects', () => {
      expect(MAJOR_ASPECTS).toHaveLength(5);
    });

    it('should include conjunction at 0°', () => {
      const conjunction = MAJOR_ASPECTS.find(a => a.name === 'Conjunction');
      expect(conjunction?.angle).toBe(0);
    });

    it('should include opposition at 180°', () => {
      const opposition = MAJOR_ASPECTS.find(a => a.name === 'Opposition');
      expect(opposition?.angle).toBe(180);
    });
  });

  describe('ZODIAC_RULERS', () => {
    it('should have 12 zodiac signs', () => {
      expect(Object.keys(ZODIAC_RULERS)).toHaveLength(12);
    });

    it('should have Mars as ruler of Aries', () => {
      expect(ZODIAC_RULERS['Aries']?.traditional).toBe('Mars');
    });

    it('should have Pluto as modern ruler of Scorpio', () => {
      expect(ZODIAC_RULERS['Scorpio']?.modern).toBe('Pluto');
    });
  });

  describe('HOUSE_THEMES', () => {
    it('should have 12 house themes', () => {
      expect(HOUSE_THEMES).toHaveLength(12);
    });

    it('should have 7th house as partnerships', () => {
      expect(HOUSE_THEMES[6]).toContain('Partnership');
    });
  });
});

describe('Aspect Calculator', () => {
  describe('calculateAngleDifference', () => {
    it('should calculate simple angle difference', () => {
      expect(calculateAngleDifference(0, 90)).toBe(90);
      expect(calculateAngleDifference(90, 0)).toBe(90);
    });

    it('should handle wrap-around at 360°', () => {
      expect(calculateAngleDifference(350, 10)).toBe(20);
      expect(calculateAngleDifference(10, 350)).toBe(20);
    });

    it('should return shortest path for opposition', () => {
      expect(calculateAngleDifference(0, 180)).toBe(180);
      expect(calculateAngleDifference(180, 0)).toBe(180);
    });

    it('should handle same position', () => {
      expect(calculateAngleDifference(45, 45)).toBe(0);
    });
  });

  describe('isAspectApplying', () => {
    it('should detect applying aspect with direct transit', () => {
      // Transit at 85°, natal at 90°, transit speed +1°/day
      // Moving toward conjunction at 90°
      const applying = isAspectApplying(85, 90, 1.0, 0);
      expect(applying).toBe(true);
    });

    it('should detect separating aspect with direct transit', () => {
      // Transit at 95°, natal at 90°, transit speed +1°/day
      // Moving away from conjunction at 90°
      const separating = isAspectApplying(95, 90, 1.0, 0);
      expect(separating).toBe(false);
    });

    it('should handle retrograde transit correctly', () => {
      // Transit at 95°, natal at 90°, transit speed -1°/day (retrograde)
      // Moving toward conjunction at 90°
      const applying = isAspectApplying(95, 90, -1.0, 0);
      expect(applying).toBe(true);
    });
  });

  describe('estimateDaysToExact', () => {
    it('should estimate days for applying aspect', () => {
      // 2° orb, 1°/day speed, applying
      const days = estimateDaysToExact(2, 1.0, true);
      expect(days).toBe(2);
    });

    it('should return negative for separating aspect', () => {
      const days = estimateDaysToExact(2, 1.0, false);
      expect(days).toBe(-2);
    });

    it('should return null for stationary planet', () => {
      const days = estimateDaysToExact(2, 0.0001, true);
      expect(days).toBeNull();
    });
  });

  describe('calculateTransitToNatalAspects', () => {
    it('should find aspects within orb', () => {
      const aspects = calculateTransitToNatalAspects(
        mockTransitBodies as any,
        mockNatalBodies as any,
        8
      );
      expect(aspects.length).toBeGreaterThan(0);
    });

    it('should sort aspects by orb', () => {
      const aspects = calculateTransitToNatalAspects(
        mockTransitBodies as any,
        mockNatalBodies as any,
        8
      );
      for (let i = 1; i < aspects.length; i++) {
        expect(aspects[i]!.orb).toBeGreaterThanOrEqual(aspects[i - 1]!.orb);
      }
    });

    it('should include isApplying status', () => {
      const aspects = calculateTransitToNatalAspects(
        mockTransitBodies as any,
        mockNatalBodies as any,
        8
      );
      aspects.forEach(aspect => {
        expect(typeof aspect.isApplying).toBe('boolean');
      });
    });

    it('should include transit speed', () => {
      const aspects = calculateTransitToNatalAspects(
        mockTransitBodies as any,
        mockNatalBodies as any,
        8
      );
      aspects.forEach(aspect => {
        expect(typeof aspect.transitSpeed).toBe('number');
      });
    });

    it('should find Saturn transit to natal Sun (same sign)', () => {
      // Saturn at 350° Pisces, Sun at 349.69° Pisces = near conjunction
      const aspects = calculateTransitToNatalAspects(
        mockTransitBodies as any,
        mockNatalBodies as any,
        1
      );
      const saturnSun = aspects.find(
        a => a.transitingPlanet === 'Saturn' && a.natalPlanet === 'Sun'
      );
      expect(saturnSun).toBeDefined();
      expect(saturnSun?.aspectType).toBe('Conjunction');
      expect(saturnSun?.orb).toBeLessThan(1);
    });
  });

  describe('calculateProgressedToNatalAspects', () => {
    it('should find progressed aspects within tight orb', () => {
      const aspects = calculateProgressedToNatalAspects(
        mockNatalBodies as any, // Using natal as "progressed" for testing
        mockNatalBodies as any,
        1
      );
      // Should be empty since we're comparing natal to itself (same positions)
      expect(Array.isArray(aspects)).toBe(true);
    });

    it('should use tighter orbs than transits', () => {
      // Default orb for progressions should be 1°
      const aspects = calculateProgressedToNatalAspects(
        mockTransitBodies as any,
        mockNatalBodies as any,
        1
      );
      aspects.forEach(aspect => {
        expect(aspect.orb).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('filterSignificantAspects', () => {
    it('should filter by orb', () => {
      const aspects: TransitNatalAspect[] = [
        { orb: 2, transitingPlanet: 'A' } as any,
        { orb: 5, transitingPlanet: 'B' } as any,
        { orb: 8, transitingPlanet: 'C' } as any
      ];
      const filtered = filterSignificantAspects(aspects, 5);
      expect(filtered).toHaveLength(2);
    });

    it('should limit results when specified', () => {
      const aspects: TransitNatalAspect[] = [
        { orb: 1 } as any,
        { orb: 2 } as any,
        { orb: 3 } as any
      ];
      const filtered = filterSignificantAspects(aspects, 10, 2);
      expect(filtered).toHaveLength(2);
    });
  });

  describe('getMostSignificantTransits', () => {
    it('should return only applying aspects', () => {
      const aspects: TransitNatalAspect[] = [
        { orb: 1, isApplying: true } as any,
        { orb: 2, isApplying: false } as any,
        { orb: 1, isApplying: true } as any
      ];
      const significant = getMostSignificantTransits(aspects, 3, 5);
      expect(significant.every(a => a.isApplying)).toBe(true);
    });
  });

  describe('findAspectsInvolvingPlanet', () => {
    it('should find aspects by transit planet', () => {
      const aspects: TransitNatalAspect[] = [
        { transitingPlanet: 'Saturn', natalPlanet: 'Sun' } as any,
        { transitingPlanet: 'Jupiter', natalPlanet: 'Moon' } as any
      ];
      const saturn = findAspectsInvolvingPlanet(aspects, 'saturn');
      expect(saturn).toHaveLength(1);
    });

    it('should find aspects by natal planet', () => {
      const aspects: TransitNatalAspect[] = [
        { transitingPlanet: 'Saturn', natalPlanet: 'Sun' } as any,
        { transitingPlanet: 'Jupiter', natalPlanet: 'Sun' } as any
      ];
      const sun = findAspectsInvolvingPlanet(aspects, 'Sun');
      expect(sun).toHaveLength(2);
    });
  });

  describe('groupAspectsByTransitPlanet', () => {
    it('should group aspects correctly', () => {
      const aspects: TransitNatalAspect[] = [
        { transitingPlanet: 'Saturn', natalPlanet: 'Sun' } as any,
        { transitingPlanet: 'Saturn', natalPlanet: 'Moon' } as any,
        { transitingPlanet: 'Jupiter', natalPlanet: 'Mars' } as any
      ];
      const grouped = groupAspectsByTransitPlanet(aspects);
      expect(grouped.Saturn).toHaveLength(2);
      expect(grouped.Jupiter).toHaveLength(1);
    });
  });
});

describe('Prompt Builder', () => {
  const mockContext: QueryContext = {
    profile: {
      name: 'TestUser',
      birthDate: new Date('1990-03-10T10:30:00Z'),
      location: {
        name: 'New York, NY',
        latitude: 40.7128,
        longitude: -74.0060
      }
    },
    natal: {
      bodies: mockNatalBodies,
      angles: {
        ascendant: 170.04,
        midheaven: 78.5,
        descendant: 350.04,
        imumCoeli: 258.5
      },
      houses: {
        cusps: [170, 200, 230, 260, 290, 320, 350, 20, 50, 80, 110, 140],
        system: 'placidus'
      }
    } as any,
    transits: {
      bodies: mockTransitBodies,
      angles: {
        ascendant: 0,
        midheaven: 270,
        descendant: 180,
        imumCoeli: 90
      },
      houses: {
        cusps: Array(12).fill(0).map((_, i) => i * 30),
        system: 'placidus'
      }
    } as any,
    natalAspects: [
      { planet1: 'Sun', planet2: 'Moon', aspect: '☍ Opposition', orb: 10.62 }
    ],
    transitAspects: [
      {
        transitingPlanet: 'Saturn',
        natalPlanet: 'Sun',
        aspectType: 'Conjunction',
        symbol: '☌',
        exactAngle: 0,
        actualAngle: 0.31,
        orb: 0.31,
        isApplying: true,
        transitSpeed: 0.05,
        daysToExact: 6,
        nature: 'neutral' as const
      }
    ],
    housePlacements: [
      { planet: 'Sun', house: 7, sign: 'Pisces', degree: 19.69, retrograde: false }
    ],
    retrogradePlanets: ['Mercury'],
    queryMeta: {
      depth: 'standard',
      timestamp: new Date(),
      question: 'What does my Venus Star Point transit mean for relationships?'
    }
  };

  describe('buildSystemPrompt', () => {
    it('should include collaborator role', () => {
      const prompt = buildSystemPrompt('standard');
      expect(prompt).toContain('expert astrologer');
      expect(prompt).toContain('collaborating');
    });

    it('should include word count guidance for quick mode', () => {
      const prompt = buildSystemPrompt('quick');
      expect(prompt).toContain('200-400');
    });

    it('should include comprehensive guidance for deep mode', () => {
      const prompt = buildSystemPrompt('deep');
      expect(prompt).toContain('1500-3000');
      expect(prompt).toContain('Practical synthesis');
    });
  });

  describe('buildUserPrompt', () => {
    it('should include the question', () => {
      const prompt = buildUserPrompt(mockContext);
      expect(prompt).toContain('Venus Star Point');
    });

    it('should include profile information', () => {
      const prompt = buildUserPrompt(mockContext);
      expect(prompt).toContain('TestUser');
      expect(prompt).toContain('New York');
    });

    it('should include natal positions table', () => {
      const prompt = buildUserPrompt(mockContext);
      expect(prompt).toContain('Natal Positions');
      expect(prompt).toContain('Sun');
      expect(prompt).toContain('Pisces');
    });

    it('should include transit aspects', () => {
      const prompt = buildUserPrompt(mockContext);
      expect(prompt).toContain('Transit-to-Natal Aspects');
      expect(prompt).toContain('Saturn');
    });

    it('should include retrograde planets', () => {
      const prompt = buildUserPrompt(mockContext);
      expect(prompt).toContain('Retrograde');
      expect(prompt).toContain('Mercury');
    });
  });

  describe('buildPromptPair', () => {
    it('should return system and user prompts', () => {
      const { system, user, maxTokens } = buildPromptPair(mockContext);
      expect(system.length).toBeGreaterThan(0);
      expect(user.length).toBeGreaterThan(0);
      expect(maxTokens).toBeGreaterThan(0);
    });

    it('should use correct max tokens for depth', () => {
      const standardPair = buildPromptPair({
        ...mockContext,
        queryMeta: { ...mockContext.queryMeta, depth: 'standard' }
      });
      const deepPair = buildPromptPair({
        ...mockContext,
        queryMeta: { ...mockContext.queryMeta, depth: 'deep' }
      });
      expect(deepPair.maxTokens).toBeGreaterThan(standardPair.maxTokens);
    });
  });

  describe('estimatePromptTokens', () => {
    it('should return positive token estimate', () => {
      const tokens = estimatePromptTokens(mockContext);
      expect(tokens).toBeGreaterThan(0);
    });

    it('should estimate more tokens for deep mode', () => {
      const standardTokens = estimatePromptTokens(mockContext);
      const deepContext: QueryContext = {
        ...mockContext,
        progressed: mockContext.natal,
        progression: { age: 35, progressedDate: new Date() },
        progressedAspects: [],
        queryMeta: { ...mockContext.queryMeta, depth: 'deep' }
      };
      const deepTokens = estimatePromptTokens(deepContext);
      expect(deepTokens).toBeGreaterThanOrEqual(standardTokens);
    });
  });
});
