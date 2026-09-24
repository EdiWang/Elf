# Elf Forwarder 与 Admin 合并：任务计划和进度追踪

> 状态：批次 0–3 已完成；批次 4–5 未开始。最后更新：2026-09-24。
>
> **每完成一个批次，必须在该批次的提交中更新本文件**：勾选完成项，填写测试结果、验收结果、提交说明、遗留问题和下一步。未通过验收时保持“进行中”，不要提前勾选。后续 AI 从新对话接手时，先读本文件、仓库根目录 `AGENTS.md` 和当前 `git status`，再继续尚未完成的批次。

## 目标与已确认的决定

- 目标：将当前两个 ASP.NET Core 10 Web 应用合为**一个应用项目、一个运行进程和一个部署镜像**，降低日常运维成本；不是重写业务或数据库。
- 公开地址继续使用 `https://go.edi.wang/fw/{token}` 与 `https://go.edi.wang/aka/{akaName}`；已发出的转发链接不得改变。
- 管理入口改为 `https://go.edi.wang/admin`。**所有**管理页面、管理 API、登录、OIDC 回调和后台静态资源均置于 `/admin` 路径下；不可遗留可访问的根路径管理接口。
- 切换完成后直接停用旧的 `admin.go.edi.wang`；不要求旧管理域名跳转或并行服务期。切换前需准备恢复旧入口和旧服务的回退步骤。
- 保留 `Local`、`OpenIdConnect`、`External` 三种 Admin 鉴权。`External` 依赖代理：代理须保护精确路径 `/admin` 及其子路径，且应用端口不得被外部绕过代理直连。默认部署仍须让 `/fw/*`、`/aka/*` 公开可用。
- 用户要求先规划、分批执行、每批测试/提交/验收；研究或执行中遇到需要产品或部署取舍的问题，要先向用户说明建议并询问，不得代替用户决定。本轮用户已授权执行批次 0 和批次 1；后续代码合并和部署须按用户后续指示推进，生产入口切换仍须用户明确决定。

## 现有仓库事实（接手时应重新核对）

- 解决方案：`src/Elf.slnx`。当前宿主分别是 `src/Elf.Api/Program.cs` 与 `src/Elf.Admin/Program.cs`；两者共享 `Elf.Data`、`Elf.Shared`、`Elf.TokenGenerator`。建议以已有 Razor Pages 的 `Elf.Admin` 为合并宿主，以减少页面迁移量；这是建议，实施前可与用户确认。
- `Elf.Api` 的 `/` 当前是健康检查；Admin 的 `/` 当前是首页。Admin 移到 `/admin` 后可保留现有 `/` 健康检查，不需要为了避让首页而改动公开根路径。
- 当前 Forwarder 使用 `ElfDbContext`/EF Core 做链接读取和跟踪写入；支持 SQL Server 与 PostgreSQL。根目录 `AGENTS.md` 中关于 API 使用 Dapper、API/Admin 分离实体的描述已落后于当前代码，**实施以实际代码为准**，不要为了符合旧描述改回 Dapper。
- API 启动时检查/初始化空数据库；Admin 有跟踪记录清理后台服务。两端分别注册 LiteBus 处理器、`IDistributedCache`、数据库上下文、限流；API 使用 `AddDbContextPool`，Admin 使用带 lazy-loading proxies 的 `AddDbContext`。合并时应确认所有处理器被发现，且数据库上下文只按一种兼容配置注册。暂不预设具体实现。
- 转发控制器位于 `src/Elf.Api/Controllers/ForwardController.cs`，包含 token/aka 路由、`fixed-ip` 限流、目标 URL 验证、禁用链接、默认跳转、缓存、可选跟踪和无缓存响应。Admin 控制器使用授权策略和防伪保护。不得在合并时放松这些行为。
- Admin 当前有根路径引用：`/api/*`、`/auth/*`、`/signin-oidc`、`/signout-callback-oidc`、`/js/*`、`/lib/*`、`/css/*` 等。检查 Razor、JS 模块导入、fetch、Cookie 跳转、OIDC 回调、静态文件和链接生成。`ForwarderBaseUrl` 用于 Admin 中生成公开转发链接。
- `compose.yaml` 当前运行 PostgreSQL、API、Admin 三个服务；`.github/workflows/docker-api.yml` 和 `docker-admin.yml` 分别发布两张镜像。README 说明了 Local/OIDC/External 和 Redis。单进程内存缓存可共享，但**多实例**仍需 Redis 等共享缓存，否则管理修改无法使其他实例的缓存立即失效。
- 当前 Admin 有 `src/Elf.Admin.Tests/AdminAuthorizationIntegrationTests.cs` 宿主级测试；API 测试主要覆盖控制器及辅助类。合并后需新增同宿主的公开/受保护路由集成验证，而不是只依赖单元测试。

