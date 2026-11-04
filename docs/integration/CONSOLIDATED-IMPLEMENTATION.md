# HighCountry B2 — Consolidated runtime, economy, Old Town and Tiled integration

**Status:** INTEGRATED ON ISOLATED BRANCH; targeted L1/L2 GREEN; live geographic issuance and production database activation UNQUALIFIED.  
**Integration branch:** `integration/highcountry-consolidated`  
**HighCountry source main:** `ad899746423b83de4453fbe2ce752cd0f4ae0570`  
**Genesis current main at migration:** `efa93ca96d58533e0f47e9f9ec3d03ed6cacb07b`  
**Baseline audit:** `audit/2026-11-02-reconciliation-inventory`; 28 reconciliations, 126 distinct changed paths, 42 duplicated byte-identical paths, zero Git blob collisions.

## Actual source migration (not an app mock-up)

A pinned one-time runner cloned the publicly accessible Genesis repository with sparse checkout and imported the current HighCountry browser source, route/bootstrap server, static build, 38 original app tests, HighCountry economy services/tests/migrations, HighCountry archive and cultivar governance service, cadastral scripts and source manifests. It then imported the deduplicated files from all 28 reviewed reconciliation branches by original canonical file path, excluding redundant branch-scoped CI workflows and archival copies of stale application entrypoints.

At final checked tree: **41** `apps/highcountry-web/src` modules, **38** app test files, **58** economy source files, **61** economy tests, **7** economy migrations, **72** `scripts/highcountry` files, **39** `deployments/highcountry` files and **6** Tiled tooling files. Runtime dependencies exist as source, including `services/highcountry-economy/src/start-runtime.js`, placement transaction/custody/recovery modules and `scripts/highcountry/hc-world-02-cadastre.mjs`.

Existing artwork is NEVER copied from Genesis: **1,540/1,540 original HighCountry public/asset Git blobs remain identical to main**, with no replacements and no new game PNGs. This includes the full 197 HC-ART-05 art roster and existing Old Town original sprites.

## Explicit code integration

- Keeps latest Genesis `app.js`, `server.mjs`, build, runtime and services rather than overwriting them with orphaned historical snapshots.
- Adds `/emerald-coast` region navigation, public Port Alder map stage and exact 13 provisional district-polygon navigation. Authenticated milestone reader remains fail-closed: no fabricated settlement-backed endpoint, no browser counts.
- Old Town `HC-EC-S01-D07`: integrates 2:1 deterministic SVG scene and the five public landmark information screens. **Whole visible building SVG image** is wrapped in a keyboard-focusable accessible link for each of the 20 Genesis structures. Five LM links open read-only landmark information; 15 prebuilt private structures link to **read-only provisional property previews** that never assert current ownership or interiors. Door-pixel and road/freight alignment do not gate navigation.
- Preserves immutable 59-site registry, B22 park, 20 Genesis sprites, geometry-status denial, 16x16 logical chunks, no automatic land issuance and unapproved sprite-foundation/terrain markers.
- Imports canonical rectangle HC-PLACE registry, persisted placement transaction/custody/recovery implementation and reusable outbuilding interior validator, alongside source ownership/economy services and seven SQL migration files. **No service HTTP handler is newly enabled by the branch**; no owner/asset bonus or title issuance authority is inferred.
- Preserves #930→#931→#932 neutral Tiled template, 60 site/park rectangles, metadata-only markers and hash-verified original-PNG image preview generator. Preview canvas-fit and site-centre coordinates remain expressly unqualified as real sprite right-edge ground contacts.
- Ability contracts (#890/#893/#895/#900) and Red Mesa 420Corp review-only catalogue (#917) remain non-activated. No unverified numeric bonus or player sale privileges are enabled.

## Four conflicting files — resolved against actual authoritative PNGs and design

1. `regional-memorabilia-catalogue.js`: used reconciled #856 IDs and asset filenames, **matching all twelve actual PNGs** on HighCountry main; retained strict wall/tabletop slot requirements. Updated the old Genesis-only test's obsolete IDs/predicate expectations, without weakening missing-anchor or missing-ownership denial.
2. `red-mesa-leisure-catalogue.js`: used reconciled #928/#929 explicit clickable-building exception, retaining qualified collision mask, authenticated ownership, anchor, region, no-overlap and server authorization gates. The outdated mandatory flat-terrain/door-entrance requirements were not reinstated.
3. `red-mesa-leisure-catalogue.test.mjs`: adopted the exact matching reconciled test for the approved exception.
4. `placement-contract.js`: surgically restored `structure` to authorized layers and `outdoor_ground` surface without changing unrelated authorization/geometry validators; final module Git blob matches preserved #928/#929 contract.

The provenance and individual resolutions are recorded in `docs/integration/FOUNDATION-MIGRATION.json`; no outstanding same-path source conflict remains.

## Targeted validation — all SUCCESS

- **Initial pinned Genesis migration + new integrated app L1 / real built-bundle L2 / original SHA-256 PNG Tiled L2:** [Actions #41587413154](https://github.com/abvhiael/HighCountry/actions/runs/41587413154).
- **Four resolved catalogue/geometry contracts: only affected L1 tests and actual browser build L2:** [Actions #41587834992](https://github.com/abvhiael/HighCountry/actions/runs/41587834992).
- **Newly combined app/economy/survey/Tiled relative import dependency graph — all 89 reachable local modules resolve:** [Actions #41588201860](https://github.com/abvhiael/HighCountry/actions/runs/41588201860).
- **New whole-building accessible SVG image-link integration — 20 sprite targets, 15 private/5 public, no issuance:** [Actions #41588374046](https://github.com/abvhiael/HighCountry/actions/runs/41588374046).
- No unrelated passing suites were restarted, no CI-GUARD, no automatic Level 3, and no live Cloudflare deployment triggered by these GitHub Actions.

## Remaining production qualification and authority

These are **not** claimed complete:
1. The production Postgres instance and schema migrations have NOT been applied to a connected database by this reconciliation. The source runtime and migrations are present, but no actual external database connection, authorization under concurrency, crash recovery or authenticated API round-trip has been qualified in this integration. A separate environment-bound **affected Level 2** PostgreSQL integration must verify the exact repo SHA and existing granted service credentials.
2. Actual signed/owner-approved terrain byte sources and survey custody keyring are NOT provided. HC-WORLD-02 source modules are installed; no real geographic/title admission can occur without signed approved survey evidence.
3. Port Alder settled-title progress endpoint is intentionally **unmounted**. Without verified server snapshot, map stage defaults to Genesis; no client-driven 50% or 75% promotion.
4. Old Town source artwork and property roster are preserved (CR-04 exists in the source registered 20-spawn list), but placement visuals remain provisional until **true source image foundation measurements**, right-edge anchoring, 2:1 sprite acceptance, independently surveyed geometry and separate authorized title-ownership destination claims. Clickable image previews are not production gameplay placement.
5. Red Mesa 05-F founder approval and placement, and all proposed unqualified property/building bonuses, remain deferred.
6. User-facing runtime, external web deployment configuration and live E2E/production system qualification are outside the completed targeted source/build tests. This branch is not merged into main.

## Disposition

The requested recoverable application and service foundation has been migrated and source-integrated on an isolated **integration branch**, not released. All exact existing artwork is preserved. The four source-level conflicts have been resolved by canonical asset evidence and the approved game-navigation exception. Scoped L1/L2 qualification evidence is green.

**No original orphaned PR has been merged/closed. Neither repository main has been modified.** Do not merge the consolidated branch until the outstanding environment-backed authority approvals and any required integration acceptance steps are explicitly addressed.
