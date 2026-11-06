export type Preference = '休息' | '自然' | '文化' | '挑战';
export type TripInput = { thought: string; origin: string; end: string; date: string; days: number; maxDrive: number; budget: string; needs: string; preferences: Preference[] };
export type Evidence = { sourceId: string; title: string; page: number; status: 'unverified'; importedAt: string };
export type Place = { id: string; name: string; region: string; themes: Preference[]; opportunity: string; burden: string; evidence: Evidence };
export type Intent = { original: string; preferences: Preference[]; needs: string; confirmed: boolean; unknowns: string[] };
export type Plan = { status: 'needs_input' | 'provisional' | 'infeasible'; issues: string[]; days: { day: number; stops: string[]; note: string }[]; missingIds: string[]; summary: string };
export const emptyTrip: TripInput = { thought: '', origin: '', end: '', date: '', days: 3, maxDrive: 4, budget: '', needs: '', preferences: [] };

export function validateTrip(t: TripInput): string[] {
  const errors: string[] = [];
  if (!t.origin.trim()) errors.push('从哪里出发？');
  const parsedDate = Date.parse(t.date);
  if (!t.date || !/^\d{4}-\d{2}-\d{2}$/.test(t.date) || !Number.isFinite(parsedDate) || new Date(parsedDate).toISOString().slice(0,10) !== t.date) errors.push('请填写有效的出发日期。');
  if (!Number.isInteger(t.days) || t.days < 1 || t.days > 30) errors.push('请输入 1–30 天的旅行天数。');
  if (!Number.isFinite(t.maxDrive) || t.maxDrive <= 0 || t.maxDrive > 24) errors.push('请填写有效的每日驾驶上限。');
  if (t.budget && (!Number.isFinite(Number(t.budget)) || Number(t.budget) <= 0)) errors.push('总预算应大于 0，或留空。');
  return errors;
}

export function understand(t: TripInput): Intent {
  // Only explicit statements are carried forward. No emotion diagnosis or keyword inference.
  return { original: t.thought.trim(), preferences: [...t.preferences], needs: t.needs.trim(), confirmed: false,
    unknowns: [...validateTrip(t), ...(!t.budget ? ['总预算未填写'] : [])] };
}

export function findCandidates(places: Place[], intent: Intent, query: string): Place[] {
  const filtered = places.filter(p => `${p.name}${p.region}${p.opportunity}${p.themes.join('')}`.includes(query.trim()));
  if (!intent.confirmed) return filtered;
  return [...filtered].sort((a,b) => b.themes.filter(x => intent.preferences.includes(x)).length - a.themes.filter(x => intent.preferences.includes(x)).length);
}

export function makePlan(t: TripInput, selectedIds: string[], places: Place[], confirmed: boolean): Plan {
  const issues = validateTrip(t);
  if (!confirmed) issues.push('请先确认本次想法。');
  if (!selectedIds.length) issues.push('请选择一个想去的地方。');
  const unique = [...new Set(selectedIds)];
  const selected = unique.map(id => places.find(p => p.id === id)).filter((p): p is Place => !!p);
  const missingIds = unique.filter(id => !places.some(p => p.id === id));
  if (missingIds.length) issues.push('部分地点不在当前资料中，请重新选择。');
  if (issues.length) return { status: 'needs_input', issues, days: [], missingIds, summary: '还需要补充条件' };
  if (selected.length > t.days) return { status: 'infeasible', issues: ['当前草案按每天至多一个目的地安排；请减少地点或增加天数。此项是安排规则，不是道路计算结论。'], days: [], missingIds, summary: '所选地点超过当前安排容量' };
  const days = Array.from({length: t.days}, (_,i) => ({ day: i + 1,
    stops: [ ...(i === 0 ? [t.origin.trim()] : []), selected[i]?.name ?? '原地休息／自由安排', ...(i === t.days - 1 ? [t.end.trim() || t.origin.trim()] : []) ].filter((stop,index,all)=>index===0 || stop!==all[index-1]),
    note: '地点按选择顺序占位；交通时间、访问条件与住宿待核实。' }));
  const pending = ['逐段驾驶时间与每日上限尚未核对', '停车、接驳、步行及全天负担尚未核对', '当期开放、预约及天气尚未核实', '住宿、餐饮、门票与交通费用尚未核算', '末日返程衔接尚未核对'];
  if (t.needs.trim()) pending.push(`同行与活动要求待逐项核对：${t.needs.trim()}`);
  return { status: 'provisional', issues: pending, days, missingIds,
    summary: `${t.origin.trim()}出发，${t.days}天，结束于${t.end.trim() || t.origin.trim()}；每日驾驶上限${t.maxDrive}小时。` };
}

export function exportPlan(t: TripInput, plan: Plan, places: Place[]): string {
  return ['自驾自由 · 待核实草案', plan.summary, `出发：${t.date}`, `想法：${t.thought || '未填写'}`, `偏好：${t.preferences.join('、') || '未填写'}`, `总预算（人民币，整团）：${t.budget || '未填写'}`, ...plan.days.map(d => `第${d.day}天：${d.stops.join(' → ')}\n${d.note}`), '待核实：', ...plan.issues.map(i => `- ${i}`), '资料线索（非当前运营事实）：', ...places.map(p => `${p.name}：${p.evidence.sourceId}《${p.evidence.title}》物理页${p.evidence.page}`)].join('\n');
}

export function restoreTrip(value: unknown): TripInput | null {
  if (!value || typeof value !== 'object') return null;
  const t = value as TripInput;
  if (['thought','origin','end','date','budget','needs'].some(k => typeof t[k as keyof TripInput] !== 'string')) return null;
  if (!Array.isArray(t.preferences) || t.preferences.some(p => !['休息','自然','文化','挑战'].includes(p))) return null;
  if (typeof t.days !== 'number' || typeof t.maxDrive !== 'number' || validateTrip(t).length) return null;
  return { thought: t.thought, origin: t.origin, end: t.end, date: t.date, days: t.days, maxDrive: t.maxDrive, budget: t.budget, needs: t.needs, preferences: [...new Set(t.preferences)] };
}
