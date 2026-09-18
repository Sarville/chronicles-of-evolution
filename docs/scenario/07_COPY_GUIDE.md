# Хроники Эволюции — Narrative Copy Guide

**Документ:** DS-05, act-structure revision 3.0
**Статус:** ready for review
**Назначение:** единые правила языка интерфейса, Архива, milestones, событий, Chronicle и endings — для всех пяти глав Act 1 (`T1–T5`).

**Что изменилось:** голос Архива по эрам (§4) теперь привязан к главам
`T1–T5`, а не к минутам одного 120-минутного прогона; добавлена
терминология для глав/collapse-endings/species skin (§2).

---

# 1. Core voice

Текст «Хроник Эволюции» должен быть:

- коротким;
- ясным;
- спокойным;
- предметным;
- слегка научным, но не академическим;
- эмоциональным через наблюдение, а не через пафос.

Главная формула:

> Сначала факт. Затем смысл. Никогда лишнее объяснение.

Пример:

Хорошо:

> Клетки становятся частями одного целого.

Плохо:

> Поздравляем! Вы успешно совершили невероятный эволюционный прорыв и открыли удивительный мир многоклеточной жизни!

---

# 2. Player-facing terminology

Canonical terms:

## Biology

- РНК / RNA
- ДНК / DNA
- Репликация
- Мембрана
- Клетка
- Биомасса / Biomass
- Метаболизм
- Энергия / Energy — только после Metabolism
- Адаптации
- Очки адаптации / Adaptation Points / AP
- Многоклеточность
- Нервная система
- Когнитивность / Cognition
- Разум / Sapience milestone

## Civilization

- Еда / Food
- Материалы / Materials
- Знания / Knowledge
- Население / Population
- Мощность / Power — Industry+
- Племя
- Поселение
- Город
- Индустрия / Эпоха машин
- Современность
- Атомный век

## Final act (`T5`)

- Стабильность — internal unless needed in detail view
- Напряжение мира / World Tension — player-facing crisis meter
- Великий фильтр
- Пепел
- Архив
- Фрагменты Архива
- Timeline / Timeline #1 — legacy term; в player-facing UI предпочтительно
  «глава»/`T1–T5`, `Timeline` остаётся допустимым system/lore-термином там,
  где уже используется, не расширять на новый UI

## Act 1 structure (`T1–T5`)

- Глава — player-facing термин для `T1–T5` (не «Timeline», не «эпоха» в UI)
- Мор / Катаклизм / Раскол / Авария — canonical titles для endings `T1–T4`
- Синтез — вход в `T5`, не отдельный ending
- (внутренний термин, не для UI) species skin swap — косметическая смена
  вида на входе `T2`/`T4`; не выводить слово «skin»/«swap» в player-facing
  текст, использовать нейтральное описание («вид», «форма»), как для
  primary trait в `T1`

---

# 3. Forbidden / deprecated terminology

Не использовать как canonical current gameplay language:

- Information как spendable resource;
- Chemical Gradient;
- Catalytic Fold;
- Energy Pocket;
- Stable Bond в старой gameplay semantics;
- Photosynthesis/Chemosynthesis как primary exclusive first branch;
- Energy с первой секунды игры;
- Power до Industry;
- Sapience как обычную покупку за несколько ресурсов.

Слово «информация» допустимо в естественном смысле:

> Информация научилась копировать себя.

Но не:

> +12 Information

---

# 4. Archive voice by chapter

Фазы голоса теперь растянуты на пять глав вместо 120 минут одного
прогона (см. `docs/scenario/01_TIMELINE_01_SCRIPT.md` §2):

```text
Инструмент  — весь T1
Наблюдатель — T2, T3
Свидетель   — T4
Участник    — T5
```

## 4.1 `T1` — Instrument

Стиль:

- сухой;
- точный;
- безличный;
- короткие предложения.

Примеры:

> Реакция стабильна.

> Биологическая единица подтверждена.

> Когнитивная активность обнаружена.

Avoid:

> Я наблюдаю...

> Мне кажется...

> Ты сделал...

---

## 4.2 `T2`, `T3` — Observer

