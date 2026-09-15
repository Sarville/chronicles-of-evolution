# UX documentation

UX-документы проекта **Хроники Эволюции** формируются в design session **DS-06** после принятия gameplay contracts DS-01 и DS-02.

## Planned files

- `00_UX_PRINCIPLES.md` — mobile-first принципы, information density, interaction rules.
- `01_SCREEN_MAP.md` — карта экранов/состояний и переходов.
- `02_MOBILE_WIREFRAMES.md` — основной UX contract.
- `03_DESKTOP_WIREFRAMES.md` — responsive adaptation, а не отдельная логика игры.
- `04_COMPONENT_STATES.md` — состояния goal cards, resources, nodes, jobs, events, crisis, ending.
- `05_TUTORIAL_AND_HINTS.md` — contextual onboarding, bottleneck hints, recovery UX.

## Source inputs

UX не должен самостоятельно придумывать gameplay.

Основные входы:
- accepted GDD 01–09;
- economy;
- evolution/tech/building/job graph;
- Timeline #1 event/ending contract;
- `DECISIONS.md`.

## Core constraints

- mobile-first;
- no hover dependency;
- primary touch targets >=44 px;
- diorama is the primary visual surface;
- context resources only;
- max one dominant CTA;
- progressive disclosure;
- no long mandatory tutorial screens.

Фактический статус раздела смотреть в `../PROJECT_STATE.yaml`.