## 进度总览

| 批次 | 状态 | 测试/验收记录 | 提交记录 |
| --- | --- | --- | --- |
| 0. 基线 | 已完成 | `dotnet test src/Elf.slnx`：204 通过、0 失败、0 跳过；公开入口和生产镜像/Caddy 路由已只读核对；备份负责人待部署前确认 | 批次 0 基线记录提交 |
| 1. Admin 完整迁入 `/admin` | 已完成 | 宿主集成测试 100 通过；全量测试 217 通过；临时 LocalDB 浏览器回归通过 | 批次 1 Admin `/admin` 路径迁移提交 |
| 2. 建立单应用宿主 | 已完成 | Admin 宿主测试 100 通过；全量测试 217 通过；同宿主公开/授权路由及根健康检查通过 | 批次 2 Forwarder 接入 Admin 宿主提交 |
| 3. 合并后的回归与安全验证 | 已完成 | `dotnet test src/Elf.slnx`：230 通过、0 失败、0 跳过；SQL Server/PostgreSQL 实际启动读写、浏览器 CRUD、缓存、异步跟踪和清理验证通过 | 批次 3 回归、安全验证及本计划进度提交；External 代理验收留作切换阻断 |
| 4. 部署准备与切换 | 未开始 | 未运行 | 未提交 |
| 5. 清理旧 API 项目 | 未开始 | 未运行 | 未提交 |

## 批次 0：建立基线

- [x] 核对 `git status`、当前分支、部署方式和现有生产配置，不覆盖用户已有改动。
- [x] 从仓库根目录运行 `dotnet test src/Elf.slnx`，记录通过数、失败项及环境限制；此处先不宣称测试通过。
- [x] 用现有部署记录 `/`、`/fw/{token}`、`/aka/{akaName}`、Admin 登录、创建/编辑/停用/删除、标签、报表及缓存失效的预期行为；记录 Local/OIDC/External 的实际验证环境。
- [x] 记录回退所需的旧镜像、代理配置和数据库备份/恢复责任；旧镜像摘要及 Caddy 路由已核实，备份/恢复负责人未知并已列为部署切换前必补信息。

**验收门槛：**基线结果及已知失败项可复现；未将既有问题误记为合并回归。更新本文件后才进入批次 1。

### 批次 0 基线记录（2026-09-24）

