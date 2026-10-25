"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/motion";
exports.ids = ["vendor-chunks/motion"];
exports.modules = {

/***/ "./node_modules/motion/dist/es/react.mjs":
/*!***********************************************!*\
  !*** ./node_modules/motion/dist/es/react.mjs ***!
  \***********************************************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   m: () => (/* binding */ m),\n/* harmony export */   motion: () => (/* binding */ motion)\n/* harmony export */ });\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! framer-motion */ \"framer-motion\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_0__]);\nframer_motion__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};\n/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in framer_motion__WEBPACK_IMPORTED_MODULE_0__) if([\"default\",\"m\",\"motion\"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => framer_motion__WEBPACK_IMPORTED_MODULE_0__[__WEBPACK_IMPORT_KEY__]\n/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);\n\n\n// Re-export everything from framer-motion.\n//\n// `motion` and `m` are aliased through local bindings so the module has\n// explicit named exports for IDE auto-import (see #3432). The previous\n// `export { motion, m } from \"framer-motion\"` line — sitting alongside\n// `export * from \"framer-motion\"` — was a duplicate-source re-export pattern\n// that caused Next.js Turbopack to OOM during module-graph analysis (#3741).\n// Local declarations shadow the wildcard re-export per the ES spec, so\n// `motion` and `m` come from the explicit bindings below and the rest from\n// `export *`.\nconst motion = framer_motion__WEBPACK_IMPORTED_MODULE_0__.motion;\nconst m = framer_motion__WEBPACK_IMPORTED_MODULE_0__.m;\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvbW90aW9uL2Rpc3QvZXMvcmVhY3QubWpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFvQztBQUNOO0FBRTlCLDJDQUEyQztBQUMzQyxFQUFFO0FBQ0Ysd0VBQXdFO0FBQ3hFLHVFQUF1RTtBQUN2RSx1RUFBdUU7QUFDdkUsNkVBQTZFO0FBQzdFLDZFQUE2RTtBQUM3RSx1RUFBdUU7QUFDdkUsMkVBQTJFO0FBQzNFLGNBQWM7QUFDZCxNQUFNQyxTQUFTRCxpREFBUztBQUN4QixNQUFNRSxJQUFJRiw0Q0FBSTtBQUVPIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmxpbmtpdC1mcm9udGVuZC8uL25vZGVfbW9kdWxlcy9tb3Rpb24vZGlzdC9lcy9yZWFjdC5tanM/NDcxMCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmbSBmcm9tICdmcmFtZXItbW90aW9uJztcbmV4cG9ydCAqIGZyb20gJ2ZyYW1lci1tb3Rpb24nO1xuXG4vLyBSZS1leHBvcnQgZXZlcnl0aGluZyBmcm9tIGZyYW1lci1tb3Rpb24uXG4vL1xuLy8gYG1vdGlvbmAgYW5kIGBtYCBhcmUgYWxpYXNlZCB0aHJvdWdoIGxvY2FsIGJpbmRpbmdzIHNvIHRoZSBtb2R1bGUgaGFzXG4vLyBleHBsaWNpdCBuYW1lZCBleHBvcnRzIGZvciBJREUgYXV0by1pbXBvcnQgKHNlZSAjMzQzMikuIFRoZSBwcmV2aW91c1xuLy8gYGV4cG9ydCB7IG1vdGlvbiwgbSB9IGZyb20gXCJmcmFtZXItbW90aW9uXCJgIGxpbmUg4oCUIHNpdHRpbmcgYWxvbmdzaWRlXG4vLyBgZXhwb3J0ICogZnJvbSBcImZyYW1lci1tb3Rpb25cImAg4oCUIHdhcyBhIGR1cGxpY2F0ZS1zb3VyY2UgcmUtZXhwb3J0IHBhdHRlcm5cbi8vIHRoYXQgY2F1c2VkIE5leHQuanMgVHVyYm9wYWNrIHRvIE9PTSBkdXJpbmcgbW9kdWxlLWdyYXBoIGFuYWx5c2lzICgjMzc0MSkuXG4vLyBMb2NhbCBkZWNsYXJhdGlvbnMgc2hhZG93IHRoZSB3aWxkY2FyZCByZS1leHBvcnQgcGVyIHRoZSBFUyBzcGVjLCBzb1xuLy8gYG1vdGlvbmAgYW5kIGBtYCBjb21lIGZyb20gdGhlIGV4cGxpY2l0IGJpbmRpbmdzIGJlbG93IGFuZCB0aGUgcmVzdCBmcm9tXG4vLyBgZXhwb3J0ICpgLlxuY29uc3QgbW90aW9uID0gZm0ubW90aW9uO1xuY29uc3QgbSA9IGZtLm07XG5cbmV4cG9ydCB7IG0sIG1vdGlvbiB9O1xuIl0sIm5hbWVzIjpbImZtIiwibW90aW9uIiwibSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/motion/dist/es/react.mjs\n");

/***/ })

};
;