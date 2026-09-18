import { createBrowserStorage } from '../adapters/storageAdapter.js';
import { ruleset, createRulesetIndexes } from '../config/index.js';
import { ARCHIVE_RECALL_CHAPTERS } from '../config/archiveRecall.js';
import { calculateCap } from '../domain/services/resources.js';
import {
  selectCurrentGoal,
  formatEta,
  formatResourceAmount,
  selectManualProcessView,
  selectEvolutionRevealLevel,
  selectNodeCost,
  selectNodeStatus,
  selectPurchaseEta,
  selectProducerOutputView,
  selectProducerPrice,
  selectProducerStatus,
  selectBuildingPrice,
  selectBuildingStatus,
  selectProductionRates,
  selectSideGoals,
  selectProgressiveGoals,
  selectVisibleResources,
  selectPopulation,
  selectCognition,
} from '../domain/selectors.js';
import { createSaveRepository } from '../save/repository.js';
import { createPlayableRuntime, routeCtaFocus } from './runtime.js';

const DEV = __CHRONICLES_DEV__;
const ROOT_ID = 'chronicles-root';
const EVOLUTION_NODES = ruleset.nodes.map((node) => node.id);
const RESOURCE_NAMES = {
  rna: 'RNA',
  dna: 'DNA',
  biomass: 'Biomass',
  atp: 'ATP',
  food: 'Food',
  materials: 'Materials',
  knowledge: 'Knowledge',
  power: 'Power',
};
const NODE_NAMES = {
  M01: 'Stable RNA',
  M02: 'Self Replication',
  M03: 'DNA Synthesis',
  M04: 'Error Correction',
  M05: 'Membrane',
  M06: 'Cell',
  C01: 'Metabolism',
  C02A: 'Absorption',
  C02B: 'Symbiosis',
  C02C: 'Shell',
  C03: 'Protein Synthesis',
  C04A: 'Photosynthesis',
  C04B: 'Chemosynthesis',
  C04C: 'Efficient Digestion',
  C05: 'Organelles',
  C06: 'Cell Coordination',
  B02A: 'Mobility',
  B02B: 'Sensory Cells',
  B02C: 'Digestion',
  B02D: 'Structural Tissue',
  C07: 'Multicellularity',
  B03: 'Tissue Specialization', B04: 'Nervous Tissue', B05: 'Nervous System',
  N03: 'Neural Complexity', N05: 'Proto-language', N07: 'Sapience',
  N02A: 'Solitary Strategy', N02B: 'Social Behavior', N02C: 'Object Manipulation',
  T01A: 'Hunting Tradition', T01B: 'Gathering Network', T01C: 'Knowledge Ritual',
  T02: 'Fire', T03: 'Shared Survival', T05: 'Tribe', T07: 'Seed Selection', T08: 'Agriculture',
  T09: 'Permanent Settlement', T10: 'Writing', T11: 'Organized Labor', T12: 'City',
  T13: 'Mechanization', T14: 'Steam and Rail', T15: 'Electrification', T16: 'Electrical Grid',
  T17: 'Research Institutions', T18: 'Global Connection', A01: 'Scientific Method',
  A02: 'Atomic Theory', A03: 'Reactor/Lab Program', A04: 'Atomic Age',
};
const PRODUCER_NAMES = {
  PROC_PRIMORDIAL_REACTION: 'Primordial Reaction',
  PROC_RNA_REPLICATION: 'RNA Replication',
  PROC_DNA_SYNTHESIS: 'DNA Synthesis',
  PROC_BIOMASS_UPTAKE: 'Biomass Uptake',
  PROC_RESPIRATION: 'Respiration',
};
const BUILDING_NAMES = {
  BLD_MEMBRANE_STORE: 'Membrane Layers',
  BLD_GENETIC_STORE: 'Genetic Storage',
  BLD_BIOMASS_STORE: 'Biomass Reserve',
  BLD_ATP_STORE: 'ATP Reserve',
  BLD_FOOD_STORE: 'Food Store',
  BLD_MATERIALS_STORE: 'Materials Store',
  BLD_KNOWLEDGE_ARCHIVE: 'Knowledge Archive',
  BLD_POWER_STORE: 'Power Reserve',
  BLD_FIELD: 'Field',
  BLD_HOUSE: 'House', BLD_WORKSHOP: 'Workshop', BLD_SCHOOL: 'School', BLD_MARKET: 'Market',
  BLD_FACTORY: 'Factory', BLD_RAIL_HUB: 'Rail Hub', BLD_GRID: 'Electrical Grid', BLD_REACTOR_LAB: 'Reactor/Lab',
};

