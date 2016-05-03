//
//  NewRelic.m
//  RNNewRelic
//
//  Created by Daniel Zlotin on 26/04/2016.
//  Copyright © 2016 Wix.com. All rights reserved.
//

#import "NewRelic.h"

@implementation NewRelic

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(send: (NSString*)name :(NSDictionary*)args){
    [NewRelicAgent recordEvent:name attributes:args];
}

@end
