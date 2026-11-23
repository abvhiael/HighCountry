import {readdir,stat,mkdir,copyFile,readFile} from 'node:fs/promises';
import {join,resolve,relative} from 'node:path';
import {execFileSync} from 'node:child_process';
const expected='f5072ae8d343aca4731e02b774c41394b4228d69';
const external=resolve(process.argv[2]||'_genesis');
const head=execFileSync('git',['-C',external,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(head!==expected)throw Error('Genesis shared contract dependency pin mismatch '+head);
const from=join(external,'contracts'),to=resolve('contracts');
let copied=0,kept=0;
async function sync(relativePath){
  const src=join(from,relativePath),dst=join(to,relativePath);
  for(const e of await readdir(src,{withFileTypes:true})){
    const part=join(relativePath,e.name);if(part==='src/highcountry'||part==='test/highcountry')continue;
    const source=join(src,e.name),destination=join(dst,e.name);
    if(e.isDirectory()){await mkdir(destination,{recursive:true});await sync(part);}
    else if(e.isFile()){try{await stat(destination);kept++;}catch{await copyFile(source,destination);copied++;}}
  }
}
await sync('src');await sync('test/helpers');
console.log('Pinned Genesis shared dependencies hydrated at build time only:',head,'copied:',copied,'existing:',kept);
