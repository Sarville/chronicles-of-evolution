import assert from 'node:assert/strict';
import { ruleset } from '../../src/chronicles/config/index.js';
import { createFakeClock } from '../../src/chronicles/adapters/clock.js';
import { createSeededRng } from '../../src/chronicles/adapters/rng.js';
import { createChroniclesEngine } from '../../src/chronicles/domain/engine.js';
import { selectProducerPrice, selectResourceAmounts } from '../../src/chronicles/domain/selectors.js';

const clock = createFakeClock(1000);
const rng = createSeededRng(42);
const engine = createChroniclesEngine({ ruleset, ports: { clock, rng } });

assert.equal(engine.state.run.eraId, 'MOLECULAR');
assert.deepEqual(selectResourceAmounts(engine.state), { energy: 0, information: 0 });

let result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'energy', amount: 100 });
assert.equal(result.ok, true);
assert.equal(result.events[0].type, 'resource_changed');
assert.equal(engine.state.run.resources.energy.amount, 100);

assert.deepEqual(selectProducerPrice(engine.state, ruleset, 'GEN_CHEMICAL_GRADIENT'), { energy: 10 });
result = engine.dispatch({ type: 'BUY_PRODUCER', producerId: 'GEN_CHEMICAL_GRADIENT' });
assert.equal(result.ok, true);
assert.equal(result.events.some((event) => event.type === 'producer_bought'), true);
assert.equal(engine.state.run.producers.GEN_CHEMICAL_GRADIENT.count, 1);
assert.equal(engine.state.run.resources.energy.amount, 90);

const beforeFailedPayment = engine.state.run.resources.energy.amount;
result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M02' });
assert.equal(result.ok, false);
assert.equal(result.reason, 'PREREQUISITES_NOT_MET');
assert.equal(engine.state.run.resources.energy.amount, beforeFailedPayment);

result = engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'information', amount: 10 });
assert.equal(result.ok, true);
result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M01' });
assert.equal(result.ok, true);
assert.equal(result.events.some((event) => event.type === 'node_completed'), true);
assert.equal(result.events.some((event) => event.type === 'goal_completed'), true);

const beforeAtomicFailure = {
  energy: engine.state.run.resources.energy.amount,
  information: engine.state.run.resources.information.amount,
};
result = engine.dispatch({ type: 'BUY_NODE', nodeId: 'M02' });
assert.equal(result.ok, true);
assert.equal(engine.state.run.resources.energy.amount, beforeAtomicFailure.energy - 40);
assert.equal(engine.state.run.resources.information.amount, beforeAtomicFailure.information - 3);

engine.state.run.nodes.completed.T08 = { completedAtMs: 0 };
engine.state.run.eraId = 'SETTLEMENT_EARLY';
engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'food', amount: 180 });
engine.dispatch({ type: 'ADD_RESOURCE', resourceId: 'materials', amount: 260 });
result = engine.dispatch({ type: 'BUY_BUILDING', buildingId: 'BLD_FIELD' });
assert.equal(result.ok, true);
assert.equal(result.events.some((event) => event.type === 'building_bought'), true);
assert.equal(engine.state.run.buildings.BLD_FIELD.count, 1);

const tick = engine.tick(1000);
assert.equal(tick.ok, true);
assert.equal(tick.events.some((event) => event.type === 'tick'), true);

assert.doesNotThrow(() => JSON.stringify(engine.state.run));
assert.equal(typeof rng.next(), 'number');
clock.start((deltaMs) => engine.tick(deltaMs));
clock.advance(250);
assert.equal(clock.getNow(), 1250);

console.log('domain flow ok');

