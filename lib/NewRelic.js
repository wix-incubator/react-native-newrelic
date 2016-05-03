'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.






overrideConsole=overrideConsole;exports.




















registerGlobalArgs=registerGlobalArgs;exports.








report=report;var _reactNative=require('react-native');var _lodash=require('lodash');var _=_interopRequireWildcard(_lodash);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else {var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}var logger=_reactNative.NativeModules.RNNewRelic;var globalArgs={};function overrideConsole(){var defaultLog=console.log;var defaultWarn=console.warn;var defaultError=console.error;console.log=function(){sendConsole('log',arguments);defaultLog.apply(console,arguments);};console.warn=function(){sendConsole('warn',arguments);defaultWarn.apply(console,arguments);};console.error=function(){sendConsole('error',arguments);defaultError.apply(console,arguments);};} /**
 * registers global arguments that will be sent with every event
 * @param args
 */function registerGlobalArgs(args){globalArgs=args;}function sendConsole(type,args){var argsStr=_.map(args,String).join(', ');send('JSConsole',{consoleType:type,args:argsStr});}function report(eventName,args){send(eventName,args);}
function send(name,args){
var nameStr=String(name);
var argsStr={};
_.forEach(args,function(value,key){
argsStr[String(key)]=String(value);});

logger.send(nameStr,argsStr);}