import {writeFile} from 'node:fs/promises';
const repo=process.env.GITHUB_REPOSITORY,token=process.env.GH_TOKEN;
if(repo!=='abvhiael/HighCountry'||!token)throw Error('wrong repository or missing scoped token');
const headers={authorization:'Bearer '+token,accept:'application/vnd.github+json','x-github-api-version':'2022-11-28'};
const root='https://api.github.com/repos/'+repo;
async function get(path){const r=await fetch(root+path,{headers});if(r.status===404)return null;if(!r.ok)throw Error(path+' HTTP '+r.status);return await r.json();}
const open=[],records=[];
for(let page=1;page<20;page++){const list=await get('/pulls?state=open&per_page=100&page='+page);open.push(...list);if(list.length<100)break;}
for(const n of [5,6]){
 const p=await get('/pulls/'+n),item={pr:n,ref:p?.head?.ref,expected:p?.head?.sha,status:'skipped',reason:''};records.push(item);
 if(!p||!p.merged_at||p.state!=='closed'||p.head?.repo?.full_name!==repo){item.reason='not safely merged in same repo';continue;}
 if(open.some(other=>other.head?.repo?.full_name===repo&&other.head?.ref===item.ref)){item.reason='branch used by open PR';continue;}
 if(['main','master'].includes(item.ref)){item.reason='default branch';continue;}
 const branch=await get('/branches/'+encodeURIComponent(item.ref));if(!branch){item.status='already absent';continue;}
 if(branch.protected||branch.commit?.sha!==item.expected){item.reason='protected or SHA changed';continue;}
 const del=await fetch(root+'/git/refs/heads/'+encodeURIComponent(item.ref),{method:'DELETE',headers});
 if(del.status!==204)throw Error('deletion rejected '+n+': '+del.status);
 if(await get('/git/ref/heads/'+encodeURIComponent(item.ref)))throw Error('deletion not verified '+item.ref);
 item.status='deleted';item.reason='independently confirmed absent';
}
await writeFile('highcountry-merged-migration-branches.json',JSON.stringify(records,null,2)+'\n');
console.log(JSON.stringify(records,null,2));
