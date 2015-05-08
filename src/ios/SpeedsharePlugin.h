//
//  SpeedsharePlugin.h
//
//  Copyright (c) 2015 Osix Corp. All rights reserved.
//  Please see the LICENSE included with this distribution for details.
//

#import <Cordova/CDVPlugin.h>
#import "VKPlayerController.h"


@interface SpeedsharePlugin : CDVPlugin

// SSVideo
- (void)startSession:(CDVInvokedUrlCommand*)command;
- (void)stopSession:(CDVInvokedUrlCommand*)command;
- (void)updateView:(CDVInvokedUrlCommand*)command;
- (void)updateStream:(CDVInvokedUrlCommand*)command;

@end