const storage = createBrowserStorage();
const repository = createSaveRepository({ storage });
let runtime = createPlayableRuntime({ repository, ruleset, dev: DEV });
const indexes = createRulesetIndexes(ruleset);
let activeView = 'world';
let focusedEntityId = null;
let lastTickAt = performance.now();
let lastSaveMessage =
  runtime.mode === 'playable' ? (runtime.loaded.created ? 'New run created' : 'Save loaded') : 'Recovery required';

function engine() {
  return runtime.engine;
}

function autosave() {
  return runtime.autosave;
}

function debugApi() {
  return runtime.debugApi;
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return '0';
  }
  if (value >= 1000) {
    return value.toFixed(0);
  }
  if (value >= 100) {
    return value.toFixed(1);
  }
  return value.toFixed(2).replace(/\.?0+$/, '');
}

function formatCost(cost) {
  return Object.entries(cost)
    .map(([resourceId, amount]) => `${formatNumber(amount)} ${RESOURCE_NAMES[resourceId] || resourceId}`)
    .join(' + ');
}

function shortfallColor(resourceId, amount) {
  const current = engine().state.run.resources[resourceId]?.amount || 0;
  if (current >= amount) {
    return null;
  }
  const cap = calculateCap(engine().state, resourceId, ruleset);
  return amount > cap ? 'red' : 'lightcoral';
}

function formatWholeCost(cost) {
  return Object.entries(cost)
    .map(([resourceId, amount]) => {
      const label = `${formatResourceAmount(amount)} ${RESOURCE_NAMES[resourceId] || resourceId}`;
      const color = shortfallColor(resourceId, amount);
      return color ? `<span style="color:${color}">${label}</span>` : label;
    })
    .join(' + ');
}

function formatNodeCost(node, cost) {
  const adaptationCost = node.adaptationPointCost ? `${node.adaptationPointCost} AP` : '';
  const resourceCost = formatWholeCost(cost);
  return [adaptationCost, resourceCost].filter(Boolean).join(' + ');
}

function nodePurchaseFailureMessage(result) {
  if (result.reason === 'INSUFFICIENT_ADAPTATION_POINTS') {
    return `Нужно AP: ${result.details?.required || 0}; доступно: ${result.details?.available || 0}.`;
  }
  if (result.reason === 'BLOCKED_BY_EVENT') {
    return 'Сначала завершите открытое событие.';
  }
  return `Не удалось открыть узел: ${result.reason || 'UNKNOWN'}.`;
}

function phaseLabel() {
  if (engine().state.run.eraId !== 'MOLECULAR' && engine().state.run.eraId !== 'CELLULAR' && engine().state.run.eraId !== 'MULTICELLULAR') {
    return engine().state.run.eraId.replaceAll('_', ' ');
  }
  if (engine().state.run.nodes.completed.C06) return 'Cell Coordination';
  if (engine().state.run.nodes.completed.C05) return 'Organelles';
  if (engine().state.run.nodes.completed.C03) return 'Protein Synthesis';
  if (engine().state.run.nodes.selectedBranchByGroup?.cell_identity_1) return NODE_NAMES[engine().state.run.nodes.selectedBranchByGroup.cell_identity_1];
  if (engine().state.run.nodes.completed.C01) return 'Metabolism';
  if (engine().state.run.nodes.completed.M06) return 'Cell';
  if (engine().state.run.nodes.completed.M05) return 'Membrane';
  if (engine().state.run.nodes.completed.M03) return 'DNA synthesis';
  if (engine().state.run.nodes.completed.M02) return 'Self replication';
  if (engine().state.run.nodes.completed.M01) return 'Stable RNA';
  return 'Primordial';
}

function goalProgress(goal) {
  if (!goal) return '';
  if (goal.nodeId) {
    const node = indexes.nodes[goal.nodeId];
    const lines = Object.entries(selectNodeCost(engine().state, ruleset, goal.nodeId))
      .map(([resourceId, amount]) => {
        const current = engine().state.run.resources[resourceId]?.amount || 0;
        const line = `${RESOURCE_NAMES[resourceId] || resourceId}: ${formatResourceAmount(Math.min(current, amount))} / ${formatResourceAmount(amount)}`;
        const color = shortfallColor(resourceId, amount);
        return color ? `<span style="color:${color}">${line}</span>` : line;
      });
    if (node?.cognitionMin != null) {
      const cognition = selectCognition(engine().state, ruleset);
      lines.push(`Cognition: ${formatNumber(cognition.value)} / ${cognition.max}`);
    }
    return lines.join('<br>');
  }
  const cognitionCondition = goal.conditions?.find((condition) => condition.type === 'cognition_at_least');
  if (cognitionCondition) {
    const cognition = selectCognition(engine().state, ruleset);
    return `Cognition: ${formatNumber(cognition.value)} / ${cognitionCondition.value}`;
  }
  return goal.completed ? 'Complete' : 'In progress';
}

