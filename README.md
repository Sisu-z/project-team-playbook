# 临时项目团队操作手册

给一个人和按需参与的 Agent 使用的项目启动、协作与资产沉淀指南。项目可以不同，执行聊天可以更换；目标、任务、成果和经验由文件与版本记录承接。

## 使用

把 [START_HERE.md](START_HERE.md) 交给新项目的主入口 Agent，并直接描述目标。默认由它承担技术总监职能：整理要求、查现成方案、维护项目说明、按依赖派工、核对结果、沉淀资产。负责人不必拆技术任务或搬运工作报告。

已有项目先盘点原有规则与产物，不重建平行文档。执行者和审查者只读取自己的操作路径。无需安装框架即可按文件使用；支持 Agent Skills 的宿主可以将本仓库作为完整技能包使用，入口为 [SKILL.md](SKILL.md)。

`0.2.0` 强化关键门槛提前收口、简单事务由总监直接处理、授权与任务头部同步、真实交付证据及项目结束检查。已有项目不自动升级；按变化影响选择采用，原执行版本留历史。实际验证范围见 [VALIDATION.md](VALIDATION.md)。

## 内容

- [总监规程](references/director.md)：从目标到启动、派工、核对、变更和结束。
- [执行规程](references/executor.md)、[审查与整合](references/review-integrate.md)：一次性任务的边界与交付。
- [共享任务流程](references/shared-work.md)：GitHub Issues／PR 或单一本地任务源。
- [资产维护](references/knowledge.md)：跨项目索引、项目内经验、统一日志和方法迭代。
- `templates/project/`：可复制到业务项目的入口、项目说明和原生 GitHub 模板。
- `scripts/bootstrap.mjs`：仅生成最小项目文件，默认预览，拒绝覆盖。
- [来源与采用说明](SOURCES.md)、[验证记录](VALIDATION.md)：方法出处及覆盖边界，不是必读规则。

协作资产库的 [项目索引](registry/projects.md) 与 [问题经验索引](registry/experiences.md) 只保留发现入口，实际成果留在各自项目。

版本见 [VERSION](VERSION)。不要把业务项目的私密资料上传到本仓库。公开发布手册不等于自动获得其他项目的写入、发布或设备操作权限。
