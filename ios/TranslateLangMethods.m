//
//  TranslateLangMethods.m
//  FlashcardExpo
//
//  Created by terrence on 1/2/24.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(TranslateLangMethods, NSObject)
RCT_EXTERN_METHOD(englishToChinese:(NSString *)inputText
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
