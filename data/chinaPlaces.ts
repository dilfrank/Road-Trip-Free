import type { Place } from '../lib/planner';

// Curated discovery leads from the user's local corpus. No current operational facts.
export const chinaPlaces: Place[] = [
  { id:'chengdu', name:'成都', region:'四川', themes:['休息','文化'], opportunity:'以城市漫步和日常生活为体验方向。', burden:'街区步行、停车与假日拥挤情况需要核实。', evidence:{sourceId:'S080',title:'我是驴友-成都攻略',page:4,status:'unverified',importedAt:'2026-11-06'} },
  { id:'bamboo', name:'蜀南竹海', region:'四川', themes:['自然','休息'], opportunity:'以竹林和自然停留为体验方向。', burden:'进入方式、内部交通和步行距离需要核实。', evidence:{sourceId:'S083',title:'我是驴友-蜀南竹海',page:3,status:'unverified',importedAt:'2026-11-06'} },
  { id:'jiuzhai', name:'九寨沟', region:'四川', themes:['自然'], opportunity:'以湖泊、森林和景观观察为体验方向。', burden:'景区接驳、栈道开放、海拔与全天负担需要核实。', evidence:{sourceId:'S078',title:'我是驴友-九寨沟',page:4,status:'unverified',importedAt:'2026-11-06'} },
  { id:'siguniang', name:'四姑娘山', region:'四川', themes:['自然','挑战'], opportunity:'以山地景观为体验方向，具体活动由你选择。', burden:'具体沟谷、活动强度、海拔与进入条件需要单独核实。', evidence:{sourceId:'S079',title:'我是驴友-四姑娘山',page:2,status:'unverified',importedAt:'2026-11-06'} },
  { id:'yading', name:'稻城亚丁', region:'四川', themes:['自然','挑战'], opportunity:'以雪山、草甸和湖泊为体验方向。', burden:'长途往返、接驳、徒步与海拔可能增加负担，不能仅凭景色选择。', evidence:{sourceId:'S082',title:'我是驴友-稻城亚丁',page:2,status:'unverified',importedAt:'2026-11-06'} }
];
