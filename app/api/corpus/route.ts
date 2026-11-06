import { NextResponse } from 'next/server';
import { searchCorpus } from '../../../lib/corpus';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(req:Request){
  const url=new URL(req.url);
  if(!['localhost','127.0.0.1','[::1]'].includes(url.hostname)||req.headers.get('sec-fetch-site')==='cross-site')return NextResponse.json({error:'本地资料仅在本机读取。'},{status:403});
  const query=url.searchParams.get('q')??'';
  if(query.length>100)return NextResponse.json({error:'请缩短关键词。'},{status:400});
  return NextResponse.json(await searchCorpus(query),{headers:{'Cache-Control':'no-store'}});
}
