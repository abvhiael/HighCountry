import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {regionalMemorabiliaCatalogue as assets,canPlaceRegionalMemorabilia as canPlace} from '../src/regional-memorabilia-catalogue.js';
test('HC-ART-03-F canonical PNG identities and fail-closed anchor requirements',()=>{
 assert.equal(assets.length,12);
 assert.equal(new Set(assets.map(x=>x.id)).size,12);
 for(const region of ['emerald','prairie','mesa'])
  assert.equal(assets.filter(x=>x.originRegion===region).length,4);
 for(const x of assets){
  assert.equal(existsSync(new URL('../public'+x.assetUrl,import.meta.url)),true,x.assetUrl);
  assert.equal(x.footprint.tileSizePx,64);
  assert.equal(x.marketplace.currency,'BUDS');
  assert.equal(x.marketplace.price,null);
  assert.equal(x.marketplace.inventoryPolicy,'authenticated-server-owned');
  assert.equal(canPlace({id:x.id,owned:true}),false,'anchor missing');
  const anchor=x.placement.layer==='wall_decor'
   ?{hasWallAnchor:true,wallOccupied:false}
   :{hasSurfaceAnchor:true,surfaceOccupied:false};
  assert.equal(canPlace({id:x.id,owned:true,...anchor}),true,'advisory eligibility only');
  assert.equal(canPlace({id:x.id,owned:false,...anchor}),false,'unowned');
  const occupied=x.placement.layer==='wall_decor'?{wallOccupied:true}:{surfaceOccupied:true};
  assert.equal(canPlace({id:x.id,owned:true,...anchor,...occupied}),false,'slot occupied');
 }
});
