# HighCountry — all-branch reconciliation consolidation audit

**Audit date:** 2026-11-02 (America/Regina)  
**Authoritative comparison base:** `abvhiael/HighCountry@ad899746423b83de4453fbe2ce752cd0f4ae0570` (`main`)  
**Scope:** all **28** `reconcile/pr-*` branches listed in the repository at audit. This report is on `audit/2026-11-02-reconciliation-inventory` only; `main` is unchanged.

## 1. Audited inventory: findings

The detailed machine-readable file inventory is **[reconciliation-inventory.json](./reconciliation-inventory.json)**. It contains each of the 28 exact branch HEAD SHAs, merge bases, ahead/behind counts, all relative changed paths (with statuses), and a cross-branch path→branch index including verified shared Git blob IDs. The split source capture is in `inventory-branches-01..03.json`; proof of overlap matching in `overlap-blobs-01..03.json`.

- **28** reconciliation branches, all descend from exactly the main SHA above; **0 behind main** at audit.
- **176** branch/path occurrences after including inherited files (reconciliation reports, branch source snapshots and targeted CI files included).
- **126 distinct changed paths** across all branches; all are additions relative to HighCountry main. **42 paths** occur in more than one branch; exact Git tree blob SHA checks across **92 occurrences** show **0 divergent shared file contents**.
- **84** changed paths occur on exactly one branch. A direct branch merge would repeat inherited files; remove duplication by using the single newest verified version of each path, not 28 independent wholesale content copies.
- No branch in this audit is currently behind main; the report does not mean it is safe to merge all branches blindly. **Semantic conflicts and missing dependencies are substantial.**
- HighCountry main has **zero** blobs under `apps/highcountry-web/src/`, `apps/highcountry-web/scripts/`, `apps/highcountry-web/test/`, `services/highcountry-economy/`, `deployments/highcountry/`, `scripts/highcountry/` or `tools/tiled/`. The transferred art exists but the consolidated browser/server/application source baseline is not on main.
- Main's actual HC-ART-05 PNG count is **197**, grouped A=18, B=18, C=18, D=52, E=43, F=48 (each path under `apps/highcountry-web/public/assets/structures/hc-art-05-{a..f}/`). This is a **Git tree path count**, not a new SHA-256 byte audit.

### Full 28-branch index

The file counts below are **cumulative changed paths compared to main**, not unique additions introduced by that source PR. The linked JSON supplies the complete literal file names and branch HEADs.

