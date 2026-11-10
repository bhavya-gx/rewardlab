# Rewardlab

An open-source product experience concept for B2B AI companies: branded access cards that deliver trials or credits, a creator studio for designing them, and a simulated hackathon rewards flow for organisers, winners and sponsors.

Live demo: https://rewardlab.vercel.app

Everything here is MIT licensed. There is no waitlist, no email capture and no analytics. Clone it and make it yours.

## Routes

- `/` Private Access landing page with an interactive customer journey (receive, open, reveal, activate).
- `/studio` Creator Studio, a card and offer designer with a shareable customer preview.
- `/rewards` Hackathon rewards MVP: recipient CSV import and validation, three award tiers, branding controls, a review gate, simulated batch send, personal winner cards, shared team claims, sponsor approval, failure and retry, and report export.

## Run it locally

Requires Node.js 22.13 or newer and pnpm 10 or newer.

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Build and test

```sh
pnpm test
```

That builds the production bundle and runs the unit tests. To also smoke-test a running server:

```sh
pnpm start
TEST_BASE_URL=http://localhost:3000 node --test tests/rendered-html.test.mjs tests/rewards.test.mjs
```

## Deploy

Any Next.js host works. On Vercel, import the repository with the Next.js preset and the defaults. No environment variables are required.

## What this is and is not

Everything on `/rewards` is simulated and labelled as such. There is no authentication, tenant isolation, database, email delivery, sponsor API or real reward issuance. View switching is a demo control, not access control. State lives in the browser's localStorage only. The companies named in the demos are fictional.

## Make it yours

- Branding: the wordmark, colours and type live in `app/globals.css` (landing), `app/studio/studio.css` (studio) and `app/rewards/rewards-theme.css` (rewards). Swap REWARDLAB for your own name in `app/page.tsx`, `app/studio/page.tsx` and `app/rewards/page.tsx`.
- Offers and copy: the landing journey and the studio offer types are plain React in `app/page.tsx` and `app/studio/page.tsx`.
- Rewards logic: tiers, CSV parsing, validation, claims and export are pure functions in `app/rewards/model.ts`, covered by `tests/rewards.test.mjs`. Change the tiers or the claim rules there first.
- Going real: everything is simulated on purpose. To issue real rewards you would add a database for batches and claims, authentication for organisers and sponsors, an email provider for invitations, and your product's API for activation. The UI already has the states (pending, confirmed, failed, retry) to hang those on.

## Stack

Next.js 16, React 19, TypeScript. No other runtime dependencies.

## License

MIT. See LICENSE.
