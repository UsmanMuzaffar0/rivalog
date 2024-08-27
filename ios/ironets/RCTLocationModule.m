// RCTCalendarModule.m
#import "RCTLocationModule.h"
#import <React/RCTLog.h>
#import "AppDelegate.h"
#import "ironets-Swift.h"

@import MapboxMaps;
@import MapboxDirections;
@import MapboxNavigation;
@import MapboxCoreNavigation;

@implementation RCTLocationModule
// To export a module named RCTCalendarModule
RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(createLocationEvent:(NSString *)interval accesstoken: (NSString *) accesstoken)
{
 RCTLogInfo(@"Pretending to create an event %@ - %@", interval,accesstoken);
  [[NSUserDefaults standardUserDefaults] setObject:accesstoken forKey:@"accessToken"];
  [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"currentTimestamp"];
  [[NSUserDefaults standardUserDefaults] synchronize];
  locationManager = [[CLLocationManager alloc] init];
  accessToken = accesstoken;
  timeInterval = interval;
  dispatch_async(dispatch_get_main_queue(), ^{
    self->locationManager = [[CLLocationManager alloc] init];
    self->locationManager.delegate = self;
    self->locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    self->locationManager.activityType = CLActivityTypeAutomotiveNavigation;
    self->locationManager.allowsBackgroundLocationUpdates = true;
    self->locationManager.showsBackgroundLocationIndicator = true;
    self->locationManager.pausesLocationUpdatesAutomatically = false;
    [self->locationManager startUpdatingLocation];
  });

}

RCT_EXPORT_METHOD(requestRoute: (double)destinationLat
                  destinationLong:(double)destinationLong
                  language:(NSString *)language) {
  RCTLogInfo(@"Current Location %f - %f",currentLocation.coordinate.latitude,currentLocation.coordinate.longitude );
  RCTLogInfo(@"Destination Location %f - %f",destinationLat,destinationLong );
  dispatch_async(dispatch_get_main_queue(), ^{
    MapboxNavigationHandler *vc = [[MapboxNavigationHandler alloc] init];
    [vc requestRouteWithOriginLat:self->currentLocation.coordinate.latitude originLong:self->currentLocation.coordinate.longitude destinationLat:destinationLat destinationLong:destinationLong laungage:language];
      });
  
}



//RCT_EXPORT_METHOD(openMapNavigation:(double)originLat
//                        originLongitude:(double)originLong
//                     destinationLatitude:(double)destinationLat
//                      destinationLongitude:(double)destinationLong
//                                language:(NSString *)language) {
//    CLLocationCoordinate2D origin = CLLocationCoordinate2DMake(originLat, originLong);
//    CLLocationCoordinate2D destination = CLLocationCoordinate2DMake(destinationLat, destinationLong);
//    NavigationRouteOptions *navigationRouteOptions = [[NavigationRouteOptions alloc] initWithCoordinates:@[origin, destination]];
//    navigationRouteOptions.locale = [NSLocale localeWithLocaleIdentifier:[language isEqualToString:@"tr"] ? @"tr_TR" : @"en-US"];
//
//    [[Directions shared] calculateNavigationRouteWithOptions:navigationRouteOptions completionHandler:^(NSArray * _Nullable waypoints, NavigationRoute * _Nullable route, NSError * _Nullable error) {
//        if (error) {
//            UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"Error" message:error.localizedDescription preferredStyle:UIAlertControllerStyleAlert];
//            UIAlertAction *okbtn = [UIAlertAction actionWithTitle:@"Ok" style:UIAlertActionStyleDefault handler:nil];
//            [alert addAction:okbtn];
//            [self presentViewController:alert animated:YES completion:nil];
//        } else {
//            [self showNavigationMapWithRouteResponse:route];
//        }
//    }];
//}

RCT_EXPORT_METHOD(stopService)
{
  NSLog(@"timer stop");
  if (locationManager != nil){
    [locationManager stopUpdatingLocation];
  }
  [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"currentTimestamp"];
  [[NSUserDefaults standardUserDefaults] synchronize];
}





-(void) fetchData:(NSString *)accessToken {
  dispatch_semaphore_t sema = dispatch_semaphore_create(0);
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"https://www.rivalogservice.com/api/transporter-management/points"]
                                                         cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                     timeoutInterval:10.0];
  NSDictionary *headers = @{
    @"Authorization": [NSString stringWithFormat:@"%@ %@",@"Bearer ",accessToken],
    @"Content-Type": @"application/json"
  };
  [request setAllHTTPHeaderFields:headers];
  double lat = currentLocation.coordinate.latitude;
  double longt = currentLocation.coordinate.longitude;
  NSNumber *latitude = [NSNumber numberWithDouble:lat];
  NSNumber *longitude = [NSNumber numberWithDouble:longt];
  
  NSString *stringData = [NSString stringWithFormat:@"{\n    \"latitude\":%@,\n    \"longitude\":%@\n}",[latitude stringValue],[longitude stringValue]];
  NSData *data1 = [stringData dataUsingEncoding:NSUTF8StringEncoding];
  [request setHTTPBody:data1];
  [request setHTTPMethod:@"POST"];
  NSURLSession *session = [NSURLSession sharedSession];
  NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request
                                              completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
    if (error) {
      NSLog(@"API error - %@", error);
      dispatch_semaphore_signal(sema);
    } else {
      NSError *parseError = nil;
      NSDictionary *responseDictionary = [NSJSONSerialization JSONObjectWithData:data options:0 error:&parseError];
      NSLog(@"API Response - %@",responseDictionary);
      dispatch_semaphore_signal(sema);
    }
  }];
  [dataTask resume];
  dispatch_semaphore_wait(sema, DISPATCH_TIME_FOREVER);
}


- (void)locationManager:(CLLocationManager *)manager
     didUpdateLocations:(NSArray *)locations {
  currentLocation = [locations lastObject];
  AppDelegate.sharedAppDelegate.globalLatitude = [[NSNumber alloc] initWithDouble:currentLocation.coordinate.latitude];
  AppDelegate.sharedAppDelegate.globalLongitude = [[NSNumber alloc] initWithDouble:currentLocation.coordinate.longitude];
  
  
  if ([self getTime] == nil) {
    [self saveTime];
  }else{
    NSString *currentTime = [NSString stringWithFormat:@"%f",[[NSDate date] timeIntervalSince1970]];
    NSString *lastUpdatedTime = [self getTime];
    
    NSNumber *c = @([currentTime intValue]);
    NSNumber *l = @([lastUpdatedTime intValue]);
    
    NSNumber *result = @([c intValue] - [l intValue]);
  
  
    NSLog(@"Result = %@",result);
    
    if([result intValue] > [timeInterval intValue]){
      [self fetchData:accessToken];
      [self saveTime];
    }
  }
}


- (NSString *) getTime {
  return  [[NSUserDefaults standardUserDefaults]
           stringForKey:@"currentTimestamp"];
}

-(void) saveTime {
  NSString * timestamp = [NSString stringWithFormat:@"%f",[[NSDate date] timeIntervalSince1970]];
  [[NSUserDefaults standardUserDefaults] setObject:timestamp forKey:@"currentTimestamp"];
  
}
@end
