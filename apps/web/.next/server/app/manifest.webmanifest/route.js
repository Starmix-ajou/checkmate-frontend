/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/manifest.webmanifest/route";
exports.ids = ["app/manifest.webmanifest/route"];
exports.modules = {

/***/ "(rsc)/../../node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fmanifest.webmanifest%2Froute&page=%2Fmanifest.webmanifest%2Froute&appPaths=&pagePath=private-next-app-dir%2Fmanifest.ts&appDir=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fmanifest.webmanifest%2Froute&page=%2Fmanifest.webmanifest%2Froute&appPaths=&pagePath=private-next-app-dir%2Fmanifest.ts&appDir=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/../../node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/../../node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/../../node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_metadata_route_loader_filePath_2FUsers_2Fpjookim_2Fcapstone_2Fcheckmate_frontend_2Fapps_2Fweb_2Fapp_2Fmanifest_ts_isDynamicRouteExtension_1_next_metadata_route___WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next-metadata-route-loader?filePath=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb%2Fapp%2Fmanifest.ts&isDynamicRouteExtension=1!?__next_metadata_route__ */ \"(rsc)/../../node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js?filePath=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb%2Fapp%2Fmanifest.ts&isDynamicRouteExtension=1!?__next_metadata_route__\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/manifest.webmanifest/route\",\n        pathname: \"/manifest.webmanifest\",\n        filename: \"manifest\",\n        bundlePath: \"app/manifest.webmanifest/route\"\n    },\n    resolvedPagePath: \"next-metadata-route-loader?filePath=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb%2Fapp%2Fmanifest.ts&isDynamicRouteExtension=1!?__next_metadata_route__\",\n    nextConfigOutput,\n    userland: next_metadata_route_loader_filePath_2FUsers_2Fpjookim_2Fcapstone_2Fcheckmate_frontend_2Fapps_2Fweb_2Fapp_2Fmanifest_ts_isDynamicRouteExtension_1_next_metadata_route___WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vLi4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9idWlsZC93ZWJwYWNrL2xvYWRlcnMvbmV4dC1hcHAtbG9hZGVyL2luZGV4LmpzP25hbWU9YXBwJTJGbWFuaWZlc3Qud2VibWFuaWZlc3QlMkZyb3V0ZSZwYWdlPSUyRm1hbmlmZXN0LndlYm1hbmlmZXN0JTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGbWFuaWZlc3QudHMmYXBwRGlyPSUyRlVzZXJzJTJGcGpvb2tpbSUyRmNhcHN0b25lJTJGY2hlY2ttYXRlLWZyb250ZW5kJTJGYXBwcyUyRndlYiUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZwam9va2ltJTJGY2Fwc3RvbmUlMkZjaGVja21hdGUtZnJvbnRlbmQlMkZhcHBzJTJGd2ViJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUMwSDtBQUN2TTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwibmV4dC1tZXRhZGF0YS1yb3V0ZS1sb2FkZXI/ZmlsZVBhdGg9JTJGVXNlcnMlMkZwam9va2ltJTJGY2Fwc3RvbmUlMkZjaGVja21hdGUtZnJvbnRlbmQlMkZhcHBzJTJGd2ViJTJGYXBwJTJGbWFuaWZlc3QudHMmaXNEeW5hbWljUm91dGVFeHRlbnNpb249MSE/X19uZXh0X21ldGFkYXRhX3JvdXRlX19cIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvbWFuaWZlc3Qud2VibWFuaWZlc3Qvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL21hbmlmZXN0LndlYm1hbmlmZXN0XCIsXG4gICAgICAgIGZpbGVuYW1lOiBcIm1hbmlmZXN0XCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL21hbmlmZXN0LndlYm1hbmlmZXN0L3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwibmV4dC1tZXRhZGF0YS1yb3V0ZS1sb2FkZXI/ZmlsZVBhdGg9JTJGVXNlcnMlMkZwam9va2ltJTJGY2Fwc3RvbmUlMkZjaGVja21hdGUtZnJvbnRlbmQlMkZhcHBzJTJGd2ViJTJGYXBwJTJGbWFuaWZlc3QudHMmaXNEeW5hbWljUm91dGVFeHRlbnNpb249MSE/X19uZXh0X21ldGFkYXRhX3JvdXRlX19cIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/../../node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fmanifest.webmanifest%2Froute&page=%2Fmanifest.webmanifest%2Froute&appPaths=&pagePath=private-next-app-dir%2Fmanifest.ts&appDir=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/../../node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!**********************************************************************************************************!*\
  !*** ../../node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \**********************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/../../node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js?filePath=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb%2Fapp%2Fmanifest.ts&isDynamicRouteExtension=1!?__next_metadata_route__":
/*!****************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js?filePath=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb%2Fapp%2Fmanifest.ts&isDynamicRouteExtension=1!?__next_metadata_route__ ***!
  \****************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/../../node_modules/next/dist/api/server.js\");\n/* harmony import */ var _Users_pjookim_capstone_checkmate_frontend_apps_web_app_manifest_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/manifest.ts */ \"(rsc)/./app/manifest.ts\");\n/* harmony import */ var next_dist_build_webpack_loaders_metadata_resolve_route_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/webpack/loaders/metadata/resolve-route-data */ \"(rsc)/../../node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js\");\n/* harmony import */ var next_dist_build_webpack_loaders_metadata_resolve_route_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_build_webpack_loaders_metadata_resolve_route_data__WEBPACK_IMPORTED_MODULE_2__);\n/* dynamic asset route */\n\n\n\n\nconst contentType = \"application/manifest+json\"\nconst fileType = \"manifest\"\n\n\n  if (typeof _Users_pjookim_capstone_checkmate_frontend_apps_web_app_manifest_ts__WEBPACK_IMPORTED_MODULE_1__[\"default\"] !== 'function') {\n    throw new Error('Default export is missing in \"/Users/pjookim/capstone/checkmate-frontend/apps/web/app/manifest.ts\"')\n  }\n  \n\n\nasync function GET() {\n  const data = await (0,_Users_pjookim_capstone_checkmate_frontend_apps_web_app_manifest_ts__WEBPACK_IMPORTED_MODULE_1__[\"default\"])()\n  const content = (0,next_dist_build_webpack_loaders_metadata_resolve_route_data__WEBPACK_IMPORTED_MODULE_2__.resolveRouteData)(data, fileType)\n\n  return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(content, {\n    headers: {\n      'Content-Type': contentType,\n      'Cache-Control': \"public, max-age=0, must-revalidate\",\n    },\n  })\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vLi4vbm9kZV9tb2R1bGVzL25leHQvZGlzdC9idWlsZC93ZWJwYWNrL2xvYWRlcnMvbmV4dC1tZXRhZGF0YS1yb3V0ZS1sb2FkZXIuanM/ZmlsZVBhdGg9JTJGVXNlcnMlMkZwam9va2ltJTJGY2Fwc3RvbmUlMkZjaGVja21hdGUtZnJvbnRlbmQlMkZhcHBzJTJGd2ViJTJGYXBwJTJGbWFuaWZlc3QudHMmaXNEeW5hbWljUm91dGVFeHRlbnNpb249MSE/X19uZXh0X21ldGFkYXRhX3JvdXRlX18iLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUMwQztBQUMrQztBQUNLOztBQUU5RjtBQUNBOzs7QUFHQSxhQUFhLDJHQUFPO0FBQ3BCO0FBQ0E7QUFDQTs7O0FBR087QUFDUCxxQkFBcUIsK0dBQU87QUFDNUIsa0JBQWtCLDZHQUFnQjs7QUFFbEMsYUFBYSxxREFBWTtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIIiwic291cmNlcyI6WyI/X19uZXh0X21ldGFkYXRhX3JvdXRlX18iXSwic291cmNlc0NvbnRlbnQiOlsiLyogZHluYW1pYyBhc3NldCByb3V0ZSAqL1xuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXG5pbXBvcnQgaGFuZGxlciBmcm9tIFwiL1VzZXJzL3Bqb29raW0vY2Fwc3RvbmUvY2hlY2ttYXRlLWZyb250ZW5kL2FwcHMvd2ViL2FwcC9tYW5pZmVzdC50c1wiXG5pbXBvcnQgeyByZXNvbHZlUm91dGVEYXRhIH0gZnJvbSAnbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9tZXRhZGF0YS9yZXNvbHZlLXJvdXRlLWRhdGEnXG5cbmNvbnN0IGNvbnRlbnRUeXBlID0gXCJhcHBsaWNhdGlvbi9tYW5pZmVzdCtqc29uXCJcbmNvbnN0IGZpbGVUeXBlID0gXCJtYW5pZmVzdFwiXG5cblxuICBpZiAodHlwZW9mIGhhbmRsZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0RlZmF1bHQgZXhwb3J0IGlzIG1pc3NpbmcgaW4gXCIvVXNlcnMvcGpvb2tpbS9jYXBzdG9uZS9jaGVja21hdGUtZnJvbnRlbmQvYXBwcy93ZWIvYXBwL21hbmlmZXN0LnRzXCInKVxuICB9XG4gIFxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBoYW5kbGVyKClcbiAgY29uc3QgY29udGVudCA9IHJlc29sdmVSb3V0ZURhdGEoZGF0YSwgZmlsZVR5cGUpXG5cbiAgcmV0dXJuIG5ldyBOZXh0UmVzcG9uc2UoY29udGVudCwge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiBjb250ZW50VHlwZSxcbiAgICAgICdDYWNoZS1Db250cm9sJzogXCJwdWJsaWMsIG1heC1hZ2U9MCwgbXVzdC1yZXZhbGlkYXRlXCIsXG4gICAgfSxcbiAgfSlcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../../node_modules/next/dist/build/webpack/loaders/next-metadata-route-loader.js?filePath=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb%2Fapp%2Fmanifest.ts&isDynamicRouteExtension=1!?__next_metadata_route__\n");