| PR | Branch subject | Paths vs main | Integration function | Dependencies / notes |
|---:|---|---:|---|---|
| 845 | Entertainment | 3 | catalogue + scoped test | application marketplace/build/qualified placement |
| 849 | Posters | 3 | catalogue + scoped test | app/creator cataloguing, wall mounting |
| 851 | Signs/plaques | 3 | catalogue + scoped test | app, qualified surface/placement |
| 852 | Framed art | 3 | catalogue + scoped test | app, wall slots and authorization |
| 853 | Mounted decor | 3 | catalogue + scoped test | app, qualified parent/slot anchors |
| 855 | Small decor | 3 | catalogue + scoped test | app, tabletop/shelf contracts |
| 856 | Regional memorabilia | 3 | catalogue + scoped test | app, region/placement qualification |
| 859 | Outdoor structures | 3 | catalogue + scoped test | same blob also in 928/929; app/HC-PLACE |
| 872 | Fire/gathering | 3 | catalogue + scoped test | same blob in 928/929 |
| 877 | Garden ornaments | 3 | catalogue + scoped test | same blob in 928/929 |
| 878 | Physical survey | 7 | validation scripts and tests | missing HC-WORLD-02 cadastre generator and terrain approval inputs |
| 879 | Paths/landscape | 3 | catalogue + scoped test | same blob in 928/929 |
| 881 | Recreation | 3 | catalogue + scoped test | same blob in 928/929 |
| 885 | Survey custody | 11 | custody script/test/docs | **inherits 878**; approved terrain/keyring and cadastre still missing |
| 890 | Building economy | 2 | design contract | legacy 108-count language superseded by actual 197 PNG inventory |
| 891 | Port Alder map stage | 12 | map selector, 13 district hitboxes, server-side count helper, tests; app snapshots | browser/router/build, authenticated settled-title snapshot endpoint missing |
| 893 | Workshop abilities | 4 | 18-workshop design contract | **inherits 890**; runtime ability engine not implemented |
| 895 | Old Town abilities/LMs | 4 | 16 ability identities, 5 civic landmark design contracts | provisional survey; numeric targets unqualified |
| 896 | Old Town landmarks | 12 | 5 informational landmark routes + draft polygons/test | **inherits 895**, route build missing; #909 later supersedes entrance-gating |
| 900 | Agriculture | 4 | 52-building D catalogue/test/ability contract | app/marketplace/HC-PLACE; 52 PNGs present |
| 909 | Old Town roadmap | 3 | 28-step master amendment plus OT-SCREEN-00..06 | approved owner design, not executable gameplay |
| 913 | Old Town renderer | 15 | renderer, 59-site+20-image registry, provisional geometry and anchors/tests | **inherits 909**; no full browser runtime; foundations not qualified |
| 917 | F Red Mesa review | 5 | 12-item 420Corp-only review catalogue/test + workflow | founder-approved identity/function/placement missing |
| 928 | Canonical rectangles | 18 | HC-PLACE geometry/transactions and 90 eligible object definitions/tests | carries same five catalogues; standalone Postgres/production authority not wired |
| 929 | Outbuilding layout | 22 | interior layout validation and tests | **inherits 928**; no authoritative live mutation integration |
| 930 | Tiled editor starter | 3 | neutral .tmj template/docs | editor only |
| 931 | Tiled Old Town review | 6 | 59 sites + B22, 20 identity markers | **inherits 930**, geometry provisional |
| 932 | Tiled original PNG preview | 12 | SHA-256-checking generator, workflow, 20 image previews | **inherits 931/930**, needs Genesis source registry; no foundation-qualified placement |

## 2. Proven inheritance and duplicate functionality

The following child branches already include their parents (confirmed by branch comparisons and matching shared Git blobs):

- `878 → 885` (survey then survey source custody).
- `890 → 893` (building abilities then workshop abilities).
- `895 → 896` (landmark identity/design then informational screens).
- `909 → 913` (Old Town screen roadmap then provisional renderer).
- `928 → 929` (HC-PLACE rectangles/transactions then outbuilding interior layout).
- `930 → 931 → 932` (Tiled template → site review map → PNG generator).
- The exact standalone catalogues from `859, 872, 877, 879, 881` are **byte-identical** to those imported by `928`, and carried on `929`.

**Consequences:** Consolidate by unique file/blob, and preserve the latest dependency child or derive incremental patches. Do not execute duplicate tests because the same source was copied to a different reconciliation branch. Keep historical snapshots under `docs/reconciliation/pr-*-source-snapshots/` as evidence only: never mistake them for the active app, server or build entry points.

## 3. Decisions: conflicting definitions and authority

### Old Town roster — source-registry reconciliation

Read `deployments/highcountry/old-town-site-registry.json` and `old-town-genesis-assets.json` as recorded on current Genesis main (Git blobs `5ba800f1220e459971e13a16fce198610c632b68` and `b6904cc9e60fe3a134af7f25e1f7555576b85201`, now preserved in 913 and 932). Their recorded data establishes:

- **54 private titles:** 30 residential, 24 commercial; **39 vacant sites**, **15 Genesis private structures**.
- **Five permanent, non-saleable landmarks**; **20 Genesis sprites total:** **4 HL + 6 CR + 5 WH + 5 LM**.
- **HL-05** is a house design but **not** Genesis-prebuilt.
- **CR-04 Port Alder Bookshop** is **present as a Genesis storefront site/asset** in the recorded registry, and its identity also appears in PR #895's 16-building ability definitions, PR #909's stated 20-site roster and PR #931's Tiled review. Thus the earlier 5-CR planning list is **outdated for this registered Genesis roster**; retain **six** CR IDs in consolidation. Do not remove CR-04 or fabricate a 21st structure.
- The source still says `coordinateAuthority=PROVISIONAL_LOCAL_PHASE_C`. **Recorded roster identity is resolved; independent survey and actual title issuance are NOT approved**. Do not promote provisional lot coordinates to finalized title authority.
- Prefer exact canonical filename/ID to display-name spelling variants: e.g., the actual WH-01 asset filename contains `baked-bouy` (not necessarily the desired display spelling). Canonical IDs and immutable PNG bytes cannot be renamed by prose or a stale abilities contract without approved migration.
- The 16-buildings ability list covers **5 HL templates + 6 CR + 5 WH**. This is a *design catalogue* and is **not** the number of Genesis-prebuilt private sites or the complete 54-property title inventory.

### HC-ART-05 catalogue and artwork counts

Use **197 present PNGs** as the transferred source artwork census: A=18, B=18, C=18, D=52, E=43, F=48. Correspondingly A–E contribute **149 potential player-owned artwork definitions**; F=48 public/non-player artwork. This supersedes historical design text describing six groups of 18, 108 total, or outdated E/D count plans. **Presence is not certification**: some records still need exact source pixel and geometry/approval checks.

- PR #900's **52-item D catalogue** (16 universal + 12 each EC/GP/RM) matches the **52** current main PNG paths; its nominated footprints and `sourcePixelsPerTile=320` are not qualified occupancy or the `64 px` logical world tile size.
- PR #893's B=18 workshop identities align to B's **18** artwork paths; #890 design scope predates the later D/E expansions.
- PR #917's Red Mesa F review catalogue references **12 existing F PNGs**, yet explicitly states `review-only-roster-mismatch`, `canonicalIdentityApproved:false`, 420Corp ownership and no placement or gameplay functions. **Resolution:** retain all 12 files and this review catalogue separately, do **not** promote these names/functions as approved or enable marketplace/placement. Owner approval of roster/function is still an unresolved authority decision. Never invent a mapping from review names to an unprovided approved roster.
- HC-PLACE #928 covers **90 scoped rectangular catalogue entries**; it is not a geometry certification for all 149 player-owned structure definitions or all other household items. Its visual proxy cap fix does not change true occupancy dimensions.
- #895's example 10/15/20% property bonuses are `DESIGN_TARGETS_ONLY`. Do not treat these as certified live economy modifiers or override equipment, stacking and title authorization rules.

### Old Town navigation and rendering hierarchy

- **#909 is the governing Old Town navigation design**: select the **entire visible building** via click/tap or accessible keyboard target, not a precise entrance/door/sidewalk/freight pathway prerequisite. #896's five draft entrance polygons are preserved as historical, unapproved review geometry, never navigation gates.
- **#913** renders 2:1 world projection at nominal 64×32 display pixels; 16×16 *logical* chunks; original separate PNGs; B22 park; 59 recorded sites; 20 eligible source sprites. Its opaque-alpha/canvas fit is provisional **not a measured sprite foundation**. Preserve canonical source art and correct the renderer/anchors, including right-edge foundation anchoring when actually qualified.
- **#931/#932** are Tiled *review* files, not an independent survey, verified sprite anchor or game-runtime source of title rights. #932's actual PNG SHA-256-checking build succeeded in targeted workflow `41580635758`; 20 preview objects are expressly canvas-fit, centre-marker previews, not approved gameplay placements.
- **#891** town-stage logic is valid as a fail-closed helper but the authenticated final-title snapshot route is missing. A PNG existing at the 75% path does not automatically authorize the 75% presentation flag or manufacture settled purchases.

## 4. Missing dependencies preventing a working consolidated app

