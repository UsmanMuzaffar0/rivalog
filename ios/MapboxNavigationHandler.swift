//
//  MapboxNavigationHandler.swift
//  ironets
//
//  Created by mac on 02/02/23.
//

import Foundation
import UIKit
import MapboxMaps
import MapboxDirections
import MapboxNavigation
import MapboxCoreNavigation
import CoreLocation


@objc class MapboxNavigationHandler: UIViewController {
  
 @objc func requestRoute(originLat: Double, originLong: Double, destinationLat: Double, destinationLong: Double, laungage: String) {
    let origin = CLLocationCoordinate2D(latitude: originLat, longitude: originLong)
    let destination = CLLocationCoordinate2D(latitude: destinationLat, longitude: destinationLong)
    let navigationRouteOptions = NavigationRouteOptions(coordinates: [origin, destination])
   navigationRouteOptions.locale = Locale(identifier: laungage == "tr" ? "tr_TR" : laungage == "ru" ? "ru_RU" : "en-US")
    
    Directions.shared.calculate(navigationRouteOptions) {(_, result) in
      switch result {
      case .failure(let error):
        let alert = UIAlertController(title: "Error", message: error.localizedDescription, preferredStyle: .alert)
        let okbtn = UIAlertAction(title: "Ok", style: .default, handler: nil)
        alert.addAction(okbtn)
        self.present(alert, animated: true, completion: nil)
      case .success(let response):
//        guard let self = self else { return }
        
        self.showNavigationMap(routResponse: response)
      }
    }
  }
  
  private func showNavigationMap(routResponse: RouteResponse) {
    let navigationService = MapboxNavigationService(routeResponse: routResponse, routeIndex: 0, routeOptions: RouteOptions(waypoints: routResponse.waypoints ?? []))
    print("Navigation service - ",navigationService)
    navigationService.locationManager.stopUpdatingLocation()
    let navigationViewController = NavigationViewController(navigationService: navigationService)
    print("Navigation controller - ",navigationViewController)
    navigationViewController.modalPresentationStyle = .overFullScreen
    navigationViewController.navigationView
    navigationViewController.delegate = self
    if let visibleViewCtrl = UIApplication.shared.keyWindow?.visibleViewController {
        // do whatever you want with your `visibleViewCtrl`
      visibleViewCtrl.present(navigationViewController, animated: true, completion: nil)
    }
//    present(navigationViewController, animated: true)
  }
}


// MARK: - NavigationViewControllerDelegate methods
extension MapboxNavigationHandler: NavigationViewControllerDelegate {
    
  public func navigationViewController(_ navigationViewController: NavigationViewController, didAdd finalDestinationAnnotation: PointAnnotation, pointAnnotationManager: PointAnnotationManager) {
      //  UIApplication.shared.isIdleTimerDisabled = true // awake functionaliy

        var finalDestinationAnnotation = finalDestinationAnnotation
        if let image = UIImage(named: "red_marker") {
            finalDestinationAnnotation.image = .init(image: image, name: "marker")
        } else {
            let image = UIImage(named: "default_marker", in: .mapboxNavigation, compatibleWith: nil)!
            finalDestinationAnnotation.image = .init(image: image, name: "marker")
        }
        
        pointAnnotationManager.annotations = [finalDestinationAnnotation]
    }
    
  public func navigationViewControllerDidDismiss(_ navigationViewController: NavigationViewController, byCanceling canceled: Bool) {
        // UIApplication.shared.isIdleTimerDisabled = false // awake functionaliy
        dismiss(animated: true)
    }
}



extension UIWindow {
    /// Returns the currently visible view controller if any reachable within the window.
    public var visibleViewController: UIViewController? {
        return UIWindow.visibleViewController(from: rootViewController)
    }

    /// Recursively follows navigation controllers, tab bar controllers and modal presented view controllers starting
    /// from the given view controller to find the currently visible view controller.
    ///
    /// - Parameters:
    ///   - viewController: The view controller to start the recursive search from.
    /// - Returns: The view controller that is most probably visible on screen right now.
    public static func visibleViewController(from viewController: UIViewController?) -> UIViewController? {
        switch viewController {
        case let navigationController as UINavigationController:
            return UIWindow.visibleViewController(from: navigationController.visibleViewController ?? navigationController.topViewController)

        case let tabBarController as UITabBarController:
            return UIWindow.visibleViewController(from: tabBarController.selectedViewController)

        case let presentingViewController where viewController?.presentedViewController != nil:
            return UIWindow.visibleViewController(from: presentingViewController?.presentedViewController)

        default:
            return viewController
        }
    }
}