/***/ }),

/***/ "(rsc)/./app/manifest.ts":
/*!*************************!*\
  !*** ./app/manifest.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ manifest)\n/* harmony export */ });\nfunction manifest() {\n    return {\n        name: 'checkmate',\n        short_name: 'checkmate',\n        description: '팀이 성장하는 순간, checkmate가 함께합니다',\n        start_url: '/',\n        display: 'standalone',\n        background_color: '#ffffff',\n        theme_color: '#795548',\n        icons: [\n            {\n                src: '/favicon.ico',\n                sizes: 'any',\n                type: 'image/x-icon'\n            }\n        ]\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvbWFuaWZlc3QudHMiLCJtYXBwaW5ncyI6Ijs7OztBQUVlLFNBQVNBO0lBQ3RCLE9BQU87UUFDTEMsTUFBTTtRQUNOQyxZQUFZO1FBQ1pDLGFBQWE7UUFDYkMsV0FBVztRQUNYQyxTQUFTO1FBQ1RDLGtCQUFrQjtRQUNsQkMsYUFBYTtRQUNiQyxPQUFPO1lBQ0w7Z0JBQ0VDLEtBQUs7Z0JBQ0xDLE9BQU87Z0JBQ1BDLE1BQU07WUFDUjtTQUNEO0lBQ0g7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL3Bqb29raW0vY2Fwc3RvbmUvY2hlY2ttYXRlLWZyb250ZW5kL2FwcHMvd2ViL2FwcC9tYW5pZmVzdC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGFkYXRhUm91dGUgfSBmcm9tICduZXh0J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYW5pZmVzdCgpOiBNZXRhZGF0YVJvdXRlLk1hbmlmZXN0IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnY2hlY2ttYXRlJyxcbiAgICBzaG9ydF9uYW1lOiAnY2hlY2ttYXRlJyxcbiAgICBkZXNjcmlwdGlvbjogJ+2MgOydtCDshLHsnqXtlZjripQg7Iic6rCELCBjaGVja21hdGXqsIAg7ZWo6ruY7ZWp64uI64ukJyxcbiAgICBzdGFydF91cmw6ICcvJyxcbiAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxuICAgIHRoZW1lX2NvbG9yOiAnIzc5NTU0OCcsXG4gICAgaWNvbnM6IFtcbiAgICAgIHtcbiAgICAgICAgc3JjOiAnL2Zhdmljb24uaWNvJyxcbiAgICAgICAgc2l6ZXM6ICdhbnknLFxuICAgICAgICB0eXBlOiAnaW1hZ2UveC1pY29uJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfVxufVxuIl0sIm5hbWVzIjpbIm1hbmlmZXN0IiwibmFtZSIsInNob3J0X25hbWUiLCJkZXNjcmlwdGlvbiIsInN0YXJ0X3VybCIsImRpc3BsYXkiLCJiYWNrZ3JvdW5kX2NvbG9yIiwidGhlbWVfY29sb3IiLCJpY29ucyIsInNyYyIsInNpemVzIiwidHlwZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/manifest.ts\n");

/***/ }),

/***/ "(ssr)/../../node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!**********************************************************************************************************!*\
  !*** ../../node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \**********************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/../../node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fmanifest.webmanifest%2Froute&page=%2Fmanifest.webmanifest%2Froute&appPaths=&pagePath=private-next-app-dir%2Fmanifest.ts&appDir=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fpjookim%2Fcapstone%2Fcheckmate-frontend%2Fapps%2Fweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();