- 起始状态：工作区干净，分支 `master`，起始 HEAD `7c2f1abe`。部署文档给出本地 Compose（PostgreSQL、`ediwang/elf:latest`、`ediwang/elf-admin:latest`）；两个 GitHub Actions 工作流在推送 `master` 时分别推送 API/Admin `latest` 镜像。
- 测试：`dotnet test src/Elf.slnx`，204 通过、0 失败、0 跳过，耗时约 2.8 秒；四个测试程序集均通过。
- 线上只读探测（不跟随重定向、不登录、不修改数据）：`GET https://go.edi.wang/` 返回 200；`/fw/baseline-invalid` 与 `/aka/baseline-invalid` 均返回 400；`GET https://admin.go.edi.wang/` 返回 302 并跳转至 `login.microsoftonline.com`。这只验证入口和无效样例响应，不代表有效链接或登录后流程已验收。
- 行为/鉴权基线：公开 URL 仍为 `/fw/{token}`、`/aka/{akaName}`；转发控制器保留限流、验证、自引用拦截、无缓存响应和可选跟踪。Admin 代码提供链接创建/编辑/启停/删除、搜索/分页、按标签查询、标签管理及报表；编辑、启停、删除按 token 清缓存，现有测试覆盖启停清缓存。Admin 现有测试覆盖 Local 的匿名访问/登录入口、External 的宿主授权和防伪；OIDC 有方案注册与授权策略测试，但没有真实 IdP 登录测试。Compose 配置使用 Local；External 目前只有自动化测试，未发现实际代理验证环境；线上旧 Admin 入口的挑战跳转表明当前入口使用 Microsoft 登录。没有凭据，未执行线上登录及 CRUD、标签、报表或缓存失效操作；这些流程留待非生产环境回归。
- 生产部署/回退基线：`go.edi.wang` DNS 指向 Azure VM `rg-ediwangapps-eastasia/spirit`。主机运行 Caddy，`/etc/caddy/Caddyfile` 将 `go.edi.wang` 转发到 `127.0.0.1:8002`，将 `admin.go.edi.wang` 转发到 `127.0.0.1:8003`；Caddy 监听 80/443。运行镜像为 `ediwang/elf:latest`（镜像摘要 `sha256:66f342bd3df9c7aa6c2270b2bc1ce54fa983216b45caea2cfbe12bde99e21991`）与 `ediwang/elf-admin:latest`（`sha256:ebbd5abb3955b3f960552cf8be0baa739eb503f169ca06af883cc8c31ceada40`）。PostgreSQL 使用 `postgres:18`（`sha256:86c951e05bf56c93d95d397747fb8820ac76cc3bedb78f43abd83eedbe3666ae`），容器数据目录挂载主机 `/data/pgdata`；容器端口映射为 Forwarder `8002`、Admin `8003`、PostgreSQL `5432`。这些摘要可用于识别当前回退镜像；生产数据库备份/恢复负责人、最近可恢复备份和实际恢复步骤仍未找到，须在批次 4 切换前向生产运维方确认。
- 验收：测试基线和线上入口、镜像、代理路由均有可复现记录，未观察到合并回归（尚未开始合并）。备份/恢复责任缺口已显式记录为部署切换前置资料，不阻止源码批次继续。

## 批次 1：Admin 完整迁入 `/admin`

- [x] 保持 API 独立运行，在 Admin 宿主中完成 `/admin` 页面、`/admin/api/*`、`/admin/auth/*`、OIDC 登录与退出回调、静态资源和 JS API 调用的路径迁移；同时处理 `/admin` 与 `/admin/`。
- [x] 更新 Cookie 登录/拒绝访问跳转及 OIDC 重定向目标；测试确认外部回调为 `/admin/signin-oidc` 与 `/admin/signout-callback-oidc`。旧域名 Cookie 按独立 Host 处理，不假设可复用。
- [x] 确保旧根路径 `/api/*`、`/auth/*`、OIDC 回调等不再暴露管理功能。代理采用 `External` 时，路径前缀必须覆盖全部管理功能；不得只保护登录页。
- [x] 扩展现有 Admin 宿主测试并进行浏览器检查：登录、TOTP、导航、链接增删改、标签、报表、CSS/JS、可访问性状态。
- [x] 全量测试通过；更新并提交本批次及本文件的进度。

**部署前置：**应用侧 OIDC 回调已验证；在身份提供方登记 `/admin/signin-oidc` 与 `/admin/signout-callback-oidc`，属于批次 4 的部署准备，生产登录切换前完成。

**验收门槛：**独立 Admin 在 `/admin` 完整可用，根路径无管理功能泄漏；旧独立 API 完全不受本批次影响。

### 批次 1 执行记录（2026-09-24）

