import type { Place } from '../lib/planner';

// Curated discovery leads from the user's local corpus. No current operational facts.
export const chinaPlaces: Place[] = [
  { id:'chengdu', name:'成都', region:'四川', themes:['休息','文化'], opportunity:'以城市漫步和日常生活为体验方向。', burden:'街区步行、停车与假日拥挤情况需要核实。', evidence:{sourceId:'S080',title:'我是驴友-成都攻略',page:4,status:'unverified',importedAt:'2026-11-06'} },
  { id:'bamboo', name:'蜀南竹海', region:'四川', themes:['自然','休息'], opportunity:'以竹林和自然停留为体验方向。', burden:'进入方式、内部交通和步行距离需要核实。', evidence:{sourceId:'S083',title:'我是驴友-蜀南竹海',page:3,status:'unverified',importedAt:'2026-11-06'} },
  { id:'jiuzhai', name:'九寨沟', region:'四川', themes:['自然'], opportunity:'以湖泊、森林和景观观察为体验方向。', burden:'景区接驳、栈道开放、海拔与全天负担需要核实。', evidence:{sourceId:'S078',title:'我是驴友-九寨沟',page:4,status:'unverified',importedAt:'2026-11-06'} },
  { id:'siguniang', name:'四姑娘山', region:'四川', themes:['自然','挑战'], opportunity:'以山地景观为体验方向，具体活动由你选择。', burden:'具体沟谷、活动强度、海拔与进入条件需要单独核实。', evidence:{sourceId:'S079',title:'我是驴友-四姑娘山',page:2,status:'unverified',importedAt:'2026-11-06'} },
  { id:'yading', name:'稻城亚丁', region:'四川', themes:['自然','挑战'], opportunity:'以雪山、草甸和湖泊为体验方向。', burden:'长途往返、接驳、徒步与海拔可能增加负担，不能仅凭景色选择。', evidence:{sourceId:'S082',title:'我是驴友-稻城亚丁',page:2,status:'unverified',importedAt:'2026-11-06'} },
  {id:'nanjing',name:'南京',region:'江苏',themes:['文化','休息'],opportunity:'以秦淮街区、城市历史与漫步为体验方向。',burden:'街区停车、步行距离、预约及拥挤情况待核实。',evidence:{sourceId:'S094',title:'我是驴友-南京旅游攻略',page:2,status:'unverified',importedAt:'2026-11-07'}},
  {id:'suzhou',name:'苏州',region:'江苏',themes:['文化','休息'],opportunity:'以园林、水乡街区和地方文化为体验方向。',burden:'园林预约、古城停车和步行负担待核实。',evidence:{sourceId:'S100',title:'我是驴友-苏州旅游攻略',page:2,status:'unverified',importedAt:'2026-11-07'}},
  {id:'yangzhou',name:'扬州',region:'江苏',themes:['休息','文化'],opportunity:'以湖畔停留、老城漫步和地方饮食为体验方向。',burden:'湖区开放、停车、步行距离与餐饮营业待核实。',evidence:{sourceId:'S098',title:'我是驴友-扬州旅游攻略',page:2,status:'unverified',importedAt:'2026-11-07'}}
];
