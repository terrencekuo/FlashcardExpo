//
//  CustomMethods.swift
//  FlashcardExpo
//
//  Created by terrence on 10/24/23.
//

import Foundation
import MLKitTextRecognition
import MLKitVision
import MLKit

@objc(CustomMethods)
class CustomMethods: NSObject {
  @objc public func simpleMethod() { print("Swift is powerful") }
  
  @objc func recognizeTextFromImage(_ imagePath: String,
                                    resolver: @escaping RCTPromiseResolveBlock,
                                    rejecter: @escaping RCTPromiseRejectBlock) {
    
    // Remove the "file://" prefix from the imagePath
    let adjustedImagePath = imagePath.replacingOccurrences(of: "file://", with: "")
    
    guard let image = UIImage(contentsOfFile: adjustedImagePath) else {
        rejecter("ERROR", "Failed to load image", nil)
        return
    }

    let visionImage = VisionImage(image: image)
    visionImage.orientation = image.imageOrientation

    // let options = TextRecognizerOptions() // recognize english
    let options = ChineseTextRecognizerOptions() // recognize chinese
    let onDeviceTextRecognizer = TextRecognizer.textRecognizer(options: options)

    onDeviceTextRecognizer.process(visionImage) { result, error in
      guard error == nil, let result = result else {
          rejecter("ERROR", "Failed to recognize text: \(error?.localizedDescription ?? "")", nil)
          return
      }

      var textOverlays: [[String: Any]] = []

      // Loop through each block, line, and element to get the text and its frame
      for block in result.blocks {
          for line in block.lines {
              for element in line.elements {
                  // Create a dictionary for each piece of text including the text and its frame
                  let textOverlay = [
                      "text": element.text,
                      "frame": [
                          "x": element.frame.origin.x,
                          "y": element.frame.origin.y,
                          "width": element.frame.size.width,
                          "height": element.frame.size.height
                      ]
                  ]
                  // Add the dictionary to the array
                  textOverlays.append(textOverlay)
              }
          }
      }

      // Resolve the promise with the array of text overlays
      resolver(textOverlays)
    }
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return true // or false if initialization can run on a background thread.
  }
}