function goalEta(goal) {
  if (!goal?.nodeId) {
    return '';
  }
  const status = selectNodeStatus(engine().state, ruleset, goal.nodeId);
  const cost = selectNodeCost(engine().state, ruleset, goal.nodeId);
  return etaText(status, cost);
}

function renderResources() {
  return selectVisibleResources(engine().state, ruleset)
    .map(
      (resource) => `<div class="resource-row">
        <span>${RESOURCE_NAMES[resource.id] || resource.id}</span>
        <strong>${formatResourceAmount(resource.amount)} / ${formatResourceAmount(resource.cap)}</strong>
        <small>${resource.perSecond > 0 ? '+' : ''}${formatNumber(resource.perSecond)}/s</small>
      </div>`
    )
    .join('');
}

function renderObjective() {
  const goal = selectCurrentGoal(engine().state, ruleset);
  const sideGoals = selectSideGoals(engine().state, ruleset);
  if (!goal) {
    return '<section class="panel objective"><h2>Objective</h2><p>No active objective.</p></section>';
  }
  const goalState = goal.state;
  const hint = goalState.hintShownAtMs != null ? `<p class="hint">${goal.hint}</p>` : '';
  const eta = goalEta(goal);
  const side = sideGoals
    .map((sideGoal) => {
      const progress = goalProgress(sideGoal);
      return `<div class="side-goal"><strong>${sideGoal.title}</strong><span>${sideGoal.description}</span>${progress ? `<span>${progress}</span>` : ''}</div>`;
    })
    .join('');
  return `<section class="panel objective">
    <h2>Objective</h2>
    <h3>${goal.title}</h3>
    <p>${goal.description}</p>
    <div class="progress">${goalProgress(goal)}</div>
    ${eta ? `<p>${eta}</p>` : ''}
    ${hint}
    <button data-action="focus" data-target="${goal.cta?.targetId || ''}">${goal.cta?.label || 'Continue'}</button>
    ${side ? `<div class="side-goals">${side}</div>` : ''}
  </section>`;
}

function renderProgressiveGoals() {
  return selectProgressiveGoals(engine().state, ruleset)
    .map((goal) => `<section class="panel progressive-goal">
      <h2>${goal.title}</h2>
      <p>${goal.description}</p>
      <div class="progress">${goalProgress(goal)}</div>
    </section>`)
    .join('');
}

function renderPendingEvent() {
  const eventId = engine().state.run.events.pendingId;
  if (!eventId) return '';
  const event = indexes.events[eventId];
  if (!event) return '';
  const choices = event.choices.map((choice) => {
    const node = choice.purchaseNodeId ? indexes.nodes[choice.purchaseNodeId] : null;
    const status = node ? selectNodeStatus(engine().state, ruleset, node.id) : 'available_affordable';
    const cost = node ? `<small>${formatWholeCost(selectNodeCost(engine().state, ruleset, node.id))}</small>` : '';
    return `<button class="event-choice" data-action="resolve-event" data-event-id="${event.id}" data-choice-id="${choice.id}" ${status === 'available_affordable' ? '' : 'disabled'}>
      <strong>${choice.label}</strong>${cost}
    </button>`;
  }).join('');
  return `<section class="event-panel ${event.type === 'branch' ? 'blocking' : ''}" role="dialog" aria-label="${event.title}">
    <small>СОБЫТИЕ</small><h2>${event.title}</h2><p>${event.body}</p><div class="event-choices">${choices}</div>
  </section>`;
}

function manualActionStatus(process) {
  if (!process.available) {
    const remaining = Math.max(0, (process.state.availableAtMs || 0) - engine().state.run.clock.simulationMs);
    if (remaining > 0) {
      return `${Math.ceil(remaining / 1000)}s`;
    }
    return 'Locked';
  }
  if (!process.affordable) {
    return `Needs ${formatCost(process.inputCost)}`;
  }
  const cost = Object.keys(process.inputCost || {}).length ? `${formatCost(process.inputCost)} → ` : '';
  return `${cost}+${formatCost(process.reward)}`;
}

