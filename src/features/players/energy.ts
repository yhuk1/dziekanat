export const BASE_ENERGY_REGEN_SECONDS = 300;
export const MEDICINE_ENERGY_REGEN_SECONDS = 240;
export const HIGH_STRESS_REGEN_PENALTY = 1.25;
export const MAXIMUM_STRESS = 100;

type EnergyState = {
  energy: number;
  maximumEnergy: number;
  stress: number;
  lastEnergyUpdateAt: Date;
  studyProgramSlug?: string;
  energyRegenBonus?: number;
};

export function getEnergyRegenSeconds(studyProgramSlug?: string) {
  return studyProgramSlug === "medicine"
    ? MEDICINE_ENERGY_REGEN_SECONDS
    : BASE_ENERGY_REGEN_SECONDS;
}

export function getEffectiveEnergyRegenSeconds(
  stress: number,
  studyProgramSlug?: string,
  energyRegenBonus = 0,
) {
  const baseSeconds = getEnergyRegenSeconds(studyProgramSlug);
  const bonusMultiplier = Math.max(0.5, 1 - energyRegenBonus / 100);
  const secondsAfterBonus = Math.ceil(baseSeconds * bonusMultiplier);

  if (stress >= 60) {
    return Math.ceil(secondsAfterBonus * HIGH_STRESS_REGEN_PENALTY);
  }

  return secondsAfterBonus;
}

export function calculateServerEnergy(state: EnergyState, now: Date) {
  const cappedEnergy = Math.min(state.energy, state.maximumEnergy);

  if (cappedEnergy >= state.maximumEnergy) {
    return {
      energy: state.maximumEnergy,
      lastEnergyUpdateAt: now < state.lastEnergyUpdateAt ? state.lastEnergyUpdateAt : now,
      regenerated: Math.max(0, state.maximumEnergy - state.energy),
    };
  }

  if (now <= state.lastEnergyUpdateAt) {
    return {
      energy: cappedEnergy,
      lastEnergyUpdateAt: state.lastEnergyUpdateAt,
      regenerated: 0,
    };
  }

  const regenSeconds = getEffectiveEnergyRegenSeconds(
    state.stress,
    state.studyProgramSlug,
    state.energyRegenBonus,
  );
  const elapsedSeconds = Math.floor((now.getTime() - state.lastEnergyUpdateAt.getTime()) / 1000);
  const gainedEnergy = Math.floor(elapsedSeconds / regenSeconds);
  const nextEnergy = Math.min(state.maximumEnergy, cappedEnergy + gainedEnergy);

  if (gainedEnergy <= 0) {
    return {
      energy: cappedEnergy,
      lastEnergyUpdateAt: state.lastEnergyUpdateAt,
      regenerated: 0,
    };
  }

  const consumedSeconds = (nextEnergy - cappedEnergy) * regenSeconds;
  const nextUpdateAt =
    nextEnergy >= state.maximumEnergy
      ? now
      : new Date(state.lastEnergyUpdateAt.getTime() + consumedSeconds * 1000);

  return {
    energy: nextEnergy,
    lastEnergyUpdateAt: nextUpdateAt,
    regenerated: nextEnergy - cappedEnergy,
  };
}

export function clampStress(stress: number) {
  return Math.min(MAXIMUM_STRESS, Math.max(0, stress));
}
