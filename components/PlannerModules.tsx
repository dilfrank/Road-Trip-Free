import type { ParsedIntent, CheckedPlan } from '../lib/services';
import { intentCategories } from '../lib/intentCategories';
import { previewTopics } from '../lib/topicPreview';
import { CorpusSearch } from './CorpusSearch';
import { useState } from 'react';
import { validateTrip } from '../lib/planner';
import type { Intent, Plan, Place, Preference, TripInput } from '../lib/planner';
export function IntentModule({trip,change,intent,confirm,submit,busy=false}:{trip:TripInput;change:(t:TripInput)=>void;intent:Intent|null;confirm:()=>void;submit:()=>void;busy?:boolean}) {
  const [planOpen,setPlanOpen]=useState(false);
  const topics=previewTopics(trip.thought);
  const field=(key:keyof TripInput,value:string|number)=>change({...trip,[key]:value});
  return <section className="v2-panel intent-panel" aria-label="度假对话"><form noValidate onSubmit={e=>{e.preventDefault();if(validateTrip(trip).length)setPlanOpen(true);submit();}}>
    <div className="v2-composer"><label className="v2-thought-label" htmlFor="vacation-thought">你的想法</label><textarea id="vacation-thought" aria-label="你的想法" value={trip.thought} onChange={e=>field('thought',e.target.value)} maxLength={2000}/>
    <div className="v2-topic-grid" role="list" aria-label="自动主题归类">{topics.map(topic=><span role="listitem" key={topic.key} className={'v2-topic-tile'+(topic.evidence.length?' is-active':'')} title={topic.evidence.length?topic.evidence.join('；'):'尚未提及'} aria-label={topic.label+(topic.evidence.length?'：涉及此主题，原话：'+topic.evidence.join('；'):'：尚未提及')}>{topic.label}</span>)}</div>
    <div className="v2-composer-actions"><button className="v2-plan-trigger" type="button" aria-expanded={planOpen} aria-controls="vacation-plan" onClick={()=>setPlanOpen(!planOpen)}>条件 <span aria-hidden="true">{planOpen?'−':'+'}</span></button><button className="v2-primary" type="submit" disabled={busy||!trip.thought.trim()}>{busy?'生成中…':'方案'}</button></div></div>
    {planOpen&&<div id="vacation-plan" className="v2-plan-fields"><div className="v2-fields"><label>出发<input required value={trip.origin} onChange={e=>field('origin',e.target.value)} placeholder="城市或地点" maxLength={100}/></label><label>时间<input required type="date" value={trip.date} onChange={e=>field('date',e.target.value)}/></label><label>天数<input required type="number" min="1" max="30" value={trip.days||''} onChange={e=>field('days',Number(e.target.value))}/></label><label>开车时间<input required type="number" min="0.5" max="24" step="0.5" value={trip.maxDrive||''} onChange={e=>field('maxDrive',Number(e.target.value))}/></label></div>
    <details><summary>备注</summary><div className="v2-chips" aria-label="体验偏好">{(['休息','自然','文化','挑战'] as Preference[]).map(p=><button type="button" key={p} aria-pressed={trip.preferences.includes(p)} onClick={()=>change({...trip,preferences:trip.preferences.includes(p)?trip.preferences.filter(x=>x!==p):[...trip.preferences,p]})}>{p}</button>)}</div><div className="v2-fields"><label>目的地<input value={trip.end} onChange={e=>field('end',e.target.value)} placeholder="默认回到出发地" maxLength={100}/></label><label>总预算 · 元<input type="number" min="1" value={trip.budget} onChange={e=>field('budget',e.target.value)} placeholder="整团预算"/></label></div><label>要求<textarea value={trip.needs} onChange={e=>field('needs',e.target.value)} placeholder="写下你在意的事" maxLength={1000}/></label></details></div>}
    </form>{intent&&<div className="v2-reflection"><h2>确认你的度假需求</h2>{!(intent as ParsedIntent).observations?.length&&<section className="v2-intent-group"><h3>尚未归类的想法</h3><p className="v2-original">{intent.original}</p></section>}{intentCategories.map(category=>{const observations=(intent as ParsedIntent).observations?.filter(o=>o.category===category.key)??[];return observations.length?<section className="v2-intent-group" key={category.key}><h3>{category.label}</h3>{observations.map((o,i)=><div key={i}><p>{o.value}{o.source==='system_inferred'?'（请确认是否准确）':''}</p>{o.value!==o.evidence&&<blockquote>“{o.evidence}”</blockquote>}</div>)}</section>:null;})}<details><summary>查看完整原话</summary><p className="v2-original">{intent.original||'尚未填写'}</p>{intent.needs&&<p>{intent.needs}</p>}</details>{!!intent.preferences.length&&<p>体验偏好：{intent.preferences.join(' · ')}</p>}<button className="v2-primary" disabled={intent.confirmed} onClick={()=>{if(validateTrip(trip).length)setPlanOpen(true);confirm();}}>{intent.confirmed?'已确认':'确认需求，选择地点'}</button></div>}</section>;

}
export function KnowledgeModule({query,change}:{query:string;change:(q:string)=>void}) {
  return <section className="v2-knowledge"><h2>随心选一处</h2><input aria-label="搜索资料候选" type="search" value={query} onChange={e=>change(e.target.value)} placeholder="搜索地点或资料关键词"/><CorpusSearch query={query}/></section>;
}
export function SelectionModule({places,selected,toggle,build}:{places:Place[];selected:string[];toggle:(id:string)=>void;build:()=>void}) {
  return <section aria-label="选择地点"><div className="v2-candidates">{places.map(p=><article key={p.id} className={selected.includes(p.id)?'v2-place is-selected':'v2-place'}><label className="v2-pick"><input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggle(p.id)}/><strong>{p.name}</strong></label><details><summary>了解这里</summary><p>{p.opportunity}</p><p>{p.burden}</p><p>资料待核实：{p.evidence.sourceId} · {p.evidence.title} · 第 {p.evidence.page} 页</p></details></article>)}</div>{!places.length&&<p>暂时没有匹配的地方。</p>}<div className="v2-action"><span>已选 {selected.length} 处</span><button className="v2-primary" disabled={!selected.length} onClick={build}>看看安排</button></div></section>;
}
export function FeasibilityModule({plan}:{plan:Plan}) {
  return <section className="v2-check"><h2>{plan.status==='provisional'?'还需要核对':plan.status==='infeasible'?'需要调整安排':'还缺一些信息'}</h2><ul>{plan.issues.map(i=><li key={i}>{i}</li>)}</ul>{plan.status==='provisional'&&<p>以下为待核实草案；入口、接驳、停留时间和当期通行条件仍需确认。</p>}</section>;
}
export function ResultsModule({plan,copy,save,adjust}:{plan:Plan;copy:()=>void;save:()=>void;adjust:()=>void}) {
  if(!plan.days.length)return null;
  return <section className="v2-panel"><div className="v2-result-head"><h2>你的度假草案</h2><span>待核实</span></div><p>{plan.summary}</p>{(plan as CheckedPlan).explanation?.map(s=><p key={s}>{s}</p>)}<ol className="v2-days">{plan.days.map(d=><li key={d.day}><span>第 {d.day} 天</span><h3>{d.stops.join(' → ')}</h3><p>{d.note}</p></li>)}</ol><div className="v2-actions"><button onClick={adjust}>调整</button><button onClick={copy}>复制</button><button onClick={save}>保存到本机</button></div></section>;
}
