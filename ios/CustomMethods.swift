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

    
    print("a")
    
    // Remove the "file://" prefix from the imagePath
    let adjustedImagePath = imagePath.replacingOccurrences(of: "file://", with: "")
    
    guard let image = UIImage(contentsOfFile: adjustedImagePath) else {
        rejecter("ERROR", "Failed to load image", nil)
        return
    }
    print("b")
    
    let visionImage = VisionImage(image: image)
    visionImage.orientation = image.imageOrientation

//      // recognize english
//      let options = TextRecognizerOptions()
//      let onDeviceTextRecognizer = TextRecognizer.textRecognizer(options: options)
    
      // recognize chinese
      let options = ChineseTextRecognizerOptions()
      let onDeviceTextRecognizer = TextRecognizer.textRecognizer(options: options)
    
      print("c")
      onDeviceTextRecognizer.process(visionImage) { result, error in
          guard error == nil, let result = result else {
              rejecter("ERROR", "Failed to recognize text: \(error?.localizedDescription ?? "")", nil)
              return
          }

          let extractedText = result.text
          resolver(extractedText)
      }
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
      return true // or false if initialization can run on a background thread.
  }
}
