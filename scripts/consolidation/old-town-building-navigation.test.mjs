import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mountOldTownScene} from '../../apps/highcountry-web/src/old-town-scene.js';
const root=new URL('../../deployments/highcountry/',import.meta.url);
class MockElement {
 constructor(name){this.name=name;this.attrs=new Map();this.children=[];this.textContent='';this.className='';}
 setAttribute(key,value){this.attrs.set(key,String(value));}
 append(...nodes){this.children.push(...nodes);}
}
const document={
 createElement:name=>new MockElement(name),
 createElementNS:(_namespace,name)=>new MockElement(name)
};
function descendants(root,filter){
 const result=[];
 function visit(node){if(filter(node))result.push(node);for(const child of node.children||[])visit(child);}
 visit(root);return result;
}
test('OT-SCREEN-01/03 bridge: all twenty original sprites expose whole-building, keyboard accessible, read-only routes',async()=>{
 const main=new MockElement('main');
 const fetchImpl=async url=>{
  assert.match(url,/^\/assets\/highcountry\/maps\/old-town-/);
  const name=url.split('/').at(-1);
  return {ok:true,json:async()=>JSON.parse(readFileSync(new URL(name,root),'utf8'))};
 };
 const scene=await mountOldTownScene({document,main,fetchImpl});
 assert.ok(scene,'scene should render using registered provisional geometry');
 assert.equal(scene.buildings.length,20);
 const links=descendants(scene.svg,e=>e.name==='a');
 assert.equal(links.length,20,'one whole-building SVG link per Genesis sprite');
 const ids=new Set();
 for(const a of links){
  assert.equal(a.attrs.get('tabindex'),'0');
  assert.match(a.attrs.get('aria-label'),/^Open (?:HL|CR|WH|LM)-\d{2} building$/);
  assert.equal(descendants(a,e=>e.name==='image').length,1,'image itself must be linked');
  const href=a.attrs.get('href');
  const id=href.split('/').at(-1);
  assert.ok(!ids.has(id),'duplicate interactive building');
  ids.add(id);
  if(id.startsWith('LM-'))assert.match(href,/\/landmark\/LM-0[1-5]$/);
  else assert.match(href,/\/property\/(?:HL|CR|WH)-\d{2}$/);
 }
 assert.equal([...ids].filter(id=>id.startsWith('LM-')).length,5);
 assert.equal([...ids].filter(id=>!id.startsWith('LM-')).length,15);
 const status=descendants(main,e=>e.name==='p'&&e.attrs.get('role')==='status')[0];
 assert.match(status.textContent,/no title issuance authorization/);
});
