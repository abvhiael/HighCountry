import {mkdir,stat,writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
const PRS=[928,917,913,900,896,891,881,879,877,872,839,833,811,803,796];
const repo='https://github.com/abvhiael/420-integrated-v0.1.git';
const run=(cmd,args)=>execFileSync(cmd,args,{encoding:'utf8',maxBuffer:32*1024*1024}).trim();
run('git',['switch','-c','migration/highcountry-legacy-source-20261122']);
run('git',['clone','--depth','1','--filter=blob:none','--no-checkout',repo,'/tmp/hc-legacy-genesis']);
const eligible=p=>/^(apps\/highcountry-web\/(?:src|test|e2e|scripts)\/|services\/highcountry-economy\/(?:src|test)\/|docs\/highcountry\/|deployments\/highcountry\/|scripts\/highcountry\/)/.test(p)&&/\.(?:js|mjs|cjs|ts|json|md|txt|py|yaml|yml|geojson|toml)$/.test(p);
const token=process.env.GITHUB_TOKEN;
const report={sourceRepo:'abvhiael/420-integrated-v0.1',destination:'abvhiael/HighCountry',mode:'missing-only; existing files never overwritten',pullRequests:{},newFiles:[]};
for(const pr of PRS){
 const headers={'accept':'application/vnd.github+json','user-agent':'highcountry-migration'};
 if(token)headers.authorization='Bearer '+token;
 const resp=await fetch('https://api.github.com/repos/abvhiael/420-integrated-v0.1/pulls/'+pr+'/files?per_page=100',{headers});
 if(!resp.ok)throw Error('GitHub PR file inventory '+pr+': '+resp.status);
 const files=await resp.json();
 if(!Array.isArray(files))throw Error('Invalid PR files '+pr);
 const pending=[];
 for(const f of files){
  if(f.status==='removed'||!eligible(f.filename))continue;
  try{await stat(f.filename);}catch{pending.push(f);}
 }
 report.pullRequests[pr]={changedFiles:files.length,eligibleMissing:pending.map(x=>x.filename)};
 if(!pending.length)continue;
 run('git',['-C','/tmp/hc-legacy-genesis','fetch','--depth','1','--filter=blob:none','origin','refs/pull/'+pr+'/head']);
 for(const f of pending){
  const data=execFileSync('git',['-C','/tmp/hc-legacy-genesis','show','FETCH_HEAD:'+f.filename],{maxBuffer:32*1024*1024});
  if(data.length>1024*1024)throw Error('Review oversized authored file '+f.filename);
  await mkdir(dirname(f.filename),{recursive:true});
  await writeFile(f.filename,data,{flag:'wx'});
  report.newFiles.push({pr,path:f.filename,gitBlobSha:run('git',['hash-object',f.filename])});
 }
}
await mkdir('docs/migration',{recursive:true});
await writeFile('docs/migration/highcountry-legacy-missing-source-20261122.json',JSON.stringify(report,null,2)+'\n');
console.log('Missing game-owned files staged:',report.newFiles.length,'PRs inspected:',PRS.length);
for(const x of report.newFiles)console.log('STAGED',x.pr,x.path,x.gitBlobSha);
run('git',['add','apps/highcountry-web','services/highcountry-economy','docs/highcountry','deployments/highcountry','scripts/highcountry','docs/migration']);
const status=run('git',['status','--porcelain']);if(!status)throw Error('No new game-owned files found');
run('git',['-c','user.name=github-actions[bot]','-c','user.email=41898282+github-actions[bot]@users.noreply.github.com','commit','-m','Preserve unmerged HighCountry-owned source missing from standalone main']);
run('git',['push','-u','origin','HEAD']);
