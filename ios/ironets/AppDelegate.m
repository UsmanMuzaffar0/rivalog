#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import "AppDelegate.h"
#import <GoogleMaps/GoogleMaps.h>
#import <React/RCTLinkingManager.h>

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase.h>
#import <CodePush/CodePush.h>
#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>



static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

+ (AppDelegate *)sharedAppDelegate{
    return (AppDelegate *)[UIApplication sharedApplication].delegate;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  locationManager = [[CLLocationManager alloc] init];
  locationManager.delegate = self;
  [GMSServices provideAPIKey:@"AIzaSyC-8EpLCJPZY9xX9ANxrtQPnqJcLIyhrw4"];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"ironets"
                                            initialProperties:nil];
  
  // Define UNUserNotificationCenter
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    center.delegate = self;
  
  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [FIRApp configure];
  return YES;
}

// Required for the register event.
//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  // return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  return [CodePush bundleURL];
#endif
}


// Mark: - Create region
- (CLCircularRegion *) createRegion {
  CLLocationCoordinate2D newLocation = CLLocationCoordinate2DMake([self.globalLatitude doubleValue], [self.globalLongitude doubleValue]);
  CLCircularRegion *region = [[CLCircularRegion alloc] initWithCenter:newLocation radius:100 identifier:@"Rivalog"];
  [region setNotifyOnExit:true];
  [region setNotifyOnEntry:true];
  NSLog(@"Region Created!!");
  UILocalNotification *notification = [[UILocalNotification alloc] init];
//  notification.fireDate = [[NSDate date] dateByAddingTimeInterval:60*60*24];
  // notification.alertBody = @"Region Created successfully!!.";
  [[UIApplication sharedApplication] scheduleLocalNotification:notification];
  return region;
}

- (void)applicationWillTerminate:(UIApplication *)application{
  [locationManager startMonitoringForRegion:[self createRegion]];
  UILocalNotification *notification = [[UILocalNotification alloc] init];
  // notification.alertBody = @"in background mode!!";
  [[UIApplication sharedApplication] scheduleLocalNotification:notification];
}

//- (void)applicationDidBecomeActive:(UIApplication *)application {
//  [locationManager stopMonitoringForRegion:[self createRegion]];
//}

- (void)locationManager:(CLLocationManager *)manager didEnterRegion:(CLRegion *)region{
  UILocalNotification *notification = [[UILocalNotification alloc] init];
  // notification.alertBody = [NSString stringWithFormat:@"Entered into region!!Current lat and long is - %@ , %@ and current manager location is - %f, %f",self.globalLatitude,self.globalLongitude,manager.location.coordinate.latitude,manager.location.coordinate.longitude];
  [[UIApplication sharedApplication] scheduleLocalNotification:notification];
}

- (void)locationManager:(CLLocationManager *)manager didExitRegion:(CLRegion *)region{
  UILocalNotification *notification = [[UILocalNotification alloc] init];
  // notification.alertBody = [NSString stringWithFormat:@"Exit from region!!Current lat and long is - %@ , %@ and current manager location is - %f, %f",self.globalLatitude,self.globalLongitude,manager.location.coordinate.latitude,manager.location.coordinate.longitude];
  [[UIApplication sharedApplication] scheduleLocalNotification:notification];
  if(manager.location != nil){
    self.globalLatitude = [NSNumber numberWithDouble:manager.location.coordinate.latitude];
    self.globalLongitude = [NSNumber numberWithDouble:manager.location.coordinate.longitude];
  }
//  if(self.globalLatitude != NULL && self.globalLongitude != nil){
    [self locationAPICall:manager.location];
//  }
  [self createRegion];
}

- (void)locationAPICall:(CLLocation *)currentLocation {
  dispatch_semaphore_t sema = dispatch_semaphore_create(0);
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"https://www.rivalogservice.com/api/transporter-management/points"]
                                                         cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                     timeoutInterval:10.0];
  NSDictionary *headers = @{
    @"Authorization": [NSString stringWithFormat:@"%@ %@",@"Bearer ",[[NSUserDefaults standardUserDefaults]
                                                                      stringForKey:@"currentTimestamp"]],
    @"Content-Type": @"application/json"
  };
//  NSNumber *latitude;
//  NSNumber *longitude;
  [request setAllHTTPHeaderFields:headers];
  double lat = currentLocation.coordinate.latitude;
  double longt = currentLocation.coordinate.longitude;
//  if(self.globalLatitude != NULL && self.globalLongitude != nil){
  NSNumber *latitude = [NSNumber numberWithDouble:lat];
  NSNumber *longitude = [NSNumber numberWithDouble:longt];
//  }
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
      UILocalNotification *notification = [[UILocalNotification alloc] init];
      // notification.alertBody = @"API call success!!";
      [[UIApplication sharedApplication] scheduleLocalNotification:notification];
      dispatch_semaphore_signal(sema);
      
    }
  }];
  [dataTask resume];
  dispatch_semaphore_wait(sema, DISPATCH_TIME_FOREVER);
}
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}
@end
