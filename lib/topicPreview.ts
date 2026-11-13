// Live subject hints only: never rewrite the user's text or infer positive preferences.
export const topicRules = [
 {key:'feeling',label:'心情',pattern:/累|疲惫|焦虑|开心|难过|压力|心情|烦|放空|放松/},
 {key:'experience',label:'体验',pattern:/海边|看海|山水|自然|散步|徒步|露营|美食|吃|游泳|温泉|园林|古镇|风景|体验/},
 {key:'concern',label:'顾虑',pattern:/不想|不要|不能|不愿|不赶|担心|怕|避免|预算|赶路|太远|太累|开车|拥挤/},
 {key:'relationship',label:'同行',pattern:/家人|朋友|孩子|父母|伴侣|爱人|老人|同伴|一起|独自|一个人|同行/},
 {key:'meaning',label:'意义',pattern:/意义|找回|重新开始|纪念|庆祝|生日|成长|认识自己|放下工作/},
 {key:'memory',label:'回忆',pattern:/上次|以前|曾经|记得|回忆|怀念|过去|小时候/},
 {key:'community',label:'当地',pattern:/当地|居民|小店|社区|环保|垃圾|不打扰|乡村|民俗/},
] as const;
export function previewTopics(text:string) {
 const parts=text.split(/[。！？；\n]+/).map(s=>s.trim()).filter(Boolean);
 return topicRules.map(rule=>({...rule,evidence:parts.filter(p=>rule.pattern.test(p))}));
}