Архив начинает формулировать исторические наблюдения, но ещё не проявляет эмоцию.
Голос дебютирует внутри Recall-сжатого recap-а каждой главы
(`01_TIMELINE_01_SCRIPT.md` §5.1/§6.1) — сам recap не переигрывает прежний
текст, но Архив впервые комментирует, что это повтор.

Примеры (`T2` recap):

> Форма выбирается быстрее, чем в первый раз.

> Порог разума пройден без нового наблюдения.

Примеры (`T3` recap — предвидение уже заметно, но ещё не названо вслух):

> Форма не меняется. Наблюдение за ней — тоже.

> Точка прежнего разлома пройдена без повторения.

Allowed: чуть более образный язык. Начиная с `T3`, Архив явно проговаривает
пороговую реплику в конце recap-а как прямой ответ на прошлый collapse:

> «Рассеивание не защитило группу. Проверяется концентрация с
> укреплением.»

Это уже не нейтральное наблюдение, а видимое предвидение — источник этой
точности не объясняется до `T5` (`06_ENDINGS_COPY.md` §T3 Reveal).

Still avoid explicit first person.

---

## 4.3 `T4` — Witness

Появляются сбои, недоговорённость и знание вне текущей Timeline.
`ERROR 17`/«Снова.» принадлежат `T5` (Modern→Atomic bridge,
`08_EVENTS_AND_CHOICES.md` §16–17), не этой главе — не путать.

Примеры (`T4` recap, `01_TIMELINE_01_SCRIPT.md` §7.1):

> Форма выбрана до того, как выбор был предложен.

> Точка внутреннего раскола пройдена без повторения.

Примеры (новый контент `T4`):

> Прогноз перегрузки доступен раньше отказа.

Important: странность создаётся нарушением прежнего языка, а не длинной мистической речью.

---

## 4.4 `T5` — Participant

Recap (`01_TIMELINE_01_SCRIPT.md` §8.1) всё ещё до Ash, ещё Witness, но уже
самый практикованный и самый обобщающий:

> Форма повторена в пятый раз.

> Каждая точка разрушения пройдена. Ни одна не повторилась.

После Ash допускается первое коллективное местоимение:

> Мы можем изменить результат.

Это должно восприниматься как значимое событие именно потому, что раньше Архив избегал личной позиции.

Не продолжать сразу:

> Я всё это время был...

Mystery remains open.

---

# 5. UI hierarchy

## Goal title

2–6 слов, imperative or clear target.

Хорошо:

- Создайте устойчивую РНК
- Запустите саморепликацию
- Постройте постоянное поселение
- Пройдите Великий фильтр

Плохо:

- Ваша следующая важная задача заключается в создании первой устойчивой молекулы РНК

---

## Goal helper

Одна практическая строка.

Example:

> Усильте производство РНК и откройте следующий узел эволюции.

Helper explains gameplay, not lore.

---

## Milestone

1 strong title + 1–2 lines.

Example:

# ЖИЗНЬ

> Теперь система поддерживает собственные процессы.

Milestones should feel like chapter punctuation, not notification spam.

---

## Event lead

Usually 1–3 sentences.

Must answer:

- what happened;
- why a choice is needed now.

Do not front-load consequences that player should infer or see in effect UI.

---

## Button

Use action noun/verb.

Good:

- Исследовать
- Сохранить
- Отступить
- Начать деэскалацию
- Потребовать проверку

Bad:

- Быть хорошим
- Рискнуть всем
- Сделать правильный выбор

---

# 6. Chronicle voice

Chronicle is allowed to be more literary than UI.

Rules:

- 1–4 sentences per ordinary entry;
- 4–6 for major ending entries;
- past tense or historical present consistently within one entry;
- no hidden numeric modifiers;
- no omniscient explanation beyond what Timeline has established.

Good:

> Тропа стала дорогой. Укрытие — домом. Место получило имя, даже если Архив его не записал.

Bad:

> Именно в этот момент цивилизация сделала первый шаг к неизбежной ядерной гибели.

The second line reveals future knowledge unavailable to the player.

---

# 7. Scientific accuracy vs readability

