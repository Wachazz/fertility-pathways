# Intelligent Fertility Navigator

A mobile app that helps women in Zimbabwe understand fertility, prepare for a clinic visit and find checked clinics. It works in English, Shona and Ndebele and runs on Android, iPhone and the web from one codebase (Expo, React Native, TypeScript).

**Status: working prototype.** All health content is DRAFT and has not been reviewed by a clinician. Do not use it for real care decisions yet.

## What works now

| Screen | Status |
|---|---|
| Language choice (first screen) | Working. Changes all interface text. Can be changed later from Home. |
| Welcome: what the app can and cannot do | Working. Shown once each time the app opens |
| Home | Working hub: greeting, 3 main actions, grid of other topics |
| Understand your fertility | Working, tap-to-open sections, English DRAFT content |
| Prepare for care | Working 3-step checklist with step markers, a summary to share or copy, and a warning before ticks are cleared |
| Understand the costs | Working, tap-to-open sections. Cost types only, no prices |
| Find care | Working screen with a Call button. **The list is empty** until clinics are phoned and checked; until then it shows what to do now and what to ask when calling |
| Support and next steps | Working. Urgent signs always open at the top (DRAFT) |
| Ask the assistant | Working offline helper with tap-to-ask questions. Returns approved sections only. Refuses to diagnose or suggest medicine, shows urgent advice for warning signs, blocks phone numbers |
| Privacy notice | Working, DRAFT |
| "Get help" button | In the top bar of every screen; opens the urgent signs |

## Still to do

- Clinician review of every section in `content/en.json`
- Shona and Ndebele translation of the medical and safety text, by fluent speakers (interface text is a DRAFT translation)
- Real clinics in `content/clinics.json`
- An AI model behind the assistant, called from a small server route, never from the phone, with no logging of questions
- Contact details for reporting problems

## Screens and flow

```
  Choose language ──► Welcome ──► ┌──────────────── Tabs ────────────────┐
   (first screen)    (once per    │  Home   Prepare   Find care   Ask   │
                      launch)     └──┬───────────────────────────────────┘
                                     │ Home opens:
                                     ├─► Understand your fertility
                                     ├─► Understand the costs
                                     ├─► Support and next steps
                                     ├─► Your privacy
                                     └─► Change language ──► back to Home

  "Get help" (top bar, every screen) ──► Support, urgent signs at the top
```

- Language and Welcome are replaced as you move on, so the Back button never returns to them.
- Prepare, Find care and Ask are tabs because they are used most. They are also the three big buttons on Home.

## Privacy by design

- No account, no login, no analytics, no adverts, no trackers
- Nothing is written to the device. Language, checklist ticks and assistant questions live in memory and are gone when the app closes
- The app works fully offline. It makes no network requests

## Run it

You need Node.js LTS. On your phone, install **Expo Go** from the Play Store or App Store.

```
npm install
npx expo start
```

- Phone: scan the QR code with Expo Go (Android) or the Camera app (iPhone). Phone and computer must be on the same Wi-Fi, or run `npx expo start --tunnel`.
- Android emulator: press `a`
- Web browser: press `w`

Windows cannot build an iPhone install file. Use Expo Go for testing, and EAS Build (`npx eas-cli@latest build`) for store builds later. That needs an Apple developer account.

## Web demo

```
npm run export:web
```

This writes a static site to `dist/`, which can be hosted free on Vercel or Cloudflare Pages.

## Project layout

```
content/          all text and the clinic list (see content/README.md)
scripts/          check-content.js (compares the language files)
src/app/          one file per screen (Expo Router); (tabs)/ holds the tab bar screens
src/assistant/    offline assistant rules and search, with tests
src/components/   one file per shared piece (Screen, Button, Card, Accordion, ...)
src/hooks/        checklist and assistant state, kept in memory only
src/i18n/         language switching with English fallback
src/theme.ts      colours, spacing, text sizes and other design tokens
```

## Checks

```
npm run typecheck        TypeScript
npm run lint             ESLint
npm test                 assistant safety rules, language merge, checklist summary
npm run check:content    fails if sn.json or nd.json has keys not in en.json; lists untranslated text
npx expo-doctor          Expo project health
```

## Android install file (APK)

```
npx eas-cli@latest build -p android --profile preview
```

This builds in Expo's cloud (needs an Expo login) and gives a download link for an `.apk` you can send to Android phones.

## Licence

MIT. See `LICENSE`.
