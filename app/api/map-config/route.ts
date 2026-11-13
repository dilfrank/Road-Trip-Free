import { NextResponse } from 'next/server';
export const dynamic='force-dynamic';
export async function GET(req:Request){
 const url=new URL(req.url);
 if(!['localhost','127.0.0.1','[::1]'].includes(url.hostname)||req.headers.get('sec-fetch-site')==='cross-site')return NextResponse.json({error:'仅供本机开发'},{status:403});
 const key=process.env.AMAP_JS_KEY;const securityJsCode=process.env.AMAP_JS_SECURITY_CODE;
 return NextResponse.json(key&&securityJsCode?{configured:true,key,securityJsCode}:{configured:false},{headers:{'Cache-Control':'no-store'}});
}