- 路径：Admin 使用 `/admin` PathBase，根路径仅保留 `/health`，其他未加前缀的 Admin 页面、API、回调和静态资源均返回 404。Razor 资源、JS 模块导入、API 请求、账户重定向及报表弹出页均按 `/admin` 基址解析。README 已同步本地入口和 OIDC 公共回调 URL。
- 鉴权：Local 登录、TOTP 首次设置和退出在临时 SQL Server LocalDB 中完成；`/admin`、`/admin/` Cookie 登录跳转和 OIDC 登录/登出挑战回调均由宿主测试验证。身份提供方登记留到批次 4。
- 浏览器：在隔离数据库中完成链接创建、读取、编辑、删除；标签创建、编辑、删除；侧栏导航到 Tags、Report、Account；报表图表和追踪 API 返回 200。CSS、Fluent UI、Alpine、Admin JS 和 favicon 从 `/admin/...` 成功加载；辅助树包含命名导航、主内容、表头和表单标签。QA 临时数据库及 Playwright 输出已清理。
- 回归修正：报表工具栏原本打开根路径 `/Report`，现按页面 base URL 打开 `/admin/Report`。真实编辑流程还暴露出链接详情 API 序列化已释放 EF lazy-loading proxy 导致 500；查询预加载标签并返回编辑模型后，浏览器编辑与删除通过。Aka 输入 pattern 中的连字符已转义，浏览器控制台无错误。
- 测试：`dotnet test src/Elf.Admin.Tests/Elf.Admin.Tests.csproj --no-restore`：100 通过、0 失败；`dotnet test src/Elf.slnx`：217 通过、0 失败、0 跳过。根路径旧管理 URL 404、`/admin` 静态资源和 `/health` 可用均有宿主集成测试覆盖。
- 验收：通过；未更改 `Elf.Api`，未执行生产、代理或身份提供方配置变更。
- 提交：批次 1 Admin `/admin` 路径迁移及本计划进度更新。

## 批次 2：建立单应用宿主

- [x] 在同一宿主中接入 Forwarder 的控制器、LiteBus handlers、缓存、跟踪后台队列和数据库初始化；暂时保留旧 API 项目/镜像作为对照与回退。优先复用现有实现，不新造框架层。
- [x] 合并唯一的 `ElfDbContext`、Redis/内存缓存、feature flags、转发/登录限流、鉴权、防伪、代理头、安全响应头和压缩配置；核对中间件顺序及作用范围。
- [x] 保留 `GET /fw/*`、`GET /aka/*` 和现有 `/` 健康检查；Admin 仅在 `/admin` 下。验证 `ForwarderBaseUrl` 生成的公开链接。
- [x] 新增最小的同宿主集成测试，确认公开转发无需 Admin 登录、Admin API 需要正确授权、两类 endpoint 同时注册且无路由冲突。
- [x] 全量测试通过后提交本批次及本文件的进度更新。

**验收门槛：**一个应用进程能同时运行公开转发和后台；旧部署仍可启动，尚未切换生产流量。

### 批次 2 执行记录（2026-09-24）

- 宿主：`Elf.Admin` 引用并发现旧 API 程序集中的 Forwarder 控制器和 LiteBus handlers；同一 Admin `ElfDbContext` 同时供 Forwarder 与管理功能使用。接入原有 Redis/内存缓存、跟踪队列和后台服务、IP 定位客户端、数据库 schema runner 与启动初始化器；未改动独立 `Elf.Api`，仍可单独启动作为回退。
- 配置与中间件：Admin 配置补入 Forwarder 的默认跳转 URL、feature flags 和固定 IP 限流参数；共用一个 `IDistributedCache` 和数据库上下文。合并 `fixed-ip` 与登录限流、鉴权/防伪、可选 forwarded headers、安全响应头、HTTPS/HSTS 和响应压缩。根路径健康检查在 `/admin` PathBase 识别后按原始根路径短路，避免与 Admin 首页路由冲突；原 `/health` 也保留。
- 同宿主验收：宿主测试确认 `/fw/{token}`、`/aka/{akaName}` endpoint 均注册；未登录请求 `/fw/not-a-token` 返回 Forwarder 的 400，而匿名 `/admin/api/tag/list` 仍为 401/登录跳转。根 `/` 与 `/health` 返回 200，根健康响应含 `X-Frame-Options: DENY`；`/admin` 页面输出 `ForwarderBaseUrl=https://go.edi.wang`，旧根路径管理 URL 仍为 404。集成测试替换启动初始化器以避免依赖真实数据库；真实数据库启动/读写回归留在批次 3。
- 测试：`dotnet test src/Elf.Admin.Tests/Elf.Admin.Tests.csproj --no-restore`：100 通过、0 失败；`dotnet test src/Elf.slnx`：217 通过、0 失败、0 跳过。
- 验收：通过。未构建/部署生产镜像，未改动生产入口、Caddy、OIDC 提供方或服务流量。
- 提交：批次 2 Forwarder 接入 Admin 单应用宿主及本计划进度更新。
- 下一步：批次 3 验证转发回归、安全边界、真实 SQL Server/PostgreSQL 初始化与读写行为。

