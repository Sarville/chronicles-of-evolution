import { ARCHIVE_RECALL_CHAPTERS } from '../../config/archiveRecall.js';
import { applyEffects } from './modifiers.js';

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
