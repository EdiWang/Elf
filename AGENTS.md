# Copilot Instructions

## Project Overview
- Elf is a .NET 10 link forward service used to provide stable redirect URLs for changing third-party URLs. It is similar to a URL shortener, but the main goal is long-lived static tokens and optional `aka` aliases, not maximum token compression.
- Public redirect endpoints live in `Elf.Api`. Admin management, tags, and reports live in `Elf.Admin`. Shared URL verification helpers live in `Elf.Shared`. Token generation lives in `Elf.TokenGenerator`.
- Main user flows:
	- `GET /fw/{token}` redirects by generated token.
	- `GET /aka/{akaName}` resolves an alias to a token, then redirects.
	- Admin pages create, edit, tag, enable/disable, delete, search, paginate, and report link usage.
	- Successful redirects can be tracked with IP, user agent, location, and request time when the `EnableTracking` feature flag is enabled.

## Solution Layout
- `src/Elf.slnx` is the solution file.
- `Elf.Api` is the public forwarder API. It uses controllers, LiteBus command/query handlers, Dapper, `IDbConnection`, distributed cache, rate limiting, security headers, and startup database initialization.
- `Elf.Admin` is the Razor Pages admin UI plus API controllers for the UI. It uses EF Core SQL Server with lazy-loading proxies, LiteBus command/query handlers, Fluent Web Components, Alpine.js modules, and Bootstrap Icons.
- `Elf.Shared` contains cross-project helpers such as `LinkVerifier`, `PingEndpoint`, URL validation, private IP detection, and feature flag names.
- `Elf.TokenGenerator` contains the `ITokenGenerator` implementation. The current token format is exactly 8 characters from a lowercase GUID prefix.
- `Elf.Shared.Tests` and `Elf.TokenGenerator.Tests` use xUnit v3, Moq, and coverlet.
- `deployment/main.bicep` deploys the API and Admin UI to Azure App Service with Linux containers and SQL Server.

## Architecture Guidelines
- Keep `Elf.Api` optimized for high-frequency redirect traffic. Prefer Dapper and small SQL projections for forwarder reads/writes instead of adding EF Core to the API path.
- Keep `Elf.Admin` as the place for management workflows and richer relational operations. Use `ElfDbContext` and EF Core for link, tag, and tracking management.
- Use LiteBus records for business operations:
	- Commands mutate state and are named like `CreateLinkCommand`, `EditLinkCommand`, `TrackSucessRedirectionCommand`.
	- Queries return data and are named like `GetLinkQuery`, `ListLinkQuery`, `GetLinkByTokenQuery`.
	- Register new handlers by keeping them in the project assembly; `Program.cs` already registers command and query modules from the assembly.
- Keep controllers thin. Controllers should validate HTTP concerns, invoke mediators, manage response codes, and delegate business logic to command/query handlers or shared services.
- Do not duplicate shared behavior between API and Admin. Put cross-cutting logic in `Elf.Shared` or an existing shared project when both apps need it.
- Respect the current split between API and Admin link entities. `Elf.Api.Data.LinkEntity` is a lightweight Dapper model; `Elf.Admin.Data.LinkEntity` is the EF Core entity with navigation properties.

## Redirect And Safety Rules
- Always validate destination URLs with `ILinkVerifier` before accepting or redirecting to an origin URL.
- Preserve the distinction between `InvalidFormat`, `InvalidLocal`, and `InvalidSelfReference` so API and Admin can return clear responses and logs.
- Self-reference blocking applies to forward endpoints (`/fw`, `/aka`) on the same scheme and host unless the `AllowSelfRedirection` feature flag is enabled.
- Do not bypass rate limiting on public forward endpoints. The API uses the `fixed-ip` policy and normalizes IPv6 callers to a `/64` subnet.
- Keep redirect responses uncached unless there is an explicit product decision to change that behavior.
- When changing cache behavior, remember Admin edits and deletes remove cached entries by token, while API caches successful enabled link lookups using `IDistributedCache`.

## Data And Configuration
- SQL Server is the primary database. API startup can create the initial schema through embedded SQL when the database is empty.
- `ConnectionStrings:ElfDatabase` is required for both apps.
- `ConnectionStrings:RedisConnection` is optional for `Elf.Api`; if missing, the API falls back to distributed memory cache.
- `DefaultRedirectionUrl` controls the API fallback target when a token is not found.
- `FeatureManagement:AllowSelfRedirection` and `FeatureManagement:EnableTracking` are the active feature flags.
- `ForwardedHeaders:Enabled` controls whether `UseSmartXFFHeader()` is used behind proxies.
- `ForwarderBaseUrl` in Admin is used to generate and display public forward links.
- Keep configuration keys compatible with environment variable binding, for example `ConnectionStrings__ElfDatabase`.

## Admin UI Guidelines
- This repo follows a Fluent Web Components design principle. Prefer Fluent controls such as `fluent-dropdown`, `fluent-text-input`, `fluent-button`, `fluent-dialog`, `fluent-switch`, and `fluent-progress-ring` instead of replacing them with native HTML elements unless explicitly requested.
- For date inputs, prioritize using Fluent components, for example `fluent-text-input type="date"`. Avoid using native inputs styled with custom CSS to simulate Fluent style.
- Keep Admin UI pages dense, operational, and table-oriented. Avoid marketing-style landing pages, oversized heroes, decorative cards, and unnecessary visual flourishes.
- Use existing Razor Pages, partials, and ES module patterns under `Elf.Admin/Pages` and `Elf.Admin/wwwroot/js`. Prefer extending existing modules such as `index.*.mjs`, `report.*.mjs`, and `tags.*.mjs` over placing large inline scripts in `.cshtml` files.
- Do not edit generated or vendored files under `wwwroot/lib`. Update `libman.json` when library dependencies need to change.
- Use Bootstrap Icons already present in the project for iconography unless the project adds another icon system.
- Preserve accessibility attributes already used in the UI, including `aria-*`, `role`, labels, disabled states, and screen-reader-only text.

## Coding Style
- Target `net10.0` and keep implicit usings enabled.
- Follow the existing C# style: file-scoped namespaces, records for LiteBus messages, constructor injection, async/await, and cancellation tokens in handlers where available.
- Prefer clear method names and small private helpers in controllers and handlers when a flow has multiple decision points.
- Use structured logging placeholders instead of string interpolation in logs, especially for user-provided values.
- Keep security-sensitive behavior explicit. Do not silently relax URL validation, self-reference checks, rate limits, forwarded header handling, or tracking feature flags.
- Add comments only when they clarify non-obvious behavior. Avoid comments that restate the code.
- Keep changes narrowly scoped. Do not refactor unrelated Admin UI, database schema, Docker, or Bicep code while making feature fixes.

## Testing And Validation
- Run all tests from the repo root with `dotnet test src/Elf.slnx`.
- For shared URL safety changes, add or update tests in `Elf.Shared.Tests/LinkVerifierTests.cs`.
- For token generation changes, add or update tests in `Elf.TokenGenerator.Tests/ShortGuidTokenGeneratorTests.cs`.
- When changing public API redirect behavior, verify token validation, disabled links, fallback redirect, cache invalidation, rate limiting, and tracking behavior.
- When changing Admin UI behavior, verify the relevant Razor page, API controller action, Alpine.js module, Fluent component state, and browser accessibility behavior.
