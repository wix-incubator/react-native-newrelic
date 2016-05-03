require('jasmine-expect');
const proxyquire = require('proxyquire');

const emptyFunction = () => {
  //
};
describe('NewRelicLogger', () => {
  let uut;
  const mockNewRelicLogger = {};

  beforeEach(() => {
    mockNewRelicLogger.send = emptyFunction;
    uut = proxyquire.noCallThru().noPreserveCache()('./../src/NewRelicLogger', {
      'react-native': {
        NativeModules: {
          NewRelicLogger: mockNewRelicLogger
        }
      }
    });
  });

  describe('report', () => {
    it('sends name and args', () => {
      spyOn(mockNewRelicLogger, 'send');
      expect(mockNewRelicLogger.send).not.toHaveBeenCalled();
      uut.report('name', {inner: 'val'});
      expect(mockNewRelicLogger.send).toHaveBeenCalledTimes(1);
      expect(mockNewRelicLogger.send).toHaveBeenCalledWith('name', {inner: 'val'});
    });

    it('sends name as string', () => {
      spyOn(mockNewRelicLogger, 'send');
      expect(mockNewRelicLogger.send).not.toHaveBeenCalled();
      uut.report(123, {inner: 'val'});
      expect(mockNewRelicLogger.send).toHaveBeenCalledTimes(1);
      expect(mockNewRelicLogger.send).toHaveBeenCalledWith('123', {inner: 'val'});
    });

    it('sends args as string', () => {
      spyOn(mockNewRelicLogger, 'send');
      expect(mockNewRelicLogger.send).not.toHaveBeenCalled();
      uut.report('name', {inner: 123});
      expect(mockNewRelicLogger.send).toHaveBeenCalledTimes(1);
      expect(mockNewRelicLogger.send).toHaveBeenCalledWith('name', {inner: '123'});
    });
  });

  describe('overrideConsole', () => {
    const defaultLog = console.log;
    const defaultWarn = console.warn;
    const defaultError = console.error;
    beforeEach(() => {
      console.log = emptyFunction;
      console.warn = emptyFunction;
      console.error = emptyFunction;
    });

    afterEach(() => {
      console.log = defaultLog;
      console.warn = defaultWarn;
      console.error = defaultError;
    });

    it('overrides default console.log', () => {
      expect(console.error).toBe(emptyFunction);
      uut.overrideConsole();
      expect(console.log).not.toBe(emptyFunction);
    });

    it('overrides default console.warn', () => {
      expect(console.error).toBe(emptyFunction);
      uut.overrideConsole();
      expect(console.warn).not.toBe(emptyFunction);
    });

    it('overrides default console.error', () => {
      expect(console.error).toBe(emptyFunction);
      uut.overrideConsole();
      expect(console.error).not.toBe(emptyFunction);
    });

    it('sends console.log to logger', () => {
      spyOn(mockNewRelicLogger, 'send');
      uut.overrideConsole();
      expect(mockNewRelicLogger.send).not.toHaveBeenCalled();
      console.log('hello');
      expect(mockNewRelicLogger.send).toHaveBeenCalledTimes(1);
    });

    it('sends console.warn to logger', () => {
      spyOn(mockNewRelicLogger, 'send');
      uut.overrideConsole();
      expect(mockNewRelicLogger.send).not.toHaveBeenCalled();
      console.warn('hello');
      expect(mockNewRelicLogger.send).toHaveBeenCalledTimes(1);
    });

    it('sends console.error to logger', () => {
      spyOn(mockNewRelicLogger, 'send');
      uut.overrideConsole();
      expect(mockNewRelicLogger.send).not.toHaveBeenCalled();
      console.error('hello');
      expect(mockNewRelicLogger.send).toHaveBeenCalledTimes(1);
    });

    it('sends consoles to logger with name JSConsole', () => {
      let called = null;
      mockNewRelicLogger.send = (name) => {
        called = name;
      };
      uut.overrideConsole();
      expect(called).toBeNull();
      console.log('hello');
      expect(called).toEqual('JSConsole');
      console.warn('hello');
      expect(called).toEqual('JSConsole');
      console.error('hello');
      expect(called).toEqual('JSConsole');
    });

    it('send consoles to logger with argument and consoleType', () => {
      spyOn(mockNewRelicLogger, 'send');
      uut.overrideConsole();
      expect(mockNewRelicLogger.send).not.toHaveBeenCalled();
      console.log('hello1');
      expect(mockNewRelicLogger.send).toHaveBeenCalledWith('JSConsole', {consoleType: 'log', args: 'hello1'});
      console.warn('hello2');
      expect(mockNewRelicLogger.send).toHaveBeenCalledWith('JSConsole', {consoleType: 'warn', args: 'hello2'});
      console.error('hello3');
      expect(mockNewRelicLogger.send).toHaveBeenCalledWith('JSConsole', {consoleType: 'error', args: 'hello3'});
      expect(mockNewRelicLogger.send).toHaveBeenCalledTimes(3);
    });

    it('send consoles to logger with argument seperated by comma and cast to string', () => {
      spyOn(mockNewRelicLogger, 'send');
      uut.overrideConsole();
      expect(mockNewRelicLogger.send).not.toHaveBeenCalled();
      console.log('hello', 'world', 123, null, {inner: 1});
      expect(mockNewRelicLogger.send).toHaveBeenCalledWith('JSConsole', {consoleType: 'log', args: 'hello, world, 123, null, [object Object]'});
    });
  });
});
