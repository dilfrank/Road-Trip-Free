import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
 const incoming = new URL(req.url);
 if (!['localhost','127.0.0.1','[::1]'].includes(incoming.hostname) || req.headers.get('sec-fetch-site') === 'cross-site') return NextResponse.json({error:'仅供本机使用'}, {status:403});
 if (!process.env.AMAP_JS_KEY) return NextResponse.json({error:'地图未配置'}, {status:503});
 const reader=req.body?.getReader();if(!reader)return new Response(null,{status:400});
 const chunks:Uint8Array[]=[];let size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>65536){await reader.cancel();return new Response(null,{status:413});}chunks.push(value);}
 const upstream=new URL('https://jsapi.amap.com/web_map/get_tile');upstream.searchParams.set('key',process.env.AMAP_JS_KEY);
 try {
 const response=await fetch(upstream,{method:'POST',body:Buffer.concat(chunks),headers:{'Content-Type':'application/x-www-form-urlencoded'},redirect:'error',cache:'no-store',signal:AbortSignal.timeout(15000)});
 return new Response(await response.arrayBuffer(),{status:response.status,headers:{'Content-Type':response.headers.get('content-type')||'application/octet-stream','Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'高德底图连接失败'},{status:502});}
}
