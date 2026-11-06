import { useEffect, useState } from 'react';
type Result={sourceId:string;title:string;page:number;method:string;excerpt:string};
type Response={connected:boolean;documents:number;pages:number;results:Result[]};
export function CorpusSearch({query}:{query:string}){
  const [data,setData]=useState<Response|null>(null);const [error,setError]=useState('');
  useEffect(()=>{const controller=new AbortController();setData(null);setError('');const timer=setTimeout(async()=>{try{const res=await fetch(`/api/corpus?q=${encodeURIComponent(query)}`,{signal:controller.signal});if(!res.ok)throw new Error();setData(await res.json());}catch{if(!controller.signal.aborted)setError('资料检索暂时不可用。');}},250);return()=>{clearTimeout(timer);controller.abort();};},[query]);
  return <div className="v2-corpus" aria-live="polite">{error?<p>{error}</p>:!data?<p>正在读取本地资料…</p>:!data.connected?<p>本地资料未连接，请先建立索引。</p>:<details open={query.trim()?true:undefined}><summary>本地资料 · {data.documents} 份 / {data.pages} 页</summary><p>来自你的自驾资料。内容可能过时，需核实后安排。</p>{!query.trim()?<p>输入地点或关键词，查找对应资料与页码。</p>:data.results.length?data.results.map(r=><article key={`${r.sourceId}-${r.page}`}><h3>{r.title} · 第 {r.page} 页</h3><p>{r.excerpt}</p><p>{r.sourceId} · {r.method==='ocr'?'图像识别，文字待核对':'提取文字，事实待核实'}</p></article>):<p>没有找到匹配页，可尝试更具体的地名。</p>}</details>}</div>;
}
