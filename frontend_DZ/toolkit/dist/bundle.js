/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const http = __webpack_require__(/*! http */ \"http\");\r\n(__webpack_require__(/*! dotenv */ \"dotenv\").config)({ path: `.env.${\"development\"}` });\r\n\r\nconsole.log('Loaded environment variables:', process.env);\r\n\r\nconst host = process.env.HOST;\r\nconst port = process.env.PORT;\r\n\r\nlet message;\r\nswitch (\"development\") {\r\n  case 'local':\r\n    message = 'Hello';\r\n    break;\r\n  case 'dev':\r\n    message = 'Hello world and galaxy!';\r\n    break;\r\n  case 'prod':\r\n    message = 'Hello world!';\r\n    break;\r\n  default:\r\n    message = 'Environment not recognized!';\r\n}\r\n\r\nconst server = http.createServer((req, res) => {\r\n  res.statusCode = 200;\r\n  res.setHeader('Content-Type', 'text/html');\r\n  res.end(`${message}\\n`);\r\n});\r\n\r\nserver.listen(port, host, () => {\r\n  console.log(`Сервер запущен на ${host}:${port}`);\r\n  console.log('Environment:', \"development\");\r\n  console.log('API URL:', process.env.API_URL);\r\n  console.log('Database Host:', process.env.DB_HOST);\r\n  console.log('Database Port:', process.env.DB_PORT);\r\n  console.log('Log Level:', process.env.LOG_LEVEL);\r\n});\n\n//# sourceURL=webpack://multi-env-project/./index.js?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;