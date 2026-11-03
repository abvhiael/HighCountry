#!/usr/bin/env python3
"""Old Town canonical-PNG byte and image-space evidence, never cadastral/foundation authority.

Output is diagnostic only. An alpha bounding rectangle is NOT a measured foundation.
"""
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root=Path(__file__).resolve().parents[2]
data=root/"deployments/highcountry"
assets=json.loads((data/"old-town-genesis-assets.json").read_text())["assets"]
anchors=json.loads((data/"old-town-render-anchors.v1.json").read_text())["anchors"]
site=json.loads((data/"old-town-site-registry.json").read_text())
geo=json.loads((data/"old-town-geo-authority-status.json").read_text())
assert len(assets)==len(anchors)==20
by_site={x["id"]:x for x in site["sites"]}
by_anchor={x["id"]:x for x in anchors}
out=root/"artifacts/qualification/old-town"
out.mkdir(parents=True,exist_ok=True)

entries=[]
font=ImageFont.load_default()
sheet=Image.new("RGB",(5*300,4*238),(238,242,243))
draw=ImageDraw.Draw(sheet)

for i,item in enumerate(assets):
    label=item["id"]
    image_path=root/item["repoPath"]
    b=image_path.read_bytes()
    sha=hashlib.sha256(b).hexdigest()
    if sha!=item["sha256"]:
        raise AssertionError(f"{label}: uploaded PNG SHA-256 differs from registry")
    with Image.open(image_path) as original:
        assert original.format=="PNG",label
        png=original.convert("RGBA")
        width,height=png.size
        visible=png.getchannel("A").point(lambda a:255 if a>20 else 0)
        bounds=visible.getbbox()
        if bounds is None:raise AssertionError(label+": entirely transparent source")
        px=visible.load()
        # Approximate alpha support is *not* an architectural wall/foundation measurement.
        low_y=max(bounds[1],bounds[3]-max(2,int(.03*(bounds[3]-bounds[1]))))
        low_x=[x for y in range(low_y,bounds[3]) for x in range(bounds[0],bounds[2]) if px[x,y]>0]
        if not low_x: raise AssertionError(label+": no alpha near bottom")
        support=[min(low_x),max(low_x)]
        lot=by_site[label]["rect"]
        registered=by_anchor[label]["groundAnchorTiles"]
        # Proposed right boundary is only a comparison; it is NOT an approved grounding coordinate.
        is_center_bottom=registered==[(lot[0]+lot[2])/2,lot[3]]
        right_edge_match=registered[0]==lot[2]
        entries.append({
            "id":label,"png":item["repoPath"],"sha256":sha,
            "canvasPx":[width,height],"alphaBoundingBoxPx":[*bounds],
            "alphaWidthPx":bounds[2]-bounds[0],"alphaHeightPx":bounds[3]-bounds[1],
            "lowAlphaSupportSpanXpx":support,
            "siteRectTiles":lot,"registeredAnchorTiles":registered,
            "registeredAnchorIsLotCentreBottom":is_center_bottom,
            "registeredAnchorAtRightLotBoundaryX":right_edge_match,
            "measuredFoundationPolygon":None,
            "qualifiedRightEdgeGroundContact":False,
            "provenance":"GitHub canonical bytes; image alpha diagnostics only",
        })
        cell_x=(i%5)*300
        cell_y=(i//5)*238
        draw.rectangle((cell_x+2,cell_y+2,cell_x+297,cell_y+236),fill=(250,252,252),outline=(166,180,184),width=2)
        draw.text((cell_x+11,cell_y+9),label+" — CANONICAL ORIGINAL",font=font,fill=(24,34,41))
        alpha_crop=png.crop(bounds)
        alpha_crop.thumbnail((267,164),Image.Resampling.LANCZOS)
        target_x=cell_x+(300-alpha_crop.width)//2
        target_y=cell_y+25+(171-alpha_crop.height)//2
        sheet.paste(alpha_crop,(target_x,target_y),alpha_crop)
        draw.text((cell_x+10,cell_y+199),f"Canvas {width} x {height} | alpha {bounds[2]-bounds[0]} x {bounds[3]-bounds[1]}",font=font,fill=(30,45,55))
        draw.text((cell_x+10,cell_y+217),"Foundation/contact: UNQUALIFIED",font=font,fill=(150,42,42))

sheet_path=out/"canonical-sprite-evidence-sheet.png"
sheet.save(sheet_path)
status={
    "schema":"HC.OLDTOWN.FOUNDATION.SOURCE_DIAGNOSTICS.V1",
    "totalOriginalSprites":len(entries),
    "pngSha256MatchingRegistry":sum(bool(x["sha256"]) for x in entries),
    "lotCentreBottomAnchors":sum(x["registeredAnchorIsLotCentreBottom"] for x in entries),
    "registeredAtRightLotBoundary":sum(x["registeredAnchorAtRightLotBoundaryX"] for x in entries),
    "measuredFoundationPolygons":0,
    "rightEdgeGroundContactsQualified":0,
    "independentSurveyApproved":False,
    "oldTownSourceCoordinateAuthority":site.get("coordinateAuthority"),
    "geographyIssuanceAuthorized":geo.get("issuanceAuthorized"),
    "oldTownRendererProductionReady":False,
    "reason":"No measured sprite-local architectural foundation polygons or owner-approved right-edge contact anchors; parcel geometry still provisional. Alpha extent is not a foundation.",
    "entries":entries,
    "visualization":sheet_path.name
}
(out/"foundation-evidence.json").write_text(json.dumps(status,indent=2)+"\n")
assert status["pngSha256MatchingRegistry"]==20
assert status["lotCentreBottomAnchors"]==20
assert status["registeredAtRightLotBoundary"]==0
assert status["measuredFoundationPolygons"]==0
assert status["oldTownSourceCoordinateAuthority"]=="PROVISIONAL_LOCAL_PHASE_C"
assert status["geographyIssuanceAuthorized"] is False
print("CANONICAL PNG SHA256: PASS 20/20; measured alpha evidence: 20/20")
print("ANCHOR DIAGNOSTIC: 20/20 provisional site-centre-bottom, 0/20 registered right boundary")
print("RELEASE GATE: BLOCKED — no independently certified foundation polygons/contact, no approved survey")
print("Visual diagnostic:",sheet_path)