**Hard blocking infrastructure (confirmed absent from HighCountry main):**
1. The actual HighCountry **browser shell/routes/build/server** (`apps/highcountry-web/src/app.js`, `server.mjs`, `scripts/build.mjs`, package/boot configuration, existing route and marketplace sources). Existing reconciliation snapshots do not supply the latest app implementation; migrate the current authoritative Genesis implementation without overwriting later changes. #891, #896, #913 and all frontend catalogues need it.
2. The broader **services/highcountry-economy** runtime, authenticated ownership and inventory systems, land/title registry, settlement/transaction authority, database migration and PostgreSQL adapter. #928/#929 include partial pure and transactional modules, but not a production fully wired application/API service. No live mutations, grants or economic activation should be inferred.
3. **HC-WORLD-02 cadastre generator and canonical geographic inputs**. The #878 full-survey module imports `./hc-world-02-cadastre.mjs`, which is **absent from the union of all 28 reconciliation branch changed paths and from HighCountry main** (available in current Genesis main). #885 also needs independently verified terrain source bytes, trusted Ed25519 owner approval keys/signatures and authoritative datasets. Source transfer precedes real survey admission.
4. **HighCountry map/navigation dependencies and the canonical auth service** for #891's missing `/api/highcountry/world/port-alder/purchase-milestone` endpoint. The browser must fail closed to Genesis art unless the server provides valid finalized inventory proof.
5. **Production Old Town scene integration**: OT-SCREEN-02 pan/zoom/selection and OT-SCREEN-03 property/landmark destinations, exact sprite source hash/foundation measurement, truly approved terrain/parcel geometry and independent title/ownership checks are not established by #913/#896/#931/#932.
6. **Builder and marketplace catalogue wiring** for the numerous imported catalogue sources, including safe pricing/inventory, HC-PLACE placement certification and outbuilding equipment slots. Files being present in the source tree does not imply storefront visibility, server purchase or equip functionality.
7. **Founder approval for F Red Mesa review roster/functions and qualified placement site(s)**. Leave 420Corp-only review assets non-player and non-operational.

**No-blocker / intentional deferments:** The exact approved assets remain on main; don't regenerate them. Tiled image previews, design-only bonuses, tentative LM hitboxes and 75% art activation are not prerequisites for cataloguing or transferring byte-identical source.

## 5. Consolidation order and verification policy

Recommended staging on a new **integration branch from exact audited main SHA**, never on the original Genesis orphaned PR branches:

1. **Foundation migration:** copy current Genesis HighCountry browser, build/server, economy/land-registry service and HC-WORLD-02 modules in a controlled dependency audit. Record SHA of every migrated file, qualify only newly introduced dependencies and reject stale snapshots.
2. **Safe non-operational catalogues and specs:** deduplicate by shared blob; import #845/#849/#851/#852/#853/#855/#856/#859/#872/#877/#879/#881, #900, #917 in review-only mode; plus 890→893. Preserve historic reconciliation reports and source snapshots, not runtime entry-point overrides.
3. **Placement/survey authority:** 878→885, 928→929; no production mutation path until actual auth, state/recovery, Postgres and owner-approved registry qualified. Carry 90-item rectangle eligibility exactly.
4. **Old Town contracts and map services:** 895→896, 909→913, plus #891's fail-closed map/stage. Resolve UI routing against #909; avoid creating competing navigators or admitting provisional geometry.
5. **Tiled tooling:** 930→931→932; keep generated art preview as a separate review deliverable until exact foundation qualification.
6. **Integration checks:** compare latest main before promotion, check import/build graph and compilation; run only *new/affected* Level 1 and relevant Level 2 on the combined exact SHA. Retain already-green source-qualified workflows. No redundant full CI, no CI-GUARD, **no automatic Level 3**.
7. **Integration PR, not main merge in this audit**: publish manifest, code ownership, unresolved approval gates and exact passing workflow links. Merge only on a distinct explicit instruction and verified integration.

## 6. Current disposition

This audit itself **makes no game runtime change**, adds no canonical assets, starts no build/tests and does not merge/close any original PR. Source file/blobs, counts, duplicate-content checks and registry consistency are audit findings, not independent gameplay certification. Pending approvals (actual survey, F review roster, item geometry, UI/source) are intentionally **not asserted as resolved**.

**Audit branch** `audit/2026-11-02-reconciliation-inventory` is an evidence branch. Its report and JSON inventory should be used as the frozen starting point for the next integration branch.
