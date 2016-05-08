/* global ErrorUtils */
import {NativeModules} from 'react-native';
import * as _ from 'lodash';

const RNNewRelic = NativeModules.RNNewRelic;

class NewRelic {

  init(config) {
    if (config.overrideConsole) {
      this._overrideConsole();
    }
    if (config.reportUncaughtExceptions) {
      this._reportUncaughtExceptions();
    }
    if (config.globalAttributes) {
      this.setGlobalAttributes(config.globalAttributes);
    }
  }

  _overrideConsole() {
    const defaultLog = console.log;
    const defaultWarn = console.warn;
    const defaultError = console.error;
    const self = this;

    console.log = function() {
      self.sendConsole('log', arguments);
      defaultLog.apply(console, arguments);
    };
    console.warn = function() {
      self.sendConsole('warn', arguments);
      defaultWarn.apply(console, arguments);
    };
    console.error = function() {
      self.sendConsole('error', arguments);
      defaultError.apply(console, arguments);
    };
  }

  _reportUncaughtExceptions(errorUtils = global.ErrorUtils) {
    const defaultHandler = errorUtils._globalHandler;
    errorUtils._globalHandler = (error) => {
      this.send('JSUncaughtException', {error, stack: error && error.stack});
      defaultHandler(error);
    };
  }

  /**
   * registers global attributes that will be sent with every event
   * @param args
   */
  setGlobalAttributes(args) {
    debugger;
    _.forEach(args, (value, key) => {
      debugger;
      RNNewRelic.setAttribute(String(key), String(value));
    });
  }

  sendConsole(type, args) {
    const argsStr = _.map(args, String).join(', ');
    this.send('JSConsole', {consoleType: type, args: argsStr});
    if (type === 'error') {
      this.nativeLog('[JSConsole:Error] ' + argsStr);
    }
  }

  report(eventName, args) {
    this.send(eventName, args);
  }

  /*
   logs a message to the native console (useful when running in release mode)
  */
  nativeLog(log) {
    RNNewRelic.nativeLog(log);
  }

  send(name, args) {
    const nameStr = String(name);
    const argsStr = {};
    _.forEach(args, (value, key) => {
      argsStr[String(key)] = String(value);
    });
    RNNewRelic.send(nameStr, argsStr);
  }

}

export default new NewRelic();
