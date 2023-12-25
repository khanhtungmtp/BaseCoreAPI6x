// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const port: string = `:${+window.location.port - 1}`;
const protocol: string = window.location.protocol;
const hostname: string = window.location.hostname;
const host: string = `${hostname}${port}`;
const baseUrl: string = `${protocol}//${host}`;
export const environment = {
  production: true,
  apiUrl: `${baseUrl}/api/`,
  allowedDomains: [host],
  disallowedRoutes: [`${host}/api/auth`],
  imageUrl: `${baseUrl}/uploaded/images/`,
  videoUrl: `${baseUrl}/uploaded/video/`,
  fileUrl: `${baseUrl}/uploaded/files/`,
  hubUrl: `${baseUrl}/hubs/`
};
