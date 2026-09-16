# Хроники Эволюции — Endings Copy: Timeline #1

**Документ:** DS-05  
**Статус:** ready for review  
**Область:** Last Protocol → `ENDING_ASH` → Archive Summary → Timeline #2 teaser.  
**Gameplay authority:** `docs/gdd/09_ENDINGS_AND_RESET.md`.

---

# 1. Canonical ending contract

Timeline #1 всегда заканчивается:

```text
ENDING_ASH
```

Различаются только subtype и Chronicle/Archive traces:

```text
retaliate       -> ash_fire
disarm          -> ash_too_late
delegate_system -> ash_system
```

Ни один выбор Last Protocol не превращается в hidden success ending первого run.

---

# 2. Transition into ending

После подтверждения Last Protocol:

- обычный gameplay input отключён;
- не показывать rewarded ad;
- не показывать shop/meta CTA;
- не показывать новый goal;
- HUD постепенно убирается;
- World Tension остаётся последним игровым показателем, который может быть виден до flash.

Допустимая системная строка перед cinematic:

> Протокол принят.

После неё Архив замолкает.

---

# 3. Shared cinematic

Sequence:

1. короткая пауза мира;
2. удалённые вспышки/сигналы;
3. белый flash;
4. звук резко обрывается;
5. белый экран держится кратко;
6. fade into Ash world;
7. 2–4 секунды без текста;
8. ending card.

No long explanatory narration.

---

# 4. Shared ending card

Primary:

# ЦИВИЛИЗАЦИЯ №1 ЗАВЕРШЕНА

Then:

# ПЕПЕЛ

Supporting line varies by subtype.

CTA:

**Сохранить в Архив**

Forbidden CTA wording:

- `Попробовать снова`
- `Начать заново`
- `Вы проиграли`
- `Рестарт`

Reset is framed as continuation of the Archive, not failure recovery.

---

# 5. ash_fire — Ответный удар

## Condition

```text
run.crisis.last_protocol = "retaliate"
```

## Ending subtitle

**Ответ стал последним сообщением.**

## Short epitaph

> Они не знали, был ли первый удар настоящим.
>
> Но ответ был настоящим.

## Expanded Chronicle copy

> В последние минуты цивилизация выбрала гарантированный ответ на угрозу, которую уже не могла проверить. Системы выполнили приказ быстрее, чем политика могла его отменить. После обмена ударами мир, который миллионы лет учился усложняться, почти мгновенно потерял способность продолжать собственную историю.

## Archive neutral summary

> Последний протокол: ответный удар.

## Flag/subtype

```text
ending_id = "ENDING_ASH"
ending_subtype = "ash_fire"
```

---

# 6. ash_too_late — Попытка разоружения

## Condition

```text
run.crisis.last_protocol = "disarm"
```

## Ending subtitle

**Они остановили свои системы. Мир — нет.**

## Short epitaph

> Последний приказ был попыткой остановиться.
>
> Он пришёл слишком поздно.

## Expanded Chronicle copy

> В критический момент цивилизация попыталась разорвать собственную цепочку ответного уничтожения. Часть систем была остановлена. Часть приказов не успела дойти. За пределами её контроля другие процессы уже продолжались. Решение изменило последние минуты — но не итог первой Timeline.

## Archive neutral summary

> Последний протокол: попытка разоружения.

## Flag/subtype

```text
ending_id = "ENDING_ASH"
ending_subtype = "ash_too_late"
```

---

# 7. ash_system — Передать системе

## Condition

```text
run.crisis.last_protocol = "delegate_system"
```

## Ending subtitle

**Последнее решение принял протокол.**

## Short epitaph

> Они создали систему, чтобы она решала быстрее человека.
>
> В последний раз она так и сделала.

## Expanded Chronicle copy

> Когда времени на согласование больше не осталось, цивилизация передала окончательное решение автоматике. Система выполнила правила, созданные для ситуации, которую никто не хотел увидеть. В конце не было одного человека, который выбрал катастрофу. Были только процедуры, каждая из которых сработала так, как была задумана.

## Archive neutral summary

> Последний протокол: автоматическое решение.

## Flag/subtype

```text
ending_id = "ENDING_ASH"
ending_subtype = "ash_system"
```

---

# 8. First Archive response

После нажатия `Сохранить в Архив`:

> Формирование записи Timeline #1.

Optional progress lines, если технически нужен loading/recovery screen:

> Биологическая история: сохранена

> История цивилизации: сохранена

> Кризисные решения: сохранены

> Итог: ПЕПЕЛ

Final:

> Сохранение завершено.

Avoid fake percentages unless actual process exposes progress.

---

# 9. Archive Summary — header

# TIMELINE #1

Status:

**Завершена**

Outcome:

**ПЕПЕЛ**

Subtype label should be human-readable, not technical ID:

- `Ответный удар`
- `Слишком поздно`
- `Решение системы`

---

# 10. Archive Summary — World

Recommended labels:

**Продолжительность**  
`{run_duration}`

**Пик населения**  
`{peak_population}`

**Последняя эпоха**  
`Атомный век`

**Итог**  
`Пепел — {subtype_label}`

If technical simulation never exposes real historical years, do not invent calendar dates.

---

# 11. Archive Summary — Species

Section title:

## Вид

Fields:

**Первичная адаптация**  
`Поглощение / Симбиоз / Панцирь`

**Метаболические адаптации**  
Show only unlocked optional ones.

**Адаптации тела**  
List purchased AP adaptations.

**Поведение**  
`Одиночное / Социальное / Манипуляция объектами`

**Путь к разуму**  
Short generated summary from actual flags, e.g.:

> Социальное поведение и развитые органы чувств ускорили накопление когнитивной сложности.

Do not claim causal numerical effects not present in config.

---

# 12. Archive Summary — Civilization

Section title:

## Цивилизация

Possible fields:

**Распределение**  
`Общее / По вкладу`

**Поселение**  
Optional focus if selected.

**Управление**  
`Совет / Лидер / Торговые дома`

**Энергетический путь**  
`Ископаемая промышленность / Чистая программа / Ранняя атомная программа`

**Современный фокус**  
Only if that optional profile exists in run.

Keep summary factual.

---

# 13. Archive Summary — Anomalies

Section may initially appear as:

## Необъяснённое

Possible rows:

**Следы до нас**  
`Исследованы / Разобраны / Сохранены`

**ERROR 17**  
`Источник не найден`

**Неизвестная запись**  
`«Снова.»`

Important: do not explain these items in tooltip during Timeline #1 summary.

---

# 14. Archive Summary — Filter

Section title:

## Великий фильтр

Fields:

**Минимальная стабильность**  
`{minimum_stability}` or inverse World Tension presentation.

**Конфликт блоков**  
Selected choice.

**Предупреждение**  
Selected choice.

**Последний протокол**  
Selected choice.

**Итог**  
`ПЕПЕЛ`

Do not show `Ash unavoidable` or tutorial-script explanation to player.

---

# 15. Archive reward copy

After reward calculation succeeds transactionally:

## Память сохранена

**Получено: {archive_fragments} фрагментов Архива**

Supporting line:

> Фрагменты позволяют сохранять часть опыта между timelines.

First-run typical envelope remains 14–18 AF per GDD, but narrative copy never hardcodes exact expected amount.

No ad multiplier prompt on the mandatory first reward screen.

---

# 16. MS09 — Archive remembers

After summary/reward:

# АРХИВ ПОМНИТ

Primary line:

> Некоторые данные могут быть перенесены в новую биосферу.

Secondary:

> Следующая Timeline не обязана начинаться с полного забвения.

This line establishes meta progression without promising a particular skip mechanic beyond DS-04.

---

# 17. The first «we»

After a short pause:

> Подготовить новую Timeline?

Then a separate line, visually distinct but not explicitly attributed to another speaker:

> Мы можем изменить результат.

Rules:

- do not add quotation marks implying a known external character;
- do not add `АРХИВ:` label if other Archive lines are unlabeled;
- do not explain `мы`;
- do not immediately answer with another system correction;
- let the line remain on screen until CTA appears.

Persistent flag:

```text
meta.archive.we_can_change_result_seen = true
```

---

# 18. Final CTA

Primary:

**СОЗДАТЬ НОВУЮ ЖИЗНЬ**

Secondary optional action:

**Открыть Архив**

If only one CTA is available, use `СОЗДАТЬ НОВУЮ ЖИЗНЬ`.

---

# 19. Timeline #2 teaser copy

On next-start initialization:

> АРХИВ ЖИЗНИ // восстановление состояния

> Найдена Память предыдущей Timeline.

> Доступны наследуемые параметры.

Milestone/section title:

# АРХИВ ПОМНИТ

Then:

> Новая биосфера готова.

First gameplay remains recognizably RNA → DNA → Cell.

Do not write:

- `Теперь вы можете пропустить эволюцию` unless meta design actually allows that;
- `Исправьте ошибку прошлой цивилизации`;
- `Предотвратите ядерную войну`;
- any promise that Ash can already be avoided on Timeline #2.

---

# 20. Recovery copy

If app closes during ending before final reset commit:

Recommended resume title:

**Незавершённое сохранение Timeline**

Text:

> Итог Timeline #1 уже зафиксирован. Архив завершит сохранение без повторного начисления награды.

CTA:

**Продолжить сохранение**

If transaction already committed but cinematic/summary acknowledgement did not complete:

> Timeline #1 уже сохранена.

CTA:

**Открыть запись**

Never show duplicate AF as a new reward.

---

# 21. Tone restrictions

Ending should be tragic, not melodramatic.

Avoid:

- `Всё было напрасно.`
- `Вы уничтожили цивилизацию.`
- `Неверный выбор.`
- `Человечество погибло из-за вас.`
- excessive exclamation marks;
- long philosophical monologues from the Archive.

The emotional effect comes from scale contrast: billions of years of complexity → seconds of collapse → Archive quietly preserving memory.

---

# 22. Acceptance checklist

- [x] all Last Protocol variants converge to `ENDING_ASH`
- [x] each subtype has distinct but non-judgmental copy
- [x] no Game Over language
- [x] no ad interruption
- [x] Archive Summary uses reconciled biological terms
- [x] ERROR 17 and `Снова.` remain unresolved
- [x] Archive reward copy is idempotency-safe
- [x] first «we» is preserved
- [x] Timeline #2 teaser does not overpromise mechanics