## 批次 3：合并后的回归与安全验证

- [x] 验证 token 格式、aka 约束、禁用/不存在链接、默认跳转、目标 URL `InvalidFormat`/`InvalidLocal`/`InvalidSelfReference`、重定向响应无缓存、IPv6 `/64` 限流及跟踪开关。
- [x] 验证创建/编辑/启停/删除后的缓存行为；单实例内存缓存和多实例 Redis 共享缓存的失效均已检查。启用跟踪时确认异步写入和后台清理工作。
- [x] 从同域 `/admin` 创建指向 `go.edi.wang/fw/*` 与 `/aka/*` 的链接均被既有自引用规则拦截。
- [x] 通过宿主测试验证 Local、OIDC、External 应用侧策略；匿名管理 API、缺少防伪令牌、登录/转发限流、旧根路径均按预期拒绝或限流。OIDC 真实身份提供方登录留待批次 4 新回调配置后验证。
- [ ] 在真实 External 代理路径验收 `/admin` 与 `/admin/*` 保护，并确认无法直连应用端口绕过代理。当前合并应用尚无对应的预发布代理配置，此项是批次 4 生产切换的发布阻断条件。
- [x] 运行 `dotnet test src/Elf.slnx`；在真实 SQL Server LocalDB 与 PostgreSQL 环境完成数据库启动/读写；对 Admin 浏览器 CRUD、启停和缓存失效做回归。
- [x] 修正回归并提交本批次及本文件进度更新。

**验收门槛：**批次 3 的应用代码与本地/自动化验收通过。External 代理保护及应用端口隔离仍是明确的发布阻断项，必须在批次 4 预发布环境解除后才能切换流量。

### 批次 3 执行记录（2026-09-24）

- Forwarder 回归：宿主集成测试覆盖 token/Aka 格式与约束、缺失/禁用链接、默认 fallback、`InvalidFormat`/`InvalidLocal`/`InvalidSelfReference`、`no-store`、同域 Admin 新建 `/fw/*` 和 `/aka/*` 自引用链接拒绝，以及 IPv6 `/64` 转发限流。跟踪开关测试确认启用时入队并加响应头，关闭时不入队。
- 缓存与跟踪：控制器测试覆盖编辑、启停、删除的 token 缓存清理；本机内存缓存实测编辑后旧 token 立即指向新地址、停用后转到 fallback、删除后转到 fallback。PostgreSQL + Redis 的两实例实测在 Node 2 填充缓存后由 Node 1 编辑，Redis 键被删除且 Node 2 立即读取新地址。SQL Server 和 PostgreSQL 实际转发各写入异步跟踪记录；临时 SQL Server 记录实测被清理服务按 365 天保留期限删除。
- 数据库与浏览器：SQL Server LocalDB 新空库启动后自动创建 5 张必需表，`/fw` 与 `/aka` 真实读写成功；PostgreSQL 空库初始化和既有库重启均成功。Playwright 在 LocalDB 上完成 Admin 创建、编辑、停用、删除，确认管理页与转发结果同步。临时数据库、容器、浏览器产物和 scratch harness 已清理。
- 安全响应回归：真实 Kestrel 响应曾仍带 `Server: Kestrel`；在 Admin 宿主关闭 Kestrel Server 头后，重启宿主的实测响应不再包含该头，同时保留 `X-Frame-Options: DENY`、`X-Content-Type-Options: nosniff` 和无缓存头。
- 测试：`dotnet test src/Elf.slnx`：230 通过、0 失败、0 跳过。覆盖 Local/OIDC/External 应用侧鉴权、匿名 Admin API、缺防伪令牌、登录限流、旧根路径 404。OIDC 未连接真实 IdP；External 的代理鉴权与阻断应用端口直连未在本批次部署环境实测。
- 发布阻断：批次 4 必须部署并实测代理精确保护 `/admin` 和所有子路径，且外部网络不能访问绕过代理的应用端口。批次 4 还须完成新的 OIDC 回调登记，并确认生产数据库备份/恢复负责人和可执行步骤；本批次未触碰生产流量或代理。
- 提交：批次 3 合并回归、安全响应头修正及本计划进度。

