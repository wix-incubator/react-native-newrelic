require('jasmine-expect');
const proxyquire = require('proxyquire');

const emptyFunction = () => {
  //
};
describe('NewRelic', () => {
  let uut;
  const mockNewRelic = {};
  const enablePromiseSpy = jasmine.createSpy('enablePromise');

  beforeEach(() => {
    mockNewRelic.send = emptyFunction;
    mockNewRelic.setAttribute = emptyFunction;
    mockNewRelic.nativeLog = emptyFunction;

    uut = proxyquire.noCallThru().noPreserveCache()('./../src/NewRelic', {
      'react-native': {
        NativeModules: {
          RNNewRelic: mockNewRelic
        }
      },
      'Promise': {
      },
      'promise/setimmediate/rejection-tracking': {
        enable: enablePromiseSpy
      }
    }).default;
  });

  describe('init', () => {
    it('inits everything that is enabled', () => {
      uut._overrideConsole = jasmine.createSpy('overrideConsole');
      uut._reportUncaughtExceptions = jasmine.createSpy('reportUncaughtExceptions');
      uut._reportRejectedPromises = jasmine.createSpy('reportRejectedPromises');

      uut.init({
        overrideConsole: true,
        reportUncaughtExceptions: true,
        reportRejectedPromises: true
      });

      expect(uut._overrideConsole).toHaveBeenCalled();
      expect(uut._reportUncaughtExceptions).toHaveBeenCalled();
      expect(uut._reportRejectedPromises).toHaveBeenCalled();
    });

    it('does not init anything that is disabled', () => {
      uut._overrideConsole = jasmine.createSpy('overrideConsole');

      uut.init({
        overrideConsole: false
      });

      expect(uut._overrideConsole).not.toHaveBeenCalled();
    });
  });

  describe('report', () => {
    it('sends name and args', () => {
      spyOn(mockNewRelic, 'send');
      expect(mockNewRelic.send).not.toHaveBeenCalled();
      uut.report('name', {inner: 'val'});
      expect(mockNewRelic.send).toHaveBeenCalledTimes(1);
      expect(mockNewRelic.send).toHaveBeenCalledWith('name', {inner: 'val'});
    });

    it('sends name as string', () => {
      spyOn(mockNewRelic, 'send');
      expect(mockNewRelic.send).not.toHaveBeenCalled();
      uut.report(123, {inner: 'val'});
      expect(mockNewRelic.send).toHaveBeenCalledTimes(1);
      expect(mockNewRelic.send).toHaveBeenCalledWith('123', {inner: 'val'});
    });

    it('sends args as string', () => {
      spyOn(mockNewRelic, 'send');
      expect(mockNewRelic.send).not.toHaveBeenCalled();
      uut.report('name', {inner: 123});
      expect(mockNewRelic.send).toHaveBeenCalledTimes(1);
      expect(mockNewRelic.send).toHaveBeenCalledWith('name', {inner: '123'});
    });
  });

  describe('attributes', () => {
    it('set a global attribute', () => {
      spyOn(mockNewRelic, 'setAttribute');
      expect(mockNewRelic.setAttribute).not.toHaveBeenCalled();
      uut.init({
        globalAttributes: {
          always: 'send-this-attribute'
        }
      });
      
      uut.report('name', {inner: 123});
      expect(mockNewRelic.setAttribute).toHaveBeenCalledTimes(1);
      expect(mockNewRelic.setAttribute).toHaveBeenCalledWith('always', 'send-this-attribute');
    });
  });

  describe('uncaught exception', () => {
    it('reports uncaught exceptions', () => {
      spyOn(mockNewRelic, 'send');
      const originalErrorHandler = jasmine.createSpy('errorHandlerSpy');
      const errorUtils = {
        _globalHandler: originalErrorHandler
      };
      const error = new Error('some-exception');
      
      uut._reportUncaughtExceptions(errorUtils);
      errorUtils._globalHandler(error);

      expect(originalErrorHandler).toHaveBeenCalledWith(error);
      expect(originalErrorHandler).toHaveBeenCalledTimes(1);
      expect(mockNewRelic.send).toHaveBeenCalledWith('JS:UncaughtException', {
        error: String(error),
        stack: error.stack
      });
    });
  });

  describe('rejected promises', () => {
    it('reports rejected promises', () => {
      uut._reportRejectedPromises();

      expect(enablePromiseSpy).toHaveBeenCalledWith({
        allRejections: true, onUnhandled: jasmine.anything(), onHandled: jasmine.anything()
      });
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
      uut._overrideConsole();
      expect(console.log).not.toBe(emptyFunction);
    });

    it('overrides default console.warn', () => {
      expect(console.error).toBe(emptyFunction);
      uut._overrideConsole();
      expect(console.warn).not.toBe(emptyFunction);
    });

    it('overrides default console.error', () => {
      expect(console.error).toBe(emptyFunction);
      uut._overrideConsole();
      expect(console.error).not.toBe(emptyFunction);
    });

    it('sends console.log to logger', () => {
      spyOn(mockNewRelic, 'send');
      uut._overrideConsole();
      expect(mockNewRelic.send).not.toHaveBeenCalled();
      console.log('hello');
      expect(mockNewRelic.send).toHaveBeenCalledTimes(1);
    });

    it('sends console.warn to logger', () => {
      spyOn(mockNewRelic, 'send');
      uut._overrideConsole();
      expect(mockNewRelic.send).not.toHaveBeenCalled();
      console.warn('hello');
      expect(mockNewRelic.send).toHaveBeenCalledTimes(1);
    });

    it('sends console.error to logger', () => {
      spyOn(mockNewRelic, 'send');
      uut._overrideConsole();
      expect(mockNewRelic.send).not.toHaveBeenCalled();
      console.error('hello');
      expect(mockNewRelic.send).toHaveBeenCalledTimes(1);
    });

    it('sends consoles to logger with name JSConsole', () => {
      let called = null;
      mockNewRelic.send = (name) => {
        called = name;
      };
      uut._overrideConsole();
      expect(called).toBeNull();
      console.log('hello');
      expect(called).toEqual('JSConsole');
      console.warn('hello');
      expect(called).toEqual('JSConsole');
      console.error('hello');
      expect(called).toEqual('JSConsole');
    });

    it('send consoles to logger with argument and consoleType', () => {
      spyOn(mockNewRelic, 'send');
      uut._overrideConsole();
      expect(mockNewRelic.send).not.toHaveBeenCalled();
      console.log('hello1');
      expect(mockNewRelic.send).toHaveBeenCalledWith('JSConsole', {consoleType: 'log', args: 'hello1'});
      console.warn('hello2');
      expect(mockNewRelic.send).toHaveBeenCalledWith('JSConsole', {consoleType: 'warn', args: 'hello2'});
      console.error('hello3');
      expect(mockNewRelic.send).toHaveBeenCalledWith('JSConsole', {consoleType: 'error', args: 'hello3'});
      expect(mockNewRelic.send).toHaveBeenCalledTimes(3);
    });

    it('send consoles error console to native log', () => {
      spyOn(mockNewRelic, 'send');
      spyOn(mockNewRelic, 'nativeLog');

      expect(mockNewRelic.send).not.toHaveBeenCalled();

      uut._overrideConsole();
      console.error('hello3');

      expect(mockNewRelic.send).toHaveBeenCalledWith('JSConsole', {consoleType: 'error', args: 'hello3'});
      expect(mockNewRelic.nativeLog).toHaveBeenCalledWith('[JSConsole:Error] hello3');
      expect(mockNewRelic.send).toHaveBeenCalledTimes(1);
    });
    
    it('send consoles to logger with argument seperated by comma and cast to string', () => {
      spyOn(mockNewRelic, 'send');
      uut._overrideConsole();
      expect(mockNewRelic.send).not.toHaveBeenCalled();
      console.log('hello', 'world', 123, null, {inner: 1});
      expect(mockNewRelic.send).toHaveBeenCalledWith('JSConsole', {consoleType: 'log', args: 'hello, world, 123, null, [object Object]'});
    });
  });
});
