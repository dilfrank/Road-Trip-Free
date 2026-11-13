import { useEffect, useRef, useState } from 'react';
import type { Alternative } from '../lib/alternatives';
export function EvidenceStory({option,original}:{option:Alternative;original:string}) {
 const [elapsed,setElapsed]=useState(0);const [playing,setPlaying]=useState(false);const clock=useRef(0);
 const scenes=[
 {title:'你的想法',text:original,icon:'quote'},
 {title:'期待的体验',text:option.cells.expectation.split('体验方向：').pop()||'体验待明确',icon:'sun'},
 {title:'这次怎么走',text:option.plan.days.map(d=>'第'+d.day+'天 · '+d.stops.join(' → ')).join('\n'),icon:'route'},
 {title:'已查与待查',text:(option.plan.checks.driving==='pass'?'参考车程未超限。':option.plan.checks.driving==='fail'?'驾驶超限，需调整。':'车程尚未核实。')+'开放、预约、入口和费用仍待核实。',icon:'check'},
 {title:'你需要取舍',text:option.cells.tradeoff,icon:'balance'},
 {title:'依据从哪里来',text:option.source+'。旧攻略仅作线索，不代表当前运营情况。',icon:'book'},
 ];
 useEffect(()=>{if(!playing)return;clock.current=performance.now();const timer=setInterval(()=>{const now=performance.now();const delta=(now-clock.current)/1000;clock.current=now;setElapsed(t=>Math.min(30,t+delta));},100);return()=>clearInterval(timer);},[playing]);
 useEffect(()=>{if(elapsed>=30)setPlaying(false);},[elapsed]);
 useEffect(()=>{const hide=()=>{if(document.hidden)setPlaying(false);};document.addEventListener('visibilitychange',hide);return()=>document.removeEventListener('visibilitychange',hide);},[]);
 const index=Math.min(5,Math.floor(elapsed/5));const scene=scenes[index];
 return <section className="evidence-story" aria-label="30秒依据动画"><header><h3>看懂依据</h3><span>30 秒</span></header><div className="evidence-stage" key={index}><svg viewBox="0 0 320 130" aria-hidden="true"><circle cx="160" cy="65" r="52" fill={['#ffe3d3','#f9e9c8','#dcece5','#e5e2f3','#f7dfdf','#e9e4d9'][index]}/><g fill="none" stroke="#695f56" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{scene.icon==='route'?<><path d="M80 90 Q120 10 160 65 T240 40" strokeDasharray="6 7"/><circle cx="80" cy="90" r="6"/><circle cx="240" cy="40" r="6"/></>:scene.icon==='check'?<><path d="m138 65 15 15 30-33"/><circle cx="160" cy="65" r="32"/></>:scene.icon==='book'?<path d="M125 39h25l10 6 10-6h25v53h-25l-10 6-10-6h-25ZM160 45v53"/>:scene.icon==='balance'?<path d="M160 30v70M130 45h60M135 45l-15 30h30Zm50 0-15 30h30ZM143 100h34"/>:scene.icon==='sun'?<><circle cx="160" cy="59" r="21"/><path d="M112 98q48-35 96 0M160 22v-8M123 32l-6-6M197 32l6-6"/></>:<path d="M140 45q-20 0-20 25h20v-20M185 45q-20 0-20 25h20v-20"/>}</g></svg><h3>{scene.title}</h3><p>{scene.text.length>150?scene.text.slice(0,150)+'…':scene.text}</p></div><nav className="evidence-chapters" aria-label="动画章节">{scenes.map((s,i)=><button key={s.title} type="button" aria-label={s.title} aria-current={i===index?'step':undefined} onClick={()=>{setElapsed(i*5);setPlaying(false);}}><span style={{width:Math.max(0,Math.min(1,(elapsed-i*5)/5))*100+'%'}}/></button>)}</nav><div className="evidence-controls"><button type="button" onClick={()=>{if(elapsed>=30)setElapsed(0);setPlaying(!playing);}}>{playing?'暂停':elapsed>=30?'重播':'播放'}</button><output>{Math.floor(elapsed)} / 30 秒</output></div><p className="evidence-caption">动画为依据摘要，原话与完整核验见下方。</p></section>;
}
