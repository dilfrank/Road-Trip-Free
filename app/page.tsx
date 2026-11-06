"use client";
import { useRef, useState } from 'react';
import { emptyTrip, restoreTrip, validateTrip } from '../lib/planner';
import type { TripInput } from '../lib/planner';
import type { Comparison } from '../lib/alternatives';
import { IntentModule } from '../components/PlannerModules';
import { ComparisonTable } from '../components/ComparisonTable';
import { CorpusSearch } from '../components/CorpusSearch';
export default function Home(){
 const [trip,setTrip]=useState<TripInput>(emptyTrip);
 const [comparison,setComparison]=useState<Comparison|null>(null);
 const [notice,setNotice]=useState('');const [busy,setBusy]=useState(false);
 const [query,setQuery]=useState('');const version=useRef(0);const pending=useRef(false);
 function change(next:TripInput){version.current++;setTrip(next);setComparison(null);setNotice('');}
 async function submit(){
  if(pending.current)return;
  const errors=validateTrip(trip);if(!trip.thought.trim())errors.unshift('请写下这次度假的想法。');
  if(errors.length){setNotice(errors[0]);return;}
  const v=++version.current;pending.current=true;setBusy(true);setComparison(null);setNotice('');
  try{const response=await fetch('/api/trip',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'compare',trip})});const data=await response.json();if(!response.ok)throw new Error(data.error||'暂时无法生成方案，请重试。');if(v===version.current)setComparison(data.comparison);}
  catch(error){if(v===version.current)setNotice(error instanceof Error?error.message:'生成失败，请重试。');}
  finally{pending.current=false;setBusy(false);}
 }
 function restore(){try{const raw=localStorage.getItem('road-trip-free:v2:china-draft');const draft=raw?restoreTrip(JSON.parse(raw)):null;if(draft)change(draft);else setNotice('没有可恢复的有效草稿。');}catch{setNotice('无法读取本机草稿。');}}
 return <main className="v2-app"><header className="v2-header"><a href="/" className="v2-brand">自驾自由</a></header><div className="v2-intro"><h1>度假者的<span>随心选择</span></h1></div><div className="v2-layout"><IntentModule trip={trip} change={change} intent={null} submit={submit} restore={restore} confirm={()=>{}} busy={busy}/></div>{notice&&<div className="v2-notice" role="status">{notice}</div>}{busy&&<p className="v2-notice" role="status">正在整理需求并核对三套安排…</p>}{comparison&&<><ComparisonTable comparison={comparison}/><details className="v2-local-library"><summary>查阅本地资料</summary><input aria-label="搜索本地资料" value={query} onChange={e=>setQuery(e.target.value)} placeholder="输入地点或关键词"/><CorpusSearch query={query}/></details></>}</main>;
}
