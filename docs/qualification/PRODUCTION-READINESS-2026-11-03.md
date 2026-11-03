# HighCountry — Production-readiness qualification (2026-11-03)

**Verdict: NO-GO for production gameplay/land issuance.**  
**Qualified source:** `integration/highcountry-consolidated@bd0bfc734f414dc6da492d95ba4dc33949e291f7`  
**Qualification branch:** `qualification/highcountry-production-readiness`  
**Machine-readable release gates:** [production-readiness-gates.json](./production-readiness-gates.json)

## 1. PostgreSQL-backed authority — PASS in isolated PostgreSQL 18

Run: https://github.com/abvhiael/HighCountry/actions/runs/41695395928  
Run HEAD: `0da8925ce637c2d0660b0e5df82f0c3467c00f59`  
Result: **completed / success**. A disposable Docker PostgreSQL **18** service was used; neither an existing Neon database nor any production database/schema was modified.

The existing repository-targeted `postgres-live.integration.mjs` integration executed successfully with real Postgres:
- SERIALIZABLE row locking and competing reservation/settlement; no double allocation;
- source receipt replay protection and BUDS/asset conservation;
- runtime signed session/wallet nonce persistence over restarts;
- least-privilege runtime role and RLS denying unauthorized namespace, INSERT and DDL;
- authenticated ordinary-market listing/asset source admission, denial for forged caller.

The actual PostgreSQL `placement-authority-postgres.test.mjs` and `placement-market-postgres.test.mjs` suites ran with an isolated test database: **12 passed, 0 failed**. Evidence includes:
- revoked/stale parcel authority rejected with inventory unchanged;
- monotonic world authority reprovision, replay rejection;
- exact custody unit placement/listing/transfer, transactional conservation;
- concurrent independent workers, competing buyers and atomic final-unit allocation;
- stale scene version denial/rollback, database-backed restart recovery;
- deliberately corrupted persisted geometry denied without mutation;
- simulated unknown COMMIT acknowledged via matching durable operation receipt only.

**Limit:** Fixtures and migration role are testing the actual source against real PostgreSQL 18, *not* proving a deployed production TLS/role/CA setup, real owner signatures, identity provider, persisted schema provenance or live HTTP endpoint. Production-db/endpoint qualification remains open.

## 2. Canonical Old Town visual source and foundations — integrity PASS / exact placement FAIL

Run: https://github.com/abvhiael/HighCountry/actions/runs/41695419543  
Run HEAD: `be399cde5b37407f7105e4377d1209243b4c3118`  
Result: **completed / success** of the *diagnostic test*, not a production-placement approval.

Script `scripts/qualification/old-town-foundation-audit.py` verified the original GitHub PNG bytes and read real image pixel dimensions, alpha-threshold (20/255) bounding boxes and bottom-alpha support span for **all 20 Old Town Genesis images**; all **20/20 SHA-256** values match `old-town-genesis-assets.json`. The script generated `foundation-evidence.json` with each image's source SHA256, canvas dimensions, alpha bounds, bottom support, site rectangle and existing registered ground anchor.

**Actual anchor findings:** **20/20 registered ground anchors sit at the provisional site-centre-bottom**, not a surveyed sprite-local foundation contact at the approved lot right edge. **0/20 registered anchor x coordinates coincide with the lot's right x boundary.** The current renderer `spriteFit` scales visible alpha extent to the nominal occupied footprint; an image alpha outline cannot establish the actual structure foundation or correct source-to-ground contact. The registry contains **0 certified sprite-local architectural foundation polygons and 0 approved right-edge contacts**. Both the site registry and render-anchor contract identify their source as **PROVISIONAL**, and the geo-status record denies land issuance.

Therefore **production-grade visual sprite placement is NOT qualified** and should not be declared correct even if screenshot composition looks plausible. This is a known functional limitation of the current renderer, not a PNG defect: do **not** redraw, rename, shift or replace authoritative GitHub PNGs to hide it.

**Evidence artifact:** `hc-old-town-20-sprite-foundation-evidence` (ID `13260532294`), on the visual [Actions run](https://github.com/abvhiael/HighCountry/actions/runs/41695419543). Contains the original-sprite contact sheet and per-image source measurements JSON; 14-day run artifact retention. Contact-sheet pictures are diagnostic resized views only, not modified source images.

## 3. Exact release-gate decisions

| Gate | Status | Requirement before deployment |
|---|---|---|
| Real PostgreSQL 18 SERIALIZABLE and RLS | **PASS (isolated)** | Production role/CA/schema acceptance still separate |
| Placement, custody, replay, recovery | **PASS (isolated)** | External authorized world/identity evidence still separate |
| 20 canonical Old Town PNG hashes | **PASS** | Preserve unchanged |
| Measured architectural source foundation polygons | **BLOCKED (0/20)** | Individually trace approved measured source-local base geometry to original hash |
| Certified right-edge contact and pixel alignment | **BLOCKED (0/20)** | Qualify contact point, isometric position, scaling, full sprite fit, deterministic depth and lot boundaries per canonical PNG |
| Survey custody / legal title geography | **BLOCKED** | Approve independent signed surveyed site coordinates and source custody |
| Live production database with issued role/CA | **NOT TESTED** | Apply/match exact migrations and role permissions to isolated production-like deployment; no unapproved production mutations |
| Authenticated deployed HTTP/market and placement round-trip | **NOT TESTED** | Require signed identity, current authority, durable writes, fault/recovery and RLS in actual deployment |
| Browser pixel-diff/usable viewport acceptance | **NOT TESTED** | Use exact foundation-qualified sprite placement and approved camera/keyboard accessibility |
| Title issuance/unqualified bonuses | **DISABLED** | Remain disabled pending owner approval |

## 4. Immediate corrections, in dependency order

1. Produce one **measured PNG-local foundation polygon and precise ground contact** per 20 source sprites with actual pixel units, original Git blob + SHA256, proposed scale and right-edge attachment target. Record approval/provenance; don't infer a base from alpha bbox or generic footprint templates.
2. Adapt `old-town-scene.js` to fit the measured **foundation footprint** rather than alpha width, and place via approved right-edge contact rather than Phase C centre-bottom marker. Reject missing or mismatching source-hash/contact records; keep old visual mode clearly **preview only**. Run only affected OT-SCREEN renderer Level 1/2 and visual pixel acceptance on the final SHA.
3. Acquire independent signed terrain/parcel approval for the actual 59 Old Town sites plus B22, and qualify HC-WORLD-02 custody/admission before enabling title or transaction-relevant geometry.
4. Create a separate controlled production-like PostgreSQL environment and bind the exact integrated runtime schema/RLS and service roles. Verify live TLS CA, signed session, current owner/parcel evidence, operation replay, concurrency and recovery. None of these authorize blockchain-finality/settlement reward release without the verifier.

## 5. Source/branch safety and evidence policy

- Source qualification branch adds **only two narrowly scoped GitHub Actions workflows**, the canonical image diagnostic script and these evidence reports; no game runtime or artwork modifications.
- The original `integration/highcountry-consolidated` branch and both main branches remain unchanged, original orphaned PRs remain open/unmerged.
- The historical green source and consolidation Level 1/2 tests were preserved; only the missing real DB and image-source qualification were run. No CI-GUARD, broad suite or automatic Level 3.
- A GitHub-hosted production release is **not authorized** by passing a diagnostic workflow whose report explicitly says `oldTownRendererProductionReady:false`.

**Final decision: NO-GO** until the required survey/foundation certification and environment-bound production authorization are independently supplied and accepted.
