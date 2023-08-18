// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const port: string = ':7215';
// const protocol: string = window.location.protocol;
const hostname: string = window.location.hostname;
const host: string = `${hostname}${port}`;
const baseUrl: string = `https://${host}`;
export const environment = {
  production: false,
  apiUrl: `${baseUrl}/api/`,
  allowedDomains: [host],
  disallowedRoutes: [`${host}/api/auth`],
  imageUrl: `${baseUrl}/uploaded/images/`,
  videoUrl: `${baseUrl}/uploaded/video/`,
  fileUrl: `${baseUrl}/uploaded/files/`,
  hubUrl: `${baseUrl}/hubs/`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
