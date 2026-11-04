import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,dirname,extname} from 'node:path';

const repo=resolve(import.meta.dirname,'../..');
const entrypoints=[
 'apps/highcountry-web/src/app.js',
 'apps/highcountry-web/src/port-alder-navigation.js',
 'apps/highcountry-web/src/old-town-scene.js',
 'apps/highcountry-web/scripts/build.mjs',
 'apps/highcountry-web/server.mjs',
 'services/highcountry-economy/src/start-runtime.js',
 'services/highcountry-economy/src/placement-transactions.js',
 'services/highcountry-economy/src/placement-canonical-rectangles.js',
 'services/highcountry-economy/src/heritage-tool-shed-placement.js',
 'services/highcountry-archive/src/scoped-a06.mjs',
 'scripts/highcountry/hc-world-02-cadastre.mjs',
 'scripts/highcountry/hc-world-02-full-survey.mjs',
 'scripts/highcountry/hc-world-02-survey-custody.mjs',
 'tools/tiled/old-town/build-canonical-preview.mjs'
];
const sourcePatterns=[
 /\bfrom\s*['"]((?:\.\.?\/)[^'"]+)['"]/g,
 /\bimport\s*['"]((?:\.\.?\/)[^'"]+)['"]/g,
 /\bimport\s*\(\s*['"]((?:\.\.?\/)[^'"]+)['"]\s*\)/g,
 /\brequire\s*\(\s*['"]((?:\.\.?\/)[^'"]+)['"]\s*\)/g
];
const seen=new Set();
function resolveModule(path){
 if(existsSync(path)&&statSync(path).isFile())return path;
 for(const suffix of ['.js','.mjs','.cjs','.json','/index.js']){
  if(existsSync(path+suffix)&&statSync(path+suffix).isFile())return path+suffix;
 }
 return null;
}
function walk(file,missing){
 if(seen.has(file))return;
 seen.add(file);
 const source=readFileSync(file,'utf8');
 const paths=new Set();
 for(const pattern of sourcePatterns)for(const m of source.matchAll(pattern))paths.add(m[1]);
 for(const relative of paths){
  const target=resolveModule(resolve(dirname(file),relative));
  if(!target){missing.push({from:file.slice(repo.length+1),import:relative});continue}
  if(/\.(?:m?js|cjs)$/.test(target))walk(target,missing);
 }
}
test('consolidated browser, cadastral, economy and Tiled entrypoints resolve every relative module',()=>{
 const missing=[];
 for(const path of entrypoints)walk(resolve(repo,path),missing);
 assert.deepEqual(missing,[],'Missing local source modules');
 assert.ok(seen.size>=35,'Expected a real, multi-module integrated graph');
 console.log('Qualified local-import dependency graph:',seen.size,'files');
});
