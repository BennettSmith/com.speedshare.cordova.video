//
//  SpeedsharePlugin.m
//
//  Copyright (c) 2015 Osix Corp. All rights reserved.
//  Please see the LICENSE included with this distribution for details.
//

#import "SpeedsharePlugin.h"

@implementation SpeedsharePlugin{
    NSMutableDictionary *videoState;
    VKPlayerController *VKPlayer;
    NSString *startCallback;
}
//[[UIApplication sharedApplication] setIdleTimerDisabled:YES];
#pragma mark -
#pragma mark Cordova Methods
-(void) pluginInitialize{
    videoState = [[NSMutableDictionary alloc] init];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onSuspend:) name:UIApplicationDidEnterBackgroundNotification object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onResume:) name:UIApplicationWillEnterForegroundNotification object:nil];

    self.webView.opaque = NO;
    self.webView.backgroundColor = [UIColor clearColor];

    startCallback = nil;

    VKPlayer = [[VKPlayerController alloc] init];
    
    VKPlayer.delegate = self;

    VKPlayer.view.frame = CGRectMake(0, 0, 0, 0);
    VKPlayer.backgroundColor = [UIColor whiteColor];
    
    [self.webView.superview insertSubview:VKPlayer.view atIndex:0];
    
    self.webView.layer.zPosition = 4;
    VKPlayer.view.layer.zPosition = 2;
    
    VKPlayer.controlStyle = kVKPlayerControlStyleNone;

}

- (void)onSuspend:(NSNotification *) notification {
    if (VKPlayer && [videoState objectForKey:@"path"]) {
        [VKPlayer.view setHidden:true];
        [VKPlayer stop];
    }
}
- (void)onResume:(NSNotification *) notification {
    if (VKPlayer && [videoState objectForKey:@"path"]) {
        [VKPlayer play];
        [VKPlayer.view setHidden:false];
    }
}


#pragma mark -
#pragma mark Cordova JS - iOS bindings
#pragma mark Methods
/*** Methods
 ****/

// Called by SSVideo.initsession()
-(void)startSession:(CDVInvokedUrlCommand*)command{
    NSString* path = [command.arguments objectAtIndex:0];
    int top = [[command.arguments objectAtIndex:1] intValue];
    int left = [[command.arguments objectAtIndex:2] intValue];
    int width = [[command.arguments objectAtIndex:3] intValue];
    int height = [[command.arguments objectAtIndex:4] intValue];
    startCallback = command.callbackId;
    
    if (!VKPlayer) {
        VKPlayer = [[VKPlayerController alloc] init];
        
        VKPlayer.delegate = self;
        
        VKPlayer.backgroundColor = [UIColor whiteColor];
        
        [self.webView.superview insertSubview:VKPlayer.view atIndex:0];
        
        self.webView.layer.zPosition = 4;
        VKPlayer.view.layer.zPosition = 2;
        
        VKPlayer.controlStyle = kVKPlayerControlStyleNone;
    } else {
        [VKPlayer.view setHidden:true];
        [VKPlayer stop];
    }
    
    VKPlayer.view.frame = CGRectMake(left, top, width, height);
    [videoState setObject:path forKey:@"path"];
    [videoState setObject:[NSNumber numberWithInt:top] forKey:@"top"];
    [videoState setObject:[NSNumber numberWithInt:left] forKey:@"left"];
    [videoState setObject:[NSNumber numberWithInt:width] forKey:@"width"];
    [videoState setObject:[NSNumber numberWithInt:height] forKey:@"height"];
    
    VKPlayer.contentURLString = [NSString stringWithFormat:@"rtmp://54.176.168.110/live/%@ -rtmp_buffer 10 -rtmp_live live", path];
    VKPlayer.decoderOptions = [NSDictionary dictionaryWithObject:@"1" forKey:VKDECODER_OPT_KEY_PASS_THROUGH];
    [VKPlayer play];
    [VKPlayer.view setHidden:false];
}

-(void)stopSession:(CDVInvokedUrlCommand*)command{
    if (VKPlayer) {
        [VKPlayer.view setHidden:true];
        [VKPlayer stop];
        [videoState removeObjectForKey:@"path"];
    }
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)updateView:(CDVInvokedUrlCommand*)command{
    int top = [[command.arguments objectAtIndex:0] intValue];
    int left = [[command.arguments objectAtIndex:1] intValue];
    int width = [[command.arguments objectAtIndex:2] intValue];
    int height = [[command.arguments objectAtIndex:3] intValue];
    
    if (VKPlayer) {
        [videoState setObject:[NSNumber numberWithInt:top] forKey:@"top"];
        [videoState setObject:[NSNumber numberWithInt:left] forKey:@"left"];
        [videoState setObject:[NSNumber numberWithInt:width] forKey:@"width"];
        [videoState setObject:[NSNumber numberWithInt:height] forKey:@"height"];
        
        VKPlayer.view.frame = CGRectMake(left, top, width, height);
        [VKPlayer.view setNeedsDisplay];
    }
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)updateStream:(CDVInvokedUrlCommand*)command {
    [VKPlayer updateBufferForRealTime];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)onPlayerViewControllerStateChanged:(VKDecoderState)state errorCode:(VKError)errCode {
    if (state == kVKDecoderStateInitialized) {
    } else if (state == kVKDecoderStateConnecting) {
    } else if (state == kVKDecoderStateConnected) {
    } else if (state == kVKDecoderStateInitialLoading) {
    } else if (state == kVKDecoderStateReadyToPlay) {
    } else if (state == kVKDecoderStateBuffering) {
    } else if (state == kVKDecoderStatePlaying) {
        if (startCallback != nil) {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:startCallback];
            startCallback = nil;
        }
    } else if (state == kVKDecoderStatePaused) {
    } else if (state == kVKDecoderStateStoppedByUser) {
    } else if (state == kVKDecoderStateConnectionFailed) {
    } else if (state == kVKDecoderStateStoppedWithError) {
        if (errCode == kVKErrorStreamReadError) {
        }
    }
}

@end

