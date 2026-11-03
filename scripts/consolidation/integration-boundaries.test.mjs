import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {resolveRoute} from '../../apps/highcountry-web/src/app.js';
import {projectTile,chunkOf,validateOldTownScene} from '../../apps/highcountry-web/src/old-town-scene.js';
import {selectPortAlderArtwork} from '../../apps/highcountry-web/src/port-alder-map-stage.js';
import {canonicalPortAlderMilestone} from '../../services/highcountry-economy/src/port-alder-purchase-milestone.js';
const data=n=>JSON.parse(readFileSync(new URL('../../deployments/highcountry/'+n,import.meta.url),'utf8'));
const scene={sites:data('old-town-site-registry.json'),assets:data('old-town-genesis-assets.json'),geo:data('old-town-geo-authority-status.json'),geometry:data('old-town-provisional-geometry.geojson'),anchors:data('old-town-render-anchors.v1.json')};
test('combined region, Old Town and landmark route registration is read-only',()=>{
 assert.equal(resolveRoute('/emerald-coast'),'/emerald-coast');
 assert.equal(resolveRoute('/port-alder/district/HC-EC-S01-D07'),'/port-alder');
 assert.equal(resolveRoute('/port-alder/district/HC-EC-S01-D07/landmark/LM-04'),'/port-alder');
 assert.equal(resolveRoute('/port-alder/district/HC-EC-S01-D07/property/CR-04'),'/port-alder');
 const fs=readFileSync(new URL('../../apps/highcountry-web/src/old-town-scene.js',import.meta.url),'utf8');
 assert.match(fs,/wholeBuilding\.append\(image,label\)/);
 assert.match(fs,/aria-label':'Open '/);
});
test('20 Genesis sites, six Crossroads, B22 and locked no-issuance geometry survive combined import',()=>{
 const models=validateOldTownScene(scene);
 assert.equal(models.length,20);
 assert.equal(models.filter(x=>x.id.startsWith('CR-')).length,6);
 assert.equal(scene.sites.sites.filter(x=>x.status==='vacant').length,39);
 assert.equal(scene.sites.sites.filter(x=>x.status==='permanent_public').length,5);
 assert.equal(scene.sites.park.saleable,false);
 assert.equal(scene.sites.coordinateAuthority,'PROVISIONAL_LOCAL_PHASE_C');
 assert.equal(projectTile(4,4)[0],0);
 assert.deepEqual(chunkOf(16,16),[1,1]);
 assert.equal(scene.geo.issuanceAuthorized,false);
});
test('milestone selection fails closed for unauthenticated purchases and reserved title evidence',async()=>{
 const catalog=data('hc-world-map-catalogue.v1.json');
 assert.equal(selectPortAlderArtwork(catalog,null).stage,'GENESIS');
 await assert.rejects(canonicalPortAlderMilestone({
  identity:{registeredPrincipal:async()=>null},
  reader:{finalizedPortAlderTitles:async()=>({})},
  session:'unregistered'
 }),/unauthenticated/);
});
test('full canonical artwork is retained; neither review items nor Tiled metadata grants placement',async()=>{
 const root=new URL('../../apps/highcountry-web/public/assets/structures/',import.meta.url);
 const groups=[18,18,18,52,43,48];
 for(let i=0;i<6;i++){
  const family='hc-art-05-'+String.fromCharCode(97+i);
  let n=0;
  const walk=p=>{for(const e of readdirSync(p,{withFileTypes:true})){const path=p+'/'+e.name;if(e.isDirectory())walk(path);else if(e.name.endsWith('.png'))n++}};
  walk(new URL(family+'/',root).pathname);
  assert.equal(n,groups[i],family);
 }
 const {redMesaHeritageReviewCatalogue,canPlayerPlaceRedMesaHeritage}=await import('../../apps/highcountry-web/src/red-mesa-heritage-review-catalogue.js');
 assert.equal(redMesaHeritageReviewCatalogue.length,12);
 assert.equal(canPlayerPlaceRedMesaHeritage(),false);
 const tmj=JSON.parse(readFileSync(new URL('../../tools/tiled/old-town/port-alder-old-town-review.tmj',import.meta.url)));
 assert.equal(tmj.properties.find(x=>x.name==='authoritativeForOwnership')?.value,false);
 assert.equal(tmj.layers.find(x=>x.name==='Parcel boundaries').objects.length,60);
});
