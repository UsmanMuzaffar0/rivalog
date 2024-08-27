#ifndef RCTLocationModule_h
#define RCTLocationModule_h
#import <CoreLocation/CoreLocation.h>
#import <React/RCTBridgeModule.h>

@interface RCTLocationModule : NSObject <RCTBridgeModule , CLLocationManagerDelegate> {
  CLLocation *currentLocation;
  NSString *accessToken;
  NSString *timeInterval;
  CLLocationManager *locationManager;
}

@end

#endif /* LocationModule_h */
