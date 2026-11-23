const repo=process.env.GITHUB_REPOSITORY;
const token=process.env.GH_TOKEN;
if(repo!=='abvhiael/HighCountry'||!token)throw Error('wrong repository or missing token');
const base='https://api.github.com/repos/'+repo;
const headers={authorization:'Bearer '+token,accept:'application/vnd.github+json','x-github-api-version':'2022-11-28'};
const names=new Set(['HighCountry standalone pinned contract dependency qualification','HighCountry focused standalone Solidity qualification','HighCountry complete migrated Solidity test matrix']);
const pending=[];
for(const status of ['queued','in_progress']){
 for(let page=1;page<=3;page++){
  const resp=await fetch(base+'/actions/runs?status='+status+'&per_page=100&page='+page,{headers});
  if(!resp.ok)throw Error('list runs '+status+' '+resp.status);
  const json=await resp.json();
  pending.push(...json.workflow_runs.filter(x=>names.has(x.name)&&x.head_branch==='migration/highcountry-contract-source-20261122'));
  if(json.workflow_runs.length<100)break;
 }
}
const byName=new Map();
for(const run of pending){
 const previous=byName.get(run.name);
 if(!previous||new Date(run.created_at)>new Date(previous.created_at))byName.set(run.name,run);
}
for(const run of pending){
 const keep=byName.get(run.name);
 if(run.id===keep.id){console.log('KEEP',run.name,run.id,run.head_sha);continue;}
 const resp=await fetch(base+'/actions/runs/'+run.id+'/cancel',{method:'POST',headers});
 console.log('CANCEL stale',run.name,run.id,resp.status);
 if(resp.status!==202&&resp.status!==409)throw Error('failed to cancel stale '+run.id+': '+resp.status);
}
