import { NativeModules } from "react-native"
const { TranslateLangMethods } = NativeModules

export async function EnglishToHanzi(inputText) {
    return TranslateLangMethods.englishToChinese(inputText);
}

export async function EnglishToFrench(inputText) {
    return TranslateLangMethods.englishToFrench(inputText);
}

export async function EnglishToSpanish(inputText) {
    return TranslateLangMethods.englishToSpanish(inputText);
}
