import { createNavigationContainerRef } from '@react-navigation/native';
export const navigationRef = createNavigationContainerRef()

export function navigate(name, params) {
  // navigationRef.navigate(name, params);
  if (navigationRef.isReady()) {
    console.log(navigationRef, 'refefefefefef');
    // Perform navigation if the react navigation is ready to handle actions
    // setTimeout(() => {
    navigationRef.navigate(name, params);
    // }, 10000);

  } else {
    // You can decide what to do if react navigation is not ready
    // You can ignore this, or add these actions to a queue you can call later
  }
}