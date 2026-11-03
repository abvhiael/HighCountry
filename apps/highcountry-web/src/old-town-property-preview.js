// Public visual preview only. Site and art identifiers are not a land-title entitlement.
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
