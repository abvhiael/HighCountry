import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname,relative,join} from 'node:path';
const test=process.argv[2];
if(!test||!/^test\/highcountry\/[a-zA-Z0-9_./-]+\.t\.sol$/.test(test)||test.includes('..'))throw Error('expected exact HighCountry test path');
const root=resolve('contracts'),out=resolve('/tmp/highcountry-focused-foundry');
const imported=new Set();
async function visit(path){
 const abs=resolve(root,path);
 if(!abs.startsWith(root+'/'))throw Error('import outside contracts root: '+path);
 const rel=relative(root,abs);
 if(imported.has(rel))return;
 const bytes=await readFile(abs);imported.add(rel);
 const text=bytes.toString('utf8');
 for(const m of text.matchAll(/\bimport\s*(?:[^;]*?\bfrom\s*)?["']([^"']+)["']\s*;/g)){
   const target=m[1];
   if(!target.startsWith('.'))throw Error('unresolved non-relative import: '+target+' in '+rel);
   await visit(relative(root,resolve(dirname(abs),target)));
 }
 const dst=join(out,rel);await mkdir(dirname(dst),{recursive:true});await writeFile(dst,bytes);
}
await visit(test);
await writeFile(join(out,'foundry.toml'),'[profile.default]\nsrc = "src"\ntest = "test"\nsolc_version = "0.8.24"\nevm_version = "cancun"\noptimizer = true\noptimizer_runs = 200\nvia_ir = true\nffi = false\nfuzz = { runs = 256, seed = "0x420" }\n');
console.log('Focused source/test dependency closure for',test,'files:',imported.size);
