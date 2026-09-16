# UX documentation

UX-документы проекта **Хроники Эволюции** детализированы и приняты в design session **DS-06**.

Перед DS-06 принят bridge-contract **DS-05.5**, который связывает gameplay + narrative + будущий UX/art:

- `00_TIMELINE_PRESENTATION_MAP.md` — authoritative presentation sequence Timeline #1: trigger → surface → diorama state → creature state → UI reveal → transition.

DS-06 может менять layout и interaction pattern, но не должен самовольно менять смысл/порядок presentation beats PB00–PB30.

## DS-06 files

- `00_UX_PRINCIPLES.md` — mobile-first принципы, information density, interaction rules.
- `01_SCREEN_MAP.md` — карта экранов/состояний и переходов на основе Presentation Map.
- `02_MOBILE_WIREFRAMES.md` — основной mobile UX contract.
- `03_DESKTOP_WIREFRAMES.md` — responsive adaptation, а не отдельная логика игры.
- `04_COMPONENT_STATES.md` — состояния goal cards, resources, nodes, jobs, events, crisis, ending.
- `05_TUTORIAL_AND_HINTS.md` — contextual onboarding, bottleneck hints, recovery UX.

## Source inputs

UX не должен самостоятельно придумывать gameplay или narrative beats.

Основные входы:
- accepted/reconciled GDD 01–11;
- economy;
- evolution/tech/building/job graph;
- Timeline #1 narrative package DS-05;
- `00_TIMELINE_PRESENTATION_MAP.md`;
- `../art/00_VISUAL_STATE_MAP.md`;
- `DECISIONS*.md`.

## Core constraints

- mobile-first;
- no hover dependency;
- primary touch targets >=44 px;
- diorama is the primary visual surface;
- contextual resources only;
- max one dominant CTA;
- progressive disclosure;
- no long mandatory tutorial screens;
- AP UI appears only from G008;
- Cognition appears only after Nervous System;
- Power appears only in Industry;
- Modern has its own presentation state;
- World Tension appears only after Atomic transition.

Фактический статус раздела смотреть в `../PROJECT_STATE.yaml`.