Game copy is not a biology textbook.

Use simplified but defensible causal language.

Preferred:

> РНК способна сохранять и передавать структуру.

Avoid overclaiming:

> РНК была первой формой жизни во Вселенной.

Preferred:

> Клетки начинают специализироваться.

Avoid unnecessary jargon:

> Дифференциальная экспрессия транскрипционных факторов инициирует морфогенез.

Scientific detail may live in optional codex/lore later.

---

# 8. Narrative neutrality for choices

Choices must not expose a designer-approved moral answer through wording.

Bad:

**Мудрый совет** vs **Жестокий лидер**

Good:

**Совет** vs **Лидер**

Bad:

**Чистая энергетика** vs **Грязная промышленность**

Good:

**Чистая программа** vs **Ископаемая промышленность**

Consequences may clearly differ, but labels should describe rather than judge.

---

# 9. Numbers in narrative copy

Use numbers only when:

- the number is a visible gameplay value;
- it helps action;
- it is stable/config-driven.

Avoid narrative hardcoding of provisional balance values.

Bad:

> Эта технология даст вам +25% производства навсегда.

unless +25% is actually canonical config and displayed as effect UI.

Narrative description:

> Ускоряет промышленный рост.

Effect panel may separately show:

`Production +25%`.

---

# 10. Reward copy

State the reward clearly, without casino framing.

Good:

> Получено: 2 очка адаптации.

> Получено: 16 фрагментов Архива.

Avoid:

- `Джекпот!`
- `Супернаграда!`
- fake rarity language unless actual system exists.

---

# 11. Stall hints

Hints are diagnostic, not sarcastic.

Pattern:

> Не хватает: {resource/state}.
>
> Усильте: {producer/job/building/node}.

Examples:

> Недостаточно ДНК для мембраны. Усильте синтез ДНК.

> Запас еды сокращается. Назначьте больше добытчиков или улучшите производство пищи.

Never:

> Вы слишком медленно развиваетесь.

Never default to:

> Посмотрите рекламу, чтобы продолжить.

---

# 12. Error/anomaly copy

Technical-looking anomaly text should be sparse.

Canonical pattern:

> Прогноз завершения цикла: доступен.

> ERROR 17

> Доступ к записи запрещён.

Avoid fake code walls, hex dumps and terminal noise unless they carry real narrative information.

One anomalous sentence is stronger than twenty lines of `0xA17F` decoration.

---

# 13. Crisis copy

As World Tension grows, sentences become shorter.

Early crisis:

> Две коалиции требуют несовместимых условий безопасности.

Late crisis:

> Связь нестабильна.

> Резервные мощности задействованы.

> Автоматические системы ожидают решения.

Do not make the Archive scream or use repeated exclamation marks.

---

# 14. Ending copy

The game must not blame the player directly for first Ash.

Avoid:

> Вы уничтожили мир.

> Вы выбрали неправильно.

Preferred:

> Последний протокол: ответный удар.

> Цивилизация №1 завершена.

The first run is structurally tragic. Choices define how it happened and what is remembered.

---

# 15. Emotional intensity scale

## Level 1 — system

`Реакция стабильна.`

## Level 2 — discovery

`Впервые система отделяет себя от среды.`

## Level 3 — milestone

`Впервые жизнь не просто увидела звёзды. Она попыталась понять, что они означают.`

## Level 4 — anomaly

`Снова.`

## Level 5 — ending

`Они остановили свои системы. Мир — нет.`

Use Level 4–5 rarely. If every unlock sounds profound, none of them does.

---

# 16. Punctuation

Preferred:

- period for system statements;
- colon for labels;
- em dash sparingly in Chronicle;
- ellipsis only for damaged/incomplete data or intentional hesitation;
- exclamation mark almost never.

Uppercase reserved for:

- major milestone titles;
- `ERROR 17`;
- `ПОСЛЕДНИЙ ПРОТОКОЛ` if visually justified.

Do not uppercase ordinary buttons.

---

# 17. Russian localization baseline

Russian is the canonical writing language for DS-05.

Rules:

