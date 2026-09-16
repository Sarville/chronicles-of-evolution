# T1 handoff — resource chains, Organism and Sapience

## Committed scope

- Ruleset `timeline1-v8-civilization-chains`.
- Food/Materials/Knowledge/Power loops restored as distinct systems:
  - jobs and buildings source aggregate resources;
  - Food maintains Population; a shortage pauses growth and emits recovery facts;
  - Materials and Knowledge are consumed only by configured atomic purchases;
  - industrial Power is generated into a capped reserve, curtails powered
    infrastructure on shortage, and resumes it on recovery.
- Civilization start on `N07 Sapience` is transactional: EARLY_CIV, Population
  5, Food 120, Materials 45, Knowledge 12. No biological-stock conversion.
- T1-1 foundation: run-local AP, G008, B02A-D optional adaptations, C07/G009.
- T1-2 foundation: derived Cognition, B03-B05/N03/N05/N07, behavior event
  EV-BIO-03 and non-bypassable N02A-C choice.
- T1-3 start: G014 (Food reserve + Hearth) and G015 (Shelter + Population 8).

## Still open

1. Add 18-40 minute simulation profiles and retune all new costs/rates.
2. Add Cognition contribution events and complete neural/behavior presentation.
3. Implement Tribe -> Settlement transition, job remapping and the full 38-108
   city/industry/modern route.
4. Do not claim the complete 0-120 T1 route is playable yet.

## Verification

`npm test`, `npm run test:sim`, `npm run smoke`, `npm run build`, and
`git diff --check` passed before commit.