function renderManualActions() {
  return ruleset.manualProcesses
    .map((config) => {
      const process = selectManualProcessView(engine().state, ruleset, config.id);
      if (!process || (process.obsoleteAfterNodeId && engine().state.run.nodes.completed[process.obsoleteAfterNodeId])) {
        return '';
      }
      if (!process.available && !process.availableFromStart && !engine().state.run.nodes.completed[process.availableAfterNodeId]) {
        return '';
      }
      const disabled = process.available && process.affordable ? '' : 'disabled';
      return `<button class="wide primary ${focusedEntityId === process.id ? 'focused' : ''}" data-entity-id="${process.id}" data-action="manual" data-id="${process.id}" ${disabled}>
    ${process.label}
    <small>${manualActionStatus(process)}</small>
  </button>`;
    })
    .join('');
}

function etaText(status, cost) {
  const eta = selectPurchaseEta(engine().state, ruleset, status, cost);
  return eta ? `ETA ${formatEta(eta)}` : '';
}

function renderProducerMilestone(outputView) {
  const bonus = outputView.nextMilestone || outputView.reachedMilestone;
  const bonusText = bonus ? `x${formatNumber(bonus.multiplier)} (+${formatNumber((bonus.multiplier - 1) * 100)}%)` : '';
  if (outputView.nextMilestone) {
    return `<small>${outputView.nextMilestone.label} ${outputView.count}/${outputView.nextMilestone.count} · Bonus ${bonusText} production · ${outputView.nextMilestone.description}</small>`;
  }
  if (outputView.reachedMilestone) {
    return `<small>${outputView.reachedMilestone.label} · ${bonusText} production: ${outputView.reachedMilestone.description}</small>`;
  }
  return '';
}

function renderProducers() {
  const rows = ruleset.producers
    .map((producer) => {
      const status = selectProducerStatus(engine().state, ruleset, producer.id);
      if (status === 'locked') return '';
      const outputView = selectProducerOutputView(engine().state, ruleset, producer.id);
      const cost = selectProducerPrice(engine().state, ruleset, producer.id);
      const milestone = renderProducerMilestone(outputView);
      const input = Object.keys(outputView.inputPerUnit).length
        ? `<small>Consumes / unit</small>${formatCost(outputView.inputPerUnit)}/s<small>Current consumption</small>${formatCost(outputView.currentInput)}/s`
        : '';
      return `<button class="entity ${status} ${focusedEntityId === producer.id ? 'focused' : ''}" data-entity-id="${producer.id}" data-action="producer" data-id="${producer.id}" ${status === 'available_affordable' ? '' : 'disabled'}>
        <span><strong>${PRODUCER_NAMES[producer.id] || producer.id}</strong><small>Owned ${outputView.count}</small>${milestone}</span>
        <span><small>Cost</small>${formatCost(cost)}<small>${etaText(status, cost)}</small></span>
        <span>${input}<small>Base output / unit</small>${formatCost(outputView.basePerUnit)}/s<small>Current output</small>${formatCost(outputView.currentTotal)}/s</span>
      </button>`;
    })
    .join('');
  return `<section class="panel"><h2>Actions / Generators</h2>${renderManualActions()}<div class="entity-list">${rows}</div></section>`;
}

function renderBuildingCapacity(building) {
  const capacity = (building.effects || []).filter((effect) => effect.type === 'resource_capacity');
  if (!capacity.length) return '';
  return `<small>Storage</small>${capacity
    .map((effect) => `+${formatResourceAmount(effect.value)} ${RESOURCE_NAMES[effect.resourceId] || effect.resourceId}`)
    .join(' + ')}`;
}

function renderBuildings() {
  const rows = ruleset.buildings
    .map((building) => {
      const status = selectBuildingStatus(engine().state, ruleset, building.id);
      if (status === 'locked' || status === 'unknown') return '';
      const count = engine().state.run.buildings[building.id]?.count || 0;
      const cost = selectBuildingPrice(engine().state, ruleset, building.id);
      const disabled = status === 'available_affordable' ? '' : 'disabled';
      const price = cost ? formatWholeCost(cost) : '';
      return `<button class="entity ${status} ${focusedEntityId === building.id ? 'focused' : ''}" data-entity-id="${building.id}" data-action="building" data-id="${building.id}" ${disabled}>
        <span><strong>${BUILDING_NAMES[building.id] || building.id}</strong><small>Built ${count}</small></span>
        <span><small>Cost</small>${price}<small>${status === 'maxed' ? 'Maximum reached' : etaText(status, cost)}</small></span>
        <span>${renderBuildingCapacity(building)}</span>
      </button>`;
    })
    .join('');
  if (!rows) return '';
  return `<section class="panel"><h2>Infrastructure</h2><div class="entity-list">${rows}</div></section>`;
}

