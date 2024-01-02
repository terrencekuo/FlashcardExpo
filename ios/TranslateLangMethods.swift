//
//  TranslateLangMethods.swift
//  FlashcardExpo
//
//  Created by terrence on 1/2/24.
//

import Foundation
import MLKit
import MLKitTranslate

@objc(TranslateLangMethods)
class TranslateLangMethods: NSObject {
  @objc public func englishToChinese(_ inputText: String,
                                     resolver: @escaping RCTPromiseResolveBlock,
                                     rejecter: @escaping RCTPromiseRejectBlock) {
    let options = TranslatorOptions(sourceLanguage: .english, targetLanguage: .chinese)
    let translator = Translator.translator(options: options)

    let conditions = ModelDownloadConditions(
        allowsCellularAccess: false,
        allowsBackgroundDownloading: true
    )

    translator.downloadModelIfNeeded(with: conditions) { error in
        guard error == nil else { return }

        // Model downloaded successfully. Okay to start translating.
        translator.translate(inputText) { translatedText, error in
          guard error == nil, let translatedText = translatedText else { return }

          // Translation succeeded.
          resolver(translatedText)
        }
    }
  }

  @objc static func requiresMainQueueSetup() -> Bool {
      return true // or false if initialization can run on a background thread.
  }
}
