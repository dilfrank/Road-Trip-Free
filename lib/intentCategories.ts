export const intentCategories = [
  {key:'feeling',label:'现在的感受',example:'最近有点累，想换个环境',stage:'current'},
  {key:'experience',label:'期待的体验',example:'在自然里放松，慢慢散步',stage:'anticipated'},
  {key:'concern',label:'在意与顾虑',example:'不赶路，不安排高强度活动',stage:'anticipated'},
  {key:'relationship',label:'同行与关系',example:'和家人一起，多一些相处时间',stage:'anticipated'},
  {key:'meaning',label:'这次的意义',example:'暂时放下工作，找回自己的节奏',stage:'anticipated'},
  {key:'memory',label:'过去的回忆',example:'上次沿途停留比打卡更让我开心',stage:'recalled'},
  {key:'community',label:'对当地的心意',example:'支持当地小店，尽量不打扰居民',stage:'anticipated'},
] as const;
export function categorizedLines(text:string){
  return text.split('\n').flatMap(line=>{
    const match=line.match(/^\s*([^：:]+)[：:]\s*(.+?)\s*$/);if(!match)return [];
    const category=intentCategories.find(c=>c.label===match[1].trim());
    return category?[{category:category.key,value:match[2],evidence:match[2],source:'user_explicit' as const,stage:category.stage,valence:'unknown' as const}]:[];
  });
}