function renderJobs() {
  const population = selectPopulation(engine().state);
  if (!population) return '';
  const rows = ruleset.jobs
    .filter((job) => job.eraIds.includes(engine().state.run.eraId))
    .map((job) => {
      const count = engine().state.run.population.assignments[job.id] || 0;
      const output = formatCost(job.output);
      return `<div class="job-row"><span><strong>${job.labelKey?.replace('job.', '') || job.id}</strong><small>+${output}/s per person</small></span>
        <span class="job-controls"><button data-action="job" data-id="${job.id}" data-amount="${Math.max(0, count - 1)}" ${count ? '' : 'disabled'}>−</button><strong>${count}</strong><button data-action="job" data-id="${job.id}" data-amount="${count + 1}" ${population.unassigned > 0 ? '' : 'disabled'}>+</button></span></div>`;
    }).join('');
  if (!rows) return '';
  return `<section class="panel"><h2>Jobs</h2><p class="job-summary">Population ${formatNumber(population.current)} / ${formatNumber(population.cap)} · unassigned ${population.unassigned}</p>${rows}</section>`;
}

function renderEvolution() {
  const revealLevels = {};
  const rows = EVOLUTION_NODES.map((nodeId) => {
    const node = indexes.nodes[nodeId];
    const revealLevel = selectEvolutionRevealLevel(engine().state, ruleset, nodeId, revealLevels);
    if (!engine().state.run.nodes.completed[nodeId] && revealLevel > 1) {
      return `<button class="node hidden-evolution" disabled aria-label="Недоступное открытие">
        <span><strong>🔒 Неизвестное открытие</strong></span>
        <small>Откроется позже</small>
      </button>`;
    }
    const status = selectNodeStatus(engine().state, ruleset, nodeId);
    const optional = node.type === 'OPTIONAL' ? '<small class="optional">OPTIONAL</small>' : '';
    const cost = selectNodeCost(engine().state, ruleset, nodeId);
    const completed = status === 'completed';
    const eta = etaText(status, cost);
    const etaLabel = eta || `ETA ${status === 'locked' ? 'Недоступно' : 'Сейчас'}`;
    return `<button class="node ${status} ${focusedEntityId === nodeId ? 'focused' : ''}" data-entity-id="${nodeId}" data-action="node" data-id="${nodeId}" ${status === 'available_affordable' ? '' : 'disabled'}>
      <span><strong>${nodeId} — ${NODE_NAMES[nodeId] || node.labelKey || nodeId}</strong>${optional}</span>
      <span>${status.replaceAll('_', ' ')}${completed ? '' : `<small>${etaLabel}</small>`}</span>
      ${completed ? '' : `<small>${formatNodeCost(node, cost)}</small>`}
    </button>`;
  }).join('');
  const adaptationPoints = engine().state.run.adaptation?.points || 0;
  return `<section class="panel evolution-panel"><h2>Evolution</h2><p class="job-summary">Adaptation Points: ${adaptationPoints}</p><div class="node-grid">${rows}</div></section>`;
}

function renderDiorama() {
  const cognitionValue = selectCognition(engine().state, ruleset).value;
  const cognition = cognitionValue > 0 ? `<span>Cognition ${cognitionValue}/100</span>` : '';
  return `<section class="diorama" aria-label="World state">
    <div class="orbital orbital-a"></div>
    <div class="orbital orbital-b"></div>
    <div class="molecule ${engine().state.run.nodes.completed.M06 ? 'proto' : ''}"></div>
    <div>
      <p>World</p>
      <h1>${phaseLabel()}</h1>
      <span>Timeline #1 · ${Math.floor(engine().state.run.clock.simulationMs / 1000)}s</span>${cognition}
    </div>
  </section>`;
}

const ENDING_TITLE_BY_ID = { ENDING_BLIGHT: 'МОР', ENDING_CATACLYSM: 'КАТАКЛИЗМ', ENDING_FRACTURE: 'РАСКОЛ' };
const CHAPTER_KEY_BY_ENDING_ID = Object.fromEntries(
  Object.entries(ARCHIVE_RECALL_CHAPTERS).map(([chapterKey, chapterDef]) => [chapterDef.endingId, chapterKey])
);

