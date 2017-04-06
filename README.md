# react-native-newrelic

New Relic event reporting for react native.

> also check out https://github.com/wix/sentry-monitor

## Features
* `overrideConsole` will send all console.log, warn and errors to New Relic.
* `reportUncaughtExceptions` will send uncaught Javascript exceptions to New Relic.

More to come!

## Installation

### Install react-native-newrelic

```bash
npm install react-native-newrelic --save
```
## iOS 
#### 1. Install New RelicAgent in your project as a pod
In the Podfile for your project, add the following line:
`pod 'NewRelicAgent'`
Make sure Xcode is closed and run: `pod install`

#### 2. Add the project to Xcode
In the project navigator:
- Right click Libraries
- Add Files to [your project's name]
- Go to node_modules/react-native-newrelic
- Add the .xcodeproj file
In the project navigator, select your project.
- Add the libRNNewRelic.a to your project's Build Phases ➜ Link Binary With Libraries
- Click .xcodeproj file you added before in the project navigator and go the Build Settings tab. Make sure 'All' is toggled on (instead of 'Basic').

#### 3. In your AppDelegate.m
Add the following:

``` objective-c
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

``` objective-c
  [self setupNewRelic];
```

#### 4. Add a prefix header to your iOS project

Add a `PrefixHeader.pch` file as explained [here](https://docs.newrelic.com/docs/mobile-monitoring/mobile-monitoring-installation/ios/adding-prefix-header-ios-project)
Your file should look like this:

``` objective-c
#ifdef __OBJC__ 

#import <NewRelicAgent/NewRelic.h>

#endif
```

## Android (gradle only)

#### 1. Add NewRelic agent to your Android project

**[This link](https://docs.newrelic.com/docs/mobile-monitoring/new-relic-mobile-android/install-configure/installing-android-apps-gradle-android-studio) describes how to add the original NewRelic agent to your project. This guide only requires a part of the original steps (some of the steps are already integrated in `react-native-newrelic`:**

Extend `Application.java` and override the following method:

``` java
public void onCreate() {
	super.onCreate();
	NewRelic.withApplicationToken("yourApplicationToken").start(this);
}
```

Create `newrelic.properties` in your root android dir:

```
com.newrelic.application_token= yourApplicationToken
```

> Get your application token from newrelic.com


 
#### 2. Add the `react-native-newrelic` module to your Android project

In `settings.gradle`:

``` gradle
include ':react-native-newrelic'
project(':react-native-newrelic').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-newrelic/android')

```
In your project level `build.gradle`:

```
dependencies {
	...
	classpath "com.newrelic.agent.android:agent-gradle-plugin:5.11.+"
	...
 }

```


In your app level `build.gradle`:

``` gradle
apply plugin: 'newrelic'


dependencies {
	...
	compile project(":react-native-newrelic")
	compile fileTree(dir: "node_modules/react-native-newrelic/android/libs", include: ["*.jar"])
	...
}
```

Add `new RNNewRelicPackage()` to your list of packages in `getPackages()` in `MainActivity.java` :

``` java
@Override
public List<ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(... new RNNewRelicPackage());
}
```


## Configuration

Add the following to your app root (e.g. `app.ios.js` ):

```javascript
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
