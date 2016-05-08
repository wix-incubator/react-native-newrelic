# react-native-newrelic

New Relic event reporting for react native.

## Features
* `overrideConsole` will send all console.log, warn and errors to New Relic.
* `reportUncaughtExceptions` will send uncaught Javascript exceptions to New Relic.

More to come!

## Installation

### 1.Install react-native-newrelic:

```javascript
npm install react-native-newrelic --save
```

### 2. Install New RelicAgent in your project as a pod.
In the Podfile for your project, add the following line:
`pod 'NewRelicAgent'`
Make sure Xcode is closed and run: `pod install`

### 3. Add the project to Xcode
In the project navigator:
- Right click Libraries
- Add Files to [your project's name]
- Go to node_modules/react-native-newrelic
- Add the .xcodeproj file
In the project navigator, select your project.
- Add the libRNDNewRelic.a to your project's Build Phases ➜ Link Binary With Libraries
- Click .xcodeproj file you added before in the project navigator and go the Build Settings tab. Make sure 'All' is toggled on (instead of 'Basic').

### 4. In your AppDelegate.m
Add the following:

```
-(void)setupNewRelic{
  NSString* token;
  if(isDebug) {
    token = @"<your new relic dev token (optional)>";
  } else {
    token = @"<your new relic production token";
  }
  [NewRelicAgent startWithApplicationToken:token];
}
```

And add the following line to the top of your didFinishLaunchingWithOptions function: 
```
  [self setupNewRelic];
```

### 5. Add a prefix header to your iOS project

Add a `PrefixHeader.pch` file as explained [here](https://docs.newrelic.com/docs/mobile-monitoring/mobile-monitoring-installation/ios/adding-prefix-header-ios-project)
Your file should look like this:
```
#ifdef __OBJC__ 

#import <NewRelicAgent/NewRelic.h>

#endif
```

## Configuration

Add the following to your app root (e.g. `app.ios.js` ):
```
import {default as newRelic} from 'react-native-newrelic';
newRelic.init({
  overrideConsole: true,
  reportUncaughtExceptions: true,
    globalAttributes: {
      'this-string': 'will be sent with every event that is being reported'
    }
});
```

Credits to [@DanielZlotin](https://github.com/danielzlotin) for the initial version
