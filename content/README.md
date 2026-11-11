# Content

Every sentence the app shows lives in this folder, so a clinician or translator can review it without reading code.

| File | What it holds |
|---|---|
| `en.json` | All English text. This is the master copy. |
| `sn.json` | Shona. Interface text only, DRAFT. |
| `nd.json` | Ndebele. Interface text only, DRAFT. |
| `clinics.json` | The clinic list for Find care. Empty until clinics are checked. |

## Review rules

- Each section has `"reviewed": false`. The app shows a **DRAFT** label until a qualified Zimbabwe-based clinician approves the text and the flag is set to `true`.
- Shona and Ndebele files only need the keys that are translated. Any missing key falls back to English, and the screen shows a notice saying some text is still in English.
- Medical and safety text (Understand, Costs, Support, Privacy, assistant replies) is not translated yet. A fluent speaker and a clinician must write or review it. Do not use raw machine translation for it.
- `keywords` on each section are what the assistant searches. Add words people really use, including Shona and Ndebele words once those sections are translated.

## Adding a clinic

Only add a clinic after someone has phoned or visited it. Clinics without `lastChecked` are hidden.

```json
{
  "id": "short-unique-id",
  "name": "Clinic name",
  "town": "Harare",
  "address": "Street and area",
  "phone": "+263 ...",
  "services": ["Gynaecology", "Fertility tests"],
  "ownership": "public",
  "consultationFee": "USD 20",
  "feeChecked": "2026-11-01",
  "lastChecked": "2026-11-01",
  "checkedBy": "Initials of the person who phoned"
}
```

- `ownership` is `"public"` (government) or `"private"`. It is optional.
- `consultationFee` is the price of a first visit, written the way the clinic said it. It is shown only when `feeChecked` (YYYY-MM-DD) is also filled in. Without both, the app tells the person to ask the clinic for the price. Never estimate a fee.
- `town` should match a name in `src/lib/zimbabweTowns.ts` so that nearest clinic distances work. Add the town and its position there if it is missing.
- If a person picks a town with no checked clinic, the app lists the three nearest towns that have one, with the straight line distance.
