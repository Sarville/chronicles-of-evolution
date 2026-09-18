import { ARCHIVE_RECALL_CHAPTERS, ARCHIVE_RECALL_ENDGAME } from '../../config/archiveRecall.js';
import { applyEffects } from './modifiers.js';

// docs/gdd/10_META_PROGRESSION.md sec.4.4/sec.7: scaling curve past "all 3
// unlocked" isn't designed yet -- cap the level so an endlessly-replayed T5
// can't blow through the sec.7 anti-snowball ceilings before a real curve
// exists.
// ponytail: flat cap, replace with the real curve once sec.4.4 is designed.
const ENDGAME_LEVEL_CAP = 5;

export function grantArchiveRecallPerkChoice(chapterKey, perkChoiceId) {
  const chapterDef = ARCHIVE_RECALL_CHAPTERS[chapterKey];
  if (!chapterDef) {
    return { ok: false, reason: 'UNKNOWN_ARCHIVE_RECALL_CHAPTER', details: { chapterKey } };
  }
  const perk = chapterDef.stylePerks[perkChoiceId];
  if (!perk) {
    return {
      ok: false,
      reason: 'INVALID_ARCHIVE_RECALL_PERK_CHOICE',
      details: { chapterKey, perkChoiceId, options: Object.keys(chapterDef.stylePerks) },
    };
  }
  return {
    ok: true,
    grant: { chapterKey, styleChoice: perkChoiceId, perkId: perk.id, defensePerkId: chapterDef.defensePerk?.id ?? null },
  };
}

// Perks are permanent (stored in meta, not run) but the effects they produce
// live in run.modifiers.active like any node/building effect, so every fresh
// run (after a reset) needs them re-applied once from meta.archiveRecall.
export function applyArchiveRecallPerks(state) {
  const chapters = state.meta?.archiveRecall?.chapters || {};
  for (const [chapterKey, unlocked] of Object.entries(chapters)) {
    const chapterDef = ARCHIVE_RECALL_CHAPTERS[chapterKey];
    const perk = chapterDef?.stylePerks[unlocked.styleChoice];
    if (perk) applyEffects(state, perk.effects, { sourceType: 'archive_recall_perk', sourceId: perk.id });
    // Defense perks are cosmetic (empty effects) but still routed through
    // applyEffects for consistency in case a future chapter gives one teeth.
    if (unlocked.defensePerkId && chapterDef?.defensePerk?.id === unlocked.defensePerkId) {
      applyEffects(state, chapterDef.defensePerk.effects, { sourceType: 'archive_recall_perk', sourceId: chapterDef.defensePerk.id });
    }
  }
}

// T5's ending offers a choice among 3 perks instead of T1-T4's one-of-3-per-
// slot pattern -- once every perk is unlocked (level > 0 for all three),
// further ENDING_ASH completions no longer need a choice; they scale every
// existing perk by +1 level instead (docs/gdd/10_META_PROGRESSION.md sec.4.4).
export function grantArchiveRecallEndgamePerk(state, perkChoiceId) {
  const levels = state.meta?.archiveRecall?.endgame || {};
  const perkKeys = Object.keys(ARCHIVE_RECALL_ENDGAME.perks);
  const locked = perkKeys.filter((key) => !(levels[key] > 0));
  if (locked.length === 0) {
    return { ok: true, grant: { scaleAll: true } };
  }
  if (!perkChoiceId || !locked.includes(perkChoiceId)) {
    return { ok: false, reason: 'INVALID_ARCHIVE_RECALL_PERK_CHOICE', details: { perkChoiceId, options: locked } };
  }
  return { ok: true, grant: { unlock: perkChoiceId } };
}

// Mirrors buildEndgamePerkEffects' role for T1-T4's applyArchiveRecallPerks:
// perks are permanent (stored in meta) but their effects live in
// run.modifiers.active like any other modifier, so a fresh run re-applies
// them from meta.archiveRecall.endgame every time.
function buildEndgamePerkEffects(perkKey, level) {
  const magnitude = (ARCHIVE_RECALL_ENDGAME.perLevel[perkKey] || 0) * level;
  if (perkKey === 'production') {
    return [{ type: 'global_production_multiplier', value: 1 + magnitude }];
  }
  if (perkKey === 'stability') {
    return [
      { type: 'resource_capacity_multiplier', resourceId: 'food', value: 1 + magnitude },
      { type: 'resource_capacity_multiplier', resourceId: 'materials', value: 1 + magnitude },
      { type: 'resource_capacity_multiplier', resourceId: 'knowledge', value: 1 + magnitude },
      { type: 'crisis_stability_decay_multiplier', value: Math.max(0.5, 1 - magnitude) },
    ];
  }
  if (perkKey === 'cognition') {
    return [{ type: 'resource_production_multiplier', resourceId: 'knowledge', value: 1 + magnitude }];
  }
  return [];
}

export function applyArchiveRecallEndgamePerks(state) {
  const levels = state.meta?.archiveRecall?.endgame || {};
  for (const [perkKey, rawLevel] of Object.entries(levels)) {
    const perk = ARCHIVE_RECALL_ENDGAME.perks[perkKey];
    if (!perk || !(rawLevel > 0)) continue;
    const level = Math.min(rawLevel, ENDGAME_LEVEL_CAP);
    applyEffects(state, buildEndgamePerkEffects(perkKey, level), { sourceType: 'archive_recall_endgame_perk', sourceId: perk.id });
  }
}
