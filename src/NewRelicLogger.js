import {NativeModules} from 'react-native';
import * as _ from 'lodash';

const logger = NativeModules.NewRelicLogger;

export function overrideConsole() {
  const defaultLog = console.log;
  const defaultWarn = console.warn;
  const defaultError = console.error;
  console.log = function() {
    sendConsole('log', arguments);
    defaultLog.apply(console, arguments);
  };
  console.warn = function() {
    sendConsole('warn', arguments);
    defaultWarn.apply(console, arguments);
  };
  console.error = function() {
    sendConsole('error', arguments);
    defaultError.apply(console, arguments);
  };
}
/**
 * registers global arguments that will be sent with every event
 * @param args
 */
export function registerGlobalArgs(args) {
  globalArgs = args;
}

function sendConsole(type, args) {
  const argsStr = _.map(args, String).join(', ');
  send('JSConsole', {consoleType: type, args: argsStr});
}

export function report(eventName, args) {
  send(eventName, args);
}

function send(name, args) {
  const nameStr = String(name);
  const argsStr = {};
  _.forEach(args, (value, key) => {
    argsStr[String(key)] = String(value);
  });
  logger.send(nameStr, argsStr);
}
