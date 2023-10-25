// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  elfApiBaseUrl: window["env"]["elfApiBaseUrl"] || "https://localhost:5001",
  clientId: window["env"]["clientId"] || '00000000-0000-0000-0000-000000000000',
  tenantId: window["env"]["tenantId"] || '00000000-0000-0000-0000-000000000000',
  applicationIdUri: window["env"]["applicationIdUri"] || "api://elf"
};
