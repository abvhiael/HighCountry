#!/usr/bin/env python3
"""Pinned one-time HighCountry consolidation. Does not replace canonical PNGs or enable titles."""
import json, os, pathlib, re, shutil, subprocess, sys
ROOT=pathlib.Path(__file__).resolve().parents[2]
GENESIS=pathlib.Path(os.environ.get("GENESIS_CHECKOUT", "/tmp/highcountry-genesis"))
SOURCE_SHA="efa93ca96d58533e0f47e9f9ec3d03ed6cacb07b"
MAIN_SHA="ad899746423b83de4453fbe2ce752cd0f4ae0570"
AUDIT_REF="origin/audit/2026-11-02-reconciliation-inventory"

def git(*args, check=True):
    p=subprocess.run(["git",*args],cwd=ROOT,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    if check and p.returncode: raise RuntimeError(f"git {' '.join(args)} failed: {p.stderr.decode(errors='replace')[:4000]}")
    return p.stdout

def copy_file(source, target):
    target.parent.mkdir(parents=True,exist_ok=True)
    if target.exists():
        if target.read_bytes()!=source.read_bytes(): raise RuntimeError(f"unsafe overwrite: {target}")
        return
    shutil.copy2(source,target)

def copy_tree(source, target):
    if not source.is_dir(): return
    for f in source.rglob("*"):
        if f.is_file(): copy_file(f,target/f.relative_to(source))

if git("rev-parse","HEAD").decode().strip()!=MAIN_SHA:
    raise RuntimeError("Integration must start at pinned HighCountry main; unexpected HEAD")
if subprocess.check_output(["git","rev-parse","HEAD"],cwd=GENESIS).decode().strip()!=SOURCE_SHA:
    raise RuntimeError("Genesis checkout moved; refuse an unreviewed source import")

# Current Genesis authoritative app, service, land/custody implementations and tests.
for directory in [
    "apps/highcountry-web/src","apps/highcountry-web/scripts",
    "apps/highcountry-web/test","apps/highcountry-web/e2e","apps/highcountry-web/config",
    "services/highcountry-economy","services/highcountry-archive",
    "services/highcountry-cultivar-governance","scripts/highcountry",
    "deployments/highcountry",
]:
    copy_tree(GENESIS/directory,ROOT/directory)
for path in [
    "apps/highcountry-web/README.md","apps/highcountry-web/server.mjs",
    "apps/highcountry-web/package.json","apps/highcountry-web/public/index.html",
    "apps/highcountry-web/public/styles.css","apps/highcountry-web/public/seed-catalogue.css",
]:
    if (GENESIS/path).exists(): copy_file(GENESIS/path,ROOT/path)

manifest=json.loads(git("show",f"{AUDIT_REF}:docs/consolidation/reconciliation-inventory.json"))
if manifest["verifiedMainSha"]!=MAIN_SHA or len(manifest["branches"])!=28:
    raise RuntimeError("Wrong audit inventory")
versions=[]
# Unique reviewed artifacts: never overwrite newer Genesis application/service source blindly.
for f in manifest["files"]:
    path=f["path"]
    if path.startswith(".github/workflows/") or path.startswith("docs/reconciliation/pr-") and "/source-snapshots/" in path:
        continue
    if path in ["apps/highcountry-web/src/port-alder-navigation.js","apps/highcountry-web/package.json"]:
        # Three-way functional integration is performed below.
        continue
    dest=ROOT/path
    src=f["branches"][-1]
    data=git("show",f"origin/{src}:{path}")
    if dest.exists() and dest.read_bytes()!=data:
        # Preserve source of truth from current Genesis, record difference; never silently clobber.
        versions.append({"path":path,"retained":"Genesis main","reconciledBranch":src,
                         "note":"source differed; inspect against current app/service"})
        continue
    dest.parent.mkdir(parents=True,exist_ok=True)
    if not dest.exists(): dest.write_bytes(data)

# Integrate the newer Emerald Coast/Port Alder stage map instead of downgrading to the older OT-SCREEN-01 navigator.
nav_path=ROOT/"apps/highcountry-web/src/port-alder-navigation.js"
nav=git("show","origin/reconcile/pr-891-port-alder-map-stage:docs/reconciliation/pr-891-source-snapshots/apps/highcountry-web/src/port-alder-navigation.js").decode()
assert "export async function mountPortAlderNavigation" in nav
assert "if(selected){" in nav
nav="import {mountOldTownScene} from './old-town-scene.js';\n"+nav
nav=nav.replace("if(selected){",
"""if(selected){
   if(selected.id==='HC-EC-S01-D07'){
    // Whole-building visual selection; no coordinate survey or ownership authority.
    await mountOldTownScene({document,main,fetchImpl});
    const heritage=el(document,'nav','');heritage.setAttribute('aria-label','Old Town public landmark destinations');
    for(let i=1;i<=5;i++){const id='LM-0'+i;const row=el(document,'p','');
     row.append(a('Public landmark '+id,'/port-alder/district/HC-EC-S01-D07/landmark/'+id));heritage.append(row)}
    main.append(heritage);
   }
""",1)
nav_path.write_text(nav)

# Make each visible original Genesis building image a single keyboard accessible whole-building link.
scene_path=ROOT/"apps/highcountry-web/src/old-town-scene.js"
scene=scene_path.read_text()
needle="group.append(image,label);spriteLayer.append(group);"
if scene.count(needle)!=1: raise RuntimeError("Old Town scene hook drift; refuse speculative modification")
scene=scene.replace(needle,"""const id=a.id;
   const isLandmark=id.startsWith('LM-');
   const target=isLandmark
    ? '/port-alder/district/HC-EC-S01-D07/landmark/'+id
    : '/port-alder/district/HC-EC-S01-D07/property/'+id;
   const wholeBuilding=svgElement(document,'a',{href:target,'aria-label':'Open '+id+' building','tabindex':'0'});
   wholeBuilding.append(image,label);group.append(wholeBuilding);spriteLayer.append(group);""")
scene=scene.replace("Building access and interactive camera controls follow in OT-SCREEN-02/03.",
"Whole-building navigation is read-only; interactive camera controls and certified placements remain separately gated.")
scene_path.write_text(scene)

# Add public-view-only property destination. Never expose title rights or claim private ownership.
dest=ROOT/"apps/highcountry-web/src/old-town-property-preview.js"
dest.write_text("""// Public visual preview only. Site and art identifiers are not a land-title entitlement.
export async function mountOldTownPropertyPreview({document,main,pathname,fetchImpl=fetch}){
 const id=pathname.split('/').at(-1);
 if(!/^(HL-0[1-5]|CR-0[1-6]|WH-0[1-5])$/.test(id))throw Error('unknown property');
 const r=await fetchImpl('/assets/highcountry/maps/old-town-site-registry.json');
 if(!r.ok)throw Error('site registry unavailable');
 const registry=await r.json();
 if(registry.coordinateAuthority!=='PROVISIONAL_LOCAL_PHASE_C')throw Error('unexpected registry authority');
 const s=registry.sites.find(x=>x.id===id&&x.status!=='permanent_public');
 if(!s)throw Error('unknown private site');
 const e=(tag,txt)=>{const el=document.createElement(tag);el.textContent=txt;return el};
 main.append(e('h3','Old Town property '+id));
 main.append(e('p','Provisional property visualization only. No current owner, sale, occupancy or interior entitlement is asserted.'));
 const a=e('a','Back to Old Town');a.href='/port-alder/district/HC-EC-S01-D07';main.append(a);
}
""")

app_path=ROOT/"apps/highcountry-web/src/app.js"
app=app_path.read_text()
if not app.startswith("import {mountPortAlderNavigation}"): raise RuntimeError("App import shape changed")
app="""import {mountOldTownLandmark} from './old-town-landmarks.js';
import {mountOldTownPropertyPreview} from './old-town-property-preview.js';
"""+app
if "'/port-alder':'Port Alder'" not in app: raise RuntimeError("Page route drift")
app=app.replace("'/port-alder':'Port Alder'","'/port-alder':'Port Alder','/emerald-coast':'Emerald Coast'",1)
original="if(path==='/port-alder'){mountPortAlderNavigation({document,main,pathname:location.pathname,fetchImpl});}"
if app.count(original)!=1: raise RuntimeError("Current Genesis app branch logic drift")
replacement="""if(/^\\/port-alder\\/district\\/HC-EC-S01-D07\\/landmark\\/LM-0[1-5]$/.test(location.pathname)){
   mountOldTownLandmark({document,main,pathname:location.pathname,fetchImpl}).catch(e=>main.append(el('p','Landmark unavailable: '+e.message)));
  }else if(/^\\/port-alder\\/district\\/HC-EC-S01-D07\\/property\\/(?:HL-0[1-5]|CR-0[1-6]|WH-0[1-5])$/.test(location.pathname)){
   mountOldTownPropertyPreview({document,main,pathname:location.pathname,fetchImpl}).catch(e=>main.append(el('p','Property preview unavailable: '+e.message)));
  }else if(path==='/port-alder'||path==='/emerald-coast'){
   mountPortAlderNavigation({document,main,pathname:location.pathname,fetchImpl,runtime,authenticate:localAuth?()=>localAuth.getToken():authenticate});
  }"""
app=app.replace(original,replacement,1)
app_path.write_text(app)

server=ROOT/"apps/highcountry-web/server.mjs"
s=server.read_text()
marker="if(path==='/port-alder'||"
if s.count(marker)!=1: raise RuntimeError("Server fallback changed; fail closed")
s=s.replace(marker,"if(path==='/emerald-coast'||/^\\/port-alder\\/district\\/HC-EC-S01-D07\\/(landmark\\/LM-0[1-5]|property\\/(?:HL-0[1-5]|CR-0[1-6]|WH-0[1-5]))$/.test(path)||path==='/port-alder'||",1)
server.write_text(s)

# Add reconciled catalogue modules to original (not stale) Genesis build.
build=ROOT/"apps/highcountry-web/scripts/build.mjs"
txt=build.read_text()
match=re.search(r"for\\(const name of \\[(.*?)\\]\\)await writeFile",txt,re.S)
if not match: raise RuntimeError("Genesis build copy manifest missing")
existing=re.findall(r"'([^']+)'",match.group(1))
available=[x.name for x in (ROOT/"apps/highcountry-web/src").glob("*.js")]
combined=existing+[x for x in sorted(available) if x not in existing]
txt=txt[:match.start(1)]+",".join(repr(x) for x in combined)+txt[match.end(1):]
txt+="""

// Consolidated public presentation datasets (not title, bonus or survey authority).
for(const name of [
 'hc-world-map-catalogue.v1.json','hc-world-port-alder-artwork-hitboxes.v2.json',
 'hc-world-pa-oldtown-landmark-hitboxes.v1.json',
 'old-town-site-registry.json','old-town-genesis-assets.json',
 'old-town-geo-authority-status.json','old-town-provisional-geometry.geojson',
 'old-town-render-anchors.v1.json']){
 const from=join(repo,'deployments/highcountry',name),to=join(dist,'assets/highcountry/maps',name);
 await mkdir(resolve(to,'..'),{recursive:true});await cp(from,to);
}
"""
build.write_text(txt)

# Preserve the exact verified PNG workflow and neutral Tiled review artifacts, not source regenerations.
# The generated TSX and art preview are intentionally not checked in; run pinned generator during scoped test.
# Fail if any existing, canonical HighCountry image was modified.
changed=git("diff","--name-only",MAIN_SHA,"--","apps/highcountry-web/public/assets/","assets/highcountry/").decode().strip()
if changed: raise RuntimeError("Canonical artwork changed: "+changed[:2000])
metadata={"sourceGenesisMainSha":SOURCE_SHA,"baseHighCountryMainSha":MAIN_SHA,
          "reconciledBranches":len(manifest["branches"]),"changedPaths":len(manifest["files"]),
          "conflictsRequiringReview":versions,
          "designAuthority":"PROVISIONAL_AND_FAIL_CLOSED",
          "runtimeStatus":"integration branch only; no title/bonus issuance",
          "note":"No approved terrain source/keyring or production authenticated milestone endpoint is fabricated."}
out=ROOT/"docs/integration/FOUNDATION-MIGRATION.json"
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps(metadata,indent=2)+"\\n")
print("Migrated Genesis pinned sources; imported deduplicated reconciliation files.")
print("Files requiring manual version review:",len(versions),*[x["path"] for x in versions],sep="\\n")
