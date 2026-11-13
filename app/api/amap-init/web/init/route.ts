import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const incoming = new URL(req.url);
  if (!['localhost','127.0.0.1','[::1]'].includes(incoming.hostname) || req.headers.get('sec-fetch-site') === 'cross-site') return NextResponse.json({error:'仅供本机使用'}, {status:403});
  const key = process.env.AMAP_JS_KEY;
  if (!key) return NextResponse.json({error:'地图未配置'}, {status:503});
  const upstream = new URL('https://jsapi.amap.com/web/init');
  upstream.searchParams.set('key', key);
  try {
    const response = await fetch(upstream, {cache:'no-store', redirect:'error', signal:AbortSignal.timeout(15000)});
    return new Response(await response.arrayBuffer(), {status:response.status, headers:{'Content-Type':response.headers.get('content-type') || 'application/json', 'Cache-Control':'no-store'}});
  } catch { return NextResponse.json({error:'高德底图初始化连接失败'}, {status:502}); }
}