function renderEnding() {
  const ending = engine().state.run.ending;
  if (!ending) return '';
  const chapterKey = CHAPTER_KEY_BY_ENDING_ID[ending.id];
  if (chapterKey) {
    const chapterDef = ARCHIVE_RECALL_CHAPTERS[chapterKey];
    const defenseNote = chapterDef.defensePerk
      ? `<p class="hint">Также получена косметическая защита: ${chapterDef.defensePerk.label}.</p>`
      : '';
    const options = Object.entries(chapterDef.stylePerks)
      .map(([choiceId, perk]) => `<button class="primary" data-action="archive-reset" data-perk="${choiceId}">${perk.label}: ${perk.description}</button>`)
      .join('');
    return `<section class="panel ending"><small>ЦИВИЛИЗАЦИЯ ЗАВЕРШЕНА</small><h2>${ENDING_TITLE_BY_ID[ending.id] || ending.id}</h2><p>Подтип: ${ending.subtype}. Выберите перк Archive Recall для следующей попытки.</p>${defenseNote}${options}</section>`;
  }
  return `<section class="panel ending"><small>ЦИВИЛИЗАЦИЯ №1 ЗАВЕРШЕНА</small><h2>ПЕПЕЛ</h2><p>Подтип: ${ending.subtype}. История готова к сохранению в Архив.</p><button class="primary" data-action="archive-reset">Сохранить в Архив</button></section>`;
}

const renderDevPanel = DEV
  ? function renderDevPanelContent() {
      return `<details class="panel dev-panel">
    <summary>Development</summary>
    <div class="dev-grid">
      ${debugApi().timeScales.map((scale) => `<button data-action="speed" data-scale="${scale}">${scale}x</button>`).join('')}
      <button data-action="grant" data-resource="rna">+100 RNA</button>
      <button data-action="grant" data-resource="dna">+25 DNA</button>
      <button data-action="grant" data-resource="biomass">+25 Biomass</button>
      <button data-action="grant" data-resource="atp">+25 ATP</button>
      <button data-action="toggle-test-mode">Test mode: ${engine().state.settings.testMode ? 'ON' : 'OFF'}</button>
      <button data-action="dev-reset">Dev reset</button>
      <button data-action="dump">Dump state</button>
    </div>
    <pre id="dev-dump"></pre>
  </details>`;
    }
  : function renderNoDevPanel() {
      return '';
    };

function render() {
  const root = document.getElementById(ROOT_ID);
  if (runtime.mode !== 'playable') {
    root.innerHTML = `<main class="app recovery">
      <section class="panel recovery-panel">
        <h1>Save recovery required</h1>
        <p>Primary / pending / backup contain invalid data.</p>
        ${
          runtime.diagnostics?.length
            ? `<ul>${runtime.diagnostics
                .map((slot) => `<li><strong>${slot.key}</strong>: ${slot.reason}${slot.errors?.length ? ` (${slot.errors.join(', ')})` : ''}</li>`)
                .join('')}</ul>`
            : ''
        }
        <button class="primary" data-action="start-fresh">Start fresh</button>
      </section>
    </main>`;
    return;
  }
  root.innerHTML = `<main class="app">
    <header>
      <div><strong>Хроники Эволюции</strong><small>Timeline #1 · RNA → Ash</small></div>
      <nav>
        <button data-action="view" data-view="world" class="${activeView === 'world' ? 'active' : ''}">World</button>
        <button data-action="view" data-view="evolution" class="${activeView === 'evolution' ? 'active' : ''}">Evolution</button>
      </nav>
    </header>
    <section class="resources">${renderResources()}</section>
    ${renderPendingEvent()}
    <div class="layout">
      <div>
        ${renderDiorama()}
        ${activeView === 'world' ? `${renderProducers()}${renderJobs()}${renderBuildings()}` : renderEvolution()}
      </div>
      <aside>
        ${renderEnding() || renderObjective()}
        ${renderProgressiveGoals()}
        <section class="panel status"><h2>Save</h2><p>${lastSaveMessage}</p>${engine().state.run.migrationNotice ? `<p class="hint">${engine().state.run.migrationNotice}</p>` : ''}<button data-action="save">Save now</button><button data-action="new-run">New run</button></section>
        ${renderDevPanel()}
      </aside>
    </div>
  </main>`;
}

