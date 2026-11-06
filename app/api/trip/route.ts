import { NextResponse } from 'next/server';
import { restoreTrip } from '../../../lib/planner';
import { executeIntent, executePlanner, integrationStatus, selectPlaces } from '../../../lib/services';
export const runtime='nodejs';
export const dynamic='force-dynamic';
let active=0;
export async function GET(){return NextResponse.json(integrationStatus());}
export async function POST(req:Request){
  if(req.headers.get('origin')!==new URL(req.url).origin)return NextResponse.json({error:'请从本站发起请求。'},{status:403});
  if(active>=2)return NextResponse.json({error:'正在处理，请稍后再试。'},{status:429});
  // Public deployment is opt-in until authentication and persistent quotas are configured.
  if(!['localhost','127.0.0.1','[::1]'].includes(new URL(req.url).hostname)&&process.env.ALLOW_PUBLIC_TRIP_API!=='true')return NextResponse.json({error:'当前服务仅供本机使用。'},{status:403});
  active++;
  try{
    const reader=req.body?.getReader();if(!reader)return NextResponse.json({error:'缺少请求内容。'},{status:400});
    let text='',bytes=0;const decoder=new TextDecoder();while(true){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;if(bytes>16000){await reader.cancel();return NextResponse.json({error:'输入过长。'},{status:413});}text+=decoder.decode(part.value,{stream:true});}text+=decoder.decode();
    let body;try{body=JSON.parse(text);}catch{return NextResponse.json({error:'请求格式无效。'},{status:400});}
    const trip=restoreTrip(body.trip);
    if(!trip||trip.thought.length>2000||trip.needs.length>1000||trip.origin.length>100||trip.end.length>100)return NextResponse.json({error:'请检查出行条件。'},{status:400});
    if(body.action==='intent')return NextResponse.json({intent:await executeIntent(trip)});
    if(body.action==='places'&&body.confirmed===true)return NextResponse.json({places:selectPlaces(trip)});
    if(body.action==='plan'&&body.confirmed===true&&Array.isArray(body.selected)&&body.selected.length<=5&&body.selected.every((id:unknown)=>typeof id==='string'&&id.length<100))return NextResponse.json({plan:await executePlanner(trip,[...new Set<string>(body.selected)])});
    return NextResponse.json({error:'请确认需求并选择地点。'},{status:400});
  }catch{return NextResponse.json({error:'服务未能完成请求，请检查模型或地图配置后重试。'},{status:502});}finally{active--;}
}
