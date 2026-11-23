import {readdir,readFile,stat} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
const roots=['contracts/src/highcountry','contracts/test/highcountry'];
const files=[];
async function visit(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())await visit(p);else if(e.isFile()&&p.endsWith('.sol'))files.push(p);}}
for(const root of roots)await visit(root);
const missing=new Map(),external=new Map();let totalImports=0;
for(const file of files){
 const text=await readFile(file,'utf8');const re=/\bimport\s*(?:[^;]*?\bfrom\s*)?["']([^"']+)["']\s*;/g;let m;
 while((m=re.exec(text))){totalImports++;const spec=m[1];if(!spec.startsWith('.')){const a=external.get(spec)||[];a.push(file);external.set(spec,a);continue;}
 const target=resolve(dirname(file),spec);try{if(!(await stat(target)).isFile())throw Error('not a file');}
 catch{const key=relative('.',target);const a=missing.get(key)||[];a.push(file);missing.set(key,a);}
 }
}
console.log('HighCountry Solidity files:',files.length,'imports:',totalImports,'external specs:',external.size,'missing relative paths:',missing.size);
for(const [path,users] of missing)console.log('UNRESOLVED',path,'required by',users.slice(0,5).join(', '));
for(const [spec,users] of external)console.log('EXTERNAL',spec,'required by',users.slice(0,3).join(', '));
if(missing.size)process.exitCode=1;