## 批次 4：部署准备与切换

- [ ] 准备单镜像 Dockerfile、Compose、CI 和 README：一个应用服务、同一数据库及现有配置键；说明 Local/OIDC/External、`/admin` 代理规则、Redis 在多实例下的要求。
- [ ] 在预发布环境验证全新数据库、已有数据库、真实域名/HTTPS、转发、Admin 登录与 OIDC 新回调。记录构建产物、环境变量、健康检查、代理规则和回退命令。
- [ ] 部署配置与文档提交，并更新本文件。**生产入口切换前向用户展示测试证据与回退方案，由用户决定是否切换。**
- [ ] 获得用户明确的切换决定后，将 `go.edi.wang` 指向单应用，停用 `admin.go.edi.wang`；切换后复验公开链接、Admin、缓存失效、错误率、延迟和跟踪。失败则恢复旧入口和旧服务。
- [ ] 将实际切换时间、结果、问题及回退状态写入本文件并提交。

**验收门槛：**新镜像在真实入口工作，旧公开链接不变，旧管理域名按决定停用，回退步骤可执行。未获切换决定时本批次保持“进行中”。

## 批次 5：清理旧 API 项目

- [ ] 观察期长短及清理时机由用户决定；在此之前保留旧 API 项目、镜像和回退材料。
- [ ] 删除已不再使用的独立 API 宿主、旧 Docker/CI 配置和过期说明；保留实际仍被单应用使用的转发逻辑与测试。
- [ ] 运行 `dotnet test src/Elf.slnx`，验证单镜像全新安装与已有数据库部署；检查文档、解决方案和仓库状态。
- [ ] 提交清理与本文件最终进度更新。

**验收门槛：**仓库只保留一个 Web 应用项目/镜像发布路径；功能和部署测试通过，用户确认迁移完成。

## 后续更新格式

每次开始或完成一个批次时，同步更新上方总览和对应清单，并在此处追加一条记录：

| 日期 | 批次 | 状态变化 | 测试与验收证据 | 提交说明 | 遗留问题/下一步 |
| --- | --- | --- | --- | --- | --- |
| 2026-09-24 | 计划 | 创建；所有批次未开始 | 尚未运行测试 | 新增本计划文件 | 等待用户要求执行批次；按批次更新进度 |
| 2026-09-24 | 批次 0 | 已开始并完成 | 全量测试 204 通过；公开域名探测；Azure VM、Caddy 路由、生产镜像摘要和 PostgreSQL 数据目录已只读核对 | 记录基线与当前生产回退标识 | 批次 1 尚未开始；部署切换前确认数据库备份/恢复负责人、备份和恢复步骤 |
| 2026-09-24 | 批次 1 | 已完成 | Admin 宿主测试 100 通过；全量测试 217 通过；隔离 LocalDB 浏览器回归覆盖登录/TOTP、CRUD、标签、导航、报表和资源路径；旧根路径管理 URL 404 | Admin `/admin` 路径迁移及浏览器发现问题修正 | 批次 2 未开始；批次 4 登记新的 OIDC 回调并确认数据库备份/恢复责任 |
| 2026-09-24 | 批次 2 | 已完成 | Admin 宿主测试 100 通过；全量测试 217 通过；同宿主转发公开、管理授权、路由注册、健康检查和安全响应头验证通过 | Forwarder 接入 Admin 单应用宿主 | 批次 3 未开始；验证真实数据库初始化/读写及转发行为、安全边界 |
| 2026-09-24 | 批次 3 | 已完成 | 全量测试 230 通过；SQL Server/PostgreSQL 启动读写、内存/Redis 缓存失效、异步跟踪与清理、同域自引用拒绝及 Admin 浏览器 CRUD 通过 | 回归、安全响应头修正并记录批次 3 验收 | 批次 4 切换前须验收 External 代理与端口隔离、OIDC 新回调及数据库备份/恢复安排 |

状态只使用“未开始 / 进行中 / 已完成 / 受阻”。未获用户决定的产品或部署选择记为待确认，并附建议；不要据此自行切换生产或清理回退路径。
