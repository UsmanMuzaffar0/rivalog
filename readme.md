<h1>Rivalog</h1>
Rivalog is a logistic mobile app that allows you to track and manage your deliveries and shipments.

Features

• Turn by Turn location via mapbox for carriers

• View the status and location of your packages on a map

• Receive notifications and alerts for any changes or issues

• Use code push to get the latest app updates without downloading

Installation
To install Rivalog, you need to have Node.js, yarn, and React Native CLI installed on your machine. You also need to have Android Studio or Xcode to run the app on an emulator or a device. You may need to add Mapbox local sdk to your machine and setup mapbox token to it too.

Clone this repository and run yarn install to install the dependencies.

git clone https://github.com/kissoid/rivalog.git
cd rivalog
yarn install

Usage
To run the app on Android, use the following command:

yarn run android

To run the app on iOS, use the following command:

yarn run ios

To start the Metro bundler, use the following command:

yarn start

To test the app with Jest, use the following command:

yarn test

To lint the app with ESLint, use the following command:

yarn run lint

To use code push for Android or iOS, use one of the following commands:

yarn run codepush-staging:android # for staging environment on Android
yarn run codepush-prod:android # for production environment on Android
yarn run codepush-staging:ios # for staging environment on iOS
yarn run codepush-prod:ios # for production environment on iOS

Dependencies
Following are few dependencies Rivalog uses:

• @react-native-community/push-notification-ios for handling push notifications on iOS devices

• @react-native-firebase/app for integrating Firebase services into the app

• @react-native-firebase/crashlytics for tracking and reporting app crashes and errors

• @react-native-firebase/messaging for sending and receiving push notifications via Firebase Cloud Messaging (FCM)

• date-fns for manipulating and formatting dates and times in the app

• formik for building and validating forms in the app

• patch-package for applying patches to npm dependencies

• react-native-battery-optimization-check for checking and requesting battery optimization settings on Android devices

• react-native-code-push for delivering updates to the app over the air without requiring users to download a new version from the app store

• react-native-flash-message for showing flash messages or toasts in the app

• react-native-geocoding for converting geographic coordinates to addresses and vice versa in the app

• react-native-geolocation-service for getting high accuracy location updates on Android devices using Google Play Services
