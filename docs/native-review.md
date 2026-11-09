# Native review of the translations

The 15 non-English locales of this site were translated with machine assistance when localization was added (the same 16 languages as openbiblestories.org, churchbased.bible and translationcore.com). They pass `npm run check:locales`: every string present, every tag, link and `{placeholder}` intact, and every protected name (BT Servant, unfoldingWord, WhatsApp, Telegram, Signal, Translation Words, Translation Academy, the partner names, the Telegram handle and the WhatsApp number) kept verbatim. **No native speaker has reviewed them yet.**

That is the remaining gap. A sentence that is understandable but not what a speaker would say is what makes a page look machine-translated. The readers here are pastors, teachers and translation teams deciding whether to trust a tool with Scripture, so the wording matters.

## The ask

For each language, one person who reads it natively (ideally someone who works with Bible translation in that language) and about half an hour; the site is two pages:

```
npm run review -- pt --out=pt-review.md
```

This writes a sheet with the key, the English, the current translation and an empty **Suggested** column. Read the **Current** column as a speaker, not against the English, and write a better phrase only where one is needed. Strings marked `[markup]` must keep their `<…>` tags; `[placeholder]` strings must keep `{date}`.

`npm run review -- --priority` produces sheets for pt, es, fr, hi and ar first: Brazilian Portuguese because Brazilian OBT teams are the first audience asked for (issue #6), then the largest translation-team audiences among the 15.

Things worth a native reader's eye in particular:

- **The hero line.** "BT Servant equips disciples / to understand · to study · to teach · to translate · to share / God's Word." The rotating words change while the rest stays. Each locale has `hero.title`, `hero.rotatorBefore`, `hero.rotatorWords` and `hero.rotatorAfter`, so a language that puts the object before the verb can move "God's Word" into `rotatorBefore` and leave `rotatorAfter` empty. Check that every one of the five lines reads naturally.
- **Register.** The English is plain and warm ("Ask naturally. Receive trusted guidance."). Formal vs familiar address (tú/usted, tu/vous, आप, …) should match what a church audience in that language expects.
- **The screenshot descriptions** (`intents.items[].alt`) describe English WhatsApp conversations; they are read by screen readers and search engines, not shown.

## Applying a review

Edit `src/i18n/{locale}/*.json`, run `npm run check:locales`, open a pull request, and note the reviewer and date below.

| Locale | Reviewed by | Date |
|---|---|---|
| (none yet) | | |
