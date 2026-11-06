"use client";
import { useRef, useState } from 'react';
import { chinaPlaces } from '../data/chinaPlaces';
import { emptyTrip, exportPlan, findCandidates, restoreTrip, validateTrip } from '../lib/planner';
import type { Intent, Plan, Place, TripInput } from '../lib/planner';
import { IntentModule, KnowledgeModule, SelectionModule, FeasibilityModule, ResultsModule } from '../components/PlannerModules';
const storageKey='road-trip-free:v2:china-draft';
export default function Home() {
  const [trip,setTrip]=useState<TripInput>(emptyTrip);
  const [intent,setIntent]=useState<Intent|null>(null);
  const [selected,setSelected]=useState<string[]>([]);
  const [query,setQuery]=useState('');
  const [plan,setPlan]=useState<Plan|null>(null);
  const [notice,setNotice]=useState('');
  const [candidates,setCandidates]=useState<Place[]>([]);
  const version=useRef(0);
  const pending=useRef(false);
  async function call(action:string,extra:object={}){const res=await fetch('/api/trip',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,trip,...extra})});const data=await res.json();if(!res.ok)throw new Error(data.error||'暂时无法完成，请重试。');return data;}
  async function confirm(){if(pending.current)return;const v=version.current;pending.current=true;try{const data=await call('places',{confirmed:true});if(v!==version.current)return;setCandidates(data.places);setIntent(i=>i?{...i,confirmed:true}:null);setNotice('');}catch(e){if(v===version.current)setNotice(e instanceof Error?e.message:'加载失败');}finally{pending.current=false;}}
  async function build(){if(pending.current)return;const v=version.current;pending.current=true;setNotice('正在核对安排…');try{const data=await call('plan',{selected,confirmed:intent?.confirmed});if(v===version.current){setPlan(data.plan);setNotice('');}}catch(e){if(v===version.current)setNotice(e instanceof Error?e.message:'安排失败');}finally{pending.current=false;}}
  const selection=useRef<HTMLDivElement>(null);
  function change(next:TripInput){version.current++;setTrip(next);setIntent(null);setSelected([]);setPlan(null);setNotice('');}
  async function submit(){if(pending.current)return;const errors=validateTrip(trip);if(errors.length){setNotice(errors[0]);return;}const v=++version.current;pending.current=true;setIntent(null);setSelected([]);setPlan(null);setNotice('正在理解你的想法…');try{const data=await call('intent');if(v!==version.current)return;setIntent(data.intent);setNotice(data.intent.mode==='explicit_only'?'智能理解尚未配置，目前仅保留你的原话与手动选择。':'');}catch(e){if(v===version.current)setNotice(e instanceof Error?e.message:'解析失败');}finally{pending.current=false;}}
  function toggle(id:string){version.current++;setSelected(ids=>ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]);setPlan(null);setNotice('');}
  function restore(){try{const raw=localStorage.getItem(storageKey);const restored=raw?restoreTrip(JSON.parse(raw)):null;if(!restored){setNotice('没有可恢复的有效草稿。');return;}change(restored);setNotice('已恢复出行条件，请重新确认想法和地点。');}catch{setNotice('无法读取本机草稿。');}}
  async function copy(){if(!plan)return;try{await navigator.clipboard.writeText(exportPlan(trip,plan,chinaPlaces.filter(p=>selected.includes(p.id))));setNotice('已复制，包含待核实事项。');}catch{setNotice('复制失败，请允许剪贴板访问后重试。');}}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(trip));setNotice('出行条件已保存到本机。');}catch{setNotice('浏览器无法保存草稿。');}}
  return <main className="v2-app">
    <header className="v2-header"><a href="/" className="v2-brand">自驾自由</a></header>
    <div className="v2-intro"><h1>度假者的<span>随心选择</span></h1></div>
    <div className="v2-layout"><IntentModule trip={trip} change={change} intent={intent} submit={submit} restore={restore} confirm={confirm}/></div>
    {notice&&<div className="v2-notice" role="status" aria-live="polite">{notice}</div>}
    {intent?.confirmed&&<div className="v2-right" ref={selection}><KnowledgeModule query={query} change={setQuery}/><SelectionModule places={findCandidates(candidates,intent,query)} selected={selected} toggle={toggle} build={build}/></div>}
    {plan&&<div className="v2-output"><FeasibilityModule plan={plan}/><ResultsModule plan={plan} copy={copy} save={save} adjust={()=>{setPlan(null);selection.current?.scrollIntoView({behavior:'smooth'});}}/></div>}
  </main>;
}
