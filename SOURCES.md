# 来源与适配边界

核对日期：2026-10-09。以下是一手来源；链接指向持续维护的文档或仓库。

本手册采用下列机制，并为“人类负责人＋按任务启用、完成后退出的 Agent”做轻量适配；不是这些组织或项目的官方联合方案。**没有直接复制或集成第三方框架代码、CLI 或 Skill 实现，也未声明已安装、运行或锁定其某个提交。**

| 编号 | 一手来源与阅读位置 | 采用的机制 | 适配边界 |
| --- | --- | --- | --- |
| S01 | GitHub：[GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow)，Following GitHub flow | 独立分支、小变更、PR 关联 Issue、审查后合并、保留提交与讨论历史 | Issue 承载任务，PR 承载成果与证据；读取与回填不等于自动唤醒 Agent，也不提供任务领取的原子锁。 |
| S02 | BMAD：[Choose a Planning Path](https://docs.bmad-method.org/plan/choose-a-planning-path/)，Start from the Intent／Size Follows the Intent／Start Project-Sized Work | 准备工作按需求清晰度、规模与风险决定；大型工作共享产品意图和架构，明确各工作流负责人；仅补缺失文档 | 将文档维护责任与任务责任显式写入记录，不绑定永久 Agent 身份；不照搬整套角色、输出目录或固定阶段。 |
| S03 | Every：[Compound Engineering 的经验捕获指南](https://github.com/EveryInc/compound-engineering-plugin/blob/main/docs/guides/ce-compound.md)，TL;DR 与捕获条件 | 已验证且耐久、非显然、遗忘代价高的经验才沉淀；实现与测试已充分表达的内容不重复写；查重、更新和淘汰旧经验 | 经验日志区分未验证尝试与可复用结论；不把所有聊天入库，不照搬大规模并行或固定工时比例；没有引入 CE 插件。 |
| S04 | Fission AI：[OpenSpec OPSX 工作流](https://github.com/Fission-AI/OpenSpec/blob/main/docs/opsx.md)，变更工件与归档 | 将现行规范与拟议差异分开；变更说明影响，采用后更新基线并保留历史 | 仅重要跨边界变化需要独立变更记录；不为每个小修生成整套工件，不再建立重复任务台账；没有引入 OpenSpec CLI。 |
| S05 | Google：[代码审查标准](https://google.github.io/eng-practices/review/reviewer/standard.html)、[Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html) | 以事实与工程健康判断；区分阻塞缺陷和非阻塞建议；交付自包含、可检查的小变化 | 按风险选择审查深度，不强制每项任务多个 Reviewer；安全、权限和核心验收失败仍阻塞交付，不以“无需完美”为由放行。 |
| S06 | DORA：[Work in process limits](https://dora.dev/capabilities/wip-limits/)、[Working in small batches](https://dora.dev/capabilities/working-in-small-batches/) | 限制在制任务，把审查、等待与集成都纳入交付流；按可独立验证的增量拆分 | 并发数受瓶颈与验收容量约束，没有统一最佳 Agent 数；不能从团队研究推导本手册的确定效率收益。 |
| S07 | GitLab：[DRI](https://handbook.gitlab.com/handbook/people-group/directly-responsible-individuals/)、[异步工作指南](https://handbook.gitlab.com/handbook/company/culture/all-remote/non-linear-workday/) | 明确单一交付责任；重要结论写入共享记录，异步交接自包含 | 职能可以长期存在，执行 Agent 可以更换；角色称谓不扩大权限，聊天记忆不作为正式状态。 |
| S08 | Michael Nygard：[Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)，全文 | 重要决定记录背景、选择、状态及后果；被替代的决定保留并链接替代项 | 只记录长期或跨模块决定，不为普通局部修改另建决策文档。 |
| S09 | Basecamp／Ryan Singer：[Set Boundaries](https://basecamp.com/shapeup/1.2-chapter-03)、[The Betting Table](https://basecamp.com/shapeup/2.2-chapter-08) | 先设投入上限；超过预算重新定义范围，而非默认无限延长 | 应用于研究和排错的停止条件，不照搬固定周数，也不裁掉安全与核心验收。 |

## 更新与引用规则

- 上表是机制来源，不是有效性保证，也不是整包采用清单。临时 Agent 生命周期、任务字段和跨项目复用方式是本手册的适配设计。
- 修改上述机制时，在变更中说明对应来源编号、适配原因和验证结果；更新日志只记录实际发生的变化。
- 第三方内容仅链接，以中文归纳，不复制大段正文或代码；不因此授予额外再分发权利。将来如需引入实现，应另行核对具体提交、许可、版权声明和维护成本。
