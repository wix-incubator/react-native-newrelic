'use strict';Object.defineProperty(exports,"__esModule",{value:true});exports.




overrideConsole=overrideConsole;exports.






















report=report;var _reactNative=require('react-native');var _lodash=require('lodash');var _=_interopRequireWildcard(_lodash);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else {var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}var logger=_reactNative.NativeModules.NewRelicLogger;function overrideConsole(){var defaultLog=console.log;var defaultWarn=console.warn;var defaultError=console.error;console.log=function(){for(var _len=arguments.length,args=Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}sendConsole.apply(undefined,['log'].concat(args));defaultLog.apply(undefined,args);};console.warn=function(){for(var _len2=arguments.length,args=Array(_len2),_key2=0;_key2<_len2;_key2++){args[_key2]=arguments[_key2];}sendConsole.apply(undefined,['warn'].concat(args));defaultWarn.apply(undefined,args);};console.error=function(){for(var _len3=arguments.length,args=Array(_len3),_key3=0;_key3<_len3;_key3++){args[_key3]=arguments[_key3];}sendConsole.apply(undefined,['error'].concat(args));defaultError.apply(undefined,args);};}function sendConsole(type){for(var _len4=arguments.length,args=Array(_len4>1?_len4-1:0),_key4=1;_key4<_len4;_key4++){args[_key4-1]=arguments[_key4];}var argsStr=_.map(args,String).join(', ');send('JSConsole',{consoleType:type,args:argsStr});}function report(eventName,args){
send(eventName,args);}


function send(name,args){
var nameStr=String(name);
var argsStr={};
_.forEach(args,function(value,key){
argsStr[String(key)]=String(value);});

logger.send(nameStr,argsStr);}