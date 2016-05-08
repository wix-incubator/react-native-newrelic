/* global ErrorUtils */
import {NativeModules} from 'react-native';
import * as _ from 'lodash';

const logger = NativeModules.RNNewRelic;

let globalArgs = {};

class NewRelic {

  init(config) {
    if (config.overrideConsole) {
      this._overrideConsole();
    }
    if (config.reportUncaughtExceptions) {
      this._reportUncaughtExceptions();
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
   * registers global arguments that will be sent with every event
   * @param args
   */
  registerGlobalArgs(args) {
    globalArgs = {...globalArgs, ...args};
  }

  sendConsole(type, args) {
    const argsStr = _.map(args, String).join(', ');
    this.send('JSConsole', {consoleType: type, args: argsStr});
  }

  report(eventName, args) {
    this.send(eventName, args);
  }

  send(name, args) {
    const nameStr = String(name);
    const argsStr = {};
    _.forEach({...args, ...globalArgs}, (value, key) => {
      argsStr[String(key)] = String(value);
    });
    logger.send(nameStr, argsStr);
  }

}

export default new NewRelic();
