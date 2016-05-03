import {NativeModules} from 'react-native';
import * as _ from 'lodash';

const logger = NativeModules.NewRelicLogger;
let globalArgs = {};

export function overrideConsole() {
  const defaultLog = console.log;
  const defaultWarn = console.warn;
  const defaultError = console.error;
  console.log = (...args) => {
    sendConsole('log', ...args);
    defaultLog(...args);
  };
  console.warn = (...args) => {
    sendConsole('warn', ...args);
    defaultWarn(...args);
  };
  console.error = (...args) => {
    sendConsole('error', ...args);
    defaultError(...args);
  };
}

function sendConsole(type, ...args) {
  const argsStr = _.map(args, String).join(', ');
  send('JSConsole', {consoleType: type, args: argsStr});
}

export function report(eventName, args) {
  send(eventName, args);
}

function send(name, args) {
  const nameStr = String(name);
  const argsStr = {};
  _.forEach({...args, ...globalArgs}, (value, key) => {
    argsStr[String(key)] = String(value);
  });
  logger.send(nameStr, argsStr);
}
