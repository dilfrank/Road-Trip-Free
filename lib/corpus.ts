import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
type Corpus={indexedAt:string;documents:{id:string;title:string;path:string;pages:{page:number;text:string;method:string}[]}[]};
let cached:Corpus|null=null;let stamp=0;
async function readCorpus(){
  const filename=path.join(process.cwd(),'.local','corpus-index.json');
  const info=await stat(filename);if(!cached||info.mtimeMs!==stamp){cached=JSON.parse(await readFile(filename,'utf8'));stamp=info.mtimeMs;}return cached!;
}
export function searchPages(index:Corpus,query:string){
  const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean).slice(0,8);
  if(!terms.length)return [];
  return index.documents.flatMap(doc=>doc.pages.flatMap(page=>{
    const text=page.text.toLowerCase();const title=doc.title.toLowerCase();
    if(!terms.every(term=>text.includes(term)||title.includes(term)))return [];
    const hits=terms.filter(term=>text.includes(term));const position=hits.length?Math.min(...hits.map(term=>text.indexOf(term))):0;
    return [{sourceId:doc.id,title:doc.title,page:page.page,method:page.method,excerpt:page.text.slice(Math.max(0,position-45),Math.max(0,position-45)+220),score:hits.length+terms.filter(term=>title.includes(term)).length*3}];
  })).sort((a,b)=>b.score-a.score||a.sourceId.localeCompare(b.sourceId)||a.page-b.page).slice(0,8);
}
export async function searchCorpus(query:string){
  try{const index=await readCorpus();return {connected:true,documents:index.documents.length,pages:index.documents.reduce((n,d)=>n+d.pages.length,0),indexedAt:index.indexedAt,results:searchPages(index,query)};}
  catch{return {connected:false,documents:0,pages:0,indexedAt:null,results:[]};}
}
