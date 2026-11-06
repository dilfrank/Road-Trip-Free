const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { stripTypeScriptTypes } = require('node:module');
// 无第三方依赖的领域测试；仅转换本项目的 TypeScript 模块。
function load(file) {
  let src = stripTypeScriptTypes(fs.readFileSync(file, 'utf8'));
  src = src.replace(/import\s*\{([\s\S]*?)\}\s*from\s*["'](.+?)["'];/g,
    (_, names, target) => `const {${names}} = load(${JSON.stringify(path.resolve(path.dirname(file), target + '.ts'))});`);
  const exports = [...src.matchAll(/export (?:function|const) (\w+)/g)].map(m => m[1]);
  src = src.replace(/export /g, '');
  return new Function('load', src + `\nreturn {${exports.join(',')}};`)(load);
}
const { recommendRoutes } = load(path.resolve(__dirname, '../lib/recommend.ts'));
let checks = 0;
for (const days of [2,3,4,5]) for (const month of [1,6,11]) {
  const prefs = { origin:'San Jose', month, days, maxDrive:3, budget:'省钱', thought:'想看海', moods:[], selectedAttractions:['Monterey','不存在的景点'] };
  for (const route of recommendRoutes(prefs)) {
    assert.equal(route.days.length, days);
    assert.ok(route.itinerary.length <= days);
    assert.deepEqual(route.matchedAttractions, prefs.selectedAttractions.filter(name => route.days.some(day => day.stops.includes(name))));
    assert.equal(route.totalDrive, `总驾驶约 ${route.days.reduce((sum, day) => sum + day.driveHours, 0).toFixed(1)}h`);
    assert.ok(route.score >= 0 && route.score <= 100);
    checks++;
  }
}
assert.ok(checks > 0);
console.log(`PASS: ${checks} route cases; duration, coverage, totals, score bounds`);
