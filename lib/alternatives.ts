import { validateTrip } from './planner';
import type { TripInput } from './planner';
import { executeIntent, executePlanner, selectPlaces } from './services';
import type { CheckedPlan, ParsedIntent } from './services';

export type Alternative={id:string;title:string;destination:string;plan:CheckedPlan;cells:Record<string,string>;source:string};
export type Comparison={intent:ParsedIntent;alternatives:Alternative[];basis:string;limitations:string[]};
export async function createAlternatives(trip:TripInput):Promise<Comparison>{
  const errors=validateTrip(trip);if(errors.length||!trip.thought.trim())throw new Error('请填写想法和完整出行条件。');
  const intent=await executeIntent(trip);
  // Only explicit manual preferences affect ranking. Model inferences are not confirmed by submission.
  const ranked=selectPlaces(trip);
  const region=/江苏|南京|苏州|无锡|扬州|常州|镇江|南通|徐州|盐城|淮安|连云港|宿迁|泰州/.test(trip.origin)?'江苏':/四川|成都|绵阳|宜宾|乐山|德阳/.test(trip.origin)?'四川':null;
  const selected=[...ranked].sort((a,b)=>Number(b.region===region)-Number(a.region===region)).slice(0,3);
  const quote=(category:string)=>intent.observations.filter(o=>o.category===category&&o.source==='user_explicit').map(o=>`“${o.evidence}”`).join('；');
  const alternatives:Alternative[]=[];
  for(const [index,place] of selected.entries()){
    const plan=await executePlanner(trip,[place.id]);
    const city=['chengdu','nanjing','suzhou','yangzhou'].includes(place.id);const bamboo=place.id==='bamboo';
    const direction=place.id==='nanjing'?'古都漫游':place.id==='suzhou'?'园林与水乡':place.id==='yangzhou'?'湖畔与老城':city?'城市慢游':bamboo?'竹林停留':'自然观景';
    const total=plan.legs.reduce((n,l)=>n+l.seconds,0)/3600;
    const driving=plan.checks.driving==='unknown'?'地图车程待核实，暂不能判断是否满足上限。':`已查询参考驾驶合计 ${total.toFixed(1)} 小时；${plan.checks.driving==='fail'?'有日期超出上限，需要调整':'各日参考驾驶未超上限'}。入口及接驳待核实。`;
    const source=`${place.evidence.sourceId}《${place.evidence.title}》第 ${place.evidence.page} 页 · 旧资料待核实`;
    alternatives.push({id:place.id,title:`方案${['一','二','三'][index]} · ${direction}`,destination:place.name,plan,source,cells:{
      route:plan.days.length?plan.days.map(d=>`第 ${d.day} 天：${d.stops.join(' → ')}`).join('\n'):plan.summary,
      feeling:quote('feeling')?`你的原话：${quote('feeling')}。正负感受可并存；不承诺这条路线能改变情绪。`:'未明确当前感受，不作情绪推断。',
      expectation:(quote('experience')?`你的期待：${quote('experience')}。`:'未明确期待，不推断。')+`体验方向：${place.opportunity}`,
      relaxation:place.id==='suzhou'?'建议一天只选一处园林，给水乡街区和休息留白；预约与步行量待核实。':place.id==='yangzhou'?'建议把湖畔停留和老城散步分开安排，减少赶场；开放与步行量待核实。':city?'建议减少跨区移动，在同一片区慢逛；实际步行量待核实。':bamboo?'建议减少打卡，在竹林安排留白；内部交通与步行量待核实。':'建议减少观景点数量，穿插停留；接驳与步行负担待核实。',
      engagement:place.id==='nanjing'?'可选秦淮街区观察与城市历史体验，不追求景点数量。':place.id==='suzhou'?'可选园林观察、水乡街巷或评弹体验，场所和场次待核实。':place.id==='yangzhou'?'可选湖畔观景、老城漫步或地方饮食体验，营业信息待核实。':city?'可选择街区观察、饮食或文化体验，具体活动待选择。':bamboo?'可选择观察竹林、摄影或慢走，具体步道待核实。':'可选择景观观察或摄影，不默认安排徒步挑战。',
      relationship:quote('relationship')?`依据 ${quote('relationship')}，建议保留共同活动和独处选择；同行者能力待核实。`:'未说明同行关系，不替你设定陪伴目标。',
      meaning:quote('meaning')?`你表达的意义：${quote('meaning')}。安排是否有帮助由你判断。`:'未说明个人意义，不作幸福或疗愈承诺。',
      memory:quote('memory')?`过去经验：${quote('memory')}。可自选保留一次相似体验，回来后再评价。`:'可在回来后记录最愿意记住的片刻；不预测回忆一定美好。',
      community:quote('community')?`你的心意：${quote('community')}；具体做法与商家信息待核实。`:'可选择当地经营的小店、遵守游览规则；这是建议，不是已表达偏好。',
      driving:`每日驾驶上限 ${trip.maxDrive} 小时。${driving}\n途中休息需结合实际路段安排，接驳和步行另计。`,
      budget:trip.budget?`整团预算 ${trip.budget} 元；交通、住宿、餐饮与门票未报价，不能确认预算可行。`:'未设置预算；各项费用待核算。',
      concerns:[quote('concern')?`原话约束：${quote('concern')}`:'自由文本中的约束仍需核对。',trip.needs?`同行与活动要求：${trip.needs}`:'',place.burden,'以上约束尚未逐项证实满足。'].filter(Boolean).join('\n'),
      tradeoff:place.id==='nanjing'?'历史与城市生活更突出；跨片区游览可能增加交通负担，建议少选片区。':place.id==='suzhou'?'园林与水乡体验更集中；预约、古城停车和步行需要提前核对。':place.id==='yangzhou'?'更侧重湖畔与老城停留；天气、湖区步行量和营业时段会影响体验。':city?'更侧重城市生活；自然景观体验较少，拥挤与停车仍可能增加负担。':bamboo?'更侧重竹林环境；需要确认到达方式、景区内部交通和步行距离。':'更侧重自然景观；往返、预约、接驳与海拔等条件可能增加负担。',
      validation:(plan.status==='infeasible'?'当前安排需调整':'待核实草案')+'；车程、开放预约、住宿与费用尚未完整核实。',source
    }});
  }
  return {intent,alternatives,basis:`${trip.origin}出发 · ${trip.date} · ${trip.days}天 · 结束于${trip.end||trip.origin}`,limitations:[
    '三套均为待核实草案，不代表三套都可直接出发。当前使用江苏、四川的已整理候选，同省优先不等于车程可行。',
    intent.mode==='explicit_only'?'未连接模型：按你填写的主题保留原话，未自动理解全部自由文本；方案排序依据手动体验偏好。':'模型推断保留为待确认，不自动作为硬约束或已确认偏好。',
    '地图、开放预约、住宿、费用与个人约束未完全核实前，不给出幸福评分或最佳方案结论。',
    /^(江苏|四川)(省)?$/.test(trip.origin.trim())?'出发地目前仅到省级，需具体城市或地址后才能核对往返车程。':'参考地址仍需核对到具体出发点与入口。'
  ]};
}