- avoid bureaucratic constructions;
- prefer active verbs;
- avoid excessive anglicisms when a clear Russian term exists;
- retain `Timeline` only if UI/lore product terminology decides to keep it; otherwise localization may later use `Линия`/`Цикл` consistently.

Do not mix translations inside one screen, e.g. `Population: Население` unless debug mode.

---

# 18. English localization guidance

When English localization is created later:

- translate meaning, not Russian syntax;
- keep Archive terse;
- preserve `Again.` as one-word anomaly;
- preserve distinction between `Power` and biological `Energy`;
- preserve `World Tension` as player-facing final-act metric;
- preserve `Ash` as ending title if chosen as canonical English title.

Do not translate Russian poetic lines literally if they sound unnatural.

---

# 19. Naming templates

## Goals

`Verb + concrete target`

Examples:

- Stabilize RNA
- Form a Membrane
- Build a Permanent Settlement

## Events

`Situation/concept`, not outcome.

Examples:

- Следы до нас
- Энергетический кризис
- Предупреждение

## Milestones

Short emotional statement.

Examples:

- ЖИЗНЬ
- МЫ ОСТАЛИСЬ
- ЭПОХА МАШИН
- ПЕПЕЛ

---

# 20. Content generation rules for agents

When Codex/LLM generates missing copy:

1. Read this guide first.
2. Read `01_TIMELINE_01_SCRIPT.md` for context.
3. Read `04_STORY_EVENTS.md` for canonical choice wording.
4. Never invent a gameplay effect.
5. Never invent a new lore reveal to make text more dramatic.
6. Never turn optional content into a gate.
7. Use reconciled terminology.
8. If an effect/trigger is unknown, mark it for design rather than filling a plausible value.
9. Preserve mystery around Archive, traces, ERROR 17 and `Снова.`.
10. Keep main UI copy shorter than Chronicle copy.

---

# 21. Examples: bad → good

## Early biology

Bad:

> Поздравляем, вы открыли ДНК! Теперь ваш организм сможет эволюционировать ещё быстрее!

Good:

> Обнаружен более устойчивый носитель наследственности.

---

## Choice

Bad:

> Выберите между добрым симбиозом, агрессивным поглощением и безопасным панцирем.

Good:

> Среда не предлагает правильного решения. Только разные способы выжить.

---

## City

Bad:

> Теперь ваша великая цивилизация превратилась в мощный город!

Good:

> Поселение стало системой взаимозависимых районов и профессий.

---

## Crisis

Bad:

> ВНИМАНИЕ!!! МИР НА ГРАНИ ЯДЕРНОЙ ВОЙНЫ!!!

Good:

> Военные системы переведены в повышенную готовность.

---

## Ending

Bad:

> Вы проиграли. Попробуйте снова и выберите лучше.

Good:

> ЦИВИЛИЗАЦИЯ №1 ЗАВЕРШЕНА
>
> ПЕПЕЛ

---

# 22. Review checklist for every new narrative string

Before accepting a new string, ask:

- Does it use canonical terminology?
- Is it shorter than it needs to be?
- Does it reveal something the player should not know yet?
- Does it imply a gameplay effect that does not exist?
- Does it judge a player choice?
- Could the same meaning be shown visually instead?
- Is this UI copy or should it live in Chronicle?
- Does Archive voice match the current era?
- Does it preserve the mystery instead of explaining it?

If any answer is problematic, rewrite before implementation.

---

# 23. DS-05 copy baseline

Upon approval, these files together form the Timeline #1 narrative baseline:

```text
docs/scenario/00_NARRATIVE_BIBLE.md
docs/scenario/01_TIMELINE_01_SCRIPT.md
docs/scenario/04_STORY_EVENTS.md
docs/scenario/05_NARRATIVE_FLAGS.md
docs/scenario/06_ENDINGS_COPY.md
docs/scenario/07_COPY_GUIDE.md
```

`00_NARRATIVE_BIBLE.md` remains the high-level long-range story bible,
now with an explicit product-Act ↔ narrative-Act mapping in its §0.

The DS-05 files define the implementation-ready Act 1 (`T1–T5`), not a
single Timeline.
