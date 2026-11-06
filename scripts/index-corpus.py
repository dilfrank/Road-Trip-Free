"""Build a local-only page index from previously extracted documents, verifying originals."""
import argparse, hashlib, json
from pathlib import Path
parser=argparse.ArgumentParser()
parser.add_argument('--source',default=r'E:\自驾资料')
parser.add_argument('--extracted',default='../research/corpus')
args=parser.parse_args()
root=Path(args.source).resolve()
documents=[]
skipped=[]
for path in sorted(Path(args.extracted).glob('S[0-9][0-9][0-9].json')):
    record=json.loads(path.read_text(encoding='utf-8'))
    original=(root / record['path']).resolve()
    if not original.is_relative_to(root) or not original.is_file():
        skipped.append(record['id']);continue
    if hashlib.file_digest(original.open('rb'),'sha256').hexdigest()!=record['sha256']:
        skipped.append(record['id']);continue
    documents.append({'id':record['id'],'title':original.stem,'path':record['path'],'sha256':record['sha256'],
        'pages':[{'page':p['page'],'text':p.get('text',''),'method':p.get('method','unknown')} for p in record['pages']]})
from datetime import datetime,timezone
output={'sourceRoot':str(root),'indexedAt':datetime.now(timezone.utc).isoformat(),'documents':documents,'skipped':skipped}
target=Path('.local/corpus-index.json');target.parent.mkdir(exist_ok=True)
target.write_text(json.dumps(output,ensure_ascii=False),encoding='utf-8')
print(json.dumps({'documents':len(documents),'pages':sum(len(d['pages']) for d in documents),'skipped':skipped},ensure_ascii=False))
