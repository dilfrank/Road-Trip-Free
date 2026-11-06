# Emotionapps 与自驾自由 2.0

修订日期：2026-11-06。状态：研究参考与产品设计规范，未接入运行时。

## 来源与归属
Hosany, S., Martin, D., & Woodside, A. G. (2021). *Emotions in Tourism: Theoretical Designs, Measurements, Analytics, and Interpretations*. Journal of Travel Research, 60(7), 1391–1407. 文章版权年为 2020，卷期年为 2021。

- [DOI 与出版页面](https://doi.org/10.1177/0047287520937079)
- [出版方全文](https://journals.sagepub.com/doi/pdf/10.1177/0047287520937079?download=true)
- [作者机构存档](https://pure.royalholloway.ac.uk/ws/files/38386619/Emotions_in_tourism_Hosany_Martin_Woodside_JTR_2020_final.pdf)

Emotionapps 是旅游情绪测量的概念框架，为情境适用的测量方法提供指导。核心维度为显著性（体验对个人的重要性）、效价（情绪正负性质）和情绪觉察（是否意识到自身情绪）。以上为论文内容概要，参见出版页 1398–1399；下文是本项目的应用设计，不是原论文提供的算法、量表或实证结论。

## 与新版 Prompt 的分工
| 层次 | 新版幸福框架的职责 | Emotionapps 借鉴的落点 |
|---|---|---|
| 目标 | 兼顾体验、成本、个人与社区生活 | 不替代产品目标 |
| 需求 | 理解用户想要什么 | 区分个人重要性、情绪与目的地偏好 |
| 复杂感受 | 接纳疲惫与失望 | 容纳并存的感受，避免简单正负抵消 |
| 不确定性 | 明确表达优先于推断 | 允许说不清，不替用户解释无意识 |
| 时间 | 期待、现场与回忆 | 每条记录区分记录时点和体验阶段 |
| 结果 | 旅行评价、生活延续、社区影响 | 分别收集证据，不由一个推导全部 |

“概念 → 总体效应 → 时间过程 → 机制 → 美好生活”是分析结构。放松、投入、关系、意义是产品设计视角，不是 Emotionapps 三维度的替代名称。两者之间不建立未经检验的因果箭头。

## 意图观察记录契约（未来接口）
`emotionContext.currentFeelings / desiredExperiences / concerns / personalSignificance / mixedFeelings` 共用下列记录格式。空数组表示未取得信息，不表示不存在该体验。

```json
{
  "value": "担心驾驶距离过远",
  "evidence": "但怕开太远",
  "source": "user_explicit",
  "confirmed": false,
  "reportedAtStage": "before_trip",
  "experienceStage": "anticipated",
  "valence": "unknown",
  "importance": "unknown"
}
```

枚举与约束：
- source：user_explicit、system_inferred。后者必须提供支持推断的原话，不能伪造证据；没有证据就不生成记录。
- confirmed：用户是否确认系统归纳；不能由模型自行设为 true。
- reportedAtStage：before_trip、during_trip、after_trip、unknown；来自会话情境，不能只凭词汇猜测。
- experienceStage：current、anticipated、recalled、unknown；例如旅行后回想现场，记录时点为 after_trip，体验阶段为 recalled。
- valence：positive、negative、mixed、neutral、unknown。仅作可选描述，不自动评分；对单纯目的地偏好通常为 unknown。
- importance：must_have、preferred、optional、unknown。仅依据用户明确排序或确认，不以情绪强烈程度替代重要性。
- value、evidence：非空字符串；evidence 应能在用户原话中定位。unknowns 为待确认问题列表。

服务端未来需要验证结构、枚举、原话证据及确认状态；不合格输出不得影响推荐。硬约束始终独立保存在 hardConstraints 中。显著性和觉察没有在本项目中变成经验证的数值量表；不设置 consciousnessScore。

## 参考案例与响应
用户：“最近很累，想去海边，但怕开太远。”

明确状态：很累；明确偏好：海边；担忧：开远。休息诉求可作为待确认推断，不能认定“海边必然带来幸福”。若驾驶上限未提供，问“每天最多愿意开多久？”；若表单已填，则直接使用，不重复问。推荐应说明估算驾驶时间、实际停留和必要取舍。

用户：“不知道想要什么。”

不填造情绪画像。可以先问时间或驾驶限制，提供少量不同体验方向，让用户选择；不得声称用户缺乏情绪觉察。

## 产品执行顺序
1. 读取原话及既有表单，排除否定表达和相互冲突的信息。
2. 分开整理当前感受、期待、担忧、约束，记录证据与未知。
3. 仅对影响推荐的缺失条件追问；每轮最多一个问题。
4. 对推断进行用户确认，再将确认后的偏好转给推荐引擎。
5. 在模板与道路数据允许范围内比较方案，公开遗漏、超时与估算来源。
6. 回顾只在用户主动开启时出现，不自动通知、追踪或采集新数据。

## 前台与数据边界
保留简洁 UI：一个想法输入区域、少量体验选择和必要约束。上述内部字段不转换成额外问卷或理论按钮。混合情绪不需要用户完成三维打分。优先使用用户自述，不从点击、表情、语音、停留时间推断无意识情绪。

游客体验、整体假期评价、日常生活变化、社区影响分别存证；未收集的结果保持未知。社区访问规则可作为可行性条件，但遵守规则本身不等于已经证明社区受益。

## 实现与评估状态
- 已写入：Prompt、数据契约、文档与人工验收场景。
- 当前代码：关键词推断与静态模板推荐；并未调用本文 Prompt，不支持上述记录契约。
- 未实现：结构校验服务、模型接入、用户确认状态机、旅行中反馈、旅行后回顾与效果研究。
- 验收方式：先用 Prompt 文档中的案例人工审查输出，再在接入时添加接口与交互测试。文档案例不是已经通过的自动测试。
- 当前路线匹配分不代表情绪测量、幸福程度或长期收益；不得用提高匹配分宣称提升幸福。
