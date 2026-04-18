/**
 * HALCON Query System - Aspect Calculator
 *
 * Calculates transit-to-natal and progressed-to-natal aspects for the query system.
 * Uses Swiss Ephemeris data to determine applying/separating status.
 *
 * @module lib/query/aspect-calculator
 */

import type { ChartData } from '../swisseph/types.js';
import {
  MAJOR_ASPECTS,
  MINOR_ASPECTS,
  PLANET_KEYS,
  EXTENDED_PLANET_KEYS,
  type TransitNatalAspect,
  type ProgressedNatalAspect
} from './types.js';

/**
 * Calculate the shortest angular difference between two longitudes
 */
export function calculateAngleDifference(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * Determine if an aspect is applying or separating based on transit speed
 *
 * @param transitLon - Transit planet longitude
 * @param natalLon - Natal planet longitude
 * @param transitSpeed - Transit planet speed (degrees per day, negative = retrograde)
 * @param aspectAngle - The exact aspect angle (0, 60, 90, 120, 180)
 * @returns True if applying (getting closer to exact), false if separating
 */
export function isAspectApplying(
  transitLon: number,
  natalLon: number,
  transitSpeed: number,
  aspectAngle: number
): boolean {
  // Calculate current orb
  const currentDiff = calculateAngleDifference(transitLon, natalLon);
  const currentOrb = Math.abs(currentDiff - aspectAngle);

  // Simulate position after 1 day
  const futureLon = (transitLon + transitSpeed + 360) % 360;
  const futureDiff = calculateAngleDifference(futureLon, natalLon);
  const futureOrb = Math.abs(futureDiff - aspectAngle);

  // If future orb is smaller, the aspect is applying
  return futureOrb < currentOrb;
}

/**
 * Estimate days until/since the aspect was exact
 *
 * @param orb - Current orb in degrees
 * @param transitSpeed - Transit planet speed in degrees/day
 * @param isApplying - Whether the aspect is applying
 * @returns Estimated days (positive = future, negative = past), or null if can't calculate
 */
export function estimateDaysToExact(
  orb: number,
  transitSpeed: number,
  isApplying: boolean
): number | null {
  if (Math.abs(transitSpeed) < 0.001) {
    return null; // Planet is essentially stationary
  }

  const days = orb / Math.abs(transitSpeed);

  // If applying, aspect will be exact in the future (positive)
  // If separating, aspect was exact in the past (negative)
  return isApplying ? days : -days;
}

/**
 * Calculate all transit-to-natal aspects
 *
 * @param transitBodies - Transiting planet positions
 * @param natalBodies - Natal planet positions
 * @param maxOrb - Maximum orb to consider (default 8°)
 * @param includeMinorAspects - Whether to include minor aspects (default false)
 * @returns Array of transit-to-natal aspects sorted by orb
 */
export function calculateTransitToNatalAspects(
  transitBodies: ChartData['bodies'],
  natalBodies: ChartData['bodies'],
  maxOrb: number = 8,
  includeMinorAspects: boolean = false
): TransitNatalAspect[] {
  const aspects: TransitNatalAspect[] = [];
  const aspectTypes = includeMinorAspects
    ? [...MAJOR_ASPECTS, ...MINOR_ASPECTS]
    : MAJOR_ASPECTS;

  // Use extended planet keys for more comprehensive analysis
  const planetKeys = includeMinorAspects ? EXTENDED_PLANET_KEYS : PLANET_KEYS;

  for (const transitKey of planetKeys) {
    const transit = transitBodies[transitKey as keyof typeof transitBodies];
    if (!transit) continue;

    for (const natalKey of planetKeys) {
      const natal = natalBodies[natalKey as keyof typeof natalBodies];
      if (!natal) continue;

      // Skip same planet unless it's a meaningful transit (e.g., Saturn return)
      // We include same-planet aspects for transits

      const angle = calculateAngleDifference(transit.longitude, natal.longitude);

      for (const aspectType of aspectTypes) {
        const orb = Math.abs(angle - aspectType.angle);

        if (orb <= maxOrb) {
          const transitSpeed = transit.longitudeSpeed ?? 0;
          const applying = isAspectApplying(
            transit.longitude,
            natal.longitude,
            transitSpeed,
            aspectType.angle
          );

          aspects.push({
            transitingPlanet: transit.name,
            natalPlanet: natal.name,
            aspectType: aspectType.name,
            symbol: aspectType.symbol,
            exactAngle: aspectType.angle,
            actualAngle: parseFloat(angle.toFixed(2)),
            orb: parseFloat(orb.toFixed(2)),
            isApplying: applying,
            transitSpeed: parseFloat(transitSpeed.toFixed(4)),
            daysToExact: estimateDaysToExact(orb, transitSpeed, applying),
            nature: aspectType.nature
          });
        }
      }
    }
  }

  // Sort by orb (most exact first)
  return aspects.sort((a, b) => a.orb - b.orb);
}

/**
 * Calculate all progressed-to-natal aspects
 *
 * @param progressedBodies - Progressed planet positions
 * @param natalBodies - Natal planet positions
 * @param maxOrb - Maximum orb to consider (default 1° for progressions)
 * @param includeMinorAspects - Whether to include minor aspects
 * @returns Array of progressed-to-natal aspects sorted by orb
 */
export function calculateProgressedToNatalAspects(
  progressedBodies: ChartData['bodies'],
  natalBodies: ChartData['bodies'],
  maxOrb: number = 1,
  includeMinorAspects: boolean = false
): ProgressedNatalAspect[] {
  const aspects: ProgressedNatalAspect[] = [];
  const aspectTypes = includeMinorAspects
    ? [...MAJOR_ASPECTS, ...MINOR_ASPECTS]
    : MAJOR_ASPECTS;

  const planetKeys = includeMinorAspects ? EXTENDED_PLANET_KEYS : PLANET_KEYS;

  for (const progressedKey of planetKeys) {
    const progressed = progressedBodies[progressedKey as keyof typeof progressedBodies];
    if (!progressed) continue;

    for (const natalKey of planetKeys) {
      const natal = natalBodies[natalKey as keyof typeof natalBodies];
      if (!natal) continue;

      // Skip same planet for progressed aspects
      if (progressedKey === natalKey) continue;

      const angle = calculateAngleDifference(progressed.longitude, natal.longitude);

      for (const aspectType of aspectTypes) {
        const orb = Math.abs(angle - aspectType.angle);

        if (orb <= maxOrb) {
          // Calculate how much the progressed planet has moved
          const movement = progressed.longitude - natal.longitude;
          // Normalize to -180 to 180
          const normalizedMovement = ((movement + 540) % 360) - 180;

          aspects.push({
            progressedPlanet: progressed.name,
            natalPlanet: natal.name,
            aspectType: aspectType.name,
            symbol: aspectType.symbol,
            orb: parseFloat(orb.toFixed(2)),
            progressedMovement: parseFloat(normalizedMovement.toFixed(2)),
            nature: aspectType.nature
          });
        }
      }
    }
  }

  // Sort by orb
  return aspects.sort((a, b) => a.orb - b.orb);
}

/**
 * Filter aspects by significance (tighter orbs = more significant)
 *
 * @param aspects - Array of aspects to filter
 * @param maxOrb - Maximum orb to include
 * @param limit - Maximum number to return (0 = no limit)
 * @returns Filtered array of aspects
 */
export function filterSignificantAspects<T extends { orb: number }>(
  aspects: T[],
  maxOrb: number = 8,
  limit: number = 0
): T[] {
  const filtered = aspects.filter(a => a.orb <= maxOrb);
  return limit > 0 ? filtered.slice(0, limit) : filtered;
}

/**
 * Group aspects by transiting planet
 *
 * @param aspects - Array of transit-to-natal aspects
 * @returns Record keyed by transiting planet name
 */
export function groupAspectsByTransitPlanet(
  aspects: TransitNatalAspect[]
): Record<string, TransitNatalAspect[]> {
  return aspects.reduce((acc, aspect) => {
    const key = aspect.transitingPlanet;
    if (!acc[key]) acc[key] = [];
    acc[key].push(aspect);
    return acc;
  }, {} as Record<string, TransitNatalAspect[]>);
}

/**
 * Get the most significant current transits (applying, tight orb)
 *
 * @param aspects - All transit aspects
 * @param maxOrb - Maximum orb for "significant" (default 3°)
 * @param limit - Maximum to return
 * @returns Most significant transits
 */
export function getMostSignificantTransits(
  aspects: TransitNatalAspect[],
  maxOrb: number = 3,
  limit: number = 5
): TransitNatalAspect[] {
  return aspects
    .filter(a => a.orb <= maxOrb && a.isApplying)
    .slice(0, limit);
}

/**
 * Find aspects involving a specific planet
 *
 * @param aspects - Array of aspects
 * @param planetName - Planet to search for
 * @returns Aspects involving that planet
 */
export function findAspectsInvolvingPlanet(
  aspects: TransitNatalAspect[],
  planetName: string
): TransitNatalAspect[] {
  const normalizedName = planetName.toLowerCase();
  return aspects.filter(
    a =>
      a.transitingPlanet.toLowerCase() === normalizedName ||
      a.natalPlanet.toLowerCase() === normalizedName
  );
}
