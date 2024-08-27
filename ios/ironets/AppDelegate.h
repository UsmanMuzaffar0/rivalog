#import <UserNotifications/UNUserNotificationCenter.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate,UNUserNotificationCenterDelegate, CLLocationManagerDelegate> {
  CLLocationManager *locationManager;
}

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, retain) NSNumber* globalLatitude;
@property (nonatomic, retain) NSNumber* globalLongitude;


+ (AppDelegate *)sharedAppDelegate;

@end
