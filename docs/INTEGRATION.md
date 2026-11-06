# 2.0 alpha.3 服务接入

2026-11-07：五个模块已通过 `/api/trip` 串联。这是可配置外部服务的第一版，不是完整旅游可行性系统。

| 模块 | 本次实现 | 仍待完成 |
|---|---|---|
| Intent | OpenAI Responses + strict JSON Schema；原话连续子串核验；显式/推断、时间阶段与情感效价；用户确认 | 实际模型联调；完整 Emotionapps 多主体与维度数据契约；逐条修改和澄清回合 |
| Places | 服务端真实资料库，5 个四川候选，来源编号和物理页；按用户手动偏好排序 | 扩充候选；入口坐标核验；把确认后的语义需求变成可靠筛选约束。目前模型观察只用于确认展示，未自动转成景点过滤条件 |
| Planner | 高德地址解析与逐段驾车查询；包括跨日移动和末日返程；参考停留/休息时间 | 入口/停车点选择；住宿与时间窗；跨日长途拆分和多交通衔接。当前每天至多一个目的地，按用户选择顺序安排 |
| Validator | 景点覆盖、返程终点、每日参考驾驶上限、地图数据 24 小时时效；部分失败保留未知 | 动态开放、预约、天气、预算、接驳、全日负担与个人硬约束核验。资料导入日期不当成运营核实日期 |
| Explainer | 只读取校验结果的确定性短解释，明确超限和未知 | 针对完整校验方案的多方案取舍 |

## 本机配置

复制 `.env.example` 为 `.env.local`，在本机填写：

```
OPENAI_API_KEY=你的模型服务密钥
OPENAI_MODEL=该账户可用且支持结构化输出的模型名称
AMAP_WEB_KEY=高德Web服务类型密钥
ALLOW_PUBLIC_TRIP_API=false
```

不要把真实密钥写入 GitHub、聊天、截图或 `NEXT_PUBLIC_` 变量。重新构建并重启后访问 `/api/trip`；返回 configured 仅代表变量存在，不代表凭证认证已通过。必须分别提交需求和安排完成真实调用，才能确认接通。

当前本机未发现这些凭证，真实供应商联调未完成。无模型配置时仅保留原话与手动标签；无地图配置时不计算车程。外部异常不伪造结果。模型只接收用户主动提交的 thought 与 needs，不上传原始攻略全文。

## 接口

`GET /api/trip` 返回配置状态，无密钥。`POST /api/trip` 接收 `{action, trip, confirmed?, selected?}`。action 为 intent / places / plan；后两者要求 confirmed。服务端重新核验 TripInput 和候选 ID，不接受客户端提供的道路时间或校验结论。

前端确认是交互门槛，不是用户身份认证。接口限制同源、本机访问、16KB 输入、最多两个并发及外部请求 25 秒超时。公开部署前需要身份认证和持久化额度控制，不能直接开启 ALLOW_PUBLIC_TRIP_API 作为完整生产防护。

地图地址解析参考点可能是市中心或景区中心，不是已经核验的停车场/入口。因此即使车程通过检查也只返回 provisional，不返回 checked。超过参考驾驶上限返回 infeasible，指当前草案需要调整，不表示该旅行绝对不可能。每处停留 2 小时、连续驾驶每 2 小时后休息 20 分钟是产品假设，不是法规或医学建议。没有完整地图数据时休息时长也尚未确定。

## 验证

`npm test` 包含原有 30 个路线用例、纯规划回归、外部接口契约测试。契约测试使用明确标记的 fixture，覆盖无凭证、模型未完成、伪造证据、地址歧义、无效车程、返程、超限、过期地图结果。fixture 通过不等于真实服务连接成功。

`npm run build` 检查 Next.js 生产构建与 TypeScript。密钥配置后的验收还需要：真实原话解析、具体地址往返、超限场景、供应商配额/失败，以及实际入口匹配。

接口依据：[OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses)、[高德驾车路径规划](https://lbs.amap.com/api/webservice/guide/api/direction)、[高德地理编码](https://lbs.amap.com/api/webservice/guide/api/georegeo)。
