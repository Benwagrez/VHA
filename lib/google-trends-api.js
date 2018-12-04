(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("https"), require("querystring"));
	else if(typeof define === 'function' && define.amd)
		define("google-trends-api", ["https", "querystring"], factory);
	else if(typeof exports === 'object')
		exports["google-trends-api"] = factory(require("https"), require("querystring"));
	else
		root["google-trends-api"] = factory(root["https"], root["querystring"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _api = __webpack_require__(1);
	
	var _api2 = _interopRequireDefault(_api);
	
	var _request = __webpack_require__(3);
	
	var _request2 = _interopRequireDefault(_request);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var apiRequest = _api2.default.bind(undefined, _request2.default);
	
	exports.default = {
	  autoComplete: apiRequest('Auto complete'),
	  interestByRegion: apiRequest('Interest by region'),
	  interestOverTime: apiRequest('Interest over time'),
	  relatedQueries: apiRequest('Related queries'),
	  relatedTopics: apiRequest('Related topics')
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utilities = __webpack_require__(2);
	
	exports.default = function (request, searchType) {
	  var resultsPromise = (0, _utilities.getResults)(request);
	
	  return function (reqObj, cb) {
	    var _constructObj = (0, _utilities.constructObj)(reqObj, cb),
	        cbFunc = _constructObj.cbFunc,
	        obj = _constructObj.obj;
	
	    if (obj instanceof Error) return Promise.reject(cbFunc(obj));
	
	    return resultsPromise(searchType, obj).then(function (res) {
	      return cbFunc(null, res);
	    }).catch(function (err) {
	      return Promise.reject(cbFunc(err));
	    });
	  };
	};
	
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.isLessThan7Days = isLessThan7Days;
	exports.convertDateToString = convertDateToString;
	exports.formatTime = formatTime;
	exports.constructObj = constructObj;
	exports.formatResolution = formatResolution;
	exports.parseResults = parseResults;
	exports.formatComparisonItems = formatComparisonItems;
	exports.getResults = getResults;
	function isLessThan7Days(date1, date2) {
	  return Math.abs(date2 - date1) / (24 * 60 * 60 * 1000) < 7;
	}
	
	function convertDateToString(d, shouldIncludeTime) {
	  var month = (d.getUTCMonth() + 1).toString();
	
	  month = month.length < 2 ? '0' + month : month;
	  var day = d.getUTCDate().toString();
	  var year = d.getUTCFullYear().toString();
	  var hour = d.getUTCHours();
	  var minute = d.getUTCMinutes();
	
	  if (shouldIncludeTime) {
	    return year + '-' + month + '-' + day + 'T' + hour + '\\:' + minute + '\\:00';
	  }
	
	  return year + '-' + month + '-' + day;
	}
	
	function formatTime(obj) {
	  if (obj.startTime && !(obj.startTime instanceof Date)) {
	    return new Error('startTime must be a Date object');
	  }
	  if (obj.endTime && !(obj.endTime instanceof Date)) {
	    return new Error('endTime must be a Date object');
	  }
	
	  if (obj.startTime && obj.endTime && obj.startTime > obj.endTime) {
	    var temp = obj.startTime;
	
	    obj.startTime = obj.endTime;
	    obj.endTime = temp;
	  }
	
	  if (!obj.endTime) obj.endTime = new Date();
	  if (!obj.startTime) obj.startTime = new Date('2004-01-01');
	
	  var shouldIncludeTime = isLessThan7Days(obj.startTime, obj.endTime);
	
	  var startTime = convertDateToString(obj.startTime, shouldIncludeTime && obj.granularTimeResolution);
	  var endTime = convertDateToString(obj.endTime, shouldIncludeTime && obj.granularTimeResolution);
	
	  obj.time = startTime + ' ' + endTime;
	  return obj;
	}
	
	function constructObj(obj, cbFunc) {
	  if (typeof obj === 'function') cbFunc = obj;
	
	  if (!obj || !!obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || Array.isArray(obj)) {
	    obj = new Error('Must supply an object');
	  } else if (!obj.keyword) obj = new Error('Must have a keyword field');
	
	  if (!!cbFunc && typeof cbFunc !== 'function') {
	    obj = new Error('Callback function must be a function');
	  }
	
	  if (!obj.hl) obj.hl = 'en-US';
	  if (!obj.category) obj.category = 0;
	  if (!obj.timezone) obj.timezone = new Date().getTimezoneOffset();
	
	  var possibleProperties = ['images', 'news', 'youtube', 'froogle', ''];
	
	  if (possibleProperties.indexOf(obj.property) === -1) {
	    obj.property = '';
	  }
	
	  if (!cbFunc) {
	    cbFunc = function cbFunc(err, res) {
	      if (err) return err;
	      return res;
	    };
	  }
	
	  obj = formatTime(obj);
	
	  return {
	    cbFunc: cbFunc,
	    obj: obj
	  };
	}
	
	function formatResolution() {
	  var resolution = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	  var resolutions = ['COUNTRY', 'REGION', 'CITY', 'DMA'];
	  var isResValid = resolutions.some(function (res) {
	    return res === resolution.toUpperCase();
	  });
	
	  if (isResValid) return resolution.toUpperCase();
	  return '';
	}
	
	/**
	 * Parse the result of the google api as JSON
	 * Throws an Error if the JSON is invalid
	 * @param  {String} results
	 * @return {Object}
	 */
	function parseResults(results) {
	  // If this fails, you've hit the rate limit or Google has changed something
	  try {
	    return JSON.parse(results.slice(4)).widgets;
	  } catch (e) {
	    // Throw the JSON error e.g.
	    // { message: 'Unexpected token C in JSON at position 0',
	    //   requestBody: '<!DOCTYPE html><html>...'}
	    e.requestBody = results;
	    throw e;
	  }
	}
	
	/**
	 * Create the array of comparisonItems to be used
	 * @param  {Object} obj The query obj with .keyword property and optionally
	 *                      the .geo property
	 * @return {Array}     Returns an array of comparisonItems
	 */
	function formatComparisonItems(obj) {
	
	  // If we are requesting an array of keywords for comparison
	  if (Array.isArray(obj.keyword)) {
	
	    // Map the keywords to the items array
	    var items = obj.keyword.reduce(function (arr, keyword) {
	      // Add the keyword to the array
	      arr.push(_extends({}, obj, { keyword: keyword }));
	
	      return arr;
	    }, []);
	
	    // Is there an array of regions as well?
	    if (obj.geo && Array.isArray(obj.geo)) {
	
	      obj.geo.forEach(function (region, index) {
	        items[index].geo = region;
	      });
	    }
	
	    return items;
	  }
	
	  return [obj];
	}
	
	function getResults(request) {
	  return function (searchType, obj) {
	    var map = {
	      'Auto complete': {
	        path: '/trends/api/autocomplete/' + encodeURIComponent(obj.keyword)
	      },
	      'Interest over time': {
	        path: '/trends/api/widgetdata/multiline',
	        _id: 'TIMESERIES'
	      },
	      'Interest by region': {
	        path: '/trends/api/widgetdata/comparedgeo',
	        resolution: formatResolution(obj.resolution),
	        _id: 'GEO_MAP'
	      },
	      'Related topics': {
	        path: '/trends/api/widgetdata/relatedsearches',
	        _id: 'RELATED_TOPICS'
	      },
	      'Related queries': {
	        path: '/trends/api/widgetdata/relatedsearches',
	        _id: 'RELATED_QUERIES'
	      }
	    };
	
	    var options = {
	      method: 'GET',
	      host: 'trends.google.com',
	      path: '/trends/api/explore',
	      qs: {
	        hl: obj.hl,
	        req: JSON.stringify({
	          comparisonItem: formatComparisonItems(obj),
	          category: obj.category,
	          property: obj.property
	        }),
	        tz: obj.timezone
	      }
	    };
	
	    if (obj.agent) options.agent = obj.agent;
	
	    var _map$searchType = map[searchType],
	        path = _map$searchType.path,
	        resolution = _map$searchType.resolution,
	        _id = _map$searchType._id;
	
	
	    return request(options).then(function (results) {
	      var parsedResults = parseResults(results);
	
	      /**
	       * Search for the id that matches the search result
	       * Auto complete does not have results on initial query
	       * so just pass the first available result with request
	      */
	      var resultObj = parsedResults.find(function (_ref) {
	        var _ref$id = _ref.id,
	            id = _ref$id === undefined ? '' : _ref$id,
	            request = _ref.request;
	
	        return id.indexOf(_id) > -1 || searchType === 'Auto complete' && request;
	      });
	
	      if (!resultObj) {
	        var errObj = {
	          message: 'Available widgets does not contain selected api type',
	          requestBody: results
	        };
	
	        throw errObj;
	      }
	
	      var req = resultObj.request;
	      var token = resultObj.token;
	
	      if (resolution) req.resolution = resolution;
	      req.requestOptions.category = obj.category;
	      req.requestOptions.property = obj.property;
	      req = JSON.stringify(req);
	
	      var nextOptions = {
	        path: path,
	        method: 'GET',
	        host: 'trends.google.com',
	        qs: {
	          hl: obj.hl,
	          req: req,
	          token: token,
	          tz: obj.timezone
	        }
	      };
	
	      if (obj.agent) nextOptions.agent = obj.agent;
	
	      return request(nextOptions);
	    }).then(function (res) {
	      try {
	        /** JSON.parse will decode unicode */
	        var results = JSON.stringify(JSON.parse(res.slice(5)));
	
	        return results;
	      } catch (e) {
	        /** throws if not valid JSON, so just return unaltered res string */
	        return res;
	      }
	    });
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = request;
	
	var _https = __webpack_require__(4);
	
	var _https2 = _interopRequireDefault(_https);
	
	var _querystring = __webpack_require__(5);
	
	var _querystring2 = _interopRequireDefault(_querystring);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// cache of the cookie - avoid re-requesting on subsequent requests.
	var cookieVal = void 0;
	
	// simpler request method for avoiding double-promise confusion
	function rereq(options, done) {
	  var req = void 0;
	
	  req = _https2.default.request(options, function (res) {
	    var chunk = '';
	
	    res.on('data', function (data) {
	      chunk += data;
	    });
	    res.on('end', function () {
	      done(null, chunk.toString('utf8'));
	    });
	  });
	  req.on('error', function (e) {
	    done(e);
	  });
	  req.end();
	}
	
	function request(_ref) {
	  var method = _ref.method,
	      host = _ref.host,
	      path = _ref.path,
	      qs = _ref.qs,
	      agent = _ref.agent;
	
	  var options = {
	    host: host,
	    method: method,
	    path: path + '?' + _querystring2.default.stringify(qs)
	  };
	
	  if (agent) options.agent = agent;
	  // will use cached cookieVal if set on 429 error
	  if (cookieVal) options.headers = { 'cookie': cookieVal };
	
	  return new Promise(function (resolve, reject) {
	    var req = _https2.default.request(options, function (res) {
	      var chunk = '';
	
	      res.on('data', function (data) {
	        chunk += data;
	      });
	
	      res.on('end', function () {
	        if (res.statusCode === 429 && res.headers['set-cookie']) {
	          // Fix for the "too many requests" issue
	          // Look for the set-cookie header and re-request
	          cookieVal = res.headers['set-cookie'][0].split(';')[0];
	          options.headers = { 'cookie': cookieVal };
	          rereq(options, function (err, response) {
	            if (err) return reject(err);
	            resolve(response);
	          });
	        } else {
	          resolve(chunk.toString('utf8'));
	        }
	      });
	    });
	
	    req.on('error', function (e) {
	      reject(e);
	    });
	
	    req.end();
	  });
	}
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("https");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("querystring");

/***/ }
/******/ ])
});
;
//# sourceMappingURL=google-trends-api.js.map