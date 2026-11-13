import { AmapRoutes } from './AmapRoutes';
import { useState } from 'react';
import type { Comparison } from '../lib/alternatives';
import { comparisonRows as rows } from '../lib/comparisonRows';
const colors=['#ed754e','#4d8b83','#8072af'];
export function ComparisonTable({comparison}:{comparison:Comparison}){
 const [selected,setSelected]=useState(0);const active=comparison.alternatives[selected]??comparison.alternatives[0];
 if(!active)return null;
 const routes=['M100 230 C220 70 360 50 570 90','M100 230 C280 160 370 210 570 230','M100 230 C240 390 380 400 570 370'];
 return <section className="v2-comparison" aria-label="三套出行方案对比"><h2>选一条，慢慢走</h2><p>{comparison.basis}</p>
 <div className="route-scene"><div className="route-tabs" role="group" aria-label="切换路线">{comparison.alternatives.map((a,i)=><button key={a.id} aria-pressed={selected===i} onClick={()=>setSelected(i)} style={{borderColor:colors[i]}}>{a.destination}</button>)}</div>
 <AmapRoutes comparison={comparison} selected={selected}/>
 <div className="route-brief"><strong>{active.destination}</strong><span>{active.plan.status==='infeasible'?'需调整安排':'车程与通行待核实'}</span></div>
 <ol className="route-days">{active.plan.days.map(d=><li key={d.day}><span>第 {d.day} 天</span>{d.stops.join(' → ')}</li>)}</ol></div>
 <div className="v2-table-scroll" role="region" aria-label="方案对比表，可横向滚动" tabIndex={0}><table><caption>三套方案，主要取舍</caption><thead><tr><th scope="col">对比</th>{comparison.alternatives.map(a=><th scope="col" key={a.id}>{a.destination}</th>)}</tr></thead><tbody>{[['expectation','体验'],['driving','驾驶'],['budget','预算上限'],['tradeoff','取舍']].map(([key,label])=><tr key={key}><th scope="row">{label}</th>{comparison.alternatives.map(a=><td key={a.id}>{key==='expectation'?a.cells[key].split('体验方向：').pop():key==='driving'?(a.plan.checks.driving==='unknown'?'车程待核实':a.plan.checks.driving==='fail'?'参考车程超限':'参考车程未超限，入口待核实'):key==='budget'?a.cells[key].split('；')[0]+'（费用待核算）':a.cells[key]}</td>)}</tr>)}</tbody></table></div>
 <details><summary>体验、依据与核验详情</summary><p className="v2-original">{comparison.intent.original}</p>{comparison.limitations.map(s=><p key={s}>{s}</p>)}{comparison.alternatives.map(a=><details key={a.id}><summary>{a.destination}</summary>{rows.map(([key,label])=><div key={key}><h3>{label}</h3><p className="v2-original">{a.cells[key]}</p></div>)}</details>)}</details></section>;
}