function handleAction(target) {
  const button = target.closest('button');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'start-fresh') {
    const fresh = runtime.startFreshAfterCorruption();
    if (fresh.ok) {
      runtime = fresh.runtime;
      lastSaveMessage = 'New run created';
      lastTickAt = performance.now();
      requestAnimationFrame(loop);
    } else {
      lastSaveMessage = `Recovery failed: ${fresh.loaded.reason}`;
    }
    render();
    return;
  }
  if (runtime.mode !== 'playable') return;
  if (action === 'view') activeView = button.dataset.view;
  if (action === 'focus') {
    const routed = routeCtaFocus({ targetId: button.dataset.target }, indexes);
    activeView = routed.activeView;
    focusedEntityId = routed.focusedEntityId;
  }
  if (action === 'manual') engine().dispatch({ type: 'USE_MANUAL_PROCESS', processId: button.dataset.id });
  if (action === 'producer') engine().dispatch({ type: 'BUY_PRODUCER', producerId: button.dataset.id });
  if (action === 'building') engine().dispatch({ type: 'BUY_BUILDING', buildingId: button.dataset.id });
  if (action === 'job') engine().dispatch({ type: 'ASSIGN_JOB', jobId: button.dataset.id, amount: Number(button.dataset.amount) });
  if (action === 'node') {
    const result = engine().dispatch({ type: 'BUY_NODE', nodeId: button.dataset.id });
    if (!result.ok) {
      lastSaveMessage = nodePurchaseFailureMessage(result);
    }
    if (result.ok && result.events.some((event) => event.type === 'cell_reached' || event.payload?.nodeId === 'M06')) {
      autosave().flush('cell_reached');
    }
  }
  if (action === 'resolve-event') engine().dispatch({ type: 'RESOLVE_EVENT', eventId: button.dataset.eventId, choiceId: button.dataset.choiceId });
  if (action === 'archive-reset') {
    const result = engine().dispatch({ type: 'ARCHIVE_RESET', perkChoiceId: button.dataset.perk });
    if (result.ok) {
      autosave().flush('archive_reset');
      lastSaveMessage = 'Ash saved in Archive';
      activeView = 'world';
    }
  }
  if (action === 'save') {
    const saved = autosave().flush('manual');
    lastSaveMessage = saved.ok ? 'Saved' : `Save failed: ${saved.reason}`;
  }
  if (action === 'new-run') {
    storage.remove('chronicles_evolution');
    storage.remove('chronicles_evolution.backup');
    storage.remove('chronicles_evolution.pending');
    window.location.reload();
  }
  if (DEV && action === 'speed') debugApi().setTimeScale(Number(button.dataset.scale));
  if (DEV && action === 'grant') debugApi().grant(button.dataset.resource, button.dataset.resource === 'rna' ? 100 : 25);
  if (DEV && action === 'toggle-test-mode') debugApi().toggleTestMode();
  if (DEV && action === 'dev-reset') debugApi().manualDevReset({ runId: `run_dev_${Date.now()}` });
  if (DEV && action === 'dump') document.getElementById('dev-dump').textContent = JSON.stringify(debugApi().dumpState(), null, 2);
  render();
  if (focusedEntityId) {
    document.querySelector(`[data-entity-id="${focusedEntityId}"]`)?.focus();
    document.querySelector(`[data-entity-id="${focusedEntityId}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

function installStyles() {
  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #101316; color: #f3f0e8; }
    button { min-height: 44px; border: 1px solid #3d4b50; background: #20272a; color: #f3f0e8; border-radius: 6px; padding: 10px 12px; cursor: pointer; text-align: left; }
    button:disabled { opacity: .45; cursor: not-allowed; }
    button.active, button.primary, button.available_affordable { border-color: #66d0a5; background: #1e3732; }
    button.focused { outline: 3px solid #f0c36a; outline-offset: 2px; }
    .app { min-height: 100vh; padding: 18px; }
    header { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 12px; }
    header small, small { display: block; color: #aab7b5; margin-top: 2px; }
    nav { display: flex; gap: 8px; }
    .resources { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 8px; margin-bottom: 12px; }
    .resource-row { display: grid; grid-template-columns: 1fr auto auto; gap: 12px; align-items: baseline; padding: 12px; background: #171d20; border: 1px solid #283337; border-radius: 6px; }
    .resource-row small { color: #77d7be; }
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 360px); gap: 12px; }
    .diorama { min-height: 300px; border: 1px solid #354147; border-radius: 8px; background: radial-gradient(circle at 35% 40%, #315c65, #12191d 62%); position: relative; overflow: hidden; display: flex; align-items: end; padding: 28px; }
    .diorama h1 { margin: 0; font-size: 42px; letter-spacing: 0; }
    .diorama p { margin: 0 0 4px; color: #a7e3cf; text-transform: uppercase; font-size: 12px; }
    .diorama span { color: #c0cbc8; }
    .molecule { position: absolute; width: 96px; height: 96px; left: 52%; top: 33%; border-radius: 50%; border: 2px solid #8ee6c1; box-shadow: 0 0 28px #8ee6c1; background: rgba(142, 230, 193, .16); }
    .molecule.proto { border-color: #f0c36a; box-shadow: 0 0 34px #f0c36a; background: rgba(240, 195, 106, .18); }
    .orbital { position: absolute; border: 1px solid rgba(255,255,255,.22); border-radius: 50%; }
    .orbital-a { width: 260px; height: 90px; left: 38%; top: 34%; transform: rotate(-22deg); }
    .orbital-b { width: 220px; height: 70px; left: 43%; top: 39%; transform: rotate(28deg); }
    .panel { margin-top: 12px; padding: 14px; background: #171d20; border: 1px solid #283337; border-radius: 8px; }
    .panel h2 { margin: 0 0 10px; font-size: 15px; }
    .panel h3 { margin: 0 0 8px; font-size: 20px; }
    .panel p { color: #cdd6d2; line-height: 1.45; }
    .wide { width: 100%; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
    .entity-list, .node-grid, .dev-grid { display: grid; gap: 8px; }
    .entity, .node { width: 100%; display: grid; grid-template-columns: 1.1fr 1fr 1fr; gap: 8px; align-items: center; }
    .node { grid-template-columns: 1.4fr .8fr 1fr; }
    .completed { border-color: #f0c36a; background: #332d1f; }
    .hidden-evolution { border-color: #283337; background: #14191c; color: #65706e; opacity: .7; }
    .optional { color: #f0c36a; }
    .progress { padding: 10px; border-radius: 6px; background: #20272a; color: #dfe7e4; }
    .hint { border-left: 3px solid #f0c36a; padding-left: 10px; color: #f0d99a !important; }
    .side-goal { border-top: 1px solid #2d383c; padding-top: 10px; margin-top: 10px; }
    .side-goal span { display: block; color: #c0cbc8; margin-top: 3px; }
    .progressive-goal { border-color: #4a6a7a; }
    .progressive-goal h2 { color: #9fd0e6; }
    .status button { width: 100%; margin-top: 8px; text-align: center; }
    .event-panel { margin: 0 0 12px; padding: 16px; border: 1px solid #66d0a5; border-radius: 8px; background: #18302c; box-shadow: 0 8px 30px rgba(0,0,0,.2); }
    .event-panel.blocking { border-color: #f0c36a; background: #332d1f; }
    .event-panel h2 { margin: 4px 0 8px; font-size: 22px; }
    .event-panel p { margin: 0 0 12px; color: #e2e8e5; line-height: 1.45; }
    .event-choices { display: flex; flex-wrap: wrap; gap: 8px; }
    .event-choice { min-width: 150px; flex: 1; }
    .job-row { display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 10px 0; border-top: 1px solid #2d383c; }
    .job-controls { display: flex; align-items: center; gap: 8px; } .job-controls button { min-height: 34px; min-width: 38px; text-align: center; padding: 4px 8px; }
    .job-summary { margin: 0 0 8px; color: #aab7b5 !important; } .ending { border-color: #f0c36a; background: #332d1f; }
    .recovery { display: grid; min-height: 100vh; place-items: center; }
    .recovery-panel { width: min(680px, calc(100vw - 32px)); }
    .recovery-panel h1 { margin: 0 0 10px; font-size: 28px; letter-spacing: 0; }
    #dev-dump { max-height: 260px; overflow: auto; font-size: 11px; color: #cdd6d2; }
    @media (max-width: 820px) {
      .layout { grid-template-columns: 1fr; }
      header { align-items: stretch; flex-direction: column; }
      nav button { flex: 1; text-align: center; }
      .entity, .node { grid-template-columns: 1fr; }
      .diorama h1 { font-size: 32px; }
    }
  `;
  document.head.appendChild(style);
}

function loop(now) {
  if (runtime.mode !== 'playable') {
    return;
  }
  const deltaMs = Math.min(1000, now - lastTickAt);
  lastTickAt = now;
  const scaled = deltaMs * (DEV ? engine().state.settings.devTimeScale || 1 : 1);
  engine().tick(scaled);
  const saved = autosave().tick(scaled);
  if (saved.ok && !saved.skipped) {
    lastSaveMessage = 'Autosaved';
  }
  render();
  requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', () => {
  installStyles();
  document.getElementById(ROOT_ID).addEventListener('click', (event) => handleAction(event.target));
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && runtime.mode === 'playable') autosave().flush('visibility');
  });
  window.addEventListener('beforeunload', () => {
    if (runtime.mode === 'playable') autosave().flush('beforeunload');
  });
  if (runtime.mode === 'playable') {
    selectProductionRates(engine().state, ruleset);
  }
  render();
  if (runtime.mode === 'playable') {
    requestAnimationFrame(loop);
  }
});
