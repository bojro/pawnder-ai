/**
 * Stability Score Calculator
 *
 * Baseline comes from the initial compatibility score.
 * Weekly checkins adjust the score up or down.
 * Returns a StabilitySummary with score, trend, and risk flags.
 */

import { StabilitySummary } from '../types/match';

interface CheckinData {
  id: string;
  type?: string;
  // Weekly fields
  incidentCount?: number;
  ownerStress?: number;
  bond?: number;
  trainingAdherencePercent?: number;
  // Daily fields
  dayRating?: string;
  stressSignals?: boolean;
  createdAt?: any;
}

export function computeStability(
  baselineCompatibility: number,
  checkins: CheckinData[],
  daysRemaining: number,
): StabilitySummary {
  // Start at 50% of compatibility score as baseline
  let score = Math.round(baselineCompatibility * 0.5);
  const trend: number[] = [score];

  let totalIncidents = 0;
  let latestBond = 3;
  let latestAdherence = 50;
  const riskFlags: string[] = [];

  // Sort checkins by createdAt
  const sorted = [...checkins].sort((a, b) => {
    const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
    const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
    return aTime.getTime() - bTime.getTime();
  });

  // Process weekly checkins
  const weeklies = sorted.filter(c => c.type === 'weekly');
  for (const w of weeklies) {
    let delta = 0;

    // Incidents: -3 per incident
    const incidents = w.incidentCount ?? 0;
    totalIncidents += incidents;
    delta -= incidents * 3;

    // Owner stress: 1=+2, 2=+1, 3=0, 4=-2, 5=-4
    const stress = w.ownerStress ?? 3;
    const stressMap: Record<number, number> = { 1: 2, 2: 1, 3: 0, 4: -2, 5: -4 };
    delta += stressMap[stress] ?? 0;

    // Bond: 1=-4, 2=-2, 3=0, 4=+2, 5=+4
    const bond = w.bond ?? 3;
    latestBond = bond;
    const bondMap: Record<number, number> = { 1: -4, 2: -2, 3: 0, 4: 2, 5: 4 };
    delta += bondMap[bond] ?? 0;

    // Training adherence
    const adherence = w.trainingAdherencePercent ?? 50;
    latestAdherence = adherence;
    if (adherence >= 80) delta += 3;
    else if (adherence >= 60) delta += 1;
    else delta -= 3;

    score = clamp(score + delta, 0, 100);
    trend.push(score);
  }

  // Process daily checkins for supplemental adjustments
  const dailies = sorted.filter(c => c.type === 'daily');
  for (const d of dailies) {
    let delta = 0;
    if (d.dayRating === 'calm') delta += 1;
    if (d.dayRating === 'difficult') delta -= 1;
    if (d.stressSignals) delta -= 1;
    score = clamp(score + delta, 0, 100);
  }

  // Generate risk flags
  if (totalIncidents >= 3) riskFlags.push('Multiple behavioral incidents reported');
  if (latestBond <= 2) riskFlags.push('Low bonding score');
  if (latestAdherence < 50) riskFlags.push('Training adherence below 50%');
  if (score < 40) riskFlags.push('Overall stability score is low');

  // Map bond to a 0–100 scale for the summary
  const bondScore = Math.round((latestBond / 5) * 100);

  return {
    stabilityScore: score,
    bondScore,
    incidentCount: totalIncidents,
    trainingAdherencePercent: latestAdherence,
    trend,
    daysRemaining,
  };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
