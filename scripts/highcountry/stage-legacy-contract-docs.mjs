import {mkdir,readFile,stat,writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
const PRS=[796,790,789,786,781,778,777,627,626,625,624,623,622,619,618,617,615,613,612,611,610];
const run=(cmd,args)=>execFileSync(cmd,args,{encoding:'utf8',maxBuffer:32*1024*1024}).trim();
run('git',['checkout','-B','migration/highcountry-contract-source-20261122']);
run('git',['clone','--depth','1','--filter=blob:none','--no-checkout','https://github.com/abvhiael/420-integrated-v0.1.git','/tmp/hc-source-docs']);
const report={type:'Historical source PR documentation',authority:'Genesis owns shared SDKs/protocols; HighCountry owns game docs',mode:'preserve absent docs verbatim; never overwrite current canonical docs',records:[]};
const headers={accept:'application/vnd.github+json','user-agent':'highcountry-migration'};if(process.env.GITHUB_TOKEN)headers.authorization='Bearer '+process.env.GITHUB_TOKEN;
for(const pr of PRS){
 const response=await fetch('https://api.github.com/repos/abvhiael/420-integrated-v0.1/pulls/'+pr+'/files?per_page=100',{headers});
 if(!response.ok)throw Error('PR '+pr+' inventory HTTP '+response.status);
 const fs=await response.json();
 const missing=[];
 for(const f of fs){if(f.status==='removed'||!f.filename.startsWith('docs/highcountry/')||!f.filename.endsWith('.md'))continue;try{await stat(f.filename);}catch{missing.push(f);}}
 if(!missing.length)continue;
 run('git',['-C','/tmp/hc-source-docs','fetch','--depth','1','--filter=blob:none','origin','refs/pull/'+pr+'/head']);
 for(const f of missing){
  const content=execFileSync('git',['-C','/tmp/hc-source-docs','show','FETCH_HEAD:'+f.filename],{maxBuffer:4*1024*1024});
  if(content.length>1024*1024)throw Error('unexpected oversized docs: '+f.filename);
  await mkdir(dirname(f.filename),{recursive:true});await writeFile(f.filename,content,{flag:'wx'});
  report.records.push({sourcePr:pr,path:f.filename,sourceBlobSha:run('git',['hash-object',f.filename])});
 }
}
await mkdir('docs/migration',{recursive:true});
await writeFile('docs/migration/highcountry-contract-source-docs.json',JSON.stringify(report,null,2)+'\n');
console.log('Preserved',report.records.length,'previously missing game-owned documents across',PRS.length,'source PRs');
run('git',['add','docs/highcountry','docs/migration/highcountry-contract-source-docs.json']);
run('git',['-c','user.name=github-actions[bot]','-c','user.email=41898282+github-actions[bot]@users.noreply.github.com','commit','-m','Preserve unmerged game-owned R04/HC-NEXT contract qualification documents']);
run('git',['push','origin','HEAD:migration/highcountry-contract-source-20261122']);
