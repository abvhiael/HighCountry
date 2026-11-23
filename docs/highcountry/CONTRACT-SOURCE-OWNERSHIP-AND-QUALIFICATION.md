# HighCountry standalone contract source custody

## Ownership
HighCountry is canonical owner of `contracts/src/highcountry/**`, `contracts/test/highcountry/**`, its game economics and game visuals. Genesis remains the single canonical owner of shared 420 Gaming SDK, 420ID/Identity, account/SmartAccount, capability authority, Treasury, Gaming registries and interface protocols. No shared protocol is vendored into the game repository. Never change frozen Genesis addresses, issuance, allocation, identity, claim or settlement authorization checks to make tests green.

## Exact source provenance
Game-owned Solidity source and tests were copied without overwrite from Genesis `abvhiael/420-integrated-v0.1@f5072ae8d343aca4731e02b774c41394b4228d69`. Original unmerged R04/HC-NEXT PR-specific documents not present in destination were retrieved verbatim, with source PR IDs and blob SHAs recorded in `docs/migration/highcountry-contract-source-docs.json`. Newer standalone documentation and code take precedence over archived phase assumptions.

## Local reproducible tests
From a clean clone, checkout the exact Genesis shared dependency revision into an external temporary location using read-only access, never move those source files into the tracked HighCountry tree. The supported CI path is `.github/workflows/hc-full-game-solidity-matrix.yml`, which loads the immutable Genesis revision, verifies all local relative imports, and executes each `contracts/test/highcountry/**/*.t.sol` through a dependency-closed temporary Foundry project created by `scripts/highcountry/prepare-focused-contract-test.mjs`. The fast smoke suite is `hc-focused-contract-tests.yml`. The reusable import auditor is `scripts/highcountry/verify-game-contract-dependencies.mjs`; dependency hydration is `scripts/highcountry/hydrate-genesis-shared-contracts.mjs`.

The Foundry configuration in `contracts/foundry.toml` scopes source and test discovery to HighCountry-specific code; file exclusions prevent accidental commits of Genesis-owned hydrated dependencies. All authoritative chain and gateway verifiers remain owned and versioned in Genesis, not reimplemented in this app.

## Qualification criteria
Run source integrity, all 68 Foundry game test files, marketplace and indexer service tests, and standalone source-independence CI. Preserve exact-head run IDs and any failures. A green local replay or mock chain does **not** establish live testnet finality, production deployment or independent security audit. Defer live network dependencies to `docs/highcountry/HIGHCOUNTRY-TESTNET-WORK-ROADMAP.md` with explicit blockers. Do not close Genesis migration PRs until their game-owned source and required docs are actually preserved, and do not delete a source branch still needed by an open PR.
