'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}(); /* globals ErrorUtils, __DEV__ */
var _reactNative=require('react-native');
var _lodash=require('lodash');var _=_interopRequireWildcard(_lodash);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}else {var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}newObj.default=obj;return newObj;}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}

var RNNewRelic=_reactNative.NativeModules.RNNewRelic;var 

NewRelic=function(){function NewRelic(){_classCallCheck(this,NewRelic);}_createClass(NewRelic,[{key:'init',value:function init(

config){
if(config.overrideConsole){
this._overrideConsole();}

if(config.reportUncaughtExceptions){
this._reportUncaughtExceptions();}

if(config.reportRejectedPromises){
this._reportRejectedPromises();}

if(config.globalAttributes){
this.setGlobalAttributes(config.globalAttributes);}}},{key:'_overrideConsole',value:function _overrideConsole()



{
var defaultLog=console.log;
var defaultWarn=console.warn;
var defaultError=console.error;
var self=this;

console.log=function(){
self.sendConsole('log',arguments);
defaultLog.apply(console,arguments);};

console.warn=function(){
self.sendConsole('warn',arguments);
defaultWarn.apply(console,arguments);};

console.error=function(){
self.sendConsole('error',arguments);
defaultError.apply(console,arguments);};}},{key:'_reportUncaughtExceptions',value:function _reportUncaughtExceptions()



{var _this=this;var errorUtils=arguments.length<=0||arguments[0]===undefined?global.ErrorUtils:arguments[0];
var defaultHandler=errorUtils._globalHandler;
errorUtils._globalHandler=function(error){
_this.send('JS:UncaughtException',{error:error,stack:error&&error.stack});
defaultHandler(error);};}},{key:'_reportRejectedPromises',value:function _reportRejectedPromises()



{var _this2=this;
var rejectionTracking=require('promise/setimmediate/rejection-tracking');
if(!__DEV__){
rejectionTracking.enable({
allRejections:true,
onUnhandled:function onUnhandled(id,error){
_this2.send('JS:UnhandledRejectedPromise',{error:error});
_this2.nativeLog('[UnhandledRejectedPromise] '+error);},

onHandled:function onHandled(){
//
}});}}




/**
   * registers global attributes that will be sent with every event
   * @param args
   */},{key:'setGlobalAttributes',value:function setGlobalAttributes(
args){
_.forEach(args,function(value,key){
RNNewRelic.setAttribute(String(key),String(value));});}},{key:'sendConsole',value:function sendConsole(



type,args){
var argsStr=_.map(args,String).join(', ');
this.send('JSConsole',{consoleType:type,args:argsStr});
if(type==='error'){
this.nativeLog('[JSConsole:Error] '+argsStr);}}},{key:'report',value:function report(



eventName,args){
this.send(eventName,args);}


/*
   logs a message to the native console (useful when running in release mode)
  */},{key:'nativeLog',value:function nativeLog(
log){
RNNewRelic.nativeLog(log);}},{key:'send',value:function send(


name,args){
var nameStr=String(name);
var argsStr={};
_.forEach(args,function(value,key){
argsStr[String(key)]=String(value);});

RNNewRelic.send(nameStr,argsStr);}}]);return NewRelic;}();exports.default=




new NewRelic();