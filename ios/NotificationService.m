//
//  NotificationService.m
//  Portal4HRM
//
//  Created by Mac osx on 6/29/21.
//

#import "NotificationService.h"
#import <React/RCTLog.h>
@implementation NotificationService
RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(setAppIconBadgeNumber:(NSInteger *)numberBadge)
{
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:numberBadge];
  RCTLogInfo(@"Pretending to create an event %ld", numberBadge);
}
@end
